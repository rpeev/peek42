function flash1(el, className) {
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), 300);
}

function flash2(el, className) {
  el.classList.add(className);
  setTimeout(() => {
    el.classList.remove(className);
    setTimeout(() => {
      el.classList.add(className);
      setTimeout(() => el.classList.remove(className), 300);
    }, 200);
  }, 300);
}

function flashSizeLimit(el) { flash1(el, 'peek42-flash-size-limit'); }
function flashNotice(el) { flash1(el, 'peek42-flash-notice'); }
function flashSuccess(el) { flash1(el, 'peek42-flash-success'); }
function flashWarning(el) { flash2(el, 'peek42-flash-warning'); }
function flashError(el) { flash2(el, 'peek42-flash-error'); }

const flash = {
  flash1,
  flash2,
  flashSizeLimit,
  flashNotice,
  flashSuccess,
  flashWarning,
  flashError
};

export default flash;
