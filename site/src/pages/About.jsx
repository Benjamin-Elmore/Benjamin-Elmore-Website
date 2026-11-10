import { Link } from 'react-router';

export default function About() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/">← Home</Link></p>
        <p className="eyebrow">Profile</p>
        <h1>About</h1>
      </div>
      <section className="section case-study section--page" aria-labelledby="bio-title">
        <h2 id="bio-title" className="section__title"><span aria-hidden="true">01 / </span>Bio</h2>
        <p>I am a computer science student at California Baptist University, pursuing a B.S. with a concentration in Machine Learning and Artificial Intelligence (expected May 2029). Since fall 2025, I have served as a software engineer on CBU1, the university VEX U robotics team, and since October 2026 as Vice President of CBU Robotics.</p>
        <p>My primary focus is embedded C++. My current work centers on ARC, firmware for a custom ESP32-S3 board designed to connect third-party I²C sensors to the VEX V5 platform, so that future teams can add sensors without specialized embedded expertise. Independently, I developed MarketTesting, a Python project covering the machine learning workflow from data acquisition and cleaning to LSTM model training.</p>
        <p>I intend to pursue a career in embedded and machine learning software, with particular interest in the defense industry. In leadership, my approach is one of service: consistent presence, regular check-ins and direct support for team members.</p>
      </section>
      <section className="section case-study section--page" aria-labelledby="education-title">
        <h2 id="education-title" className="section__title"><span aria-hidden="true">02 / </span>Education</h2>
        <div className="edu">
          <h3 className="edu__school">California Baptist University</h3>
          <p className="edu__degree">B.S. Computer Science, Machine Learning and Artificial Intelligence concentration</p>
          <p className="meta">Expected <time dateTime="2029-05">May 2029</time></p>
        </div>
      </section>
    </>
  );
}
