function addLogEntry({
  textContent,
  elLog
} = {}) {
  let elEntry = document.createElement('div');

  elEntry.classList.add('peek42-log-entry');
  elEntry.textContent = textContent;

  elLog.insertBefore(elEntry, elLog.firstChild);
  elLog.scrollTop = 0;
}

export {addLogEntry};
