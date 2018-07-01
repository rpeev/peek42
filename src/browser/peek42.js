import peek42 from '../universal/base';
import './styles/base.scss';
import Console from './console/console';

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
