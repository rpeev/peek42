import peek42 from '../universal/base';
import Console from './console/console';

import './peek42.scss';

function _output(arg, comment) {
  Console.instance.then(_console => {
    _console.output(arg, comment);
  });
}

Console.instance.then(_console => {
  Object.assign(peek42, {
    _console
  });
});

Object.assign(peek42, {
  _output
});

export default peek42;
