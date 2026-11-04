import { Link } from 'react-router';

export default function About() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/">← Home</Link></p>
        <h1>About</h1>
      </div>
      <section className="section case-study section--page" aria-labelledby="bio-title">
        <h2 id="bio-title" className="section__title">Bio</h2>
        <p>I’m Benjamin Elmore, a computer science student at California Baptist University, where I’m concentrating in machine learning and artificial intelligence. I work on embedded software for robots: C++ firmware where sensors, a custom board and a robot controller meet. On the CBU1 VEX U Robotics team I contribute to ARC, the sensor firmware for a custom{' '}<span className="nowrap">ESP32-S3</span>{' '}board designed to connect external sensors to a VEX V5 Brain, and I’m the team’s Vice President.</p>
        <p>I started on the team in September 2025 writing PROS/C++ drivetrain code: driver controls, point navigation from odometry, and early PID and Pure Pursuit experiments. Since August 2026 I’ve worked closer to the hardware on ARC, on device interfaces, bus ownership and diagnostics.</p>
        <p>I want to keep working on embedded software for physical systems, and I’m especially interested in defense and space manufacturing. Sensor interfaces for test fixtures and manufacturing equipment are an area I want to grow into. Outside of robotics, I built MarketTesting, a Python and TensorFlow learning project.</p>
      </section>
      <section className="section case-study section--page" aria-labelledby="education-title">
        <h2 id="education-title" className="section__title">Education</h2>
        <div className="edu">
          <h3 className="edu__school">California Baptist University</h3>
          <p className="edu__degree">B.S. Computer Science, Machine Learning and Artificial Intelligence concentration</p>
          <p className="meta">Expected{' '}<time dateTime="2029-05">May 2029</time></p>
        </div>
      </section>
    </>
  );
}
