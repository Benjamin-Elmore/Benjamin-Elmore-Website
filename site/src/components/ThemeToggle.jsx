import { useEffect, useRef } from 'react';

export default function ThemeToggle() {
  const ref = useRef(null);
  useEffect(() => {
    const btn = ref.current;
    const root = document.documentElement;
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    const current = () => root.dataset.theme || (mq && mq.matches ? 'dark' : 'light');
    // Fixed label "Dark theme"; aria-pressed carries the state (true = dark is on).
    const render = () => btn.setAttribute('aria-pressed', current() === 'dark' ? 'true' : 'false');
    const onClick = () => {
      const next = current() === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch (e) {}
      render();
    };
    btn.hidden = false;
    render();
    btn.addEventListener('click', onClick);
    if (mq) mq.addEventListener ? mq.addEventListener('change', render) : mq.addListener(render);
    return () => {
      btn.removeEventListener('click', onClick);
      if (mq) mq.removeEventListener ? mq.removeEventListener('change', render) : mq.removeListener(render);
    };
  }, []);
  return <button ref={ref} className="theme-toggle" type="button" hidden aria-pressed="false">Dark theme</button>;
}
