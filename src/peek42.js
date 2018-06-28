import peek42 from './base';
import Console from './console';

function _output(arg, comment) {
  let console = peek42._console;

  if (console === undefined) {
    document.addEventListener('DOMContentLoaded', () => {
      _output(arg, comment);
    });
  } else {
    console.output(arg, comment);
  }
}

Console.createContainer().then(container => {
  peek42._console = new Console(container);
});

Object.assign(peek42, {
  _output
});

export default peek42;
