import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function CbuRobotics() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <h1>CBU1 VEX U Robotics</h1>
        <p className="page-header__meta">California Baptist University · Software Engineer and Vice President</p>
        <p className="page-header__summary">I write software for the CBU1 VEX U team’s robots and help coordinate the team’s work across disciplines.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="role-title">
        <figure className="photo-slot photo-slot--21x9" id="cbu-team">
          {/* Photo slot "cbu-team": replace the .photo-slot__box div with <img src="../assets/photos/cbu-team.jpg" alt="..." width="..." height="..."> (file: docs/assets/photos/cbu-team.jpg). Keep the caption. */}
          <div className="photo-slot__box">Photo: CBU1 VEX U team</div>
          <figcaption className="figure__caption">The CBU1 VEX U Robotics team. Photo to be added.</figcaption>
        </figure>
        <h2 id="role-title" className="section__title">Roles</h2>
        <div className="role-section" id="software-engineer">
          <h3>Software Engineer</h3>
          <p className="meta">Since{' '}<time dateTime="2025-09">September 2025</time></p>
          <p>I write C++ for the CBU1 VEX U team’s robots. My work has moved from robot control toward the interfaces between sensors, a custom board and the V5 Brain.</p>
          <h4>Drivetrain and navigation, fall 2025</h4>
          <ul>
            <li>In September and October 2025 I wrote PROS/C++ drivetrain code: a driver-controls module with joystick-driven drive and centralized controller and motor-group configuration.</li>
            <li>I added a PID function and a baseline point-navigation routine that reads odometry, rotates the target error into the robot frame, and computes proportional x, y and heading commands for the drive motors.</li>
            <li>I explored Pure Pursuit, including a temporary linear spline search. My spline and odometry work was left unfinished, and I haven’t recorded hardware validation for this code.</li>
          </ul>
          <h4>ARC sensor firmware, from August 2026</h4>
          <ul>
            <li>I work with electrical and computer engineers on ARC, the C++ firmware for ARSENAL, a custom{' '}<span className="nowrap">ESP32-S3</span>{' '}board designed to connect external sensors to the V5 Brain. The team’s hardware and some existing sensor code are theirs; my part is firmware contributions. See the{' '}<Link to="/ARC/">ARC case study</Link>.</li>
            <li>I prototyped the sensor abstraction, moving from a sensor base class toward configurable setup and read callbacks.</li>
            <li>I moved I²C communication from Arduino{' '}<code>Wire</code>{' '}toward the{' '}<span className="nowrap">ESP-IDF</span>{' '}master API, and added a mutex-protected bus with a noncopyable lock guard so mux channel selection and the sensor transaction stay under one lock.</li>
            <li>I added optical sensor register reads and writes, position decoding and offset handling, and worked on UART and{' '}<span className="nowrap">RS-485</span>{' '}diagnostics.</li>
            <li>On October 28, 2026 a commit of mine recorded successful{' '}<span className="nowrap">RS-485</span>{' '}protocol checks across several packet formats. Optical I²C bring-up and a sensor-to-V5 hardware test are still open.</li>
          </ul>
          <p><strong>Tools:</strong>{' '}C++, PROS,{' '}<span className="nowrap">ESP-IDF</span>, FreeRTOS, PlatformIO,{' '}<span className="nowrap">ESP32-S3</span>, I²C, UART,{' '}<span className="nowrap">RS-485</span>, Git.</p>
        </div>
        <div className="role-section" id="vice-president">
          <h3>Vice President</h3>
          <p className="meta">Since{' '}<time dateTime="2026-10">October 2026</time></p>
          <p>I took on the Vice President role in October 2026, alongside my software work.</p>
          <ul>
            <li>I coordinate milestones across the team’s disciplines.</li>
            <li>I help plan events and competition preparation.</li>
            <li>Alongside the role, I designed a theoretical, AI-assisted workflow framework for the{' '}<span className="nowrap">2026-27</span>{' '}VEX U Override season, with Build, Electronics and Software agent roles, typed task, report and decision contracts, and Node.js validation scripts. Its README calls the framework theoretical and says it contains no fabricated robot,{' '}<span className="nowrap">CAD-approval</span>, PROS build or{' '}<span className="nowrap">field-trial</span>{' '}evidence.</li>
          </ul>
          <p><strong>Tools:</strong>{' '}Markdown, Node.js (the framework’s validation scripts), TypeScript types.</p>
        </div>
      </section>
    </>
  );
}
