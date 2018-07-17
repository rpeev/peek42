import peek42, {p, pp, use} from '../universal/base';
import './styles/base.scss';
import Console from './console/console';
import _reportError from './error';
import _config from './config';
import {
  _interceptNativeConsoleFn,
  _restoreNativeConsoleFns
} from './intercept';

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

function _onError(ev) {
  _reportError(ev.error);
}

function _onUnhandledRejection(ev) {
  _reportError(ev.reason, 'unhandledrejection');
}

window.addEventListener('error', _onError);
window.addEventListener('unhandledrejection', _onUnhandledRejection);

if (_config.interceptConsole) {
  _interceptNativeConsoleFn('log');
  _interceptNativeConsoleFn('info');
  _interceptNativeConsoleFn('warn');
  _interceptNativeConsoleFn('error');
}

if (_config.addGlobals) {
  Object.assign(window, {
    p,
    pp
  });
}

if (_config.autoUse) {
  window.apivis && use(apivis);
}

export default peek42;
