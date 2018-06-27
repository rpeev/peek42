import peek42 from './base';
import Console from './console';

function _output(arg, comment) {
  let str = (comment === null) ?
    String(arg) :
    `// ${String(comment)}\n${String(arg)}`;

  console.log(str);
}

Object.assign(peek42, {
  _output,
  Console
});

export default peek42;
