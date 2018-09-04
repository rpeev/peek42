function _onLogEntryToggleClick(ev) {
  let elComment = ev.currentTarget;
  let elToggle = elComment.firstElementChild;
  let elMessage = elComment.nextElementSibling;

  if (elMessage.style.display === 'none') {
    elToggle.innerHTML = '&#x25be;';
    elMessage.style.display = '';
  } else {
    elToggle.innerHTML = '&#x25b8;';
    elMessage.style.display = 'none';
  }
}

function addLogEntry({
  elLog,
  textContent,
  comment,
  message,
  level = 'log',
  collapse = false
} = {}) {
  let elEntry = document.createElement('div');

  elEntry.classList.add(`peek42-log-${level}`);

  if (textContent) {
    elEntry.classList.add('peek42-log-entry-simple');
    elEntry.textContent = textContent;
  } else {
    elEntry.classList.add('peek42-log-entry-complex');
    elEntry.innerHTML = `<div class="peek42-log-entry-comment">\
<span class="peek42-log-entry-toggle">&#x25be;</span>\
<span></span>\
</div>\
<div class="peek42-log-entry-message"></div>`;

    let elCommentContainer = elEntry.firstElementChild;
    let elToggle = elCommentContainer.firstElementChild;
    let elComment = elToggle.nextElementSibling;
    let elMessage = elCommentContainer.nextElementSibling;

    elComment.textContent = comment;
    elMessage.textContent = message;

    elCommentContainer.addEventListener('click', _onLogEntryToggleClick);
    if (collapse) {
      elCommentContainer.click();
    }
  }

  elLog.insertBefore(elEntry, elLog.firstChild);
  elLog.scrollTop = 0;
}

export {addLogEntry};
