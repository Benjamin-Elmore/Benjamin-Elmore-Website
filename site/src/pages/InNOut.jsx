import { Link } from 'react-router';

export default function InNOut() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>In-N-Out Burger</h1>
        <p className="page-header__meta">Associate · Since May 2024</p>
        <p className="page-header__summary">I've worked at In-N-Out since May 2024, helping customers with their requests and working with coworkers to get store-wide tasks done during busy shifts.</p>
      </div>
    </>
  );
}
