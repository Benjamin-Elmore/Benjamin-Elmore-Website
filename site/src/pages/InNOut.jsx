import { Link } from 'react-router';

export default function InNOut() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <h1>In-N-Out Burger</h1>
        <p className="page-header__meta">Associate · Since May 2024</p>
        <p className="page-header__summary">[INO-1] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
    </>
  );
}
