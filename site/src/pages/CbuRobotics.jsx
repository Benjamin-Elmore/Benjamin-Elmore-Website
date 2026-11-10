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
        <p className="page-header__summary">I write C++ for CBU1, California Baptist University's VEX U robotics team. I started on drivetrain and navigation code in fall 2025, moved to ARC sensor firmware in August 2026, and became Vice President of CBU Robotics in October 2026.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="role-title">
        <figure className="photo-slot photo-slot--21x9" id="cbu-team">
          {/* Photo "cbu-team": 21:9 crop (2000x857) of Ben's Team-Photo-At-Worlds.jpg; the 15 MB original is kept outside the build, in the private notes folder. */}
          <img src={BASE + 'assets/photos/cbu-team.jpg'} width="2000" height="857" loading="lazy" decoding="async" alt="The CBU1 VEX U team posed in team polos at the VEX Robotics World Championship, with two of the team's robots held up in the front row." />
          <figcaption className="figure__caption">The CBU1 VEX U team at the VEX Robotics World Championship.</figcaption>
        </figure>
        <h2 id="role-title" className="section__title"><span aria-hidden="true">01 / </span>Roles</h2>
        <div className="role-section" id="vice-president">
          <h3>Vice President</h3>
          <p className="meta">Since <time dateTime="2026-10">October 2026</time></p>
          <p>As Vice President of CBU Robotics, I coordinate milestones across the discipline teams, help plan events and competitions, and am starting to support the team's weekly Responsible Engineer updates. I've found that serving the people on the team is what actually moves the work forward.</p>
          <ul>
            <li>Coordinate engineering milestones across the build, electronics and software teams and help engineers meet deadlines.</li>
            <li>Help plan team events, competitions and our participation in VEX U Worlds.</li>
          </ul>
          <p><strong>Tools:</strong> Milestone planning, deadline tracking, cross-team communication, event and competition planning, weekly Responsible Engineer updates</p>
        </div>
        <div className="role-section" id="software-engineer">
          <h3>Software Engineer</h3>
          <p className="meta">Since <time dateTime="2025-09">September 2025</time></p>
          <p>I write C++ for the robots on PROS and for ARC on ESP-IDF. My work has moved from robot control toward the communication between sensors, our custom board and the V5 Brain.</p>
          <h4>Drivetrain and navigation, fall 2025</h4>
          <ul>
            <li>Wrote driver controls, a PID function, and point-to-point navigation that turns odometry into left, right and strafe motor commands.</li>
            <li>Prototyped Pure Pursuit path following with spline search. The spline and odometry pieces were still to do when I moved to ARC.</li>
          </ul>
          <h4>ARC sensor firmware, from August 2026</h4>
          <ul>
            <li>Write ARC, the C++ firmware for ARSENAL, the team's custom ESP32-S3 sensor board. See the <Link to="/ARC/">ARC case study</Link>.</li>
            <li>Built its sensor abstraction, shared I²C bus handling and RS-485 protocol.</li>
            <li>The RS-485 link parsed test packets from the V5 Brain on the bench in October 2026. Sensor reads and the full pipeline on hardware are next.</li>
          </ul>
          <p><strong>Tools:</strong> C++, PROS, ESP-IDF, FreeRTOS, PlatformIO, ESP32-S3, I²C, UART, RS-485, Git</p>
        </div>
      </section>
    </>
  );
}
