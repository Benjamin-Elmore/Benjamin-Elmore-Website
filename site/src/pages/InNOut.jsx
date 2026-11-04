import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function InNOut() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <h1>In-N-Out Burger</h1>
        <p className="page-header__meta">Associate · Since May 2024</p>
        <p className="page-header__summary">Associate at In-N-Out Burger since May 2024.</p>
      </div>
    </>
  );
}
