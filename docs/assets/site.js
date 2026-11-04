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
    btn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      render();
    });
    // After the click handler, and guarded for old Safari's addListener-only MediaQueryList.
    var mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq) mq.addEventListener ? mq.addEventListener('change', render) : mq.addListener(render);
  });
})();

/* Shared underline for Selected work and Experience: one line slides beneath the row that is hovered or
   focused. Without JS each row draws its own sliding underline (see site.css). */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var lists = document.querySelectorAll('.slide-list');
    Array.prototype.forEach.call(lists, function (list) {
      var rows = list.querySelectorAll('.work-row, .exp-row__link');
      if (!rows.length) return;
      var bar = document.createElement('span');
      bar.className = 'slide-indicator';
      bar.setAttribute('aria-hidden', 'true');
      list.appendChild(bar);
      list.classList.add('has-indicator');

      function show(row) {
        var visible = bar.style.opacity === '1';
        if (!visible) bar.style.transition = 'none';
        bar.style.width = row.offsetWidth + 'px';
        bar.style.transform = 'translate(' + row.offsetLeft + 'px,' + (row.offsetTop + row.offsetHeight - 2) + 'px)';
        if (!visible) {
          void bar.offsetWidth;
          bar.style.transition = '';
        }
        bar.style.opacity = '1';
      }
      function hide() { bar.style.opacity = '0'; }

      Array.prototype.forEach.call(rows, function (row) {
        row.addEventListener('mouseenter', function () { show(row); });
        row.addEventListener('focus', function () { show(row); });
        row.addEventListener('blur', hide);
      });
      list.addEventListener('mouseleave', function () {
        var a = document.activeElement;
        var fv = false;
        try { fv = a && a.matches(':focus-visible'); } catch (e) {}
        if (a && list.contains(a) && fv && (a.classList.contains('work-row') || a.classList.contains('exp-row__link'))) show(a);
        else hide();
      });
      window.addEventListener('resize', hide);
    });
  });
})();
