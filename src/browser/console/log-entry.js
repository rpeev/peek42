function _logEntryToggleAndBody(elHead) {
  return [
    elHead.firstElementChild,
    elHead.nextElementSibling
  ];
}

function _logEntryExpand(elToggle, elBody) {
  elToggle.innerHTML = '&#x25be;';
  elBody.style.display = '';
}

function _logEntryCollapse(elToggle, elBody) {
  elToggle.innerHTML = '&#x25b8;';
  elBody.style.display = 'none';
}

function _logEntryToggle(elToggle, elBody) {
  if (elBody.style.display === 'none') {
    _logEntryExpand(elToggle, elBody);
  } else {
    _logEntryCollapse(elToggle, elBody);
  }
}

function _onLogEntryHeadClick(ev) {
  _logEntryToggle(..._logEntryToggleAndBody(ev.currentTarget));
}

function addLogEntry({
  elLog,
  entrySimpleText,
  entryDesc,
  entryText,
  hidden = false,
  level = 'log',
  collapsed = false
} = {}) {
  let elEntry = document.createElement('div');

  elEntry.classList.add(`peek42-log-entry-${level}`);

  if (hidden) {
    elEntry.style.display = 'none';
  }

  if (entrySimpleText) {
    elEntry.classList.add('peek42-log-entry-simple');
    elEntry.textContent = entrySimpleText;
  } else {
    elEntry.classList.add('peek42-log-entry');
    elEntry.innerHTML = `<div class="peek42-log-entry-head">\
<span class="peek42-log-entry-toggle">&#x25be;</span>\
<span class="peek42-log-entry-desc"></span>\
</div>\
<div class="peek42-log-entry-body"></div>`;

    let elHead = elEntry.firstElementChild;
    let [elToggle, elBody] = _logEntryToggleAndBody(elHead);
    let elDesc = elToggle.nextElementSibling;

    elDesc.textContent = entryDesc;
    elBody.textContent = entryText;

    elHead.addEventListener('click', _onLogEntryHeadClick);
    if (collapsed) {
      _logEntryCollapse(elToggle, elBody);
    }
  }

  elLog.insertBefore(elEntry, elLog.firstChild);
  elLog.scrollTop = 0;
}

export {
  _logEntryToggleAndBody,
  _logEntryExpand,
  _logEntryCollapse,
  addLogEntry
};
