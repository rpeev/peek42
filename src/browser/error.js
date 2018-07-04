import {pp} from '../universal/base';

function _reportError(err, note = 'error') {
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

export default _reportError;
