javascript: (function () {
  var HOST = 'https://cdn.rawgit.com/rpeev/konsole/v1.0.7/',
    head, link, script;

  if (!window.Konsole) {
    head = document.getElementsByTagName('head')[0];
    link = document.createElement('link');
    script = document.createElement('script');

    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('href', HOST + 'konsole.css');

    script.setAttribute('src', HOST + 'konsole.js');
    script.onload = go;

    head.appendChild(link);
    head.appendChild(script);
  } else {
    go();
  }

  function go() {
    kp(document.title, 'Hello');
  }
})();
