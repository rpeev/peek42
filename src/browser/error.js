import {pretty, p, pp} from '../universal/base';

let _errorId = 1;

function _formatError(err) {
  return `${pretty(err)}\n  ${
    (err &&
      err.stack &&
      err.stack.replace(/\n/gm, '\n  ')
    ) || 'no stack'
  }`;
}

function _reportError(err, note = 'error') {
  if (window.bundleError &&
    err.sourceURL && err.sourceURL.endsWith('bundle.js')
  ) {
    err._errorId = _errorId++;

    p(`${_formatError(err)}`,
      `(${note} (id: ${err._errorId})) ${err} (retrieving source information...)`,
      {level: 'error'});

    bundleError.addSrcInfo(err).then(err1 => {
      pp(err1.srcSnip,
        `(${note} (id: ${err._errorId})) ${err1}`,
        {level: 'error'});
    }).catch(err2 => {
      p(`${_formatError(err2)}`,
        `(${note} (id: ${err._errorId})) ${err2}`,
        {level: 'error'});
    });
  } else {
    p(`${_formatError(err)}`,
      `(${note}) ${err}`,
      {level: 'error'});
  }
}

export default _reportError;
