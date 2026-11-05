import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';

// Click (or Enter/Space on) a photo or diagram in main to view it full screen.
// Native <dialog> gives Esc to close and keeps focus inside; clicking anywhere closes it.
const SELECTOR = 'main figure.photo-slot img, main figure.figure img';

export default function Lightbox() {
  const { pathname } = useLocation();
  const dialog = useRef(null);
  const opener = useRef(null);
  const [img, setImg] = useState(null);

  useEffect(() => {
    const undo = [];
    document.querySelectorAll(SELECTOR).forEach((el) => {
      el.classList.add('zoomable');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-haspopup', 'dialog');
      const open = () => {
        opener.current = el;
        setImg({ src: el.currentSrc || el.src, alt: el.alt });
      };
      const onKey = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } };
      el.addEventListener('click', open);
      el.addEventListener('keydown', onKey);
      undo.push(() => {
        el.removeEventListener('click', open);
        el.removeEventListener('keydown', onKey);
      });
    });
    return () => undo.forEach((f) => f());
  }, [pathname]);

  useEffect(() => {
    const d = dialog.current;
    if (img && d && !d.open) d.showModal();
  }, [img]);

  const close = () => { if (dialog.current && dialog.current.open) dialog.current.close(); };
  const onClose = () => {
    setImg(null);
    if (opener.current) opener.current.focus({ preventScroll: true });
  };

  return (
    <dialog ref={dialog} className="lightbox" aria-label={(img && img.alt) || 'Image'} onClick={close} onClose={onClose}>
      {img && <img className="lightbox__img" src={img.src} alt={img.alt} />}
      <button type="button" className="lightbox__close" onClick={close}>Close <span aria-hidden="true">✕</span></button>
    </dialog>
  );
}
