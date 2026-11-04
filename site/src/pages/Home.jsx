import { Link } from 'react-router';
import SlideList from '../components/SlideList.jsx';

export default function Home() {
  return (
    <>
      <section id="top" className="section section--intro" aria-labelledby="intro-title">
        <p className="intro__role">Software Engineer{' '}<span aria-hidden="true">/</span>{' '}Computer science student</p>
        <h1 id="intro-title" className="intro__name">Embedded software, from sensor to controller.</h1>
        <p className="intro__lede">I’m developing embedded firmware for robotics, with an interest in defense and space manufacturing.</p>
      </section>
      <section id="work" className="section section--work" aria-labelledby="work-title">
        <h2 id="work-title" className="section__title"><span aria-hidden="true">01 /{' '}</span>Selected work</h2>
        <SlideList className="work-list">
          <li><Link className="work-row" to="/ARC/"><span className="work-row__name">ARC</span>{' '}<span className="work-row__description">C++ sensor firmware for the CBU1 VEX U team’s custom{' '}<span className="nowrap">ESP32-S3</span>{' '}board.</span>{' '}<span className="work-row__arrow" aria-hidden="true">→</span></Link></li>
          <li><Link className="work-row" to="/MarketTesting/"><span className="work-row__name">MarketTesting</span>{' '}<span className="work-row__description">A Python and TensorFlow learning project for financial time series.</span>{' '}<span className="work-row__arrow" aria-hidden="true">→</span></Link></li>
        </SlideList>
      </section>
      <section id="experience" className="section section--experience" aria-labelledby="experience-title">
        <h2 id="experience-title" className="section__title"><span aria-hidden="true">02 /{' '}</span>Experience</h2>
        <SlideList className="exp-list">
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#vice-president"><span className="exp-row__role">Vice President</span>{' '}<span className="exp-row__arrow" aria-hidden="true">→</span>{' '}<span className="exp-row__org">CBU1 VEX U Robotics</span>{' '}<span className="exp-row__dates">Since{' '}<time dateTime="2026-10">October 2026</time></span></Link>
            <details className="exp-details">
              <summary>Responsibilities</summary>
              <ul className="role__points">
                <li>I coordinate milestones across disciplines and help plan events and competition preparation.</li>
                <li>Alongside the role, I designed a theoretical, AI-assisted workflow framework for the{' '}<span className="nowrap">2026-27</span>{' '}Override season, with Build, Electronics and Software agent roles.</li>
              </ul>
            </details>
          </li>
          <li>
            <Link className="exp-row__link" to="/CBU-Robotics/#software-engineer"><span className="exp-row__role">Software Engineer</span>{' '}<span className="exp-row__arrow" aria-hidden="true">→</span>{' '}<span className="exp-row__org">CBU1 VEX U Robotics</span>{' '}<span className="exp-row__dates">Since{' '}<time dateTime="2025-09">September 2025</time></span></Link>
            {/* home-responsibilities */}
            <details className="exp-details">
              <summary>Responsibilities and projects</summary>
              <ul className="role__points">
                <li>I contribute to the ARC sensor firmware for ARSENAL, a custom{' '}<span className="nowrap">ESP32-S3</span>{' '}board: sensor abstraction, mutex-protected I²C bus access through the{' '}<span className="nowrap">ESP-IDF</span>{' '}master API, optical sensor routines and{' '}<span className="nowrap">RS-485</span>{' '}diagnostics. See the{' '}<Link to="/ARC/">ARC case study</Link>.</li>
                <li>In fall 2025, I wrote PROS/C++ drivetrain code: joystick driver controls and baseline point navigation using odometry and robot-frame error.</li>
                <li>I explored PID and Pure Pursuit control. My spline and odometry work was left unfinished.</li>
                <li>More detail is on the{' '}<Link to="/CBU-Robotics/">CBU Robotics page</Link>.</li>
              </ul>
            </details>
            {/* /home-responsibilities */}
          </li>
          <li><Link className="exp-row__link" to="/In-N-Out/"><span className="exp-row__role">Associate</span>{' '}<span className="exp-row__arrow" aria-hidden="true">→</span>{' '}<span className="exp-row__org">In-N-Out Burger</span>{' '}<span className="exp-row__dates">Since{' '}<time dateTime="2024-05">May 2024</time></span></Link></li>
          <li><Link className="exp-row__link" to="/LEGOLAND/"><span className="exp-row__role">Seasonal Lifeguard</span>{' '}<span className="exp-row__arrow" aria-hidden="true">→</span>{' '}<span className="exp-row__org">LEGOLAND California Resort</span>{' '}<span className="exp-row__dates"><time dateTime="2026-04">April</time>{' '}to{' '}<time dateTime="2026-08">August 2026</time></span></Link></li>
        </SlideList>
      </section>
      <section id="skills" className="section section--skills" aria-labelledby="skills-title">
        <h2 id="skills-title" className="section__title"><span aria-hidden="true">03 /{' '}</span>Technical skills</h2>
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
        <h2 id="about-title" className="section__title"><span aria-hidden="true">04 /{' '}</span>About</h2>
        <p className="section__lede">My work sits where sensors, a custom board and a robot controller meet. I care about component bring-up, clear ownership of interfaces, diagnostics and checks someone else can repeat. Sensor interfaces for test fixtures and manufacturing equipment are an area I want to grow into.</p>
        <p className="about__link"><Link to="/About/">Read my bio →</Link></p>
      </section>
      <section id="education" className="section section--num" aria-labelledby="education-title">
        <h2 id="education-title" className="section__title"><span aria-hidden="true">05 /{' '}</span>Education</h2>
        <div className="edu">
          <h3 className="edu__school">California Baptist University</h3>
          <p className="edu__degree">B.S. Computer Science, Machine Learning and Artificial Intelligence concentration</p>
          <p className="meta">Expected{' '}<time dateTime="2029-05">May 2029</time></p>
        </div>
      </section>
      <section id="contact" className="section section--num" aria-labelledby="contact-title">
        <h2 id="contact-title" className="section__title"><span aria-hidden="true">06 /{' '}</span>Contact</h2>
        <p className="section__lede">The best way to reach me is email or LinkedIn.</p>
        <p className="contact__email">Email:{' '}<a href="mailto:benelmore6@gmail.com">benelmore6@gmail.com</a></p>
        <ul className="link-list contact__links">
          <li><a href="https://www.linkedin.com/in/benjamin-n-elmore/" rel="noopener">LinkedIn</a></li>
          <li><a href="https://github.com/Benjamin-Elmore" rel="noopener">GitHub</a></li>
        </ul>
      </section>
    </>
  );
}
