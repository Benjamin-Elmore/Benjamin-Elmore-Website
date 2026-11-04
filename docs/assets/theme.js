/* Applies a stored theme before first paint. The toggle button lives in the React app. */
(function () {
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  if (stored === 'dark' || stored === 'light') document.documentElement.dataset.theme = stored;
})();
