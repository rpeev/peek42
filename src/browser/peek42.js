import peek42 from '../universal/base';
import './styles/base.scss';
import Console from './console/console';
import _interceptNativeConsoleFn from './intercept';
import _reportError from './error';

function _output(arg, comment, opts) {
  // Allow peek42.console.content to be used without
  // Console.instance.then wait (or the setTimeout 0 trick)
  // after console has been created
  if (peek42.console) {
    peek42.console._output(arg, comment, opts);
  } else {
    Console.instance.then(console => {
      Object.assign(peek42, {
        console
      });

      console._output(arg, comment, opts);
    });
  }
}

Console.instance.then(console => {
  Object.assign(peek42, {
    console
  });
});

Object.assign(peek42, {
  _output,
  Console
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
