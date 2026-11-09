import { Link } from 'react-router';

export default function Legoland() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>LEGOLAND California Resort</h1>
        <p className="page-header__meta">Seasonal Lifeguard · April to August 2026</p>
        <p className="page-header__summary">[LEGO-1] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </>
  );
}
