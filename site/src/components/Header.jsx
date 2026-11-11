import { Link, useLocation } from 'react-router';
import ResumeLink, { HAS_RESUME } from './ResumeLink.jsx';

const LABELS = { work: 'Work', experience: 'Experience', about: 'About', contact: 'Contact' };

export default function Header() {
  const { pathname } = useLocation();
  const home = pathname === '/';
  const aboutPage = pathname === '/About/' || pathname === '/About';
  const galleryPage = /^\/Gallery(\/|$)/.test(pathname);
  const frag = (id) => (home ? <a href={`#${id}`}>{LABELS[id]}</a> : <Link to={`/#${id}`}>{LABELS[id]}</Link>);
  return (
    <header className="site-header">
      {home
        ? <a className="site-header__name" href="#top">Benjamin Elmore</a>
        : <Link className="site-header__name" to="/">Benjamin Elmore</Link>}
      <nav className="site-nav" aria-label="Sections">
        <ul className="site-nav__list">
          <li>{frag('work')}</li>
          <li>{frag('experience')}</li>
          <li>{aboutPage ? <Link to="/About/" aria-current="page">About</Link> : frag('about')}</li>
          <li><Link to="/Gallery/" {...(galleryPage ? { 'aria-current': 'page' } : {})}>Gallery</Link></li>
          <li>{frag('contact')}</li>
          {HAS_RESUME && <li><ResumeLink /></li>}
        </ul>
      </nav>
    </header>
  );
}
