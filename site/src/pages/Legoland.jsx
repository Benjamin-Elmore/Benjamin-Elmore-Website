import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function Legoland() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <h1>LEGOLAND California Resort</h1>
        <p className="page-header__meta">Seasonal Lifeguard · April to August 2026</p>
        <p className="page-header__summary">Seasonal lifeguard at LEGOLAND California Resort, April to August 2026.</p>
      </div>
    </>
  );
}
