import { Link } from 'react-router';

// Short tag on a page figure (for example ARC-01) that links to the same item in the Gallery.
// The image itself still opens the lightbox; only the tag navigates.
// Analytics: a data-umami-event attribute on a same-tab link makes the Umami script cancel the click and
// load the URL itself, which is a full page reload. So the event is sent from onClick instead and the
// router keeps the navigation client-side.
const track = (id) => {
  try { if (window.umami && typeof window.umami.track === 'function') window.umami.track('gallery-tag', { id }); } catch (e) { /* analytics must never block navigation */ }
};

export default function FigTag({ id }) {
  return (
    <Link className="fig-tag" to={`/Gallery/#${id}`} onClick={() => track(id)} aria-label={`${id}, view in the Gallery`}>{id}</Link>
  );
}
