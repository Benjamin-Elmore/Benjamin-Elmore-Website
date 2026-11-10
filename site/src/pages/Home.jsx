import { Link } from 'react-router';
import { BASE } from '../routes.js';
import SlideList from '../components/SlideList.jsx';
import TypeLine from '../components/TypeLine.jsx';
import ResumeLink, { HAS_RESUME } from '../components/ResumeLink.jsx';

// HOME-1: the intro line under the profile photo. It types out once per visit.
const INTRO = 'Embedded C++ firmware for robotic systems. Machine learning in Python.';

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
          <li><Link className="work-row" to="/ARC/"><span className="work-row__name">ARC</span> <span className="work-row__description">Embedded C++ sensor firmware (ESP32-S3, FreeRTOS, RS-485) for the CBU1 robotics team's custom sensor board.</span> <span className="work-row__arrow" aria-hidden="true">→</span></Link></li>
          <li><Link className="work-row" to="/MarketTesting/"><span className="work-row__name">MarketTesting</span> <span className="work-row__description">Independent machine learning project: LSTM forecasting on historical equity data.</span> <span className="work-row__arrow" aria-hidden="true">→</span></Link></li>
        </SlideList>
      </section>
      <section id="experience" className="section section--experience" aria-labelledby="experience-title">
        <h2 id="experience-title" className="section__title"><span aria-hidden="true">02 / </span>Experience</h2>
        <SlideList className="exp-list">
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#software-engineer"><span className="exp-row__role">Software Engineer</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">CBU1 VEX U Robotics</span> <span className="exp-row__dates">Since <time dateTime="2025-09">September 2025</time></span></Link>
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
            <Link className="exp-row__link" to="/CBU-Robotics/#vice-president"><span className="exp-row__role">Vice President</span> <span className="exp-row__arrow" aria-hidden="true">→</span> <span className="exp-row__org">CBU1 VEX U Robotics</span> <span className="exp-row__dates">Since <time dateTime="2026-10">October 2026</time></span></Link>
            <details className="exp-details">
              <summary>Responsibilities</summary>
              <ul className="role__points">
                <li>Coordinate engineering milestones across the build, electronics and software sub-teams and support engineers in meeting deadlines.</li>
                <li>Support planning of team events, competitions and the team's participation in the VEX U World Championship.</li>
              </ul>
            </details>
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
              <li className="tag">MATLAB/Simulink</li>
            </ul>
          </div>
          <div className="skill-group">
            <h3 id="skills-tools" className="skill-group__title">Tools</h3>
            <ul className="tag-list">
              <li className="tag">Git</li>
              <li className="tag">Linux</li>
              <li className="tag">Arduino</li>
            </ul>
          </div>
        </div>
      </section>
      <section id="about" className="section section--num" aria-labelledby="about-title">
        <h2 id="about-title" className="section__title"><span aria-hidden="true">04 / </span>About</h2>
        <p className="section__lede">I am a computer science student at California Baptist University (Class of 2029), focused on embedded systems and software that interfaces directly with physical hardware.</p>
        <p className="about__link"><Link to="/About/">Read my full bio →</Link></p>
      </section>
      <section id="education" className="section section--num" aria-labelledby="education-title">
        <h2 id="education-title" className="section__title"><span aria-hidden="true">05 / </span>Education</h2>
        <div className="edu">
          <h3 className="edu__school">California Baptist University</h3>
          <p className="edu__degree">B.S. Computer Science, Machine Learning and Artificial Intelligence concentration</p>
          <p className="meta">Expected <time dateTime="2029-05">May 2029</time></p>
        </div>
      </section>
      <section id="contact" className="section section--num" aria-labelledby="contact-title">
        <h2 id="contact-title" className="section__title"><span aria-hidden="true">06 / </span>Contact</h2>
        <p className="section__lede">For inquiries, email or LinkedIn is preferred.</p>
        <p className="contact__email">Email: <a href="mailto:benelmore6@gmail.com">benelmore6@gmail.com</a></p>
        <ul className="link-list contact__links">
          <li><a href="https://www.linkedin.com/in/benjamin-n-elmore/" rel="noopener">LinkedIn</a></li>
          <li><a href="https://github.com/Benjamin-Elmore" rel="noopener">GitHub</a></li>
          {HAS_RESUME && <li><ResumeLink>Résumé (PDF)</ResumeLink></li>}
        </ul>
      </section>
    </>
  );
}
