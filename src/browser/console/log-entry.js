function addLogEntry({
  elLog,
  textContent,
  comment,
  message,
  level = 'log'
} = {}) {
  let elEntry = document.createElement('div');

  elEntry.classList.add(`peek42-log-${level}`);

  if (textContent) {
    elEntry.classList.add('peek42-log-entry-simple');
    elEntry.textContent = textContent;
  } else {
    elEntry.classList.add('peek42-log-entry-complex');
    elEntry.innerHTML = `<div class="peek42-log-entry-comment">\
<span class="peek42-log-entry-toggle">&#x25bd;</span>${comment}</div>\
<div class="peek42-log-entry-message">${message}</div>`;
  }

  elLog.insertBefore(elEntry, elLog.firstChild);
  elLog.scrollTop = 0;
}

export {addLogEntry};
