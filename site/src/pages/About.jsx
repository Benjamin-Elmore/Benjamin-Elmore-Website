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
        <p>[ABOUT-1] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>[ABOUT-2] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        <p>[ABOUT-3] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
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
