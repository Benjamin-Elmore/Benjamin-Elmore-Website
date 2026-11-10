import { Link } from 'react-router';
import { NOTES } from '../notes.js';

export default function Notes() {
  return (
    <>
      <div className="page-header">
        <p className="eyebrow">Notes</p>
        <h1>Notes</h1>
        <p className="page-header__summary">Short write-ups on design decisions and bench results from <Link to="/ARC/">ARC</Link>. Each note says what was tested and what was not.</p>
      </div>
      <section className="section case-study" aria-labelledby="notes-title">
        <h2 id="notes-title" className="section__title"><span aria-hidden="true">01 / </span>All notes</h2>
        <ul className="notes-list">
          {NOTES.map((n) => (
            <li key={n.slug}>
              <h3><Link to={`/Notes/${n.slug}/`}>{n.title}</Link></h3>
              <p className="meta"><time dateTime={n.date}>{n.dateText}</time></p>
              <p>{n.summary}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
