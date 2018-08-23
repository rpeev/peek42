import {pretty, p, pp} from '../universal/base';

const reTestTranspiledScriptStack =
  /\nrun\S+babel/m;
const reCaptureSourceMappingURL =
  // match[1] - sourceMappingURL
  /\/\/# sourceMappingURL=(.+)\s*$/m;
const reCaptureEmbeddedSourceMap =
  // match[1] - embeddedSourceMap (base64)
  /^data:application\/json;(?:charset=[^;]+;)?base64,(.+)$/;
const reTestAbsoluteURL =
  /^(?:[a-z]+:)?\/\//i;
const reCapturePathAndName =
  // match[1] - path (includes trailing slash)
  // match[2] - name (includes extension)
  /^(.+\/)?([^\/]+)$/;

function isInlineScriptError(err) {
  return !!(
    err.sourceURL &&
    err.sourceURL === window.location.href
  );
}

function isTranspiledScriptError(err) {
  return !!(
    err.stack &&
    reTestTranspiledScriptStack.test(err.stack)
  );
}

function inlineScripts() {
  return Array.from(document.scripts).
    filter(script => !script.getAttribute('src')).
    map(script => ({
      source: script.textContent,
      sourceMap: null,
      originalErrorInfo: null
    }));
}

function transpiledInlineScripts(_inlineScripts) {
  return _inlineScripts.
    map(scriptInfo => {
      scriptInfo.sourceMap = embeddedSourceMap(
        sourceMappingURL(scriptInfo.source)
      );

      return scriptInfo;
    }).
    filter(scriptInfo => !!scriptInfo.sourceMap);
}

async function transpiledInlineScriptsWithOriginalErrorInfoAsync(
  _transpiledInlineScripts,
  err
) {
  return Promise.all(
    _transpiledInlineScripts.
      map(async scriptInfo => {
        scriptInfo.originalErrorInfo = await originalErrorInfoAsync(
          scriptInfo.sourceMap, err
        );

        return scriptInfo;
      })
  );
}

async function transpiledInlineScriptsSourceTracesAsync(err) {
  let scripts = transpiledInlineScripts(inlineScripts());

  try {
    return (await transpiledInlineScriptsWithOriginalErrorInfoAsync(
      scripts,
      err
    )).
      map(scriptInfo => sourceTrace(
        ...sourceTraceArgs(scriptInfo.originalErrorInfo)
      ));
  } catch (err1) {
    console.warn(`sourceMap library support missing/incomplete\n${err1}`);

    return scripts.
      map((scriptInfo, i) => sourceTrace(
        scriptInfo.source,
        `Transpiled inline script #${i + 1}`,
        err.line,
        err.column
      ));
  }
}

async function errorSourceAsync(err) {
  return new Promise(async (resolve, reject) => {
    if (!err.sourceURL) {
      return reject(Error('sourceURL unavailable'));
    }

    let url = err.sourceURL;

    try {
      let res = await fetch(url);

      if (!res.ok) {
        return reject(Error(`${res.status} (${res.statusText}) ${url}`));
      }

      resolve(await res.text());
    } catch (err) {
      reject(Error(`Cannot retrieve ${url}`));
    }
  });
}

function sourceMappingURL(source) {
  return (
    source.match(reCaptureSourceMappingURL) || []
  )[1];
}

function isEmbeddedSourceMap(_sourceMappingURL) {
  return reCaptureEmbeddedSourceMap.test(_sourceMappingURL);
}

function embeddedSourceMap(_sourceMappingURL) {
  let base64 = (
    (_sourceMappingURL || '').match(reCaptureEmbeddedSourceMap) || []
  )[1];

  return (base64) ? JSON.parse(atob(base64)) : null;
}

function isAbsoluteURL(url) {
  return reTestAbsoluteURL.test(url);
}

function pathAndName(url) {
  let [
    ,
    path,
    name
  ] = (url || '').match(reCapturePathAndName) || [];

  return [path, name];
}

function originalErrorInfoAsync(_sourceMap, err) {
  const {SourceMapConsumer} = sourceMap;

  return SourceMapConsumer.with(_sourceMap, null, consumer => {
    let position = consumer.originalPositionFor({
      line: err.line || 1,
      // The sourceMap lib expects 0-based columns
      column: (err.column || 1) - 1
    }) || {};
    let source = consumer.sourceContentFor(position.source, true) || '';

    return {
      position,
      source
    };
  });
}

function sourceTraceArgs(_originalErrorInfo) {
  let {source, position} = _originalErrorInfo;

  return [
    source,
    position.source || '',
    position.line || 1,
    // The sourceTrace func expects 1-based columns
    // position.name is the erroneous token
    // Place the error marker after it for consistency with runtime errors
    (position.column || 0) + 1 + (position.name || '').length
  ];
}

function sourceTrace(source, url, line1, column1, {
  indent = '',
  peekLines = 2
} = {}) {
  let lines = (source || '').split('\n');
  let [path = 'path n/a', name = 'code'] = pathAndName(url);
  let iLine = (line1 || 1) - 1;
  let iColumn = (column1 || 1) - 1;
  let traceLines = [];
  let iTraceLineMax = Math.max(0, lines.length - 1);
  let iTraceLineBeg = Math.max(0, iLine - peekLines);
  let iTraceLineEnd = Math.min(iTraceLineMax, iLine + peekLines);
  let padMax = `${lines.length}`.length;
  let margin = '|';
  let linePointer = '>';
  let columnPointer = `${' '.repeat(iColumn)}^`;

  for (let i = iTraceLineBeg; i <= iTraceLineEnd; i++) {
    let pad = ' '.repeat(padMax - `${i + 1}`.length);
    let lineMarker = (i == iLine) ?
      linePointer :
      ' '.repeat(linePointer.length);
    let columnMarker = (i == iLine) ?
      `\n${indent}${' '.repeat(lineMarker.length + padMax)}${margin}${columnPointer}` :
      '';

    traceLines.push(`${indent}${lineMarker}${pad}${i + 1}${margin}${lines[i]}${columnMarker}`);
  }

  return `${indent}${name}:${line1}:${column1} (${path})\n${traceLines.join('\n')}`;
}

async function _formatErrorAsync(err) {
  let info;

  try {
    if (isInlineScriptError(err) && isTranspiledScriptError(err)) {
      info = (await transpiledInlineScriptsSourceTracesAsync(err)).
        join('\n');
    } else {
      info = sourceTrace(await errorSourceAsync(err),
        err.sourceURL, err.line, err.column);
    }
  } catch (err1) {
    err.sourceTraceNA = `${err1}`;

    info = pretty(err);
  }

  return `${info}\nstack:\n  ${
    (err &&
      err.stack &&
      err.stack.replace(/\n/gm, '\n  ')
    ) || 'n/a'
  }`;
}

function _reportError(err, note = 'error') {
  _formatErrorAsync(err).then(str => {
    p(str,
      `(${note}) ${err}`,
      {level: 'error'});
  });
}

export {
  _formatErrorAsync,
  _reportError
};
export default _reportError;
