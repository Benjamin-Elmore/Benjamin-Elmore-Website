import { Link } from 'react-router';

export default function Legoland() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>LEGOLAND California Resort</h1>
        <p className="page-header__meta">Seasonal Lifeguard · April to August 2026</p>
        <p className="page-header__summary">I worked as a seasonal lifeguard at LEGOLAND California Resort from April to August 2026.</p>
      </div>
      <section className="section case-study" aria-label="Responsibilities">
        <div className="case-study__block">
          <ul>
            <li>Communicated with other lifeguards in emergency training scenarios so that care was organized and thorough.</li>
            <li>Supported guests with injuries and park-related questions, giving guidance and care directly until their needs were fully met.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
