import EventEmitter from 'events';

const cable = {
  __proto__: EventEmitter.prototype,

  init(websocket) {
    if (this._websocket) {
      this._websocket.terminate();
    }
    this._websocket = websocket;
    this.emit('ready');
  },

  get websocket() {
    return new Promise((resolve, reject) => {
      if (this._websocket) {
        resolve(this._websocket);
      } else {
        this.on('ready', () => resolve(this._websocket));
      }
    });
  }
};

const cp = async (msg, comment, opts) => (await cable.websocket).
  send(JSON.stringify({msg, comment, opts}));

export {
  cable,
  cp
};
