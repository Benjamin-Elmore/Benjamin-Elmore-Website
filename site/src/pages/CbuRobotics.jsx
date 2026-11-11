import { Link } from 'react-router';
import { BASE } from '../routes.js';
import FigTag from '../components/FigTag.jsx';

export default function CbuRobotics() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#experience">← All experience</Link></p>
        <p className="eyebrow">Experience</p>
        <h1>CBU1 VEX U Robotics</h1>
        <p className="page-header__meta">California Baptist University · Vice President and Software Engineer</p>
        <p className="page-header__summary">Vice President of CBU Robotics since October 2026 and software engineer for CBU1, the VEX U robotics team at California Baptist University: drivetrain and navigation software from fall 2025, then ARC sensor firmware from August 2026.</p>
      </div>
      <section className="section case-study section--page" aria-labelledby="role-title">
        <figure className="photo-slot photo-slot--21x9" id="cbu-team">
          {/* Photo "cbu-team" (2026, St. Louis): 21:9 crop (2000x857) of Ben's Team-Photo-At-Worlds.jpg; the 15 MB original is kept outside the build, in the private notes folder. */}
          <img src={BASE + 'assets/photos/cbu-team.jpg'} width="2000" height="857" loading="lazy" decoding="async" alt="Members of the CBU1 VEX U team posed in team polos at the 2026 VEX Robotics World Championship in St. Louis, with two of the team robots held up in the front row." />
          <figcaption className="figure__caption"><FigTag id="CBU1-01" />Members of the CBU1 VEX U team at the 2026 VEX Robotics World Championship in St. Louis.</figcaption>
        </figure>
        <h2 id="role-title" className="section__title"><span aria-hidden="true">01 / </span>Roles</h2>
        <div className="role-section" id="vice-president">
          <h3>Vice President</h3>
          <p className="meta">Since <time dateTime="2026-10">October 2026</time></p>
          <p>Since taking the role, also supports the weekly team Responsible Engineer updates.</p>
          <ul>
            <li>Coordinate engineering milestones across the build, electronics and software sub-teams and support engineers in meeting deadlines.</li>
            <li>Support planning of team events, competitions and team participation in the VEX U World Championship.</li>
          </ul>
          <figure className="photo-slot photo-slot--21x9" id="cbu-club">
            {/* Photo "cbu-club": 21:9 crop (2000x857) of IMG_0258.jpg (Canon, November 9, 2026); the original is in the private notes folder. */}
            <img src={BASE + 'assets/photos/cbu-club-2026.jpg'} width="2000" height="857" loading="lazy" decoding="async" alt="The full CBU Robotics team in matching navy club shirts, standing in three rows in a university building lobby." />
            <figcaption className="figure__caption"><FigTag id="CBU1-02" />The full CBU Robotics team, November 2026.</figcaption>
          </figure>
        </div>
        <div className="role-section" id="software-engineer">
          <h3>Software Engineer</h3>
          <p className="meta">Since <time dateTime="2025-09">September 2025</time></p>
          <p>C++ development for the competition robots on PROS and for ARC on ESP-IDF. Focus has progressed from robot control to communication between sensors, the custom team board and the V5 Brain.</p>
          <h4>Drivetrain and navigation, fall 2025</h4>
          <ul>
            <li>First assignment on the team: driver controls, a PID function and point-to-point navigation for the competition robot base, written in C++ on PROS, the environment for the V5 Brain.</li>
          </ul>
          <h4>ARC sensor firmware, from August 2026</h4>
          <ul>
            <li>Sole author of ARC (ARSENAL Runtime Code), the firmware for the ESP32-S3 board built by the CBU electronics team.</li>
            <li>Co-designed the RS-485 protocol with the team member who writes the V5 Brain side, and worked with the electronics team on the board interfaces.</li>
            <li>Bench results, the packet format and the data path are on the <Link to="/ARC/">ARC overview</Link>.</li>
          </ul>
          <p><strong>Tools:</strong> C++, PROS, ESP-IDF, FreeRTOS, PlatformIO, ESP32-S3, I²C, UART, RS-485, Git</p>
        </div>
        <figure className="photo-slot photo-pair" id="cbu-members">
          {/* Photos "cbu-members": IMG_0094.jpg and IMG_0146.jpg (Canon, November 9, 2026), resized to 1600x1067; originals in the private notes folder. */}
          <div className="photo-pair__grid">
            <img src={BASE + 'assets/photos/cbu-members-sign.jpg'} width="1600" height="1067" loading="lazy" decoding="async" alt="The seven CBU Robotics leads in navy club shirts, sitting and standing along a wooden bench in front of a carved CBU wall sign." />
            <img src={BASE + 'assets/photos/cbu-members-lineup.jpg'} width="1600" height="1067" loading="lazy" decoding="async" alt="The seven CBU Robotics leads in navy club shirts, standing in a staggered line with arms crossed in front of a dotted world map wall." />
          </div>
          <figcaption className="figure__caption"><FigTag id="CBU1-03" /><FigTag id="CBU1-04" />CBU Robotics leads at California Baptist University, November 2026.</figcaption>
        </figure>
        <p className="next-project"><Link to="/ARC/">Next project: ARC →</Link></p>
      </section>
    </>
  );
}
