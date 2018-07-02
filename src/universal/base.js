import {
  name as LIB_NAME,
  version as LIB_VERSION
} from '../../package.json';

function _comment(comment, arg, note) {
  if (comment !== undefined && comment !== '') {
    return comment;
  }

  let str = String(arg).replace(/\s+/gm, ' ');
  let max = 69;

  if (str.length > max) {
    str = `${str.substr(0, max)}...`;
  }

  return (note === undefined) ?
    str :
    `(${note}) ${str}`;
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
    (arg instanceof Object) ? pretty(arg) : arg,
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
  pretty,
  p,
  pp,
  use
};

export default peek42;
