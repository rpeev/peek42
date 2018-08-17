import {pretty, p, pp} from '../universal/base';

let _errorId = 1;

async function _getErrorSourceAsync(err) {
  return new Promise(async (resolve, reject) => {
    if (!err.sourceURL) {
      return reject(Error('sourceURL unavailable'));
    }

    let url = err.sourceURL;

    try {
      let res = await fetch(url);

      if (!res.ok) {
        return reject(Error(`${res.status} (${res.statusText}) ${url}`));
      }

      resolve(await res.text());
    } catch (err) {
      reject(Error(`Cannot retrieve ${url}`));
    }
  });
}

async function _genErrorSnipAsync(err, {
  indent = '',
  peekLines = 2
} = {}) {
  let [, path = 'n/a', filename = 'n/a'] = ((err.sourceURL || '').
    match(/^(.+)\/([^\/]+)$/) || []);
  let source = await _getErrorSourceAsync(err);
  let lines = source.split('\n');
  let iLine = (err.line || 1) - 1;
  let iColumn = (err.column || 1) - 1;
  let snipLines = [];
  let snipMax = lines.length - 1;
  let snipStart = Math.max(0, iLine - peekLines);
  let snipEnd = Math.min(snipMax, iLine + peekLines);
  let padMaxLen = `${lines.length}`.length;
  let div = '|';
  let rowPtr = '>';
  let colPtr = `${' '.repeat(iColumn)}^`;

  for (let i = snipStart; i <= snipEnd; i++) {
    let pad = ' '.repeat(padMaxLen - `${i + 1}`.length);
    let m1 = (i == iLine) ?
      rowPtr :
      ' '.repeat(rowPtr.length);
    let m2 = (i == iLine) ?
      `\n${indent}${' '.repeat(m1.length + padMaxLen)}${div}${colPtr}` :
      '';

    snipLines.push(`${indent}${m1}${pad}${i + 1}${div}${lines[i]}${m2}`);
  }

  return `${indent}${filename}:${err.line}:${err.column} (${path})\n${snipLines.join('\n')}`;
}

async function _formatError(err) {
  let info;

  try {
    info = await _genErrorSnipAsync(err);
  } catch (err1) {
    err.sourceSnipNA = `${err1}`;

    info = pretty(err);
  }

  return `${info}\nstack:\n  ${
    (err &&
      err.stack &&
      err.stack.replace(/\n/gm, '\n  ')
    ) || 'n/a'
  }`;
}

async function _reportError(err, note = 'error') {
  if (window.bundleError &&
    err.sourceURL && err.sourceURL.endsWith('bundle.js')
  ) {
    err._errorId = _errorId++;

    p(`${await _formatError(err)}`,
      `(${note} (id: ${err._errorId})) ${err} (retrieving source information...)`,
      {level: 'error'});

    try {
      await bundleError.addSrcInfo(err);

      pp(err.srcSnip,
        `(${note} (id: ${err._errorId})) ${err}`,
        {level: 'error'});
    } catch(err1) {
      p(`${await _formatError(err1)}`,
        `(${note} (id: ${err._errorId})) ${err1}`,
        {level: 'error'});
    }
  } else {
    p(`${await _formatError(err)}`,
      `(${note}) ${err}`,
      {level: 'error'});
  }
}

export {
  _formatError,
  _reportError
};
export default _reportError;
