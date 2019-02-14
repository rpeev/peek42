import peek42, {_comment, p, pp, use} from '../universal/base';
import './styles/base.scss';
import Console from './console/console';
import reportError, {
  sourceTrace,
  formatErrorAsync
} from './error';
import _config from './config';
import {
  _interceptNativeConsoleFn,
  _restoreNativeConsoleFns
} from './intercept';
import {cable} from './cable';

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

p.trace = (comment = undefined, opts = undefined) => {
  let stack = ((new Error).stack || '\n').split('\n');
  let trace = (stack.shift(), stack);
  let loc = trace[0];

  _output(
    trace.join('\n'),
    _comment(comment, loc, `trace`),
    opts
  );
};

Object.assign(peek42, {
  _output,
  Console,
  sourceTrace,
  formatErrorAsync,
  reportError,
  cable
});

function _onError(ev) {
  reportError(ev.error, {
    note: 'uncaught exception'
  });
}

function _onUnhandledRejection(ev) {
  reportError(ev.reason, {
    note: 'unhandled rejection'
  });
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
