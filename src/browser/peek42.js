import peek42 from '../universal/base';
import './styles/base.scss';
import Console from './console/console';

function _output(arg, comment, opts) {
  Console.instance.then(_console => {
    _console.output(arg, comment, opts);
  });
}

Console.instance.then(_console => {
  Object.assign(peek42, {
    _console
  });
});

Object.assign(peek42, {
  _output
});

function _reportError(err, note = 'error') {
  const {pp} = peek42;

  if (window.bundleError &&
    err.sourceURL && err.sourceURL.endsWith('bundle.js')
  ) {
    pp(err,
      `(${note}) ${err} (retrieving source information...)`,
      {level: 'error'});

    bundleError.addSrcInfo(err).then(err1 => {
      pp(err1.srcSnip,
        `(${note}) ${err1}`,
        {level: 'error'});
    }).catch(err2 => {
      pp(err2,
        `(${note}) ${err2}`,
        {level: 'error'});
    });
  } else {
    pp(err,
      `(${note}) ${err}`,
      {level: 'error'});
  }
}

window.addEventListener('error', ev => {
  _reportError(ev.error);
});

window.addEventListener('unhandledrejection', ev => {
  _reportError(ev.reason, 'unhandledrejection');
});

export default peek42;
