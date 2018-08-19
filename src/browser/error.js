import {pretty, p, pp} from '../universal/base';

let _errorId = 1;

async function _getSourceAsync(err) {
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

function _genSourceTrace(source, location, line1, column1, {
  indent = '',
  peekLines = 2
} = {}) {
  let lines = (source || '').split('\n');
  let [, path = 'path n/a', name = 'code'] = (location || '').
    match(/^(.+\/)?([^\/]+)$/) || [];
  let iLine = (line1 || 1) - 1;
  let iColumn = (column1 || 1) - 1;
  let traceLines = [];
  let iTraceLineMax = Math.max(0, lines.length - 1);
  let iTraceLineBeg = Math.max(0, iLine - peekLines);
  let iTraceLineEnd = Math.min(iTraceLineMax, iLine + peekLines);
  let padMax = `${lines.length}`.length;
  let margin = '|';
  let linePointer = '>';
  let columnPointer = `${' '.repeat(iColumn)}^`;

  for (let i = iTraceLineBeg; i <= iTraceLineEnd; i++) {
    let pad = ' '.repeat(padMax - `${i + 1}`.length);
    let lineMarker = (i == iLine) ?
      linePointer :
      ' '.repeat(linePointer.length);
    let columnMarker = (i == iLine) ?
      `\n${indent}${' '.repeat(lineMarker.length + padMax)}${margin}${columnPointer}` :
      '';

    traceLines.push(`${indent}${lineMarker}${pad}${i + 1}${margin}${lines[i]}${columnMarker}`);
  }

  return `${indent}${name}:${line1}:${column1} (${path})\n${traceLines.join('\n')}`;
}

async function _formatError(err) {
  let info;

  try {
    info = _genSourceTrace(
      await _getSourceAsync(err),
      err.sourceURL,
      err.line,
      err.column
    );
  } catch (err1) {
    err.sourceTraceNA = `${err1}`;

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
