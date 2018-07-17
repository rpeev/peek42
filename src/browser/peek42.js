import peek42 from '../universal/base';
import './styles/base.scss';
import Console from './console/console';
import {
  _interceptNativeConsoleFn,
  _restoreNativeConsoleFns
} from './intercept';
import _reportError from './error';

function _output(...args) {
  // Allow peek42.console.content to be used without
  // Console.instance.then wait (or the setTimeout 0 trick)
  // after console has been created and assigned
  if (peek42.console) {
    return peek42.console._output(...args);
  }

  Console.instance.then(console => {
    Object.assign(peek42, {
      console
    });

    console._output(...args);
  });
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
