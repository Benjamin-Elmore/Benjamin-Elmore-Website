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
        <p className="page-header__summary">Software engineer for CBU1, the VEX U robotics team at California Baptist University: drivetrain and navigation software from fall 2025, ARC sensor firmware from August 2026, and Vice President of CBU Robotics since October 2026.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="role-title">
        <figure className="photo-slot photo-slot--21x9" id="cbu-team">
          {/* Photo "cbu-team": 21:9 crop (2000x857) of Ben's Team-Photo-At-Worlds.jpg; the 15 MB original is kept outside the build, in the private notes folder. */}
          <img src={BASE + 'assets/photos/cbu-team.jpg'} width="2000" height="857" loading="lazy" decoding="async" alt="The CBU1 VEX U team posed in team polos at the VEX Robotics World Championship, with two of the team robots held up in the front row." />
          <figcaption className="figure__caption">The CBU1 VEX U team at the VEX Robotics World Championship.</figcaption>
        </figure>
        <h2 id="role-title" className="section__title"><span aria-hidden="true">01 / </span>Roles</h2>
        <div className="role-section" id="vice-president">
          <h3>Vice President</h3>
          <p className="meta">Since <time dateTime="2026-10">October 2026</time></p>
          <p>Responsible for coordinating milestones across the discipline teams, supporting the planning of events and competitions, and, more recently, supporting the weekly team Responsible Engineer updates.</p>
          <ul>
            <li>Coordinate engineering milestones across the build, electronics and software sub-teams and support engineers in meeting deadlines.</li>
            <li>Support planning of team events, competitions and participation of the team in the VEX U World Championship.</li>
          </ul>
          <p><strong>Focus areas:</strong> Milestone planning, deadline tracking, cross-team communication, event and competition planning, Responsible Engineer reporting</p>
        </div>
        <div className="role-section" id="software-engineer">
          <h3>Software Engineer</h3>
          <p className="meta">Since <time dateTime="2025-09">September 2025</time></p>
          <p>C++ development for the competition robots on PROS and for ARC on ESP-IDF. Focus has progressed from robot control to communication between sensors, the custom team board and the V5 Brain.</p>
          <h4>Drivetrain and navigation, fall 2025</h4>
          <ul>
            <li>Developed driver controls, a PID controller and point-to-point navigation that converts odometry into left, right and strafe motor commands.</li>
            <li>Prototyped Pure Pursuit path following with spline search; spline generation and odometry integration remained open at the transition to ARC.</li>
          </ul>
          <h4>ARC sensor firmware, from August 2026</h4>
          <ul>
            <li>Develop ARC, the C++ firmware for ARSENAL, the custom ESP32-S3 sensor board of the team. See the <Link to="/ARC/">ARC case study</Link>.</li>
            <li>Implemented its sensor abstraction, shared I²C bus management and RS-485 protocol.</li>
            <li>Verified RS-485 parsing of V5 Brain test packets on the bench in October 2026; sensor reads and full-pipeline hardware verification are the next steps.</li>
          </ul>
          <p><strong>Tools:</strong> C++, PROS, ESP-IDF, FreeRTOS, PlatformIO, ESP32-S3, I²C, UART, RS-485, Git</p>
        </div>
        <h2 id="drivetrain-title" className="section__title"><span aria-hidden="true">02 / </span>Drivetrain control and point-to-point navigation (fall 2025)</h2>
        <div className="case-study__block" id="drivetrain">
          <h3>Role</h3>
          <p>Software engineer on CBU1 VEX U. I made 14 commits to the team HamburgerTesting repository between September 16 and October 28, 2025, and 2 commits to a second drivetrain repository. Both repositories include imported PROS scaffolding, which is not my work.</p>
          <h3>Problem</h3>
          <p>Drive the robot base from a controller, and move it to a target point using odometry, by issuing left, right and strafe motor commands. Autonomous path following was unfinished.</p>
          <h3>Approach</h3>
          <ul>
            <li>A driver-controls module and joystick drivetrain control, with the controller and motor groups configured in one header.</li>
            <li>A PID function, added in one commit.</li>
            <li>Point navigation using proportional control: it reads odometry, rotates the target error into the robot frame, computes proportional x, y and heading commands, and maps them to left, right and strafe motors. Later commits fixed a target-angle unit issue and a bug in a second spline.</li>
            <li>An exploration of Pure Pursuit path following with a temporary linear spline search.</li>
          </ul>
          <h3>Results</h3>
          <p>Implemented; no on-robot test recorded.</p>
          <h3>What's next</h3>
          <p>Spline generation and odometry integration were still open when the focus of the team moved to ARC.</p>
        </div>
        <p className="next-project"><Link to="/ARC/">Next project: ARC →</Link></p>
      </section>
    </>
  );
}
