import {
  name as LIB_NAME,
  version as LIB_VERSION
} from '../package.json';

function _output(arg) {
  console.log(String(arg));
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

// TODO: Only works with apivis for now, develop general plugin model
function use(lib) {
  const {typeStr, descStr, membersStr, chainStr, apiStr} = lib;
  const {p} = peek42;

  p.type = (arg) => p(typeStr(arg));
  p.desc = (arg, k) => p(descStr(arg, k));
  p.members = (arg) => p(membersStr(arg));
  p.chain = (arg) => p(chainStr(arg));
  p.api = (arg) => p(apiStr(arg));

  return peek42;
}

const peek42 = {
  get [Symbol.toStringTag]() {
    return LIB_NAME;
  },
  version: LIB_VERSION,
  _output,
  pretty,
  use
};

export {
  _output,
  pretty,
  use
};
export default peek42;
