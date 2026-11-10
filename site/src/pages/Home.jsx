import { Link } from 'react-router';
import { BASE } from '../routes.js';
import SlideList from '../components/SlideList.jsx';
import TypeLine from '../components/TypeLine.jsx';
import ResumeLink, { HAS_RESUME } from '../components/ResumeLink.jsx';

// Hover backgrounds on the Selected work and Experience rows (pointer devices only, see "Markings" in site.css):
// the row's image fills the row behind its text, blurred and dimmed. label = a small credit line shown while hovered.
const ARC_PREVIEW = { src: 'assets/arc-software-cppdev.svg', label: 'ARC architecture · CPPDev 49d54a0' };
const MT_PREVIEW = { src: 'assets/photos/markettesting-table.jpg', label: 'AAPL prediction table · Nov 8, 2026' };
const TEAM_PREVIEW = { src: 'assets/photos/cbu-team.jpg', label: 'CBU1 team · VEX Robotics World Championship' };
// Set src to null to drop a preview. noDerivs: CC BY-ND image, shown unaltered (no blur, filter or crop), only dimmed by an overlay on top.
const INNOUT_PREVIEW = { src: 'assets/photos/innout-san-marcos.jpg', label: 'Photo: JoeInSouthernCA · CC BY-ND 2.0', noDerivs: true }; // credited in Footer.jsx too
const LEGO_PREVIEW = { src: 'assets/photos/legoland-entrance.jpg', label: 'Photo: Simon_sees · CC BY 2.0' }; // credited in Footer.jsx too
const Preview = ({ src, label, noDerivs }) => (src ? <span className={'hover-preview' + (noDerivs ? ' hover-preview--nd' : '')} data-label={label} aria-hidden="true"><img src={BASE + src} alt="" loading="lazy" decoding="async" /></span> : null);

// HOME-1: the intro line under the profile photo. It types out once per visit.
const INTRO = 'Computer science student. Software Engineer and Vice President of CBU Robotics, building ARC: C++ firmware that connects I²C sensors to the VEX V5 Brain over RS-485.';

