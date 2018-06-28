import peek42 from './base';
import Console from './console';

function _output(arg, comment) {
  let str = (comment === null) ?
    String(arg) :
    `// ${String(comment)}\n${String(arg)}`;

  console.log(str);
}

Console.createContainer().then(container => {
  peek42._console = new Console(container);
});

Object.assign(peek42, {
  _output
});

export default peek42;
