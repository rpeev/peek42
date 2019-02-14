import {_string, _comment, p, pp} from '../universal/base';
import {formatErrorAsync} from './error';

window.console = window.console || {};
const _fnOrig = {};

function _interceptNativeConsoleFn(name) {
  _fnOrig[name] = window.console[name];
  const {map} = Array.prototype;

  window.console[name] = function () {
    let str = map.call(arguments, arg => _string(arg)).join(' ');
    let stack = ((new Error).stack || '\n').split('\n');
    let loc = (stack.shift(), stack.shift() || '[source location n/a]');

    p(str,
      _comment('', '', `console.${name}@${loc}`),
      {level: name});

    try {
      _fnOrig[name] && _fnOrig[name].apply(window.console, arguments);
    } catch (err) {
      formatErrorAsync(err).then(str => {
        p(str,
          _comment('', err, `console.${name}@${loc}`),
          {level: 'error', collapsed: true});
      });
    }
  };
}

function _restoreNativeConsoleFns() {
  Object.keys(_fnOrig).forEach(name => {
    window.console[name] = _fnOrig[name];
  });
}

export {
  _interceptNativeConsoleFn,
  _restoreNativeConsoleFns
};
