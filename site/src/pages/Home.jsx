import { Link } from 'react-router';
import TypeLine from '../components/TypeLine.jsx';
import { BASE } from '../routes.js';
import SlideList from '../components/SlideList.jsx';
import ResumeLink, { HAS_RESUME } from '../components/ResumeLink.jsx';

// HOME-1: the intro line under the profile photo. It types out once per visit.
const INTRO = 'I study computer science at California Baptist University, where I write software for CBU1, the VEX U robotics team, and serve as Vice President of CBU Robotics. My current project is ARC, the C++ firmware for the custom ESP32-S3 sensor board of the team.';

// Subset of the Technical skills section below.
const KEYWORDS = ['C/C++', 'FreeRTOS', 'ESP-IDF', 'I²C', 'RS-485', 'Python', 'TensorFlow', 'Linux', 'Git'];

// Hover backgrounds on the Selected work and Experience rows (pointer devices only, see "Hover backgrounds" in
// site.css): the row image fills the row behind its text, blurred and dimmed. label = small credit line;
// veil = overlay opacity, measured per image so muted text stays at 4.5:1 or better.
// blur = optional blur radius; the ARC code render is text-on-text behind the row, so it gets a heavier blur and veil.
const ARC_PREVIEW = { src: 'assets/photos/arc-sensor-example-code.jpg', label: 'ARC TMP117 sensor example · CPPDev b24ce84', veil: 0.45, blur: '4px' };
const MT_PREVIEW = { src: 'assets/photos/markettesting-lstm.jpg', label: 'MarketTesting LSTM layers · stock_model.py · main 79f6e12', veil: 0.3 };
const CODE_PREVIEW = { src: 'assets/photos/arc-lockguard-code.jpg', label: 'ARC lib/LockGuard.h · CPPDev 49d54a0', veil: 0.1 };
const TEAM_PREVIEW = { src: 'assets/photos/cbu-club-2026.jpg', label: 'CBU Robotics full team · November 2026', veil: 0.49 };
const Preview = ({ src, label, veil, blur }) => <span className="hover-preview" data-label={label} style={blur ? { '--veil': veil, '--blur': blur } : { '--veil': veil }} aria-hidden="true"><img src={BASE + src} alt="" loading="lazy" decoding="async" /></span>;

