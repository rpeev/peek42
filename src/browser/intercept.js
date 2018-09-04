import {_string, _comment, p, pp} from '../universal/base';
import {formatErrorAsync} from './error';

window.console = window.console || {};
const _fnOrig = {};

function _interceptNativeConsoleFn(name) {
  _fnOrig[name] = window.console[name];
  const {map} = Array.prototype;

  window.console[name] = function () {
    let str = map.call(arguments, arg => _string(arg)).join(' ');

    p(str,
      _comment('', '', `intercepted console.${name}`),
      {level: name});

    try {
      _fnOrig[name] && _fnOrig[name].apply(window.console, arguments);
    } catch (err) {
      formatErrorAsync(err).then(str => {
        p(str,
          _comment('', err, `native console.${name} error`),
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
