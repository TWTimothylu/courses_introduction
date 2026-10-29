// Campaign ends after November 15 in Taiwan; hidden by default if scripts fail.
(() => {
  const expires = Date.parse('2026-11-16T00:00:00+08:00');
  let timer;
  window.syncNewStudentOffer = () => {
    clearTimeout(timer);
    const remaining = expires - Date.now();
    document.querySelectorAll('[data-new-student-offer]').forEach(el => {
      el.hidden = remaining <= 0;
    });
    if (remaining > 0) timer = setTimeout(window.syncNewStudentOffer, Math.min(remaining, 2147483647));
  };
  window.addEventListener('pageshow', window.syncNewStudentOffer);
  document.addEventListener('visibilitychange', window.syncNewStudentOffer);
  window.syncNewStudentOffer();
})();
