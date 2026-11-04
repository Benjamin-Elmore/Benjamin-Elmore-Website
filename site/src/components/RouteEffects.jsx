import { useLayoutEffect, useEffect, useRef } from 'react';
import { useLocation, useNavigationType } from 'react-router';
import { routeFor } from '../routes.js';
import { applyHead } from '../head.js';

export default function RouteEffects() {
  const location = useLocation();
  const navType = useNavigationType();
  const first = useRef(true);
  const positions = useRef(new Map());
  const keyRef = useRef(location.key);

  useEffect(() => {
    const onScroll = () => { if (keyRef.current !== 'default') positions.current.set(keyRef.current, window.scrollY); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    applyHead(routeFor(location.pathname));
    keyRef.current = location.key;
    // Hydration: only the head sync runs, so deep links keep the browser fragment scroll.
    if (first.current) { first.current = false; return; }
    try { history.scrollRestoration = 'manual'; } catch (e) {}
    // Behave like a full page load: the clicked link has unmounted, so drop focus without setting any.
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
    const target = () => {
      if (!location.hash) return null;
      let id = location.hash.slice(1);
      try { id = decodeURIComponent(id); } catch (e) {}
      return document.getElementById(id);
    };
    if (navType === 'POP') {
      // Entries the browser made for same-page #frag clicks have no router key, and the browser has already scrolled.
      if (location.key === 'default') { const el = target(); if (el) el.scrollIntoView(); return; }
      const saved = positions.current.get(location.key);
      if (saved !== undefined) window.scrollTo(0, saved);
      else if (location.hash) { const el = target(); if (el) el.scrollIntoView(); }
      else window.scrollTo(0, 0);
    } else if (location.hash) {
      const el = target();
      if (el) el.scrollIntoView(); else window.scrollTo(0, 0);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}
