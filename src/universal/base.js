import {
  name as LIB_NAME,
  version as LIB_VERSION
} from '../../package.json';

function _isBareObject(arg) {
  return typeof arg === 'object' &&
    arg !== null &&
    arg.__proto__ === undefined;
}

function _string(arg) {
  return (_isBareObject(arg)) ?
    '[object BareObject]' :
    String(arg);
}

function _comment(comment, arg, note) {
  if (comment !== undefined && comment !== '') {
    return comment;
  }

  let str = _string(arg).replace(/\s+/gm, ' ');
  let max = 69;

  if (str.length > max) {
    str = `${str.substr(0, max)}...`;
  }

  return (note === undefined) ?
    str :
    `(${note}) ${str}`;
}

function _prettyMakesSense(arg) {
  return (arg instanceof Object && !(arg instanceof Function)) ||
    _isBareObject(arg);
}

function pretty(arg) {
  let objs = [];
  let keys = [];

  return JSON.stringify(arg, (k, v) => {
    if (v instanceof Object) {
      let seen = objs.indexOf(v);

      if (seen === -1) {
        objs.push(v);
        keys.push(k || 'ROOT');

        return v;
      }

      return `${v} (ref to ${keys[seen]})`;
    }

    return v;
  }, 2);
}

function p(arg, comment, opts) {
  peek42._output(
    arg,
    _comment(comment, arg, 'value'),
    opts
  );
}

function pp(arg, comment, opts) {
  peek42._output(
    (_prettyMakesSense(arg)) ? pretty(arg) : arg,
    _comment(comment, arg, 'pretty'),
    opts
  );
}

function use(lib) {
  Object.assign(p,
    lib.peek42(p, _comment)
  );

  return peek42;
}

const peek42 = {
  get [Symbol.toStringTag]() {
    return LIB_NAME;
  },
  version: LIB_VERSION,
  _string,
  _comment,
  pretty,
  p,
  pp,
  use
};

export {_string, _comment, pretty, p, pp, use};
export default peek42;
