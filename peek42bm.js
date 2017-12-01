javascript: (function () {
  var HOST_APIVIS = 'https://cdn.rawgit.com/rpeev/apivis/v1.3.0/',
    HOST_PEEK = 'https://cdn.rawgit.com/rpeev/peek42/v3.0.0/',
    cssPeek, jsApivis, jsPeek;

  if (!window.Peek42BM) {
    window.Peek42BM = true;

    cssPeek = document.createElement('style');
    jsApivis = document.createElement('script');
    jsPeek = document.createElement('script');

    cssPeek.innerHTML = '@import "' + HOST_PEEK + 'peek42.css' + '"';
    jsApivis.setAttribute('src', HOST_APIVIS + 'apivis.js');
    jsPeek.setAttribute('src', HOST_PEEK + 'peek42.js');

    jsApivis.onload = function () {
      jsPeek.onload = function () {
        p(document.title, 'Hi');
      };

      document.body.appendChild(jsPeek);
    };

    document.body.appendChild(cssPeek);
    document.body.appendChild(jsApivis);
  }
})();
