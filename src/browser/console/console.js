import consoleHtml from './views/console.html';
import './styles/console.scss';
import flash from './flash';

class Console {
  static _html = consoleHtml;
  static _instance;

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

    this._isMinimized = false;

    this._container = document.createElement('div');
    this._container.setAttribute('class', 'peek42-console');
    this._container.innerHTML = new.target._html;
    document.body.appendChild(this._container);

    this._title = this._container.querySelector('.peek42-title');
    this._title.addEventListener('mousedown',
      ev => this._onEvent(ev, 'toggleLogPos')
    );

    this._eval = this._container.querySelector('.peek42-eval');

    this._clear = this._container.querySelector('.peek42-clear');
    this._clear.addEventListener('mousedown',
      ev => this._onEvent(ev, 'clear')
    );

    this._resize = this._container.querySelector('.peek42-resize');

    this._quietl = this._container.querySelector('.peek42-quietl');

    this._quiet = this._container.querySelector('.peek42-quiet');

    this._toggle = this._container.querySelector('.peek42-toggle');
    this._toggle.addEventListener('mousedown',
      ev => this._onEvent(ev, 'toggleDisplay')
    );

    this._log = this._container.querySelector('.peek42-log');
    this._log.style.height = `${window.innerHeight * 0.42}px`;

    this.minimize();
  }

  _onEvent(ev, methName) {
    ev.preventDefault();
    ev.stopPropagation();

    this[methName]();
  }

  get logIsAtTop() {
    return this._log.scrollTop === 0;
  }

  logPosTop() {
    this._log.scrollTop = 0;

    return this;
  }

  logPosBottom() {
    this._log.scrollTop = this._log.scrollHeight;

    return this;
  }

  toggleLogPos() {
    return (this.logIsAtTop) ?
      this.logPosBottom() :
      this.logPosTop();
  }

  clear() {
    this._log.textContent = '';
    flash.flashNotice(this._container);

    return this;
  }

  get isQuiet() {
    return this._quiet.checked;
  }

  get isMinimized() {
    return this._isMinimized;
  }

  minimize() {
    this._isMinimized = true;

    this._eval.style.display = 'none';

    this._clear.style.display = 'none';
    this._resize.style.display = 'none';
    this._quietl.style.display = '';
    this._quiet.style.display = '';
    this._toggle.innerHTML = 'Restore';

    this._log.style.display = 'none';

    return this;
  }

  show() {
    this._isMinimized = false;

    this._eval.style.display = '';

    this._clear.style.display = '';
    this._resize.style.display = '';
    this._quietl.style.display = 'none';
    this._quiet.style.display = 'none';
    this._toggle.innerHTML = 'Minimize';

    this._log.style.display = '';

    return this;
  }

  toggleDisplay() {
    return (this.isMinimized) ?
      this.show() :
      this.minimize();
  }

  output(arg, comment, opts = {
    level: 'log'
  }) {
    let content = this._log.textContent;
    let str = (comment === null) ?
      String(arg) :
      `// ${String(comment)}\n${String(arg)}`;

    if (this.isMinimized && !this.isQuiet) {
      this.show();
    }

    this._log.textContent = `${str}\n${content}`;
    this._log.scrollTop = 0;
    flash.flashOutput(this._container, opts.level);
  }
}

export default Console;
