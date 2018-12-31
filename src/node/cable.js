import EventEmitter from 'events';

const cable = {
  __proto__: EventEmitter.prototype,

  // Call as early as possible on new client connecting
  /* e.g. in a pre-routing http get middleware
    httpRouter.get('/', (ctx, next) => {
      peek42.cable.init0();

      next();
    });
  */
  init0() {
    this.init(null);
  },

  // Between init0 and init calls, any cp call will
  // wait for the websocket promise to resolve.
  // (If init0 is not called, there will be a dead zone during
  // which cp calls will use the previous (probably stale)
  // peek42 websocket)

  // Call as soon as peek42 websocket is available
  /* e.g. in the peek42 websocket get middleware
    wsRouter.get('/peek42', ctx => {
      peek42.cable.init(ctx.websocket);
    });
  */
  init(websocket) {
    if (this._websocket) {
      this._websocket.terminate();
    }

    if (!websocket) {
      this._websocket = null;
    } else {
      this._websocket = websocket;

      this.emit('ready');
    }
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

const _send = async (val, comment, opts) => (await cable.websocket).
  send(JSON.stringify({val, comment, opts}));

export {
  cable,
  _send
};
