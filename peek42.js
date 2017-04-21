/*
  Peek42 - Lightweight browser console useful for quick prototyping on touch-based devices like tablets and smartphones

  Copyright (c) 2017 Radoslav Peev <rpeev@ymail.com> (MIT License)
*/

(function () {

var VERSION = '2.3.0';

function Peek42() {
  var _this = this;

  var _container = document.createElement('div'),
    _title = document.createElement('span'),
    _toggle = document.createElement('span'),
    _quiet = document.createElement('input'),
    _quietl = document.createElement('label'),
    _resize = document.createElement('span'),
    _clear = document.createElement('span'),
    _p = document.createElement('span'),
    _pp = document.createElement('span'),
    _pm = document.createElement('span'),
    _eval = document.createElement('input'),
    _log = document.createElement('pre');

  var _printFn = 'p';

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

  _container.setAttribute('class', 'peek42-container');
  _container.style.width = '97%';

  _title.setAttribute('class', 'peek42-control peek42-title');
  _title.innerHTML = 'Peek42 (v' + VERSION + ')';
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
  _quietl.innerHTML = 'Shhhh!';

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

  _p.setAttribute('class', 'peek42-control peek42-pfn');
  _p.innerHTML = 'p';
  _p.style.fontWeight = 'bold';
  _p.addEventListener('mousedown', function (ev) {
    _printFn = 'p';

    _p.style.fontWeight = 'bold';
    _pp.style.fontWeight = 'inherit';
    _pm.style.fontWeight = 'inherit';

    _eval.focus();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _pp.setAttribute('class', 'peek42-control peek42-pfn');
  _pp.innerHTML = 'pp';
  _pp.addEventListener('mousedown', function (ev) {
    _printFn = 'pp';

    _p.style.fontWeight = 'inherit';
    _pp.style.fontWeight = 'bold';
    _pm.style.fontWeight = 'inherit';

    _eval.focus();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _pm.setAttribute('class', 'peek42-control peek42-pfn');
  _pm.innerHTML = 'pm';
  _pm.addEventListener('mousedown', function (ev) {
    _printFn = 'pm';

    _p.style.fontWeight = 'inherit';
    _pp.style.fontWeight = 'inherit';
    _pm.style.fontWeight = 'bold';

    _eval.focus();

    ev.preventDefault();
    ev.stopPropagation();
  });

  _eval.setAttribute('class', 'peek42-control peek42-eval');
  _eval.placeholder = 'JS to evaluate';
  _eval.addEventListener('keypress', function (ev) {
    var crCode = '\r'.charCodeAt(0),
      lfCode = '\n'.charCodeAt(0),
      js, src,
      printFnMap = {
        p: 'value',
        pp: 'pretty',
        pm: 'members'
      };

    if (ev.charCode == crCode || ev.charCode == lfCode) {
      js = _eval.value.replace(/'/g, '"');
      src = _printFn + '(' + js + ', \'(' + printFnMap[_printFn] + ') ' + js + '\');';

      eval(src);
    }
  });

  _log.setAttribute('class', 'peek42-log');
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
  _container.appendChild(_p);
  _container.appendChild(_pp);
  _container.appendChild(_pm);
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
      p: _p,
      pp: _pp,
      pm: _pm,
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
    _p.style.display = '';
    _pp.style.display = '';
    _pm.style.display = '';
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
    _p.style.display = 'none';
    _pp.style.display = 'none';
    _pm.style.display = 'none';
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
  var str = (obj + '').replace(/\s+/g, ' '),
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

function p(obj, comment, err) {
  if (Peek42._noop) { return; }

  comment = comment || '(value) ' + Peek42.defCommentFor(obj);

  if (document.readyState === 'loading') {
    // defer p calls made before DOM ready
    document.addEventListener('DOMContentLoaded', function () {
      p(obj, comment, err);
    });

    return;
  }

  if (!Peek42.defInst) {
    Peek42.defInst = new Peek42();
  }

  if (Peek42.defInst.minimized() && !Peek42.defInst.dom().quiet.checked) {
    Peek42.defInst.show();
  }

  Peek42.defInst.log(obj, comment, err);
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

function pp(obj, comment, err) {
  if (Peek42._noop) { return; }

  comment = comment || '(pretty) ' + Peek42.defCommentFor(obj);

  p(Peek42.pretty(obj), comment, err);
}

function pm(obj, comment, err) {
  if (Peek42._noop) { return; }

  comment = comment || '(members) ' + Peek42.defCommentFor(obj);

  pp(Object.getOwnPropertyNames(obj).sort(), comment, err);
}

window.addEventListener('error', function () {
  pp(arguments, arguments[0].message, true);
});

// exports
window.Peek42 = Peek42;
window.p = p;
window.pp = pp;
window.pm = pm;

})();
