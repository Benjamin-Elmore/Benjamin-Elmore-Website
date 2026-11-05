import { useEffect, useState } from 'react';

// Types a line out once per visit. The full text is in the served HTML and stays readable to
// screen readers: it is only made transparent while the typed copy runs over it, so nothing shifts.
// Skipped for reduced motion and after the first page view in a tab.
const KEY = 'typed-intro';
const STEP_MS = 22;

export default function TypeLine({ className, text }) {
  const [shown, setShown] = useState(null);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; sessionStorage.setItem(KEY, '1'); } catch (e) {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    setShown(0);
    const id = setInterval(() => {
      i += 1;
      if (i >= text.length) { clearInterval(id); setShown(null); } else setShown(i);
    }, STEP_MS);
    return () => { clearInterval(id); setShown(null); };
  }, [text]);

  const typing = shown !== null;
  return (
    <p className={`${className} typeline${typing ? ' is-typing' : ''}`}>
      <span className="typeline__full">{text}</span>
      {typing && <span className="typeline__live" aria-hidden="true">{text.slice(0, shown)}<span className="typeline__caret" /></span>}
    </p>
  );
}
