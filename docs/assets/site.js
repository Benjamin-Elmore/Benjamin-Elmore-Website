/* Theme toggle only. Runs in <head> so a stored theme applies before first paint. */
(function () {
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  if (stored === 'dark' || stored === 'light') root.dataset.theme = stored;

  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    // Fixed label "Dark theme"; aria-pressed carries the state (true = dark is on).
    function render() {
      btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
    }
    btn.hidden = false;
    render();
    if (window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', render);
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      render();
    });
  });
})();
