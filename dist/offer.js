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
    const seconds = Math.max(0, Math.ceil(remaining / 1000));
    const values = { days: Math.floor(seconds / 86400), hours: Math.floor(seconds / 3600) % 24, minutes: Math.floor(seconds / 60) % 60, seconds: seconds % 60 };
    Object.entries(values).forEach(([unit, value]) => {
      document.querySelectorAll('[data-offer-' + unit + ']').forEach(el => {
        el.textContent = String(value).padStart(2, '0');
      });
    });
    if (remaining > 0) timer = setTimeout(window.syncNewStudentOffer, Math.min(remaining, 1000));
  };
  window.addEventListener('pageshow', window.syncNewStudentOffer);
  document.addEventListener('visibilitychange', window.syncNewStudentOffer);
  window.syncNewStudentOffer();
})();
