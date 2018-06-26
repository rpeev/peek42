import peek42 from './base';

function _log(str) {
  console.log(str);
}

Object.assign(peek42, {
  _log
});

export default peek42;
