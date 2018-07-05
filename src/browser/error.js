import {pretty, p, pp} from '../universal/base';

function _info(err) {
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
    p(`${_info(err)}`,
      `(${note}) ${err} (retrieving source information...)`,
      {level: 'error'});

    bundleError.addSrcInfo(err).then(err1 => {
      pp(err1.srcSnip, `(${note}) ${err1}`, {level: 'error'});
    }).catch(err2 => {
      p(`${_info(err2)}`, `(${note}) ${err2}`, {level: 'error'});
    });
  } else {
    p(`${_info(err)}`, `(${note}) ${err}`, {level: 'error'});
  }
}

export default _reportError;
