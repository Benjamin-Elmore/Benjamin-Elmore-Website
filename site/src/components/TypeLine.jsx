import { useEffect, useState } from 'react';

// Types a line out letter by letter, once per tab, with human timing: uneven gaps between
// letters, a longer beat between words, longer pauses after punctuation, and the odd hesitation.
// The full text is in the served HTML and stays readable to screen readers: it is only made
// transparent while the typed copy runs over it, so nothing shifts. Skipped for reduced motion.
const KEY = 'typed-intro';
const START_MS = 400; // caret blinks before the first letter
const END_MS = 1200; // caret blinks after the last letter, then the overlay goes
const SPEED = 0.5; // scales every gap below: 0.5 types about twice as fast as the original timing

const rand = (lo, hi) => SPEED * (lo + Math.random() * (hi - lo));

function delayAfter(ch, next) {
  if (/[.!?]/.test(ch)) return rand(320, 520);
  if (/[,;:]/.test(ch)) return rand(180, 300);
  if (ch === ' ') return rand(70, 150) + (Math.random() < 0.08 ? rand(200, 420) : 0);
  if (ch === next) return rand(30, 60); // doubled letters come fast
  return rand(35, 95);
}

export default function TypeLine({ className, text }) {
  const [shown, setShown] = useState(null);
  const [idle, setIdle] = useState(true);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; sessionStorage.setItem(KEY, '1'); } catch (e) {}
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let i = 0;
    let timer;
    setShown(0);
    setIdle(true);
    const tick = () => {
      i += 1;
      setShown(i);
      if (i >= text.length) {
        setIdle(true);
        timer = setTimeout(() => setShown(null), END_MS);
        return;
      }
      const d = delayAfter(text[i - 1], text[i]);
      // The caret only blinks during real pauses; while letters flow it stays solid.
      setIdle(d > 250 * SPEED);
      timer = setTimeout(tick, d);
    };
    timer = setTimeout(() => { setIdle(false); tick(); }, START_MS);
    return () => { clearTimeout(timer); setShown(null); };
  }, [text]);

  const typing = shown !== null;
  return (
    <p className={`${className} typeline${typing ? ' is-typing' : ''}`}>
      <span className="typeline__full">{text}</span>
      {typing && (
        <span className="typeline__live" aria-hidden="true">
          {text.slice(0, shown)}
          <span className={`typeline__caret${idle ? ' is-idle' : ''}`} />
        </span>
      )}
    </p>
  );
}
