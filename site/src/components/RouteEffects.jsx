import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { routeFor } from '../routes.js';
import { applyHead } from '../head.js';
import { hydration } from '../hydration.js';

// site.css sets html{scroll-behavior:smooth}; route changes must land instantly, as a page load does.
const instant = (fn) => {
  const s = document.documentElement.style;
  const prev = s.scrollBehavior;
  s.scrollBehavior = 'auto';
  // Blink skips the style update for scrollTo(0, 0), so read the style once or the old smooth value is used.
  getComputedStyle(document.documentElement).scrollBehavior;
  try { fn(); } finally { s.scrollBehavior = prev; }
};

// A hash target inside a closed <details> (the ARC "Technical detail" section) is not rendered, so it
// cannot be scrolled to. Open every enclosing <details> first; returns true if one had to be opened.
const reveal = (el) => {
  let opened = false;
  for (let d = el && el.closest('details'); d; d = d.parentElement && d.parentElement.closest('details')) {
    if (!d.open) { d.open = true; opened = true; }
  }
  return opened;
};
const hashTarget = (hash) => {
  if (!hash) return null;
  let id = hash.slice(1);
  try { id = decodeURIComponent(id); } catch (e) {}
  return id ? document.getElementById(id) : null;
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
    // Same-document fragment changes (an in-page link, or a hash typed into the address bar) also open
    // a closed <details> around the target; the router sees these too, but this covers any it misses.
    const onHash = () => { const el = hashTarget(location.hash); if (reveal(el)) instant(() => el.scrollIntoView()); };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pagehide', onHide);
    window.addEventListener('hashchange', onHash);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onHide);
      window.removeEventListener('hashchange', onHash);
    };
  }, []);

  useLayoutEffect(() => {
    applyHead(routeFor(location.pathname));
    if (history.state && typeof history.state.idx === 'number') lastIdx.current = history.state.idx;
    keyRef.current = location.key;
    // Hydration: only the head sync runs, so deep links keep the browser fragment scroll, unless the
    // target sits in a closed <details> that the browser has not opened: then open it and land there.
    if (first.current) {
      first.current = false;
      hydration.active = false;
      const el = hashTarget(location.hash);
      if (reveal(el)) instant(() => el.scrollIntoView());
      return;
    }
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
      const el = hashTarget(location.hash);
      reveal(el);
      return el;
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
