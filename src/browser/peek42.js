import peek42 from '../universal/base';
import './styles/base.scss';
import Console from './console/console';
import _interceptNativeConsoleFn from './intercept';
import _reportError from './error';

function _output(arg, comment, opts) {
  Console.instance.then(console => {
    console._output(arg, comment, opts);
  });
}

Console.instance.then(console => {
  Object.assign(peek42, {
    console
  });
});

Object.assign(peek42, {
  _output
});

_interceptNativeConsoleFn('log');
_interceptNativeConsoleFn('info');
_interceptNativeConsoleFn('warn');
_interceptNativeConsoleFn('error');

window.addEventListener('error', ev => {
  _reportError(ev.error);
});

window.addEventListener('unhandledrejection', ev => {
  _reportError(ev.reason, 'unhandledrejection');
});

export default peek42;
