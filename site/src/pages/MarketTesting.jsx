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
        <p className="page-header__summary">An independent machine learning project covering the workflow from data to predictions: acquiring historical equity data, cleaning and scaling it, training an LSTM and recording its predictions in a structured table.</p>
      </div>
      <section className="section case-study" aria-labelledby="mt-title">
        <figure className="photo-slot photo-slot--16x9" id="markettesting-table">
          <img src={BASE + 'assets/photos/markettesting-table.jpg'} width="1600" height="900" alt="MarketTesting prediction table for AAPL: dated rows of predicted open, high, low, close and volume over a 90-day forecast." loading="lazy" decoding="async" />
          <figcaption className="figure__caption">AAPL prediction table, 90-day forecast, from the November 8, 2026 training run. Model output only; not a validated trading result.*</figcaption>
        </figure>
        <p className="figure__caption figure__note" id="markettesting-table-note"><small>* Run conditions: 12-stock training run, November 8, 2026, code at <code>main</code> 79f6e12. The 90-day forecast uses a sliding window, with each prediction fed back as input. Values are model output only; no accuracy is claimed.</small></p>
        <h2 id="mt-title" className="section__title"><span aria-hidden="true">01 / </span>Project</h2>
        <div className="case-study__block" id="mt-what">
          <h3>What it is</h3>
          <p>MarketTesting downloads daily price history for NASDAQ stocks with yfinance, or reads it from a CSV, segments it into 100-day windows, and trains a two-layer LSTM in TensorFlow to predict the open, high, low, close and volume for the next day. As a learning project, it makes no claims of predictive accuracy.</p>
        </div>
        <div className="case-study__block" id="mt-built">
          <h3>Main pieces</h3>
          <ul>
            <li><strong>Data pipeline.</strong> Loading from yfinance or CSV, filtering out empty and index-like tickers, and scaling every stock with one shared scaler.</li>
            <li><strong>Model and training.</strong> A Keras LSTM with dropout and early stopping, trained ticker by ticker, including diagnosis of a scaling defect that drove validation loss to NaN.</li>
            <li><strong>Prediction log and packaging.</strong> A DataLog that turns predictions into a time-based table, Pylint checks on GitHub Actions, and an installable Python package.</li>
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
          <figcaption className="figure__caption">End-to-end pipeline, from raw price data to the prediction table.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--16x9" id="markettesting-terminal">
          <img src={BASE + 'assets/photos/markettesting-terminal.jpg'} width="1600" height="900" alt="Terminal output from a MarketTesting training run, training one ticker at a time with per-epoch loss, early stopping for MSFT and NVDA skipped." loading="lazy" decoding="async" />
          <figcaption className="figure__caption">Per-ticker training. Early stopping terminates MSFT after four epochs once validation loss plateaus; NVDA is excluded because its scaled prices fall outside the range of the model.</figcaption>
        </figure>
        <p className="case-study__repo">Code: <a href="https://github.com/Benjamin-Elmore/MarketTesting" rel="noopener" data-umami-event="repo-markettesting">Benjamin-Elmore/MarketTesting on GitHub</a>. Described at <code>main</code> 79f6e12.</p>
        <p className="next-project"><Link to="/CBU-Robotics/">Next project: CBU Robotics →</Link></p>
      </section>
    </>
  );
}
