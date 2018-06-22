import {
  name as LIB_NAME,
  version as LIB_VERSION
} from '../package.json';

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

function _output(arg) {
  console.log(`${arg}`);
}

const peek42 = {
  get [Symbol.toStringTag]() {
    return LIB_NAME;
  },
  version: LIB_VERSION,
  pretty,
  _output
};

export {
  pretty,
  _output
};
export default peek42;
