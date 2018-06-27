import peek42 from './base';
import Console from './console';

function _log(str) {
  console.log(str);
}

Object.assign(peek42, {
  _log,
  Console
});

export default peek42;
