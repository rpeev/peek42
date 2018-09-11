import {_string, _outputOptsDefaults} from '../../universal/base';
import consoleHTML from './console.html';
import './styles/console.scss';
import Resizer from './resize';
import {
  flashNotice,
  flashOutput
} from './flash';
import {addLogEntry} from './log-entry';

class Console {
  static _html = consoleHTML;
  static _instance = null;
  static _printFnMap = {
    v: ['peek42.p', 'value'],
    value: ['peek42.p', 'value'],
    p: ['peek42.pp', 'pretty'],
    pretty: ['peek42.pp', 'pretty'],
    t: ['peek42.p.type', 'type'],
    type: ['peek42.p.type', 'type'],
    d: ['peek42.p.desc', 'desc'],
    desc: ['peek42.p.desc', 'desc'],
    m: ['peek42.p.members', 'members'],
    members: ['peek42.p.members', 'members'],
    c: ['peek42.p.chain', 'chain'],
    chain: ['peek42.p.chain', 'chain'],
    a: ['peek42.p.api', 'api'],
    api: ['peek42.p.api', 'api']
  };

  static get instance() {
    return new Promise((resolve, reject) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          resolve(this._instance = this._instance || new this());
        });
      } else {
        resolve(this._instance = this._instance || new this());
      }
    });
  }

  constructor() {
    if (document.readyState === 'loading') {
      throw new Error(`Cannot create ${new.target.name} before DOM ready`);
    }

    if (document.querySelector('.peek42-console')) {
      throw new Error(`${new.target.name} already created`);
    }

    this._container = document.createElement('div');
    this._container.setAttribute('class', 'peek42-console');
    this._container.innerHTML = new.target._html;
    document.body.appendChild(this._container);
    //this._container.classList.add('peek42-dev');

    [
      'title',
      'eval',
      'clear', 'resize', 'quietl', 'quiet', 'toggle',
      'view', 'log', 'bar1'
    ].forEach(ctrl => {
      this[`_${ctrl}`] = this._container.querySelector(`.peek42-${ctrl}`);
    });

    this._resizer = new Resizer(this._log, {
      elFlashSizeLimit: this._container,
      elsMakeSameHeight: [this._bar1]
    });
    this._isMinimized = false;

    this._title.addEventListener('click', ev => {
      this._onTitleClick(ev);
    });

    this._eval.addEventListener('keypress', ev => {
      this._onEvalKeyPress(ev);
    });

    this._clear.addEventListener('click', ev => {
      this._onClearClick(ev);
    });

    this._resize.addEventListener('touchstart', ev => {
      this._onResizeTouchStart(ev);
    });
    document.body.addEventListener('touchmove', ev => {
      this._onBodyTouchMove(ev);
    });
    document.body.addEventListener('touchend', ev => {
      this._onBodyTouchEnd(ev);
    });
    window.addEventListener('resize', ev => {
      this._onWindowResize(ev);
    });

    this._quietl.addEventListener('click', ev => {
      this._onQuietClick(ev);
    });

    this._toggle.addEventListener('click', ev => {
      this._onToggleClick(ev);
    });

    this._log.style.height = `${this._resizer.height}px`;

    this.minimize();
  }

  _output(val, comment, opts = {}) {
    opts = {..._outputOptsDefaults, ...opts};

    if (this.isMinimized && !this.isQuiet) {
      this.show();
    }

    if (comment === null) {
      addLogEntry({
        elLog: this._log,
        entrySimpleText: _string(val),
        ...opts
      });
    } else {
      addLogEntry({
        elLog: this._log,
        entryDesc: String(comment),
        entryText: _string(val),
        ...opts
      });
    }

    flashOutput(this._container, opts.level);
  }

  _onTitleClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.toggleLogPos();
  }

  _onEvalKeyPress(ev) {
    let crCode = '\r'.charCodeAt(0);
    let lfCode = '\n'.charCodeAt(0);

    if (ev.charCode === crCode || ev.charCode === lfCode) {
      this.evalJS();
    }
  }

  _onClearClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.clear();
  }

  _onResizeTouchStart(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this._resizer.resizeStart(ev.touches[0].clientY);
  }

  _onBodyTouchMove(ev) {
    if (this._resizer.isResizing) {
      ev.preventDefault();
      ev.stopPropagation();

      this._resizer.resize(ev.touches[0].clientY);
    }
  }

  _onBodyTouchEnd(ev) {
    if (this._resizer.isResizing) {
      this._resizer.resizeEnd();
    }
  }

  _onWindowResize(ev) {
    this._resizer.height = window.innerHeight * this._resizer.ratio;
    this._log.style.height = `${this._resizer.height}px`;
  }

  _onQuietClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.toggleQuiet();
  }

  _onToggleClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.toggleDisplay();
  }

  get logIsAtTop() {
    return this._log.scrollTop === 0;
  }

  toggleLogPos() {
    (this.logIsAtTop) ? this.logPosBottom() : this.logPosTop();
  }

  logPosBottom() {
    this._log.scrollTop = this._log.scrollHeight;
  }

  logPosTop() {
    this._log.scrollTop = 0;
  }

  get jsToEval() {
    return this._eval.value;
  }

  set jsToEval(v) {
    this._eval.value = v;
  }

  evalJS() {
    let val = this._eval.value;

    if (val.match(/^\s*$/gm)) {
      return;
    }

    let str = val.replace(/'/gm, '"');
    let keys = Object.keys(this.constructor._printFnMap);
    let pattern = `^(${keys.join('|')})\\s+(.+)`;
    let parts = str.match(new RegExp(pattern));
    let dummy, k, expr, fn, note, js;

    if (parts) {
      [dummy, k, expr] = parts;
      [fn, note] = this.constructor._printFnMap[k];
    } else {
      expr = str;
      [fn, note] = this.constructor._printFnMap['v'];
    }

    js = `'use strict';

${fn}(${expr}, '(${note}) ${expr}');
`;

    try {
      (new Function(js))();
    } catch (err) {
      if (!err.sourceURL) {
        err.sourceText = js;
        err.line = (err.line || 4) - 1;
      }

      throw err;
    }
  }

  clear() {
    this._log.textContent = '';
    flashNotice(this._container);
  }

  get isQuiet() {
    return this._quiet.checked;
  }

  toggleQuiet() {
    this._quiet.checked = !this._quiet.checked;
  }

  quiet() {
    this._quiet.checked = true;
  }

  unquiet() {
    this._quiet.checked = false;
  }

  get isMinimized() {
    return this._isMinimized;
  }

  toggleDisplay() {
    (this.isMinimized) ? this.show() : this.minimize();
  }

  show() {
    this._eval.style.display = '';
    this._resize.style.display = '';
    this._quietl.style.display = 'none';
    this._quiet.style.display = 'none';
    this._toggle.innerHTML = 'Minimize';
    this._view.style.display = '';

    this._isMinimized = false;
  }

  minimize() {
    this._eval.style.display = 'none';
    this._resize.style.display = 'none';
    this._quietl.style.display = '';
    this._quiet.style.display = '';
    this._toggle.innerHTML = 'Restore';
    this._view.style.display = 'none';

    this._isMinimized = true;
  }

  get content() {
    return this._log.textContent;
  }
}

export default Console;
