import peek42, {_string} from '../universal/base';

function _output(arg, comment, opts = {
  level: 'log'
}) {
  let str = (comment === null) ?
    _string(arg) :
    `// ${String(comment)}\n${_string(arg)}`;

  console[opts.level](str);
}

Object.assign(peek42, {
  _output
});

export default peek42;
