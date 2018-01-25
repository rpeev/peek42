javascript: (function () {
  var HOST_APIVIS = 'https://unpkg.com/apivis@latest/',
    HOST_PEEK = 'https://unpkg.com/peek42@latest/',
    cssMonofur, cssPeek, jsApivis, jsPeek;

  if (!window.Peek42BM) {
    window.Peek42BM = true;

    cssMonofur = document.createElement('style');
    cssPeek = document.createElement('style');
    jsApivis = document.createElement('script');
    jsPeek = document.createElement('script');

    cssMonofur.innerHTML = '@import "' + HOST_PEEK + 'monofur.css' + '"';
    cssPeek.innerHTML = '@import "' + HOST_PEEK + 'peek42.css' + '"';
    jsApivis.setAttribute('src', HOST_APIVIS + 'apivis.js');
    jsPeek.setAttribute('src', HOST_PEEK + 'peek42.js');

    jsApivis.onload = function () {
      jsPeek.onload = function () {
        let snip = (str, n) => str.trimLeft().
          replace(/\s+/gm, ' ').
          substr(0, n) + ((n < str.length) ? '...' : '');

        p([].slice.call(document.scripts).
          map(script => script.src || 'code: ' + snip(script.textContent, 101)).
          join('\n'), 'Environment');
      };

      document.body.appendChild(jsPeek);
    };

    document.body.appendChild(cssMonofur);
    document.body.appendChild(cssPeek);
    document.body.appendChild(jsApivis);
  }
})();
