import EventEmitter from 'events';

const cable = {
  __proto__: EventEmitter.prototype,

  init(websocket) {
    this.emit('ready', websocket);
  },

  get websocket() {
    return new Promise((resolve, reject) => {
      if (this._websocket) {
        resolve(this._websocket);
      } else {
        this.on('ready', websocket => {
          resolve(this._websocket = this._websocket || websocket);
        });
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
