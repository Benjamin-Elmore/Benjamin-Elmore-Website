import { Link } from 'react-router';
import { BASE } from '../routes.js';

const ARC_COMMIT = <>ARC <code>CPPDev</code> 49d54a0</>;
const MT_COMMIT = <>MarketTesting <code>main</code> 79f6e12</>;

// Every content image on the site, grouped, with where it comes from and where it is used.
const GROUPS = [
  {
    id: 'diagrams', title: 'Diagrams', items: [
      { src: 'arc-software-cppdev.svg', w: 2000, h: 1250, title: 'ARC system architecture',
        alt: 'ARC system architecture in three packages: sensor hardware, the ESP32-S3 controller firmware classes, and the RS-485 robot interface to the V5 Brain.',
        ref: <>Redrawn from the original PlantUML layout, updated to {ARC_COMMIT}. Design view. The read path was verified on the bench on November 10, 2026; not yet run on the robot.</>,
        used: [['/ARC/#arc-software', 'ARC'], ['/', 'Home thumbnail']] },
      { src: 'arc-architecture.svg', w: 1000, h: 370, title: 'ARC data path',
        alt: 'Data path: I²C sensors to an I²C multiplexer to the ESP32-S3 running ARC firmware, then half-duplex RS-485 to the V5 Brain.',
        ref: <>Designed data path from the ARC sources at {ARC_COMMIT}. Read direction verified on the bench on November 10, 2026; not yet run on the robot.</>,
        used: [['/ARC/#data-path', 'ARC']] },
      { src: 'markettesting-pipeline.svg', w: 360, h: 664, title: 'MarketTesting pipeline', narrow: true,
        alt: 'Pipeline, top to bottom: CSV or yfinance data, pandas and NumPy preprocessing, RobustScaler feature scaling, 100-day windows, LSTM, prediction table.',
        ref: <>Data flow through the package at {MT_COMMIT}.</>,
        used: [['/MarketTesting/#markettesting-pipeline', 'MarketTesting']] },
      { src: 'photos/markettesting-lstm.jpg', w: 1280, h: 560, title: 'MarketTesting LSTM layers',
        alt: 'LSTM layer stack: input of 100 days by 5 values, LSTM 100 units, dropout 0.2, LSTM 100 units, dropout 0.2, dense layer of 5 outputs for the next day.',
        ref: <><a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/stock_models/stock_model.py#L53-L70" rel="noopener"><code>create_model()</code> in stock_model.py</a> at {MT_COMMIT}.</>,
        used: [['/', 'Home hover background']] },
    ],
  },
  {
    id: 'outputs', title: 'Outputs', items: [
      { src: 'photos/markettesting-table.jpg', w: 1600, h: 900, title: 'AAPL prediction table',
        alt: 'MarketTesting prediction table for AAPL: rows of predicted open, high, low, close and volume over 90 trading days.',
        ref: <>Written by <a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/analysis/data_log.py" rel="noopener">DataLog</a> from the November 8, 2026 training run at {MT_COMMIT}. Model output only; not a validated trading result.</>,
        used: [['/MarketTesting/#markettesting-table', 'MarketTesting'], ['/', 'Home thumbnail']] },
      { src: 'photos/markettesting-terminal.jpg', w: 1600, h: 900, title: 'Per-ticker training run',
        alt: 'Terminal output from a MarketTesting training run: per-epoch loss for MSFT, NVDA skipped for out-of-range scaled data, then AMD.',
        ref: <>Terminal output of the <a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/client/model_training_client.py" rel="noopener">model training client</a> flow on 12 tickers at {MT_COMMIT}.</>,
        used: [['/MarketTesting/#markettesting-terminal', 'MarketTesting']] },
    ],
  },
  {
    id: 'code', title: 'Code', items: [
      { src: 'photos/arc-i2cbus-code.jpg', w: 1280, h: 560, title: 'I2CBus: removeSensorFromBus()',
        alt: 'Code window of removeSensorFromBus in I2CBus.h, which refuses to run unless the bus lock is held.',
        ref: <><a href="https://github.com/Benjamin-Elmore/ARC/blob/49d54a0584fecc4dd5a5edd4ad0cba9e79eb81d6/lib/i2cComm/I2CBus.h" rel="noopener">lib/i2cComm/I2CBus.h</a> at {ARC_COMMIT}.</>,
        used: [['/', 'Home hover background']] },
      { src: 'photos/arc-lockguard-code.jpg', w: 1280, h: 560, title: 'LockGuard',
        alt: 'Code window of the LockGuard RAII class that holds the shared I²C bus mutex.',
        ref: <><a href="https://github.com/Benjamin-Elmore/ARC/blob/49d54a0584fecc4dd5a5edd4ad0cba9e79eb81d6/lib/LockGuard.h" rel="noopener">lib/LockGuard.h</a> at {ARC_COMMIT}.</>,
        used: [['/', 'Home hover background']] },
      { src: 'photos/markettesting-code.jpg', w: 1280, h: 560, title: 'StockModel: create_model()',
        alt: 'Code window of create_model in stock_model.py, building two LSTM layers with dropout and a dense output layer.',
        ref: <><a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/stock_models/stock_model.py#L53-L70" rel="noopener">stock_model.py, lines 53-70</a> at {MT_COMMIT}.</>,
        used: [] },
    ],
  },
  {
    id: 'robotics', title: 'Robotics', items: [
      { src: 'photos/arc-rs485-bench.jpg', w: 1600, h: 1200, title: 'ARSENAL-3 to V5 Brain over RS-485',
        alt: 'The ARSENAL-3 board on pink anti-static foam, cabled to a VEX V5 Brain labelled CBU 3 that shows the ARC three-temperature bus test.',
        ref: <>Bench test, November 10, 2026: three temperature sensors on ARSENAL-3, read by ARC and sent over RS-485 to the V5 Brain. Levels adjusted.</>,
        used: [['/ARC/#arc-board', 'ARC']] },
      { src: 'photos/arc-rs485-v5-screen.jpg', w: 1600, h: 1200, title: 'V5 Brain: ARC three-temperature bus test',
        alt: 'V5 Brain screen showing the ARC three-temperature bus test: 0 bad packets, reply OK with markers and checksum, 49-byte reply, sensors 2, 3 and 4 at about 26 to 28 degrees C, and a hex dump of the reply.',
        ref: <>The V5 Brain side of the same bench test: 49-byte replies with valid DE AD BE EF markers and checksum, 0 bad packets. Levels adjusted.</>,
        used: [['/ARC/#arc-rs485-test', 'ARC']] },
      { src: 'photos/cbu-team.jpg', w: 2000, h: 857, title: 'CBU1 at Worlds',
        alt: 'The CBU1 VEX U team posed in team polos at the VEX Robotics World Championship, with two team robots in the front row.',
        ref: <>CBU1 VEX U team photo, VEX Robotics World Championship.</>,
        used: [['/CBU-Robotics/#cbu-team', 'CBU Robotics']] },
      { src: 'photos/cbu-club-2026.jpg', w: 2000, h: 857, title: 'CBU Robotics full team, November 2026',
        alt: 'The full CBU Robotics team in matching navy club shirts, standing in three rows in a university building lobby.',
        ref: <>CBU Robotics full team photo, November 9, 2026. Cropped to 21:9.</>,
        used: [['/CBU-Robotics/#cbu-club', 'CBU Robotics'], ['/', 'Home hover background']] },
      { src: 'photos/cbu-members-sign.jpg', w: 1600, h: 1067, title: 'CBU Robotics leads, CBU sign',
        alt: 'The seven CBU Robotics leads in navy club shirts, sitting and standing along a wooden bench in front of a carved CBU wall sign.',
        ref: <>CBU Robotics leads, November 9, 2026.</>,
        used: [['/CBU-Robotics/#cbu-members', 'CBU Robotics']] },
      { src: 'photos/cbu-members-lineup.jpg', w: 1600, h: 1067, title: 'CBU Robotics leads, lineup',
        alt: 'The seven CBU Robotics leads in navy club shirts, standing in a staggered line with arms crossed in front of a dotted world map wall.',
        ref: <>CBU Robotics leads, November 9, 2026.</>,
        used: [['/CBU-Robotics/#cbu-members', 'CBU Robotics']] },
    ],
  },
];

