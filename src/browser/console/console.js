import {_string, _outputOptsDefaults} from '../../universal/base';
import consoleHTML from './console.html';
import './styles/console.scss';
import Resizer from './resize';
import {
  flashNotice,
  flashOutput
} from './flash';
import {
  _logEntryToggleAndBody,
  _logEntryExpand,
  _logEntryCollapse,
  addLogEntry
} from './log-entry';

class Console {
  static _html = consoleHTML;
  static _instance = null;
  static _printFnMap = {
    v: ['peek42.p', 'value'],
    value: ['peek42.p', 'value'],
    p: ['peek42.p.pretty', 'pretty'],
    pretty: ['peek42.p.pretty', 'pretty'],
    t: ['peek42.p.type', 'type'],
    type: ['peek42.p.type', 'type'],
    d: ['peek42.p.desc', 'desc'],
    desc: ['peek42.p.desc', 'desc'],
    M: ['peek42.p.member', 'member'],
    member: ['peek42.p.member', 'member'],
    m: ['peek42.p.members', 'members'],
    members: ['peek42.p.members', 'members'],
    i: ['peek42.p.inspect', 'inspect'],
    inspect: ['peek42.p.inspect', 'inspect'],
    c: ['peek42.p.chain', 'chain'],
    chain: ['peek42.p.chain', 'chain'],
    a: ['peek42.p.api', 'api'],
    api: ['peek42.p.api', 'api'],
    x: ['peek42.p.dom', 'dom'],
    dom: ['peek42.p.dom', 'dom']
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
      'bar',
        'title',
        'eval',
        'clear', 'resize', 'quietl', 'quiet', 'toggle',
      'view',
        'log',
        'bar1',
          'entries-expand', 'entries-collapse',
          'entries-info', 'entries-log', 'entries-warn', 'entries-error'
    ].forEach(name => {
      this[`_${name}`] = this._container.querySelector(`.peek42-${name}`);
    });

    this._resizer = new Resizer(this._log, {
      elFlashSizeLimit: this._container,
      elsMakeSameHeight: [this._bar1]
    });

    this._isMinimized = false;

    this._countsByLevel = {
      info: 0,
      log: 0,
      warn: 0,
      error: 0
    };

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

    [
      'entries-expand',
      'entries-collapse'
    ].forEach(name => {
      this[`_${name}`].addEventListener('click', ev => {
        this[`_on-${name}`](ev);
      });
    });

    [
      'entries-info',
      'entries-log',
      'entries-warn',
      'entries-error'
    ].forEach(name => {
      this[`_${name}`].addEventListener('click', ev => {
        this[`_${name}`].classList.toggle(`peek42-${name}-active`);

        this[`_on-toggle-${name}`](ev);
      });
    });

    this.minimize();
  }

  _isLevelActive(level) {
    return this[`_entries-${level}`].classList.
      contains(`peek42-entries-${level}-active`);
  }

  _output(val, comment, opts = {}) {
    opts = {..._outputOptsDefaults, ...opts};
    let active = this._isLevelActive(opts.level);

    if (this.isMinimized && active && !this.isQuiet) {
      this.show();
    }

    if (val instanceof HTMLElement && val.dataset.peek42HtmlEntry) {
      addLogEntry({
        elLog: this._log,
        entryDesc: String(comment),
        entryHtml: val,
        hidden: !active,
        ...opts
      });
    } else {
      if (comment === null) {
        addLogEntry({
          elLog: this._log,
          entrySimpleText: _string(val),
          hidden: !active,
          ...opts
        });
      } else {
        addLogEntry({
          elLog: this._log,
          entryDesc: String(comment),
          entryText: _string(val),
          hidden: !active,
          ...opts
        });
      }
    }

    this._countsByLevel[opts.level] += 1;
    this[`_entries-${opts.level}`].
      textContent = this._countsByLevel[opts.level];

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

  ['_on-entries-expand'](ev) {
    this._log.
      querySelectorAll('.peek42-log-entry-head').
        forEach(elHead => _logEntryExpand(..._logEntryToggleAndBody(elHead)));
  }

  ['_on-entries-collapse'](ev) {
    this._log.
      querySelectorAll('.peek42-log-entry-head').
        forEach(elHead => _logEntryCollapse(..._logEntryToggleAndBody(elHead)));
  }

  _toggleEntriesDisplay(elCtrl, level) {
    let activeClass = `peek42-entries-${level}-active`;
    let entriesClass = `.peek42-log-entry-${level}`;
    let display = (elCtrl.classList.contains(activeClass)) ? '' : 'none';

    this._log.
      querySelectorAll(entriesClass).
        forEach(elEntry => elEntry.style.display = display);
  }

  ['_on-toggle-entries-info'](ev) {
    this._toggleEntriesDisplay(ev.currentTarget, 'info');
  }

  ['_on-toggle-entries-log'](ev) {
    this._toggleEntriesDisplay(ev.currentTarget, 'log');
  }

  ['_on-toggle-entries-warn'](ev) {
    this._toggleEntriesDisplay(ev.currentTarget, 'warn');
  }

  ['_on-toggle-entries-error'](ev) {
    this._toggleEntriesDisplay(ev.currentTarget, 'error');
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

    ['info', 'log', 'warn', 'error'].forEach(level => {
      this._countsByLevel[level] = 0;
      this[`_entries-${level}`].textContent = 0;
    });

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