export default function Home() {
  return (
    <>
      <section id="top" className="section section--intro" aria-labelledby="intro-title">
        <p className="intro__role">Software Engineer <span aria-hidden="true">/</span> Computer Science Student</p>
        <p className="intro__status">B.S. Computer Science, expected May 2029 · GPA 4.00 · Seeking a Summer 2027 internship in embedded, autonomy or flight software · U.S. citizen</p>
        <h1 id="intro-title" className="visually-hidden">Benjamin Elmore</h1>
        <figure className="photo-slot intro__photo" id="profile">
          {/* Profile photo: an 800px square crop of Ben's Profile.jpg, metadata stripped. */}
          <img src={BASE + 'assets/photos/profile-square.jpg'} alt="Benjamin Elmore" width="800" height="800" />
        </figure>
        <TypeLine className="intro__lede" text={INTRO} />
        <p className="intro__team"><Link className="cbu-logo" to="/CBU-Robotics/"><img src={BASE + 'assets/photos/cbu1-logo-white.png'} width="400" height="115" decoding="async" alt="CBU1 VEX U Robotics" /></Link></p>
        <ul className="tag-list keyword-strip" aria-label="Core technologies">
          {KEYWORDS.map((k) => <li className="tag" key={k}>{k}</li>)}
        </ul>
      </section>
      <section id="work" className="section section--work" aria-labelledby="work-title">
        <h2 id="work-title" className="section__title"><span aria-hidden="true">01 / </span>Selected work</h2>
        <SlideList className="work-list">
          <li><Link className="work-row" to="/ARC/"><span className="work-row__name">ARC</span> <span className="work-row__description">C++ firmware for the custom ESP32-S3 sensor board of CBU1, with FreeRTOS sensor tasks, shared I²C access and bench-tested data transfer to the V5 Brain.</span> <span className="work-row__facts"><img className="work-row__thumb" src={BASE + 'assets/arc-software-cppdev.svg'} width="96" height="60" alt="" loading="lazy" decoding="async" /><span className="work-row__stats"><span>115200 baud RS-485</span> <span>Up to 15 sensor IDs</span></span></span> <span className="work-row__arrow" aria-hidden="true">→</span> <Preview {...ARC_PREVIEW} /></Link></li>
          <li><Link className="work-row" to="/MarketTesting/"><span className="work-row__name">MarketTesting</span> <span className="work-row__description">Independent Python project: a data pipeline and LSTM training loop, packaged as an installable Python package with lint checks in CI.</span> <span className="work-row__facts"><img className="work-row__thumb" src={BASE + 'assets/photos/markettesting-table.jpg'} width="96" height="54" alt="" loading="lazy" decoding="async" /><span className="work-row__stats"><span>100-day windows</span> <span>12-stock run, Nov 8, 2026</span></span></span> <span className="work-row__arrow" aria-hidden="true">→</span> <Preview {...MT_PREVIEW} /></Link></li>
        </SlideList>
      </section>
      <section id="experience" className="section section--experience" aria-labelledby="experience-title">
        <h2 id="experience-title" className="section__title"><span aria-hidden="true">02 / </span>Experience</h2>
        <SlideList className="exp-list">
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#vice-president"><span className="exp-row__role">Vice President</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">CBU Robotics</span> <span className="exp-row__dates">Since <time dateTime="2026-10">October 2026</time></span> <Preview {...TEAM_PREVIEW} /></Link>
            <details className="exp-details">
              <summary>Responsibilities</summary>
              <ul className="role__points">
                <li>Coordinate engineering milestones across the build, electronics and software sub-teams and support engineers in meeting deadlines.</li>
                <li>Support planning of team events, competitions and team participation in the VEX U World Championship.</li>
              </ul>
            </details>
          </li>
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#software-engineer"><span className="exp-row__role">Software Engineer</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">CBU1 VEX U Robotics</span> <span className="exp-row__dates">Since <time dateTime="2025-09">September 2025</time></span> <Preview {...CODE_PREVIEW} /></Link>
            {/* home-responsibilities */}
            <details className="exp-details">
              <summary>Responsibilities and projects</summary>
              <ul className="role__points">
                <li>Developed driver controls, a PID function and point-to-point navigation in C++ on PROS.</li>
                <li>Develop ARC, the C++ sensor firmware for the custom ESP32-S3 board, built on ESP-IDF and FreeRTOS.</li>
                <li>Implemented the RS-485 protocol designed to carry sensor readings to the VEX V5 Brain.</li>
                <li>Full detail on the <Link to="/CBU-Robotics/">CBU Robotics page</Link>.</li>
              </ul>
            </details>
            {/* /home-responsibilities */}
          </li>
          <li><Link className="exp-row__link" to="/In-N-Out/"><span className="exp-row__role">Associate</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">In-N-Out Burger</span> <span className="exp-row__dates">Since <time dateTime="2024-05">May 2024</time></span></Link></li>
          <li><Link className="exp-row__link" to="/LEGOLAND/"><span className="exp-row__role">Seasonal Lifeguard</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">LEGOLAND California Resort</span> <span className="exp-row__dates"><time dateTime="2026-04">April</time> to <time dateTime="2026-08">August 2026</time></span></Link></li>
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
              <li className="tag">MATLAB</li>
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
        <p className="section__lede contact__seeking">Looking for a Summer 2027 internship in embedded, autonomy or flight software, especially in defense and aerospace. U.S. citizen.</p>
        <p className="section__lede">Contact me by email or on LinkedIn.</p>
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