export default function Gallery() {
  let n = 0;
  return (
    <>
      <div className="page-header">
        <p className="eyebrow">Gallery</p>
        <h1>Gallery</h1>
        <p className="page-header__summary">Every diagram, output, code image and photo on this site, with its source. Code and outputs are pinned to the commit they came from. Select an image to view it full size.</p>
      </div>
      {GROUPS.map((g, gi) => (
        <section key={g.id} className="section case-study" aria-labelledby={`gallery-${g.id}`}>
          <h2 id={`gallery-${g.id}`} className="section__title"><span aria-hidden="true">{String(gi + 1).padStart(2, '0')} / </span>{g.title}</h2>
          <ul className="gallery">
            {g.items.map((it) => {
              n += 1;
              return (
                <li key={it.src} className="gallery__item">
                  <figure className={'figure gallery__figure' + (it.narrow ? ' gallery__figure--narrow' : '')}>
                    <img src={BASE + 'assets/' + it.src} width={it.w} height={it.h} alt={it.alt} loading="lazy" decoding="async" />
                    <figcaption className="gallery__caption">
                      <span className="gallery__num">Fig. {String(n).padStart(2, '0')}</span>
                      <strong className="gallery__title">{it.title}</strong>
                      <span className="gallery__ref">{it.ref}</span>
                      <span className="gallery__used">Used on: {it.used.length
                        ? it.used.map(([to, label], i) => <span key={to + label}>{i > 0 && ', '}<Link to={to}>{label}</Link></span>)
                        : 'this page only'}</span>
                    </figcaption>
                  </figure>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </>
  );
}
