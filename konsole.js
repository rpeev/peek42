/*
  Konsole v1.0.9

  Copyright (c) 2016 Radoslav Peev <rpeev@ymail.com> (MIT License)
*/

(function () {

var VERSION = '1.0.9';

function Konsole() {
  var _this = this;

  var _container = document.createElement('div'),
    _title = document.createElement('span'),
    _toggle = document.createElement('span'),
    _quiet = document.createElement('input'),
    _quietl = document.createElement('label'),
    _resize = document.createElement('span'),
    _clear = document.createElement('span'),
    _kp = document.createElement('span'),
    _kpp = document.createElement('span'),
    _kpm = document.createElement('span'),
    _eval = document.createElement('input'),
    _log = document.createElement('pre');

  var _printFn = 'kp';

  var _minimized = false;

  var _resizeData = {
    height: window.innerHeight / 3,
    ratio: 1/3,
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

      _container.style.borderColor = 'red';
      setTimeout(function () {
        _container.style.borderColor = 'gray';
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

  _container.setAttribute('class', 'konsole-container');
  _container.style.width = '97%';

  _title.setAttribute('class', 'konsole-control konsole-title');
  _title.innerHTML = 'Konsole (v' + VERSION + ')';
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

  _toggle.setAttribute('class', 'konsole-control konsole-toggle');
  _toggle.innerHTML = 'Minimize';
  _toggle.addEventListener('click', function (ev) {
    if (_log.style.display === 'none') {
      _this.show();
    } else {
      _this.minimize();
    }
  });

  _quiet.setAttribute('class', 'konsole-control');
  _quiet.setAttribute('type', 'checkbox');
  _quietl.setAttribute('class', 'konsole-control konsole-quietl');
  _quietl.innerHTML = 'Shhhh!';

  _resize.setAttribute('class', 'konsole-control konsole-resize');
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

  _clear.setAttribute('class', 'konsole-control konsole-clear');
  _clear.innerHTML = 'Clear';
  _clear.addEventListener('mousedown', function (ev) {
    _this.clear();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _kp.setAttribute('class', 'konsole-control konsole-pfn');
  _kp.innerHTML = 'kp';
  _kp.style.fontWeight = 'bold';
  _kp.addEventListener('mousedown', function (ev) {
    _printFn = 'kp';

    _kp.style.fontWeight = 'bold';
    _kpp.style.fontWeight = 'inherit';
    _kpm.style.fontWeight = 'inherit';

    _eval.focus();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _kpp.setAttribute('class', 'konsole-control konsole-pfn');
  _kpp.innerHTML = 'kpp';
  _kpp.addEventListener('mousedown', function (ev) {
    _printFn = 'kpp';

    _kp.style.fontWeight = 'inherit';
    _kpp.style.fontWeight = 'bold';
    _kpm.style.fontWeight = 'inherit';

    _eval.focus();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _kpm.setAttribute('class', 'konsole-control konsole-pfn');
  _kpm.innerHTML = 'kpm';
  _kpm.addEventListener('mousedown', function (ev) {
    _printFn = 'kpm';

    _kp.style.fontWeight = 'inherit';
    _kpp.style.fontWeight = 'inherit';
    _kpm.style.fontWeight = 'bold';

    _eval.focus();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _eval.setAttribute('class', 'konsole-control konsole-eval');
  _eval.placeholder = 'JS to evaluate';
  _eval.addEventListener('keypress', function (ev) {
    var crCode = '\r'.charCodeAt(0),
      lfCode = '\n'.charCodeAt(0),
      js, src,
      printFnMap = {
        kp: 'value',
        kpp: 'pretty',
        kpm: 'members'
      };

    if (ev.charCode == crCode || ev.charCode == lfCode) {
      js = _eval.value.replace(/'/g, '"');
      src = _printFn + '(' + js + ', \'(' + printFnMap[_printFn] + ') ' + js + '\');';

      eval(src);
    }
  });

  _log.setAttribute('class', 'konsole-log');
  _log.innerHTML = '';
  _log.style.height = _resizeData.height + 'px';

  _container.appendChild(_title);
  // labels that nest a checkbox don't need to establish id-for
  // relationship in order to work
  _quietl.appendChild(_quiet);
  _container.appendChild(_quietl);
  _container.appendChild(_toggle);
  _container.appendChild(_resize);
  _container.appendChild(_clear);
  _container.appendChild(_eval);
  _container.appendChild(_kp);
  _container.appendChild(_kpp);
  _container.appendChild(_kpm);
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
      kp: _kp,
      kpp: _kpp,
      kpm: _kpm,
      eval: _eval,
      log: _log
    };
  }

  _this.minimized = function () {
    return _minimized;
  }

  _this.show = function () {
    _container.style.width = '97%';
    _toggle.innerHTML = 'Minimize';
    _quiet.style.display = 'none';
    _quietl.style.display = 'none';
    _resize.style.display = '';
    _clear.style.display = '';
    _kp.style.display = '';
    _kpp.style.display = '';
    _kpm.style.display = '';
    _eval.style.display = '';
    _log.style.display = '';

    _minimized = false;

    return _this;
  };

  _this.minimize = function () {
    _container.style.width = 'inherit';
    _toggle.innerHTML = 'Show';
    _quiet.style.display = '';
    _quietl.style.display = '';
    _resize.style.display = 'none';
    _clear.style.display = 'none';
    _kp.style.display = 'none';
    _kpp.style.display = 'none';
    _kpm.style.display = 'none';
    _eval.style.display = 'none';
    _log.style.display = 'none';

    _minimized = true;

    return _this;
  };

  _this.clear = function () {
    _log.textContent = '';

    _container.style.boxShadow = '0 0 1em blue';
    setTimeout(function () {
      _container.style.boxShadow = '0 0 1em gray';
    }, 300);

    return _this;
  };

  _this.log = function (obj, comment, err) {
    comment = comment || '';

    _log.textContent = '// ' + comment + '\n' +
      obj + '\n' +
      _log.textContent;

    // scroll to the top of the log
    _log.scrollTop = 0;

    if (err) {
      _container.style.boxShadow = '0 0 1em red';
      setTimeout(function () {
        _container.style.boxShadow = '0 0 1em gray';
        setTimeout(function () {
          _container.style.boxShadow = '0 0 1em red';
          setTimeout(function () {
            _container.style.boxShadow = '0 0 1em gray';
          }, 300);
        }, 200);
      }, 300);
    } else {
      _container.style.boxShadow = '0 0 1em green';
      setTimeout(function () {
        _container.style.boxShadow = '0 0 1em gray';
      }, 400);
    }

    return _this;
  };

  // start minimized
  _this.minimize();
}

Konsole.pretty = function (obj) {
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

Konsole.defCommentFor = function (obj) {
  var s = (obj + '').replace(/\s+/g, ' '),
    max = 42;

  if (s.length > max) {
    s = s.slice(0, max) + '...';
  }

  return s;
};

Konsole.noop = function () {
  Konsole.defInst = {};
  kpm = kpp = kp = function () {};
}

document.addEventListener('DOMContentLoaded', function () {
  if (!Konsole.defInst) {
    Konsole.defInst = new Konsole();
  }
});

function kp(obj, comment, err) {
  comment = comment || '(value) ' + Konsole.defCommentFor(obj);

  if (document.readyState === 'loading') {
    // defer kp calls made before DOM ready
    document.addEventListener('DOMContentLoaded', function () {
      kp(obj, comment, err);
    });

    return;
  }

  if (!Konsole.defInst) {
    Konsole.defInst = new Konsole();
  }

  if (Konsole.defInst.minimized() && !Konsole.defInst.dom().quiet.checked) {
    Konsole.defInst.show();
  }

  Konsole.defInst.log(obj, comment, err);
}

function kpp(obj, comment, err) {
  comment = comment || '(pretty) ' + Konsole.defCommentFor(obj);

  kp(Konsole.pretty(obj), comment, err);
}

function kpm(obj, comment, err) {
  comment = comment || '(members) ' + Konsole.defCommentFor(obj);

  kpp(Object.getOwnPropertyNames(obj), comment, err);
}

window.addEventListener('error', function () {
  kpp(arguments, arguments[0].message, true);
});

// exports
window.Konsole = Konsole;
window.kp = kp;
window.kpp = kpp;
window.kpm = kpm;

})();
