import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { routeFor } from '../routes.js';
import { applyHead } from '../head.js';

// site.css sets html{scroll-behavior:smooth}; route changes must land instantly, as a page load does.
const instant = (fn) => {
  const s = document.documentElement.style;
  const prev = s.scrollBehavior;
  s.scrollBehavior = 'auto';
  // Blink skips the style update for scrollTo(0, 0), so read the style once or the old smooth value is used.
  getComputedStyle(document.documentElement).scrollBehavior;
  try { fn(); } finally { s.scrollBehavior = prev; }
};

export default function RouteEffects() {
  const location = useLocation();
  const navType = useNavigationType();
  const first = useRef(true);
  const positions = useRef(new Map());
  const keyRef = useRef(location.key);
  const lastIdx = useRef(0);

  useEffect(() => {
    const onScroll = () => { if (keyRef.current !== 'default') positions.current.set(keyRef.current, window.scrollY); };
    // Hand scroll restoration back to the browser on unload, so a reload keeps its position.
    const onHide = () => { try { history.scrollRestoration = 'auto'; } catch (e) {} };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onHide);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onHide);
    };
  }, []);

  useLayoutEffect(() => {
    applyHead(routeFor(location.pathname));
    if (history.state && typeof history.state.idx === 'number') lastIdx.current = history.state.idx;
    keyRef.current = location.key;
    // Hydration: only the head sync runs, so deep links keep the browser fragment scroll.
    if (first.current) { first.current = false; return; }
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    // Behave like a full page load. Without a hash, move the sequential-focus start to the top of the
    // document (focus and blur in one task, so no ring paints); with one, the browser starts from the target.
    if (!location.hash) {
      const b = document.body;
      b.setAttribute('tabindex', '-1');
      b.focus({ preventScroll: true });
      b.blur();
      b.removeAttribute('tabindex');
    } else if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    const target = () => {
      if (!location.hash) return null;
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch (e) {}
      return document.getElementById(id);
    };
    if (navType === 'POP') {
      // Entries the browser made for same-page #frag clicks have no router key, and the browser has already scrolled.
      if (location.key === 'default') {
        const el = target(); if (el) el.scrollIntoView();
        // A same-page #frag entry made by the browser: stamp a router key so Back can restore its scroll later.
        const key = Math.random().toString(36).slice(2, 10);
        lastIdx.current += 1;
        try { history.replaceState({ usr: null, key, idx: lastIdx.current }, ''); } catch (e) {}
        keyRef.current = key;
        return;
      }
      const saved = positions.current.get(location.key);
      if (saved !== undefined) instant(() => window.scrollTo(0, saved));
      else if (location.hash) { const el = target(); if (el) instant(() => el.scrollIntoView()); }
      else instant(() => window.scrollTo(0, 0));
    } else if (location.hash) {
      const el = target();
      if (el) instant(() => el.scrollIntoView()); else instant(() => window.scrollTo(0, 0));
    } else {
      instant(() => window.scrollTo(0, 0));
    }
  }, [location]);

  return null;
}
