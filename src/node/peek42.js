import peek42 from '../universal/base';

function _output(arg, comment) {
  let str = (comment === null) ?
    String(arg) :
    `// ${String(comment)}\n${String(arg)}`;

  console.log(str);
}

Object.assign(peek42, {
  _output
});

export default peek42;
