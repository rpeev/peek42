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

    this._container = document.createElement('div');
    this._container.setAttribute('class', 'peek42-console');
    this._container.innerHTML = new.target._html;
    document.body.appendChild(this._container);

    this._title = this._container.querySelector('.peek42-title');
    this._title.addEventListener('mousedown',
      ev => this._onEvent(ev, 'rewind'));

    this._clear = this._container.querySelector('.peek42-clear');
    this._clear.addEventListener('mousedown',
      ev => this._onEvent(ev, 'clear'));

    this._log = this._container.querySelector('.peek42-log');
    this._log.style.height = `${window.innerHeight * 0.42}px`;
  }

  _onEvent(ev, methName) {
    ev.preventDefault();
    ev.stopPropagation();

    this[methName]();
  }

  rewind() {
    this._log.scrollTop = (this._log.scrollTop == 0) ?
      // If at the top of the log, scroll to the bottom
      this._log.scrollTop = this._log.scrollHeight :
      // When anywhere in the log, scroll to the top
      this._log.scrollTop = 0;

    return this;
  }

  clear() {
    this._log.textContent = '';
    flash.flashNotice(this._container);

    return this;
  }

  output(arg, comment) {
    let content = this._log.textContent;
    let str = (comment === null) ?
      String(arg) :
      `// ${String(comment)}\n${String(arg)}`;

    this._log.textContent = `${str}\n${content}`;
    flash.flashSuccess(this._container);
    this._log.scrollTop = 0;
  }
}

export default Console;
