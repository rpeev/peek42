javascript: (() => { 'use strict';
  let id = 'PEEK42_BOOKMARKLET';
  let version = '2.0.0-unpkg';
  let apivisBase = 'https://unpkg.com/apivis@latest/dist/';
    let apivisScriptPath = 'apivis.browser.js';
  let peek42Base = 'https://unpkg.com/peek42@latest/dist/';
    let peek42StylePath = 'peek42.css';
    let peek42ScriptPath = 'peek42.browser.js';

  if (window[id]) {
    if (window[id].readystate === 'loaded') {
      peek42.p(`${id} (v${window[id].version}) already loaded`, 'already loaded');
    }

    return;
  }

  window[id] = {
    version,
    readystate: 'loading'
  };

  let apivisScript = document.createElement('script');
  let peek42Style = document.createElement('style');
  let peek42Script = document.createElement('script');

  /* 5. peek42 script loaded */
  peek42Script.onload = () => {
    window[id].readystate = 'loaded';

    peek42.use(apivis);

    let snip = (str, n) => str.trim().
      replace(/\s+/gm, ' ').
      substr(0, n) + ((n < str.length) ? '...' : '');

    peek42.p([].slice.call(document.scripts).
      map(script => script.src || `code: ${snip(script.textContent, 101)}`).
      join('\n'), `${id} v${version} loaded`);
  };

  /* 1. Start loading peek42 style */
  peek42Style.innerHTML = `@import '${peek42Base}${peek42StylePath}'`;
  document.body.appendChild(peek42Style);

  /* 3. apivis script loaded */
  apivisScript.onload = () => {
    /* 4. Start loading peek42 script */
    peek42Script.setAttribute('src', `${peek42Base}${peek42ScriptPath}`);
    document.body.appendChild(peek42Script);
  };

  /* 2. Start loading apivis script */
  apivisScript.setAttribute('src', `${apivisBase}${apivisScriptPath}`);
  document.body.appendChild(apivisScript);
})();
