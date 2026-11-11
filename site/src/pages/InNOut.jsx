import { Link } from 'react-router';

export default function InNOut() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>In-N-Out Burger</h1>
        <p className="page-header__meta">Associate · Since May 2024</p>
        <p className="page-header__summary">Associate since May 2024, serving customers and working with team members to complete store-wide tasks during high-volume shifts.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="innout-title">
        <h2 id="innout-title" className="visually-hidden">Role</h2>
        <ul>
          <li>Associate since May 2024, about two and a half years of continuous work.</li>
          <li>Handle customer requests and confirm order details with each customer, asking clarifying questions to keep orders accurate.</li>
          <li>Manage cash drawer accounts and prevent losses from material waste and payment errors.</li>
          <li>Coordinate store requirements and triage multiple tasks during high-pressure shifts, completing work in order of priority and time sensitivity.</li>
          <li>Plan food preparation to balance ingredient supply and demand, based on customer volume and current ingredient stock.</li>
        </ul>
      </section>
    </>
  );
}
