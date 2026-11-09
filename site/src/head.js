import { BASE, SITE_URL } from './routes.js';

// One data shape for both the prerender (strings) and client navigation (DOM).
function tagsFor(route) {
  const m = route.meta;
  if (route.notFound) {
    return [{ el: 'meta', key: 'name', id: 'description', value: m.description },
            { el: 'meta', key: 'name', id: 'robots', value: 'noindex' }];
  }
  const url = SITE_URL + route.path.slice(1);
  return [
    { el: 'meta', key: 'name', id: 'description', value: m.description },
    { el: 'meta', key: 'property', id: 'og:title', value: m.title },
    { el: 'meta', key: 'property', id: 'og:description', value: m.ogDescription || m.description },
    { el: 'meta', key: 'property', id: 'og:type', value: 'website' },
    { el: 'meta', key: 'property', id: 'og:url', value: url },
    { el: 'link', key: 'rel', id: 'canonical', value: url },
  ];
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function headTags(route) {
  const lines = [`<title>${escText(route.meta.title)}</title>`];
  for (const t of tagsFor(route)) {
    lines.push(t.el === 'link'
      ? `<link rel="${t.id}" href="${esc(t.value)}">`
      : `<meta ${t.key}="${esc(t.id)}" content="${esc(t.value)}">`);
  }
  return lines.join('\n  ');
}

// Linked on every page; switched off outside ARC.
export function arcLink(route) {
  return `<link rel="stylesheet" href="${BASE}assets/arc.css" data-arc${route.arc ? '' : ' media="not all"'}>`;
}

export function scriptTag(route) {
  return route.script ? `<script src="${BASE}assets/${route.script}"></script>` : '';
}

const selector = (t) => (t.el === 'link' ? `link[rel="${t.id}"]` : `meta[${t.key}="${t.id}"]`);
const MANAGED = ['meta[name="description"]', 'meta[name="robots"]', 'meta[property^="og:"]', 'link[rel="canonical"]'];

export function applyHead(route) {
  const head = document.head;
  document.title = route.meta.title;
  const wanted = tagsFor(route);
  const keep = new Set();
  const anchor = head.querySelector('meta[name="color-scheme"]');
  for (const t of wanted) {
    let node = head.querySelector(selector(t));
    if (!node) {
      node = document.createElement(t.el);
      node.setAttribute(t.key, t.id);
      head.insertBefore(node, anchor);
    }
    node.setAttribute(t.el === 'link' ? 'href' : 'content', t.value);
    keep.add(node);
  }
  head.querySelectorAll(MANAGED.join(',')).forEach((n) => { if (!keep.has(n)) n.remove(); });
  const arc = head.querySelector('link[data-arc]');
  if (arc) {
    if (route.arc) arc.removeAttribute('media');
    else arc.setAttribute('media', 'not all');
  }
}
