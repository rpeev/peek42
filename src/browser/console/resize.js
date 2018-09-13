import {flashSizeLimit} from './flash';

class Resizer {
  constructor(elResizee, {
    elFlashSizeLimit = elResizee,
    elsMakeSameHeight = [],
    ratio = 0.42,
    minRatio = 0.05,
    maxRatio = 0.85
  } = {}) {
    this._elResizee = elResizee;
    this._elFlashSizeLimit = elFlashSizeLimit;
    this._elsMakeSameHeight = elsMakeSameHeight;
    this._ratio = ratio;
    this._minRatio = minRatio;
    this._maxRatio = maxRatio;
    this._height = window.innerHeight * this._ratio;
    this._resizeY = 0;
    this._resizeYDelta = 0;
    this._isResizing = false;

    this._syncHeights();
  }

  get ratio() {
    return this._ratio;
  }

  get height() {
    return this._height;
  }

  set height(v) {
    if (typeof v !== 'number') {
      throw new TypeError(`Expected number, got ${typeof v}`);
    }

    this._height = v;

    this._syncHeights();
  }

  _syncHeights() {
    let styleHeight = `${this._height}px`;

    this._elResizee.style.height = styleHeight;
    this._elsMakeSameHeight.forEach(el => el.style.height = styleHeight);
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
      this._syncHeights();
    } else {
      this._height = Math.min(Math.max(this._height, minHeight), maxHeight);
      this._syncHeights();

      flashSizeLimit(this._elFlashSizeLimit);
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
