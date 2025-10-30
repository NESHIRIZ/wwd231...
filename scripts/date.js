// Simple date helpers: populate #year and #lastModified with graceful fallbacks

(function () {
  const yearEl = document.getElementById('year');
  const lmEl = document.getElementById('lastModified');

  function formatDate(d) {
    try {
      return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
    } catch (e) {
      return d.toDateString();
    }
  }

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (lmEl) {
    const raw = document.lastModified && document.lastModified.trim() !== '' ? document.lastModified : null;
    if (raw) {
      const last = new Date(raw);
      if (!isNaN(last)) {
        lmEl.textContent = formatDate(last);
      } else {
        lmEl.textContent = formatDate(new Date());
      }
    } else {
      lmEl.textContent = formatDate(new Date());
    }
  }
})();