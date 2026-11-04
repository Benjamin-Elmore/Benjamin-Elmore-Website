import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function MarketTesting() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <h1>MarketTesting</h1>
        <p className="page-header__meta">Independent Python learning project, October 2025 to June 2026</p>
        <p className="page-header__summary">A data pipeline I built on my own for financial time series, from market data ingestion to a prediction table.</p>
      </div>
      <section className="section case-study" aria-labelledby="mt-title">
        <figure className="photo-slot photo-slot--16x9" id="markettesting-table">
          {/* Photo slot "markettesting-table": replace the .photo-slot__box div with <img src="../assets/photos/markettesting-table.jpg" alt="..." width="..." height="..."> (file: docs/assets/photos/markettesting-table.jpg). Keep the caption. */}
          <div className="photo-slot__box">Screenshot: prediction table</div>
          <figcaption className="figure__caption">Prediction table output from a run. Screenshot to be added.</figcaption>
        </figure>
        <h2 id="mt-title" className="section__title">Project</h2>
        <div className="case-study__block" id="mt-what">
          <h3>What it is</h3>
          <p>MarketTesting is a Python project that ingests historical market data from CSV or yfinance, turns it into 100-day windows for LSTM training, and produces prediction tables.</p>
        </div>
        <div className="case-study__block" id="mt-built">
          <h3>What I built</h3>
          <ul>
            <li>The entry point, and the model and training structure around a{' '}<code>StockModel</code>.</li>
            <li>CSV and yfinance data pull paths. On the{' '}<span className="nowrap"><code>LSTM-feature-implement</code></span>{' '}branch, I extended them with general CSV ingestion and VIX retrieval.</li>
            <li>pandas and NumPy preprocessing, feature scaling with a scikit-learn{' '}<code>RobustScaler</code>, and 100-day input windows.</li>
            <li>TensorFlow LSTM training with early stopping on validation loss, and a check that skips tickers whose scaled data is out of range.</li>
            <li>Data logging and the prediction-table output.</li>
            <li>A reorganization into a{' '}<code>src</code>{' '}package.</li>
          </ul>
          <ul className="tag-list">
            <li className="tag">Python</li>
            <li className="tag">pandas/NumPy</li>
            <li className="tag">TensorFlow</li>
            <li className="tag">yfinance</li>
          </ul>
        </div>
        {/* Pipeline diagram: replace with the render of Ben's PUML (assets/markettesting-pipeline.svg, from his .puml) when it arrives. */}
        <figure className="figure figure--diagram figure--narrow" id="markettesting-pipeline">
          <img src={BASE + 'assets/markettesting-pipeline.svg'} width="360" height="620" alt="Pipeline diagram, top to bottom: CSV or yfinance data, pandas and NumPy preprocessing, RobustScaler feature scaling, 100-day windows, LSTM, prediction table." loading="lazy" decoding="async" />
          <figcaption className="figure__caption">The MarketTesting pipeline, from data source to prediction table.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--16x9" id="markettesting-terminal">
          {/* Photo slot "markettesting-terminal": replace the .photo-slot__box div with <img src="../assets/photos/markettesting-terminal.jpg" alt="..." width="..." height="..."> (file: docs/assets/photos/markettesting-terminal.jpg). Keep the caption. */}
          <div className="photo-slot__box">Screenshot: terminal run</div>
          <figcaption className="figure__caption">A terminal run of the pipeline. Screenshot to be added.</figcaption>
        </figure>
        <p className="case-study__repo">Code:{' '}<a href="https://github.com/Benjamin-Elmore/MarketTesting" rel="noopener">Benjamin-Elmore/MarketTesting on GitHub</a>. The pipeline above is the default{' '}<code>main</code>{' '}branch at{' '}<code>79f6e12</code>. The VIX and general CSV work is on the{' '}<span className="nowrap"><code>LSTM-feature-implement</code></span>{' '}branch.</p>
      </section>
    </>
  );
}
