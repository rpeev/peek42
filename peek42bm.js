javascript: (function () {
  var HOST = 'https://cdn.rawgit.com/rpeev/peek42/v2.4.0/',
    style, script;

  if (!window.Peek42BM) {
    window.Peek42BM = true;

    style = document.createElement('style');
    script = document.createElement('script');

    style.innerHTML = '@import "' + HOST + 'peek42.css' + '"';

    script.setAttribute('src', HOST + 'peek42.js');
    script.onload = function () {
      p(document.title, 'Hello');
    };

    document.body.appendChild(style);
    document.body.appendChild(script);
  }
})();
