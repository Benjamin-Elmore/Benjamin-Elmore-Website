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
            <li>Coordinated with fellow lifeguards during emergency response training to ensure organized, thorough care.</li>
            <li>Assisted guests with injuries and park inquiries, providing direct guidance and care through resolution.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
