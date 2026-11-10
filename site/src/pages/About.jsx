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
        <p>I study computer science with an AI/ML concentration at California Baptist University and expect to graduate in May 2029. I write software for CBU1, our VEX U robotics team, and in October 2026 I became Vice President of CBU Robotics.</p>
        <p>Most of my work is embedded C++. I'm writing ARC, firmware for an ESP32-S3 board that lets robotics teams use sensors VEX doesn't make, without needing deep embedded knowledge. On my own, I built MarketTesting, a Python project where I learned machine learning end to end, from cleaning real stock data to training an LSTM.</p>
        <p>I want to keep building embedded and machine learning software. On the team, I've found that leadership works best as service: being present, checking in, and supporting the people around me.</p>
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
