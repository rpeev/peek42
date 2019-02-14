import peek42, {
  _string,
  _comment,
  _outputOptsDefaults,
  _prettyMakesSense,
  pretty,
  p,
  pp
} from '../universal/base';
import {cable, _send} from './cable';

function _output(val, comment, opts = {}) {
  opts = {..._outputOptsDefaults, ...opts};

  let str = (comment === null) ?
    _string(val) :
    `// ${String(comment)}\n${_string(val)}`;

  console[opts.level](str);
}

function cp(val, comment = undefined, opts = undefined) {
  _send(
    val,
    _comment(comment, val, 'value'),
    opts
  );
}

function cpp(val, comment = undefined, opts = undefined) {
  _send(
    (_prettyMakesSense(val)) ? pretty(val) : val,
    _comment(comment, val, 'pretty'),
    opts
  );
}

p.trace = (comment = undefined, opts = undefined) => {
  let stack = ((new Error).stack || '\n').split('\n').
    map(entry => entry.trim());
  let trace = (stack.shift(), stack.shift(), stack);
  let loc = trace[0];

  _output(
    trace.join('\n'),
    _comment(comment, loc, `trace`),
    opts
  );
};

cp.trace = (comment = undefined, opts = undefined) => {
  let stack = ((new Error).stack || '\n').split('\n').
    map(entry => entry.trim());
  let trace = (stack.shift(), stack.shift(), stack);
  let loc = trace[0];

  _send(
    trace.join('\n'),
    _comment(comment, loc, `trace`),
    opts
  );
};

function use(lib) {
  Object.assign(p,
    lib.peek42(p, _comment)
  );

  Object.assign(cp,
    lib.peek42(cp, _comment)
  );

  return peek42;
}

Object.assign(peek42, {
  _output,
  cable,
  cp,
  cpp,
  use // Overwrite the value from '../universal/base'
});

export default peek42;
