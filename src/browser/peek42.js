import peek42, {_comment, p, pp, use} from '../universal/base';
import './styles/base.scss';
import Console from './console/console';
import reportError, {
  sourceTrace,
  formatErrorAsync
} from './error';
import _config from './config';
import {
  _interceptNativeConsoleFn,
  _restoreNativeConsoleFns
} from './intercept';
import {cable} from './cable';

function _output(...args) {
  // Allow peek42.console.content to be used without
  // Console.instance.then wait (or the setTimeout 0 trick)
  // after console has been created and assigned
  if (peek42.console) {
    return peek42.console._output(...args);
  }

  Console.instance.then(console => {
    Object.assign(peek42, {
      console
    });

    console._output(...args);
  });
}

Console.instance.then(console => {
  Object.assign(peek42, {
    console
  });
});

p.trace = (comment = undefined, opts = undefined) => {
  let stack = ((new Error).stack || '\n').split('\n');
  let trace = (stack.shift(), stack);
  let loc = trace[0];

  _output(
    trace.join('\n'),
    _comment(comment, loc, `trace`),
    opts
  );
};

function walk(elem, fnVisit, {
  level = 0
} = {}) {
  fnVisit(elem, level);

  for (let node = elem.firstChild;
    node;
    node = node.nextSibling
  ) {
    walk(node, fnVisit, {level: level + 1});
  }

  return elem;
}

const nodeTypeNames = Object.keys(Node).
  filter(k => k.match(/_NODE$/)).
  reduce((obj, k) =>
    (obj[Node[k]] = k.slice(0, -5).toLowerCase(), obj),
    {__proto__: null}
  );

function formatAttrs(attrs) {
  return Array.from(attrs,
    attr => `${attr.name}='${attr.value}'`
  );
}

function formatNode(types, node, level) {
  let tag = (node.tagName && node.tagName.toLowerCase()) ||
    nodeTypeNames[node.nodeType];

  switch (node.nodeType) {
  case Node.ELEMENT_NODE: {
    let attrs = (types.has(Node.ATTRIBUTE_NODE)) ?
      formatAttrs(node.attributes) :
      [];

    return (attrs.length > 0) ?
      `${tag}(${attrs.join(', ')})` :
      tag;
  } case Node.COMMENT_NODE: {
    let pad = '  '.repeat(level + 1);
    let text = node.textContent.trim();
    let lines = (text) ? text.split('\n') : [];
    let text1 = lines.map(line => `${pad}|${line}`).join('\n');

    return (text1) ? `${tag}\n${text1}` : tag;
  } case Node.TEXT_NODE: {
    let pad = '  '.repeat(level);
    let text = node.textContent.trim();
    let lines = (text) ? text.split('\n') : [];
    let text1 = lines.map((line, i) => (i === 0) ?
      `|${line}` :
      `${pad}|${line}`
    ).join('\n');

    return text1;
  } default:
    return tag;
  }
}

function domStr(elemOrSel = document, {
  nodeTypes = [
    Node.DOCUMENT_NODE,
    Node.DOCUMENT_FRAGMENT_NODE,
    Node.ELEMENT_NODE,
    Node.ATTRIBUTE_NODE,
    Node.COMMENT_NODE,
    Node.TEXT_NODE,
  ],
  include = [],
  exclude = [],
  level = 0
} = {}) {
  elemOrSel = (typeof elemOrSel === 'string') ?
      document.querySelector(elemOrSel) :
      elemOrSel;
  let types = new Set(
    nodeTypes.concat(include).
      filter(k => !exclude.includes(k))
  );
  let str = '';

  walk(elemOrSel, (node, level) => {
    if (types.has(node.nodeType)) {
      let pad = '  '.repeat(level);
      let s = formatNode(types, node, level);

      if (s) {
        str += `${pad}${s}\n`;
      }
    }
  }, {level});

  return str;
}

p.dom = (elemOrSel, comment = undefined, opts = undefined) => {
  _output(
    domStr(elemOrSel, (opts || {}).dom),
    _comment(comment, elemOrSel || document, `dom`),
    opts
  );
};

Object.assign(peek42, {
  _output,
  Console,
  sourceTrace,
  formatErrorAsync,
  reportError,
  cable
});

function _onError(ev) {
  reportError(ev.error, {
    note: 'uncaught exception'
  });
}

function _onUnhandledRejection(ev) {
  reportError(ev.reason, {
    note: 'unhandled rejection'
  });
}

window.addEventListener('error', _onError);
window.addEventListener('unhandledrejection', _onUnhandledRejection);

if (_config.interceptConsole) {
  _interceptNativeConsoleFn('log');
  _interceptNativeConsoleFn('info');
  _interceptNativeConsoleFn('warn');
  _interceptNativeConsoleFn('error');
}

if (_config.addGlobals) {
  Object.assign(window, {
    p,
    pp
  });
}

if (_config.autoUse) {
  window.apivis && use(apivis);
}

export default peek42;
