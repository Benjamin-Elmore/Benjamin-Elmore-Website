import { useEffect, useRef } from 'react';

// Shared underline: one line slides beneath the row that is hovered or focused.
// Server render and first client render are the plain list; the indicator is added after mount.
export default function SlideList({ className, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const list = ref.current;
    const rows = list.querySelectorAll('.work-row, .exp-row__link');
    if (!rows.length) return;
    const bar = document.createElement('li');
    bar.className = 'slide-indicator';
    bar.setAttribute('aria-hidden', 'true');
    bar.setAttribute('role', 'presentation');
    list.appendChild(bar);
    list.classList.add('has-indicator');

    function show(row) {
      const visible = bar.style.opacity === '1';
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
    function settle() {
      const a = document.activeElement;
      let fv = false;
      try { fv = a && a.matches(':focus-visible'); } catch (e) {}
      if (a && list.contains(a) && fv && (a.classList.contains('work-row') || a.classList.contains('exp-row__link'))) show(a);
      else hide();
    }

    const undo = [];
    const on = (el, type, fn) => { el.addEventListener(type, fn); undo.push(() => el.removeEventListener(type, fn)); };
    rows.forEach((row) => {
      on(row, 'mouseenter', () => show(row));
      on(row, 'focus', () => show(row));
      on(row, 'blur', hide);
    });
    list.querySelectorAll('.exp-details summary').forEach((s) => on(s, 'mouseenter', hide));
    on(list, 'mouseleave', settle);
    on(window, 'resize', settle);
    return () => {
      undo.forEach((f) => f());
      bar.remove();
      list.classList.remove('has-indicator');
    };
  }, []);
  return <ul ref={ref} className={`${className} slide-list`} role="list">{children}</ul>;
}
