import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function MarketTesting() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <p className="eyebrow">Project 02</p>
        <h1>MarketTesting</h1>
        <p className="page-header__meta">Independent Python learning project, October 2025 to June 2026</p>
        <p className="page-header__summary">[MT-1] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <section className="section case-study" aria-labelledby="mt-title">
        <figure className="photo-slot photo-slot--16x9" id="markettesting-table">
          {/* Photo slot "markettesting-table": replace the .photo-slot__box div with <img src={BASE + 'assets/photos/markettesting-table.jpg'} alt="..." width="..." height="..." /> (file: site/public/assets/photos/markettesting-table.jpg), then rebuild. Keep the caption. */}
          <div className="photo-slot__box">Screenshot: prediction table</div>
          <figcaption className="figure__caption">[MT-2] Caption.</figcaption>
        </figure>
        <h2 id="mt-title" className="section__title"><span aria-hidden="true">01 / </span>Project</h2>
        <div className="case-study__block" id="mt-what">
          <h3>What it is</h3>
          <p>[MT-3] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="case-study__block" id="mt-built">
          <h3>What I built</h3>
          <ul>
            <li>[MT-4] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[MT-5] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[MT-6] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ul>
          <ul className="tag-list">
            <li className="tag">Python</li>
            <li className="tag">pandas/NumPy</li>
            <li className="tag">TensorFlow</li>
            <li className="tag">yfinance</li>
          </ul>
        </div>
        {/* Pipeline diagram: replace with the render of Ben's PUML (site/public/assets/markettesting-pipeline.svg, from his .puml) when it arrives, then rebuild. */}
        <figure className="figure figure--diagram figure--narrow" id="markettesting-pipeline">
          <img src={BASE + 'assets/markettesting-pipeline.svg'} width="360" height="620" alt="Pipeline diagram, top to bottom: CSV or yfinance data, pandas and NumPy preprocessing, RobustScaler feature scaling, 100-day windows, LSTM, prediction table." loading="lazy" decoding="async" />
          <figcaption className="figure__caption">[MT-7] Caption.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--16x9" id="markettesting-terminal">
          {/* Photo slot "markettesting-terminal": replace the .photo-slot__box div with <img src={BASE + 'assets/photos/markettesting-terminal.jpg'} alt="..." width="..." height="..." /> (file: site/public/assets/photos/markettesting-terminal.jpg), then rebuild. Keep the caption. */}
          <div className="photo-slot__box">Screenshot: terminal run</div>
          <figcaption className="figure__caption">[MT-8] Caption.</figcaption>
        </figure>
        <p className="case-study__repo">Code: <a href="https://github.com/Benjamin-Elmore/MarketTesting" rel="noopener">Benjamin-Elmore/MarketTesting on GitHub</a>. [MT-9] Lorem ipsum dolor sit amet.</p>
      </section>
    </>
  );
}
