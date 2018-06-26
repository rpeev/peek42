import {
  name as LIB_NAME,
  version as LIB_VERSION
} from '../package.json';

function _comment(comment, arg, note) {
  // No comment
  if (comment === null) {
    return null;
  // Generate comment
  } else if (comment === undefined || comment === '') {
    let str = String(arg).replace(/\s+/gm, ' ');
    let max = 69;

    if (str.length > max) {
      str = `${str.substr(0, max)}...`;
    }

    return (note === undefined) ?
      str :
      `(${note}) ${str}`;
  }

  return String(comment);
}

function _output(arg, comment) {
  let str = (comment === null) ?
    String(arg) :
    `// ${comment}\n${String(arg)}`;

  peek42._log(str);
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
  _output(arg, _comment(comment, arg, 'value'));
}

function pp(arg, comment) {
  _output(pretty(arg), _comment(comment, arg, 'pretty'));
}

function use(lib) {
  Object.assign(peek42.p,
    lib.peek42(_output, _comment)
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
