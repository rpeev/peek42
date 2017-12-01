/*
  Peek42 - Lightweight browser console useful for quick prototyping on touch-based devices like tablets and smartphones

  Copyright (c) 2017 Radoslav Peev <rpeev@ymail.com> (MIT License)
*/

(function () {

var VERSION = '3.0.0';

function Peek42() {
  var _this = this;

  var _container = document.createElement('div'),
    _title = document.createElement('span'),
    _toggle = document.createElement('span'),
    _quiet = document.createElement('input'),
    _quietl = document.createElement('label'),
    _resize = document.createElement('span'),
    _clear = document.createElement('span'),
    _eval = document.createElement('input'),
    _log = document.createElement('pre');

  var _minimized = false;

  var _resizeData = {
    height: window.innerHeight * 0.42,
    ratio: 0.42,
    dragY: 0,
    dragDelta: 0,
    resizing: false
  };

  _resizeData.dragStart = function (clientY) {
    _resizeData.dragY = clientY;
    _resizeData.dragDelta = 0;
    _resizeData.resizing = true;
  };

  _resizeData.dragMove = function (clientY) {
    var maxHeight = window.innerHeight * 0.85,
      minHeight = window.innerHeight * 0.05;

    _resizeData.dragDelta = _resizeData.dragY - clientY;
    _resizeData.height += _resizeData.dragDelta;

    if (_resizeData.height > maxHeight || _resizeData.height < minHeight) {
      _resizeData.height = Math.min(_resizeData.height, maxHeight);
      _resizeData.height = Math.max(_resizeData.height, minHeight);
      _log.style.height = _resizeData.height + 'px';

      _container.style.boxShadow = '0 0 2em #563d7c';
      setTimeout(function () {
        _container.style.boxShadow = '0 0 1em #563d7c';
      }, 300);

      _resizeData.dragEnd();

      return;
    }

    _log.style.height = _resizeData.height + 'px';
    _resizeData.dragY = clientY;
  };

  _resizeData.dragEnd = function () {
    _resizeData.ratio = _resizeData.height / window.innerHeight;
    _resizeData.dragY = 0;
    _resizeData.dragDelta = 0;
    _resizeData.resizing = false;
  };

  _container.setAttribute('class', 'peek42-container');

  _title.setAttribute('class', 'peek42-control peek42-title');
  _title.innerHTML = 'Peek42';
  _title.addEventListener('mousedown', function (ev) {
    if (_log.scrollTop == 0) {
      // if at the top of the log, scroll to the bottom
      _log.scrollTop = _log.scrollHeight;
    } else {
      // when anywhere in the log, scroll to the top
      _log.scrollTop = 0;
    }

    ev.preventDefault();
    ev.stopPropagation();
  });

  _toggle.setAttribute('class', 'peek42-control peek42-toggle');
  _toggle.innerHTML = 'Minimize';
  _toggle.addEventListener('click', function (ev) {
    if (_log.style.display === 'none') {
      _this.show();
    } else {
      _this.minimize();
    }
  });

  _quiet.setAttribute('class', 'peek42-control');
  _quiet.setAttribute('type', 'checkbox');
  _quietl.setAttribute('class', 'peek42-control peek42-quietl');
  _quietl.innerHTML = 'Quiet ';

  _resize.setAttribute('class', 'peek42-control peek42-resize');
  _resize.innerHTML = 'Resize';
  _resize.addEventListener('touchstart', function (ev) {
    _resizeData.dragStart(ev.touches[0].clientY);

    ev.preventDefault();
    ev.stopPropagation();
  });
  _resize.addEventListener('mousedown', function (ev) {
    _resizeData.dragStart(ev.clientY);

    ev.preventDefault();
    ev.stopPropagation();
  });

  document.body.addEventListener('touchmove', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragMove(ev.touches[0].clientY);

    ev.preventDefault();
    ev.stopPropagation();
  });
  document.body.addEventListener('mousemove', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragMove(ev.clientY);

    ev.preventDefault();
    ev.stopPropagation();
  });

  document.body.addEventListener('touchend', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragEnd();
  });
  document.body.addEventListener('mouseup', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragEnd();
  });

  window.addEventListener('resize', function () {
    _resizeData.height = window.innerHeight * _resizeData.ratio;
    _log.style.height = _resizeData.height + 'px';
  });

  _clear.setAttribute('class', 'peek42-control peek42-clear');
  _clear.innerHTML = 'Clear';
  _clear.addEventListener('mousedown', function (ev) {
    _this.clear();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _eval.setAttribute('autocorrect', 'off');
  _eval.setAttribute('class', 'peek42-control peek42-eval');
  _eval.placeholder = 'JS to evaluate';
  _eval.addEventListener('keypress', function (ev) {
    var crCode = '\r'.charCodeAt(0),
      lfCode = '\n'.charCodeAt(0),
      input, parts, pair, fn, desc, expr,
      printFnMap = {
        v: ['p', 'value'],
        value: ['p', 'value'],
        p: ['pp', 'pretty'],
        pretty: ['pp', 'pretty'],
        m: ['p.props', 'members'],
        members: ['p.props', 'members'],
        t: ['p.type', 'type'],
        type: ['p.type', 'type'],
        c: ['p.protos', 'protos'],
        chain: ['p.protos', 'protos'],
        a: ['p.api', 'api'],
        api: ['p.api', 'api']
      },
      js;

    if (ev.charCode == crCode || ev.charCode == lfCode) {
      input = _eval.value.replace(/'/g, '"');
      parts = input.match(/^(\w+)\s+(.+)/);

      if (parts) {
        fn = parts[1];
        pair = printFnMap[fn];
        if (!pair) {
          p('Bad print spec: ' + fn +
            '. Use blank or one of v(alue), p(retty), m(embers), t(ype), c(hain), a(pi).',
            input, {type: 'warn'});
          pair = ['p', 'value'];
        }

        fn = pair[0];
        desc = pair[1];
        expr = parts[2];
      } else {
        fn = 'p';
        desc = 'value';
        expr = input;
      }

      js = fn + '(' + expr + ', \'(' + desc + ') ' + expr + '\');';

      eval(js);
    }
  });

  _log.setAttribute('class', 'peek42-log');
  _log.innerHTML = '';
  _log.style.height = _resizeData.height + 'px';

  _container.appendChild(_title);
  _container.appendChild(_toggle);
  // labels that nest a checkbox don't need to establish id-for
  // relationship in order to work
  _quietl.appendChild(_quiet);
  _container.appendChild(_quietl);
  _container.appendChild(_resize);
  _container.appendChild(_clear);
  _container.appendChild(_eval);
  _container.appendChild(_log);

  document.body.appendChild(_container);

  _this.dom = function () {
    return {
      container: _container,
      title: _title,
      toggle: _toggle,
      quiet: _quiet,
      quietl: _quietl,
      resize: _resize,
      clear: _clear,
      eval: _eval,
      log: _log
    };
  }

  _this.minimized = function () {
    return _minimized;
  }

  _this.show = function () {
    _toggle.innerHTML = 'Minimize';
    _quiet.style.display = 'none';
    _quietl.style.display = 'none';
    _resize.style.display = '';
    _clear.style.display = '';
    _eval.style.display = '';
    _log.style.display = '';

    _minimized = false;

    return _this;
  };

  _this.minimize = function () {
    _toggle.innerHTML = 'Restore';
    _quiet.style.display = '';
    _quietl.style.display = '';
    _resize.style.display = 'none';
    _clear.style.display = 'none';
    _eval.style.display = 'none';
    _log.style.display = 'none';

    _minimized = true;

    return _this;
  };

  _this.clear = function () {
    _log.textContent = '';

    _container.style.boxShadow = '0 0 1em blue';
    setTimeout(function () {
      _container.style.boxShadow = '0 0 1em #563d7c';
    }, 300);

    return _this;
  };

  _this.log = function (obj, comment, opts) {
    comment = comment || '';
    opts = opts || {};
    opts.type = opts.type || 'info';

    _log.textContent = '// ' + comment + '\n' +
      ((typeof obj == 'symbol') ?
        obj.toString() :
        obj) + '\n' +
      _log.textContent;

    // scroll to the top of the log
    _log.scrollTop = 0;

    switch (opts.type) {
    case 'err':
    case 'error':
      _container.style.boxShadow = '0 0 1em red';
      setTimeout(function () {
        _container.style.boxShadow = '0 0 1em #563d7c';
        setTimeout(function () {
          _container.style.boxShadow = '0 0 1em red';
          setTimeout(function () {
            _container.style.boxShadow = '0 0 1em #563d7c';
          }, 300);
        }, 200);
      }, 300);

      break;
    case 'warn':
    case 'warning':
      _container.style.boxShadow = '0 0 1em orange';
      setTimeout(function () {
        _container.style.boxShadow = '0 0 1em #563d7c';
        setTimeout(function () {
          _container.style.boxShadow = '0 0 1em orange';
          setTimeout(function () {
            _container.style.boxShadow = '0 0 1em #563d7c';
          }, 300);
        }, 200);
      }, 300);

      break;
    case 'info':
    case 'information':
    default:
      _container.style.boxShadow = '0 0 1em green';
      setTimeout(function () {
        _container.style.boxShadow = '0 0 1em #563d7c';
      }, 400);
    }

    return _this;
  };

  // start minimized
  _this.minimize();
}

Peek42.pretty = function (obj) {
  var objs = [], keys = [];

  return JSON.stringify(obj, function (k, v) {
    var seen;

    if (v instanceof Object) {
      if ( (seen = objs.indexOf(v)) == -1 ) {
        objs.push(v);
        keys.push(k || 'ROOT');

        return v;
      }

      return v + ' (ref to ' + keys[seen] + ')';
    }

    return v;
  }, 2);
}

Peek42.noop = function () {
  Peek42._noop = true;
};

Peek42.defCommentFor = function (obj) {
  var str = ((typeof obj == 'symbol') ?
    obj.toString() :
    obj + '').replace(/\s+/g, ' '),
    max = 42;

  if (str.length > max) {
    str = str.slice(0, max) + '...';
  }

  return str;
};

document.addEventListener('DOMContentLoaded', function () {
  if (Peek42._noop) { return; }

  if (!Peek42.defInst) {
    Peek42.defInst = new Peek42();
  }
});

function p(obj, comment, opts) {
  if (Peek42._noop) { return; }

  comment = comment || '(value) ' + Peek42.defCommentFor(obj);

  if (document.readyState === 'loading') {
    // defer p calls made before DOM ready
    document.addEventListener('DOMContentLoaded', function () {
      p(obj, comment, opts);
    });

    return;
  }

  if (!Peek42.defInst) {
    Peek42.defInst = new Peek42();
  }

  if (Peek42.defInst.minimized() && !Peek42.defInst.dom().quiet.checked) {
    Peek42.defInst.show();
  }

  Peek42.defInst.log(obj, comment, opts);
}

if (window.apivis) {
  p.type = function (obj, comment) {
    if (Peek42._noop) { return; }

    p(apivis.typeStr(obj), comment || `(type) ${Peek42.defCommentFor(obj)}`);
  };

  p.props = function (obj, comment) {
    if (Peek42._noop) { return; }

    p(apivis.propsStr(obj), comment || `(props) ${Peek42.defCommentFor(obj)}`);
  };

  p.protos = function (obj, comment) {
    if (Peek42._noop) { return; }

    p(apivis.protosStr(obj), comment || `(protos) ${Peek42.defCommentFor(obj)}`);
  };

  p.api = function (obj, comment) {
    if (Peek42._noop) { return; }

    p(apivis.apiStr(obj), comment || `(api) ${Peek42.defCommentFor(obj)}`);
  };
}

function pp(obj, comment, opts) {
  if (Peek42._noop) { return; }

  comment = comment || '(pretty) ' + Peek42.defCommentFor(obj);

  p((obj instanceof Object) ? Peek42.pretty(obj) : obj, comment, opts);
}

function pm(obj, comment, opts) {
  if (Peek42._noop) { return; }

  comment = comment || '(members) ' + Peek42.defCommentFor(obj);

  pp(Object.getOwnPropertyNames(obj).sort(), comment, opts);
}

window.console = window.console || {};

Peek42._console = window.console;
Peek42._consoleNativeLog = window.console.log;
Peek42._consoleNativeInfo = window.console.info;
Peek42._consoleNativeWarn = window.console.warn;
Peek42._consoleNativeError = window.console.error;

Peek42._instrumentConsoleNativeFn = function (name, fnNative) {
  window.console[name] = function () {
    var i, len, arg, fnP;

    for (i = 0, len = arguments.length; i < len; i++) {
      arg = arguments[i];
      fnP = (typeof arg == 'function') ? p: pp;

      fnP(arg, '(intercepted console.' + name + ') ' + Peek42.defCommentFor(arg));

      try {
        fnNative && fnNative.call(Peek42._console, arg);
      } catch (err) {
        pp(err, 'native console.' + name + ' chocked on ' + Peek42.defCommentFor(arg), {type: 'error'});
      }
    }

    return window.console;
  };
};

Peek42._instrumentConsoleNativeFn('log', Peek42._consoleNativeLog);
Peek42._instrumentConsoleNativeFn('info', Peek42._consoleNativeInfo);
Peek42._instrumentConsoleNativeFn('warn', Peek42._consoleNativeWarn);
Peek42._instrumentConsoleNativeFn('error', Peek42._consoleNativeError);

window.addEventListener('error', function (ev) {
  let err = ev.error;

  if (window.bundleError && err.sourceURL && err.sourceURL.endsWith('bundle.js')) {
    pp(err, err.message + ' (retrieving source information...)', {type: 'error'});

    bundleError.addSrcInfo(err).then(err1 => {
      pp(err1.srcSnip, err1.message, {type: 'error'});
    }).catch(err2 => {
      pp(err2, err2.message, {type: 'error'});
    });
  } else {
    pp(err, err.message, {type: 'error'});
  }
});

// exports
window.Peek42 = Peek42;
window.p = p;
window.pp = pp;
window.pm = pm;

})();
