function _onLogEntryHeadClick(ev) {
  let elHead = ev.currentTarget;
  let elToggle = elHead.firstElementChild;
  let elBody = elHead.nextElementSibling;

  if (elBody.style.display === 'none') {
    elToggle.innerHTML = '&#x25be;';
    elBody.style.display = '';
  } else {
    elToggle.innerHTML = '&#x25b8;';
    elBody.style.display = 'none';
  }
}

function addLogEntry({
  elLog,
  entrySimpleText,
  entryDesc,
  entryText,
  level = 'log',
  collapsed = false
} = {}) {
  let elEntry = document.createElement('div');

  elEntry.classList.add(`peek42-log-entry-${level}`);

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
    let elToggle = elHead.firstElementChild;
    let elDesc = elToggle.nextElementSibling;
    let elBody = elHead.nextElementSibling;

    elDesc.textContent = entryDesc;
    elBody.textContent = entryText;

    elHead.addEventListener('click', _onLogEntryHeadClick);
    if (collapsed) {
      elHead.click();
    }
  }

  elLog.insertBefore(elEntry, elLog.firstChild);
  elLog.scrollTop = 0;
}

export {addLogEntry};
