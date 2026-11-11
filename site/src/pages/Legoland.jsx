import { Link } from 'react-router';

export default function Legoland() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>LEGOLAND California Resort</h1>
        <p className="page-header__meta">Seasonal Lifeguard · April to August 2026</p>
        <p className="page-header__summary">Seasonal lifeguard at LEGOLAND California Resort, April to August 2026.</p>
      </div>
      <section className="section case-study" aria-label="Responsibilities">
        <div className="case-study__block">
          <ul>
            <li>Practiced coordinated emergency response with fellow lifeguards during training scenarios.</li>
            <li>Helped guests with injuries and park questions, providing assistance and directing them to the appropriate support.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
