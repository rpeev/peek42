function Konsole() {
  var _this = this;

  var _container = document.createElement('div'),
    _title = document.createElement('span'),
    _toggle = document.createElement('span'),
    _resize = document.createElement('span'),
    _clear = document.createElement('span'),
    _log = document.createElement('pre');

  var _minimized = false;

  var _resizeData = {
    initialHeight: 480,
    currentHeight: 480,
    dragY: 0,
    dragDelta: 0,
    resizing: false
  };
  _resizeData.dragStart = function (ev, clientY) {
    _resizeData.dragY = clientY;
    _resizeData.dragDelta = 0;
    _resizeData.resizing = true;
  };
  _resizeData.dragMove = function (ev, clientY) {
    _resizeData.dragDelta = _resizeData.dragY - clientY;
    _resizeData.currentHeight += _resizeData.dragDelta;
    _log.style.height = _resizeData.currentHeight + 'px';
    _resizeData.dragY = clientY;
  };
  _resizeData.dragEnd = function (ev, clientY) {
    _resizeData.resizing = false;
  };

  _container.setAttribute('class', 'konsole-container');
  _container.style.width = '97%';

  _title.setAttribute('class', 'konsole-control konsole-title');
  _title.innerHTML = 'Konsole';
  _title.addEventListener('click', function (ev) {
    if (_log.scrollTop == 0) {
      // if at the top of the log, scroll to the bottom
      _log.scrollTop = _log.scrollHeight;
    } else {
      // when anywhere in the log, scroll to the top
      _log.scrollTop = 0;
    }
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

  _resize.setAttribute('class', 'konsole-control konsole-resize');
  _resize.innerHTML = 'Resize';
  _resize.addEventListener('touchstart', function (ev) {
    _resizeData.dragStart(ev, ev.changedTouches[0].clientY);

    //kpp(_resizeData, 'touchstart');
  });
  _resize.addEventListener('mousedown', function (ev) {
    _resizeData.dragStart(ev, ev.clientY);

    ev.preventDefault();
    ev.stopPropagation();

    //kpp(_resizeData, 'mousedown');
  });
  _resize.addEventListener('touchmove', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragMove(ev, ev.changedTouches[0].clientY);

    ev.preventDefault();
    ev.stopPropagation();

    //kpp(_resizeData, 'touchmove');
  });
  document.body.addEventListener('mousemove', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragMove(ev, ev.clientY);

    ev.preventDefault();
    ev.stopPropagation();

    //kpp(_resizeData, 'mousemove');
  });
  _resize.addEventListener('touchend', function (ev) {
    _resizeData.dragEnd(ev, ev.changedTouches[0].clientY);

    //kpp(_resizeData, 'touchend');
  });
  document.body.addEventListener('mouseup', function (ev) {
    if (!_resizeData.resizing) {
      return;
    }

    _resizeData.dragEnd(ev, ev.clientY);

    //kpp(_resizeData, 'mouseup');
  });

  _clear.setAttribute('class', 'konsole-control konsole-clear');
  _clear.innerHTML = 'Clear';
  _clear.addEventListener('click', function (ev) {
    _this.clear();
  });

  _log.setAttribute('class', 'konsole-log');
  _log.style.height = _resizeData.initialHeight + 'px';

  _container.appendChild(_title);
  _container.appendChild(_toggle);
  _container.appendChild(_resize);
  _container.appendChild(_clear);
  _container.appendChild(_log);

  document.body.appendChild(_container);

  _this.dom = function () {
    return {
      container: _container,
      title: _title,
      toggle: _toggle,
      resize: _resize,
      clear: _clear,
      log: _log
    };
  }

  _this.minimized = function () {
    return _minimized;
  }

  _this.show = function () {
    _container.style.width = '97%';
    _toggle.innerHTML = 'Minimize';
    _resize.style.display = '';
    _clear.style.display = '';
    _log.style.display = '';

    _minimized = false;

    return _this;
  };

  _this.minimize = function () {
    _container.style.width = 'inherit';
    _toggle.innerHTML = 'Show';
    _resize.style.display = 'none';
    _clear.style.display = 'none';
    _log.style.display = 'none';

    _minimized = true;

    return _this;
  };

  _this.clear = function () {
    _log.textContent = '';

    return _this;
  };

  _this.log = function (obj, comment) {
    if (comment) {
      _log.textContent += '// ' + comment + '\n';
    }
    _log.textContent += obj + '\n---\n';

    // scroll to the bottom of the log
    _log.scrollTop = _log.scrollHeight;

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

Konsole.noop = function () {
  Konsole.defInst = {};
  kpp = kp = function () {};
}

document.addEventListener('DOMContentLoaded', function () {
  if (!Konsole.defInst) {
    Konsole.defInst = new Konsole();
  }
});

function kp(obj, comment) {
  if (document.readyState === 'loading') {
    // defer kp calls made before DOM ready
    document.addEventListener('DOMContentLoaded', function () {
      kp(obj, comment);
    });

    return;
  }

  if (!Konsole.defInst) {
    Konsole.defInst = new Konsole();
  }

  if (Konsole.defInst.minimized()) {
    Konsole.defInst.show();
  }

  Konsole.defInst.log(obj, comment);
}

function kpp(obj, comment) {
  kp(Konsole.pretty(obj), comment);
}

window.addEventListener('error', function () {
  kpp(arguments, arguments[0].message);
});
