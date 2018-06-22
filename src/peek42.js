import peek42, {
  pretty,
  _output
} from './base';

function p(arg) {
  _output(arg);
}

function pp(arg) {
  p(pretty(arg));
}

Object.assign(peek42, {p, pp});

export default peek42;
