import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function CbuRobotics() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>CBU1 VEX U Robotics</h1>
        <p className="page-header__meta">California Baptist University · Vice President and Software Engineer</p>
        <p className="page-header__summary">[CBU-1] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="role-title">
        <figure className="photo-slot photo-slot--21x9" id="cbu-team">
          {/* Photo slot "cbu-team": replace the .photo-slot__box div with <img src={BASE + 'assets/photos/cbu-team.jpg'} alt="..." width="..." height="..." /> (file: site/public/assets/photos/cbu-team.jpg), then rebuild. Keep the caption. */}
          <div className="photo-slot__box">Photo: CBU1 VEX U team</div>
          <figcaption className="figure__caption">[CBU-2] Caption.</figcaption>
        </figure>
        <h2 id="role-title" className="section__title"><span aria-hidden="true">01 / </span>Roles</h2>
        <div className="role-section" id="vice-president">
          <h3>Vice President</h3>
          <p className="meta">Since <time dateTime="2026-10">October 2026</time></p>
          <p>[CBU-10] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <ul>
            <li>[CBU-11] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[CBU-12] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ul>
          <p><strong>Tools:</strong> [CBU-13] Lorem ipsum dolor sit amet.</p>
        </div>
        <div className="role-section" id="software-engineer">
          <h3>Software Engineer</h3>
          <p className="meta">Since <time dateTime="2025-09">September 2025</time></p>
          <p>[CBU-3] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <h4>Drivetrain and navigation, fall 2025</h4>
          <ul>
            <li>[CBU-4] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[CBU-5] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ul>
          <h4>ARC sensor firmware, from August 2026</h4>
          <ul>
            <li>[CBU-6] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. See the <Link to="/ARC/">ARC case study</Link>.</li>
            <li>[CBU-7] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[CBU-8] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ul>
          <p><strong>Tools:</strong> [CBU-9] Lorem ipsum dolor sit amet.</p>
        </div>
      </section>
    </>
  );
}