export default function Home() {
  return (
    <>
      <section id="top" className="section section--intro" aria-labelledby="intro-title">
        <p className="intro__role">Software Engineer <span aria-hidden="true">/</span> Computer Science Student</p>
        <h1 id="intro-title" className="visually-hidden">Benjamin Elmore</h1>
        <figure className="photo-slot intro__photo" id="profile">
          {/* Profile photo: an 800px square crop of Ben's Profile.jpg, metadata stripped. */}
          <img src={BASE + 'assets/photos/profile-square.jpg'} alt="Benjamin Elmore" width="800" height="800" />
        </figure>
        <TypeLine className="intro__lede" text={INTRO} />
      </section>
      <section id="work" className="section section--work" aria-labelledby="work-title">
        <h2 id="work-title" className="section__title"><span aria-hidden="true">01 / </span>Selected work</h2>
        <SlideList className="work-list">
          <li><Link className="work-row" to="/ARC/"><span className="work-row__name">ARC</span> <span className="work-row__description">Embedded C++ firmware for the CBU1 robotics team's custom ESP32-S3 sensor board: FreeRTOS sensor tasks, a mutex-protected shared I²C bus and a bench-verified RS-485 protocol.</span> <span className="work-row__arrow" aria-hidden="true">→</span> <Preview {...ARC_PREVIEW} /></Link></li>
          <li><Link className="work-row" to="/MarketTesting/"><span className="work-row__name">MarketTesting</span> <span className="work-row__description">Independent Python project: a data pipeline and LSTM training loop, packaged as an installable Python package with lint checks in CI.</span> <span className="work-row__arrow" aria-hidden="true">→</span> <Preview {...MT_PREVIEW} /></Link></li>
        </SlideList>
      </section>
      <section id="experience" className="section section--experience" aria-labelledby="experience-title">
        <h2 id="experience-title" className="section__title"><span aria-hidden="true">02 / </span>Experience</h2>
        <SlideList className="exp-list">
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#software-engineer"><span className="exp-row__role">Software Engineer</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">CBU1 VEX U Robotics</span> <span className="exp-row__dates">Since <time dateTime="2025-09">September 2025</time></span><Preview {...ARC_PREVIEW} /></Link>
            {/* home-responsibilities */}
            <details className="exp-details">
              <summary>Responsibilities and projects</summary>
              <ul className="role__points">
                <li>Developed driver controls, a PID function and point-to-point navigation in C++ on PROS.</li>
                <li>Develop ARC, the team's C++ sensor firmware for a custom ESP32-S3 board, built on ESP-IDF and FreeRTOS.</li>
                <li>Implemented the RS-485 protocol designed to carry sensor readings to the VEX V5 Brain.</li>
                <li>Full detail on the <Link to="/CBU-Robotics/">CBU Robotics page</Link>.</li>
              </ul>
            </details>
            {/* /home-responsibilities */}
          </li>
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#vice-president"><span className="exp-row__role">Vice President</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">CBU1 VEX U Robotics</span> <span className="exp-row__dates">Since <time dateTime="2026-10">October 2026</time></span><Preview {...TEAM_PREVIEW} /></Link>
            <details className="exp-details">
              <summary>Responsibilities</summary>
              <ul className="role__points">
                <li>Coordinate engineering milestones across the build, electronics and software sub-teams and support engineers in meeting deadlines.</li>
                <li>Support planning of team events, competitions and the team's participation in the VEX U World Championship.</li>
              </ul>
            </details>
          </li>
          <li><Link className="exp-row__link" to="/In-N-Out/"><span className="exp-row__role">Associate</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">In-N-Out Burger</span> <span className="exp-row__dates">Since <time dateTime="2024-05">May 2024</time></span><Preview {...INNOUT_PREVIEW} /></Link></li>
          <li><Link className="exp-row__link" to="/LEGOLAND/"><span className="exp-row__role">Seasonal Lifeguard</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">LEGOLAND California Resort</span> <span className="exp-row__dates"><time dateTime="2026-04">April</time> to <time dateTime="2026-08">August 2026</time></span><Preview {...LEGO_PREVIEW} /></Link></li>
        </SlideList>
      </section>
      <section id="skills" className="section section--skills" aria-labelledby="skills-title">
        <h2 id="skills-title" className="section__title"><span aria-hidden="true">03 / </span>Technical skills</h2>
        <div className="skill-groups">
          <div className="skill-group">
            <h3 id="skills-embedded" className="skill-group__title">Embedded</h3>
            <ul className="tag-list">
              <li className="tag">C/C++</li>
              <li className="tag">ESP-IDF</li>
              <li className="tag">FreeRTOS</li>
              <li className="tag">ESP32-S3</li>
              <li className="tag">PlatformIO</li>
              <li className="tag">I²C</li>
              <li className="tag">UART</li>
              <li className="tag">RS-485</li>
              <li className="tag">VEX V5/PROS</li>
            </ul>
          </div>
          <div className="skill-group">
            <h3 id="skills-software" className="skill-group__title">Software</h3>
            <ul className="tag-list">
              <li className="tag">Python</li>
              <li className="tag">Java</li>
              <li className="tag">TensorFlow</li>
              <li className="tag">pandas/NumPy</li>
              <li className="tag">MATLAB/Simulink</li>
            </ul>
          </div>
          <div className="skill-group">
            <h3 id="skills-tools" className="skill-group__title">Tools</h3>
            <ul className="tag-list">
              <li className="tag">Git/GitHub</li>
              <li className="tag">GitHub Actions (CI)</li>
              <li className="tag">Linux (Ubuntu/Debian)</li>
              <li className="tag">Jira</li>
              <li className="tag">Arduino</li>
            </ul>
          </div>
        </div>
      </section>
      <section id="about" className="section section--num" aria-labelledby="about-title">
        <h2 id="about-title" className="section__title"><span aria-hidden="true">04 / </span>About</h2>
        <p className="section__lede">I am a computer science student at California Baptist University (B.S., Machine Learning and Artificial Intelligence concentration, expected May 2029), focused on embedded systems and software that interfaces directly with physical hardware.</p>
        <p className="about__link"><Link to="/About/">Read my full bio and education →</Link></p>
      </section>
      <section id="contact" className="section section--num" aria-labelledby="contact-title">
        <h2 id="contact-title" className="section__title"><span aria-hidden="true">05 / </span>Contact</h2>
        <p className="section__lede">For inquiries, email or LinkedIn is preferred.</p>
        <p className="contact__email">Email: <a href="mailto:benelmore6@gmail.com" data-umami-event="email-click">benelmore6@gmail.com</a></p>
        <ul className="link-list contact__links">
          <li><a href="https://www.linkedin.com/in/benjamin-n-elmore/" rel="noopener" data-umami-event="linkedin-click">LinkedIn</a></li>
          <li><a href="https://github.com/Benjamin-Elmore" rel="noopener" data-umami-event="github-click">GitHub</a></li>
          {HAS_RESUME && <li><ResumeLink>Résumé (PDF)</ResumeLink></li>}
        </ul>
      </section>
    </>
  );
}
