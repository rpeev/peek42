import consoleHtml from './console.html';

class Console {
  static _html = consoleHtml;

  static createContainer() {
    return new Promise((resolve, reject) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          resolve(document.createElement('div'));
        });
      } else {
        resolve(document.createElement('div'));
      }
    });
  }

  constructor(container) {
    this._container = container;
    this._container.setAttribute('class', 'peek42-container');
    this._container.innerHTML = new.target._html;
    document.body.appendChild(this._container);

    this._log = this._container.querySelector('.peek42-log');
    this._log.style.height = `${window.innerHeight * 0.42}px`;
  }

  get [Symbol.toStringTag]() {
    return 'peek42.Console';
  }

  output(arg, comment) {
    let content = this._log.textContent;
    let str = (comment === null) ?
      String(arg) :
      `// ${String(comment)}\n${String(arg)}`;
    
    this._log.textContent = `${str}\n${content}`;
    this._log.scrollTop = 0;
  }
}

export default Console;
