import consoleHtml from './views/console.html';
import './styles/console.scss';
import Resizer from './resize';
import {
  flashSizeLimit,
  flashNotice,
  flashOutput
} from './flash';

class Console {
  static _html = consoleHtml;
  static _instance = null;

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

    [
      'title',
      'eval',
      'clear', 'resize', 'quietl', 'quiet', 'toggle',
      'log'
    ].forEach(ctrl => {
      this[`_${ctrl}`] = this._container.querySelector(`.peek42-${ctrl}`);
    });

    this._resizer = new Resizer(this._container, this._log);
    this._isMinimized = false;

    this._title.addEventListener('touchstart', ev => {
      this._onTitleClick(ev);
    });

    this._clear.addEventListener('touchstart', ev => {
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

    this._quietl.addEventListener('touchstart', ev => {
      this._onQuietClick(ev);
    });

    this._toggle.addEventListener('touchstart', ev => {
      this._onToggleClick(ev);
    });

    this._log.style.height = `${this._resizer.height}px`;

    this.minimize();
  }

  _onTitleClick(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    this.toggleLogPos();
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
    this._clear.style.display = '';
    this._resize.style.display = '';
    this._quietl.style.display = 'none';
    this._quiet.style.display = 'none';
    this._toggle.innerHTML = 'Minimize';
    this._log.style.display = '';

    this._isMinimized = false;
  }

  minimize() {
    this._eval.style.display = 'none';
    this._clear.style.display = 'none';
    this._resize.style.display = 'none';
    this._quietl.style.display = '';
    this._quiet.style.display = '';
    this._toggle.innerHTML = 'Restore';
    this._log.style.display = 'none';

    this._isMinimized = true;
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
    flashOutput(this._container, opts.level);
  }
}

export default Console;
