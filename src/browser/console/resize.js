import {flashSizeLimit} from './flash';

class Resizer {
  constructor(container, log, opts = {
    ratio: 0.42,
    minRatio: 0.05,
    maxRatio: 0.85
  }) {
    this._container = container;
    this._log = log;
    this._ratio = opts.ratio;
    this._minRatio = opts.minRatio;
    this._maxRatio = opts.maxRatio;
    this._height = window.innerHeight * opts.ratio;
    this._resizeY = 0;
    this._resizeYDelta = 0;
    this._isResizing = false;
  }

  get height() {
    return this._height;
  }

  get isResizing() {
    return this._isResizing;
  }

  resizeStart(clientY) {
    this._resizeY = clientY;
    this._resizeYDelta = 0;
    this._isResizing = true;
  }

  resize(clientY) {
    let minHeight = window.innerHeight * this._minRatio;
    let maxHeight = window.innerHeight * this._maxRatio;

    this._resizeYDelta = this._resizeY - clientY;
    this._height += this._resizeYDelta;

    if (this._height > minHeight && this._height < maxHeight) {
      this._resizeY = clientY;
      this._log.style.height = `${this._height}px`;
    } else {
      this._height = Math.min(Math.max(this._height, minHeight), maxHeight);
      this._log.style.height = `${this._height}px`;

      flashSizeLimit(this._container);

      this.resizeEnd();
    }
  }

  resizeEnd() {
    this._ratio = this._height / window.innerHeight;
    this._resizeY = 0;
    this._resizeYDelta = 0;
    this._isResizing = false;
  }
}

export default Resizer;
