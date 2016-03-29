javascript: (function () {
  var HOST = 'https://cdn.rawgit.com/rpeev/konsole/v1.0.9/',
    style, script;

  if (!window.KonsoleBM) {
    window.KonsoleBM = true;

    style = document.createElement('style');
    script = document.createElement('script');

    style.innerHTML = '@import "' + HOST + 'konsole.css' + '"';

    script.setAttribute('src', HOST + 'konsole.js');
    script.onload = function () {
      kp(document.title, 'Hello');
    };

    document.body.appendChild(style);
    document.body.appendChild(script);
  }
})();
