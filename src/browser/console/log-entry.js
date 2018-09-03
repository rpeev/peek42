function addLogEntry({
  str,
  log
} = {}) {
  let entry = document.createElement('div');

  entry.classList.add('peek42-log-entry');
  entry.textContent = str;

  log.insertBefore(entry, log.firstChild);
  log.scrollTop = 0;
}

export {addLogEntry};
