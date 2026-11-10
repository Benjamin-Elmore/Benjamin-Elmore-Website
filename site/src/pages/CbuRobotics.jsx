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
        <p className="page-header__summary">Software engineer for CBU1, California Baptist University's VEX U robotics team: drivetrain and navigation software from fall 2025, ARC sensor firmware from August 2026, and Vice President of CBU Robotics since October 2026.</p>
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
          <p>Responsible for coordinating milestones across the discipline teams, supporting the planning of events and competitions, and, more recently, supporting the team's weekly Responsible Engineer updates. The role is approached as one of service to the team, which keeps the engineering work moving.</p>
          <ul>
            <li>Coordinate engineering milestones across the build, electronics and software sub-teams and support engineers in meeting deadlines.</li>
            <li>Support planning of team events, competitions and the team's participation in the VEX U World Championship.</li>
          </ul>
          <p><strong>Tools:</strong> Milestone planning, deadline tracking, cross-team communication, event and competition planning, Responsible Engineer reporting</p>
        </div>
        <div className="role-section" id="software-engineer">
          <h3>Software Engineer</h3>
          <p className="meta">Since <time dateTime="2025-09">September 2025</time></p>
          <p>C++ development for the competition robots on PROS and for ARC on ESP-IDF. Focus has progressed from robot control to communication between sensors, the team's custom board and the V5 Brain.</p>
          <h4>Drivetrain and navigation, fall 2025</h4>
          <ul>
            <li>Developed driver controls, a PID controller and point-to-point navigation that converts odometry into left, right and strafe motor commands.</li>
            <li>Prototyped Pure Pursuit path following with spline search; spline generation and odometry integration remained open at the transition to ARC.</li>
          </ul>
          <h4>ARC sensor firmware, from August 2026</h4>
          <ul>
            <li>Develop ARC, the C++ firmware for ARSENAL, the team's custom ESP32-S3 sensor board. See the <Link to="/ARC/">ARC case study</Link>.</li>
            <li>Implemented its sensor abstraction, shared I²C bus management and RS-485 protocol.</li>
            <li>Verified RS-485 parsing of V5 Brain test packets on the bench in October 2026; sensor reads and full-pipeline hardware verification are the next steps.</li>
          </ul>
          <p><strong>Tools:</strong> C++, PROS, ESP-IDF, FreeRTOS, PlatformIO, ESP32-S3, I²C, UART, RS-485, Git</p>
        </div>
      </section>
    </>
  );
}
