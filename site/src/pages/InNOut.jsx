import { Link } from 'react-router';

export default function InNOut() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>In-N-Out Burger</h1>
        <p className="page-header__meta">Associate · Since May 2024</p>
        <p className="page-header__summary">Benjamin Elmore has been an associate since May 2024, serving customers and completing store tasks with team members during busy shifts.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="innout-title">
        <h2 id="innout-title" className="visually-hidden">Role</h2>
        <ul>
          <li>Handle cash transactions and check payments for accuracy.</li>
          <li>Take customer orders and confirm details, asking clarifying questions to keep orders accurate.</li>
          <li>Prioritize customer service, food preparation and store tasks during busy shifts.</li>
          <li>Prepare ingredients based on customer volume and available stock.</li>
        </ul>
      </section>
    </>
  );
}
