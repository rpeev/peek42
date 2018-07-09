import peek42, {_string} from '../universal/base';

function _output(val, comment, opts = {
  level: 'log'
}) {
  let str = (comment === null) ?
    _string(val) :
    `// ${String(comment)}\n${_string(val)}`;

  console[opts.level || 'log'](str);
}

Object.assign(peek42, {
  _output
});

export default peek42;
