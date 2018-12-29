import {p, pp} from '../universal/base';

class WS {
  constructor(url) {
    this._url = url;
    this._ws = new WebSocket(this._url);

    this._ws.addEventListener('open', ev => {
      p(`peek42 WebSocket open (url: ${this._url})`,
        null, {level: 'info'});
    });
    this._ws.addEventListener('close', ev => {
      p(`peek42 WebSocket close (url: ${this._url}, code: ${ev.code})`,
        null, {level: 'warn'});
    });
    this._ws.addEventListener('error', ev => {
      throw new Error(`peek42 WebSocket error (url: ${this._url})`);
    });

    this._ws.addEventListener('message', ev => {
      let serverWireData = ev.data;
      let serverData = JSON.parse(serverWireData);

      this.onmessage(serverData);
    });
  }

  onmessage(serverData) {
    let {msg, comment, opts} = serverData;

    p(msg, comment, opts);
  }
}

const cable = {
  init(url = `${location.origin.replace(/^http/, 'ws')}/peek42`) {
    this._websocket = new WS(url);
  }
};

export {
  cable
};
