import peek42, {
  _output,
  pretty
} from './base';

function p(arg) {
  _output(arg);
}

function pp(arg) {
  p(pretty(arg));
}

Object.assign(peek42, {p, pp});

export default peek42;
