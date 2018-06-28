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

    container.setAttribute('class', 'peek42-container');
    container.innerHTML = new.target._html;

    document.body.appendChild(container);
  }

  get [Symbol.toStringTag]() {
    return 'peek42.Console';
  }
}

export default Console;
