import {_comment, p, pp} from '../universal/base';

window.console = window.console || {};

function _interceptNativeConsoleFn(name) {
  const fnOrig = window.console[name];
  const {map} = Array.prototype;

  window.console[name] = function () {
    let str = map.call(arguments, arg => String(arg)).join(' ');

    p(str,
      _comment('', '', `intercepted console.${name}`),
      {level: name});

    try {
      fnOrig && fnOrig.apply(window.console, arguments);
    } catch (err) {
      pp(err,
        _comment('', err, `native console.${name}`),
        {level: 'error'});
    }
  };
}

export default _interceptNativeConsoleFn;
