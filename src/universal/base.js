import {
  name as LIB_NAME,
  version as LIB_VERSION
} from '../../package.json';

function _comment(comment, genBase, genNote) {
  if (comment !== undefined && comment !== '') {
    return comment;
  }

  let str = String(genBase).replace(/\s+/gm, ' ');
  let max = 69;

  if (str.length > max) {
    str = `${str.substr(0, max)}...`;
  }

  return (genNote === undefined) ?
    str :
    `(${genNote}) ${str}`;
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

function p(arg, comment) {
  peek42._output(
    arg,
    _comment(comment, arg, 'value')
  );
}

function pp(arg, comment) {
  peek42._output(
    (arg instanceof Object) ? pretty(arg) : arg,
    _comment(comment, arg, 'pretty')
  );
}

function use(lib) {
  Object.assign(peek42.p,
    lib.peek42(peek42._output, _comment)
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
