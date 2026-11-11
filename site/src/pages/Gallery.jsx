import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigationType } from 'react-router';
import { hydration } from '../hydration.js';
import CodeWindow from '../components/CodeWindow.jsx';
import { SERIAL_CAPTURE, LOCKGUARD_CODE } from '../codeSamples.js';
import { BASE } from '../routes.js';

const ARC_COMMIT = <>ARC <code>CPPDev</code> 49d54a0</>;
const MT_COMMIT = <>MarketTesting <code>main</code> 79f6e12</>;

// Sets and subsets. Adding a set (for example work experience or school) is just another entry here:
// give it a subset with a prefix and numbered items, and the filter buttons pick it up.
const SETS = [
  {
    id: 'projects', title: 'Projects', subsets: [
      { id: 'arc', title: 'ARC', prefix: 'ARC', items: [
          { id: 'ARC-01', src: 'photos/arc-rs485-bench.jpg', w: 1600, h: 1200, title: 'ARSENAL-3 to V5 Brain over RS-485',
            alt: 'The ARSENAL-3 board on pink anti-static foam, cabled to a VEX V5 Brain labelled CBU 3 that shows the ARC three-temperature bus test.',
            ref: <>Bench test, November 10, 2026: three temperature sensors on ARSENAL-3, read by ARC and sent over RS-485 to the V5 Brain. Levels adjusted.</>,
            used: [['/ARC/#arc-board', 'ARC']] },
          { id: 'ARC-02', src: 'arc-software-cppdev.svg', w: 2000, h: 1250, title: 'ARC system architecture',
            alt: 'ARC system architecture in three packages: sensor hardware, the ESP32-S3 controller firmware classes, and the RS-485 robot interface to the V5 Brain.',
            ref: <>Redrawn from the original PlantUML layout, updated to {ARC_COMMIT}. Design view. The read path was verified on the bench on November 10, 2026; not yet run on the robot.</>,
            used: [['/ARC/#arc-software', 'ARC'], ['/', 'Home thumbnail']] },
          { id: 'ARC-03', code: 'serial', w: 0, h: 0, title: 'ARC serial monitor output', language: 'Serial output', codeTitle: 'ESP32-S3 serial monitor, October 28, 2026',
            ref: <>Bench serial output from ARC, October 28, 2026, with the RS-485 link under isolated test: a read request from the V5 Brain received and parsed without error. Duplicate buffer output and all-zero rows are omitted. Text, as on the ARC page.</>,
            used: [['/ARC/#arc-serial', 'ARC']] },
          { id: 'ARC-04', src: 'arc-architecture.svg', w: 1000, h: 370, title: 'ARC data path',
            alt: 'Data path: I²C sensors to an I²C multiplexer to the ESP32-S3 running ARC firmware, then half-duplex RS-485 to the V5 Brain.',
            ref: <>Designed data path from the ARC sources at {ARC_COMMIT}. Read direction verified on the bench on November 10, 2026; not yet run on the robot.</>,
            used: [['/ARC/#data-path', 'ARC']] },
          { id: 'ARC-05', src: 'photos/arc-rs485-v5-screen.jpg', w: 1600, h: 1200, title: 'V5 Brain: ARC three-temperature bus test',
            alt: 'V5 Brain screen showing the ARC three-temperature bus test: 0 bad packets, reply OK with markers and checksum, 49-byte reply, sensors 2, 3 and 4 at about 26 to 28 degrees C, and a hex dump of the reply.',
            ref: <>The V5 Brain side of the same bench test: 49-byte replies with valid DE AD BE EF markers and checksum, 0 bad packets. Levels adjusted.</>,
            used: [['/ARC/#arc-rs485-test', 'ARC']] },
          { id: 'ARC-06', code: 'lockguard', w: 0, h: 0, title: 'LockGuard, condensed', language: 'C++', codeTitle: 'lib/LockGuard.h (condensed)',
            ref: <>Condensed from <a href="https://github.com/Benjamin-Elmore/ARC/blob/49d54a0584fecc4dd5a5edd4ad0cba9e79eb81d6/lib/LockGuard.h" rel="noopener">lib/LockGuard.h</a> at {ARC_COMMIT}. Text, as on the ARC page.</>,
            used: [['/ARC/#arc-lockguard', 'ARC']] },
          { id: 'ARC-07', src: 'photos/arc-i2cbus-code.jpg', w: 1280, h: 560, title: 'I2CBus: removeSensorFromBus()',
            alt: 'Code window of removeSensorFromBus in I2CBus.h, which refuses to run unless the bus lock is held.',
            ref: <><a href="https://github.com/Benjamin-Elmore/ARC/blob/49d54a0584fecc4dd5a5edd4ad0cba9e79eb81d6/lib/i2cComm/I2CBus.h" rel="noopener">lib/i2cComm/I2CBus.h</a> at {ARC_COMMIT}.</>,
            used: [['/', 'Home hover background']] },
          { id: 'ARC-08', src: 'photos/arc-lockguard-code.jpg', w: 1280, h: 560, title: 'LockGuard',
            alt: 'Code window of the LockGuard RAII class that holds the shared I²C bus mutex.',
            ref: <><a href="https://github.com/Benjamin-Elmore/ARC/blob/49d54a0584fecc4dd5a5edd4ad0cba9e79eb81d6/lib/LockGuard.h" rel="noopener">lib/LockGuard.h</a> at {ARC_COMMIT}.</>,
            used: [['/', 'Home hover background']] },
      ] },
      { id: 'markettesting', title: 'MarketTesting', prefix: 'MT', items: [
          { id: 'MT-01', src: 'markettesting-pipeline.svg', w: 360, h: 664, title: 'MarketTesting pipeline', narrow: true,
            alt: 'Pipeline, top to bottom: CSV or yfinance data, pandas and NumPy preprocessing, RobustScaler feature scaling, 100-day windows, LSTM, prediction table.',
            ref: <>Data flow through the package at {MT_COMMIT}.</>,
            used: [['/MarketTesting/#markettesting-pipeline', 'MarketTesting']] },
          { id: 'MT-02', src: 'photos/markettesting-table.jpg', w: 1600, h: 900, title: 'AAPL prediction table',
            alt: 'MarketTesting prediction table for AAPL: rows of predicted open, high, low, close and volume over 90 trading days.',
            ref: <>Written by <a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/analysis/data_log.py" rel="noopener">DataLog</a> from the November 8, 2026 training run at {MT_COMMIT}. Model output only; not a validated trading result.</>,
            used: [['/MarketTesting/#markettesting-table', 'MarketTesting'], ['/', 'Home thumbnail']] },
          { id: 'MT-03', src: 'photos/markettesting-terminal.jpg', w: 1600, h: 900, title: 'Per-ticker training run',
            alt: 'Terminal output from a MarketTesting training run: per-epoch loss for MSFT, NVDA skipped for out-of-range scaled data, then AMD.',
            ref: <>Terminal output of the <a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/client/model_training_client.py" rel="noopener">model training client</a> flow on 12 tickers at {MT_COMMIT}.</>,
            used: [['/MarketTesting/#markettesting-terminal', 'MarketTesting']] },
          { id: 'MT-04', src: 'photos/markettesting-lstm.jpg', w: 1280, h: 560, title: 'MarketTesting LSTM layers',
            alt: 'LSTM layer stack: input of 100 days by 5 values, LSTM 100 units, dropout 0.2, LSTM 100 units, dropout 0.2, dense layer of 5 outputs for the next day.',
            ref: <><a href="https://github.com/Benjamin-Elmore/MarketTesting/blob/79f6e126636b6706006b147a128676d5668054ce/src/markettesting/stock_models/stock_model.py#L53-L70" rel="noopener"><code>create_model()</code> in stock_model.py</a> at {MT_COMMIT}.</>,
            used: [['/', 'Home hover background']] },
      ] },
    ],
  },
  {
    id: 'teams', title: 'Teams', subsets: [
      { id: 'cbu1', title: 'CBU1 Robotics', prefix: 'CBU1', items: [
          { id: 'CBU1-01', src: 'photos/cbu-team.jpg', w: 2000, h: 857, title: 'CBU1 at 2026 Worlds, St. Louis',
            alt: 'The CBU1 VEX U team posed in team polos at the 2026 VEX Robotics World Championship in St. Louis, with two team robots in the front row.',
            ref: <>CBU1 VEX U team photo, 2026 VEX Robotics World Championship, St. Louis.</>,
            used: [['/CBU-Robotics/#cbu-team', 'CBU Robotics']] },
          { id: 'CBU1-02', src: 'photos/cbu-club-2026.jpg', w: 2000, h: 857, title: 'CBU Robotics full team, November 2026',
            alt: 'The full CBU Robotics team in matching navy club shirts, standing in three rows in a university building lobby.',
            ref: <>CBU Robotics full team photo, November 9, 2026. Cropped to 21:9.</>,
            used: [['/CBU-Robotics/#cbu-club', 'CBU Robotics'], ['/', 'Home hover background']] },
          { id: 'CBU1-03', src: 'photos/cbu-members-sign.jpg', w: 1600, h: 1067, title: 'CBU Robotics leads, CBU sign',
            alt: 'The seven CBU Robotics leads in navy club shirts, sitting and standing along a wooden bench in front of a carved CBU wall sign.',
            ref: <>CBU Robotics leads, November 9, 2026.</>,
            used: [['/CBU-Robotics/#cbu-members', 'CBU Robotics']] },
          { id: 'CBU1-04', src: 'photos/cbu-members-lineup.jpg', w: 1600, h: 1067, title: 'CBU Robotics leads, lineup',
            alt: 'The seven CBU Robotics leads in navy club shirts, standing in a staggered line with arms crossed in front of a dotted world map wall.',
            ref: <>CBU Robotics leads, November 9, 2026.</>,
            used: [['/CBU-Robotics/#cbu-members', 'CBU Robotics']] },
      ] },
    ],
  },
];

const CODE = { serial: SERIAL_CAPTURE, lockguard: LOCKGUARD_CODE };

const filterOf = (search) => {
  const v = new URLSearchParams(search).get('set');
  return SETS.some((s) => s.id === v) ? v : 'all';
};
// The filter lives in the URL (?set=teams) so Back restores the layout a scroll position was saved under.
// The address is replaced in place, keeping the router history state, so no route change or scroll reset happens.
const writeFilter = (id) => {
  try {
    const u = new URL(location.href);
    if (id === 'all') u.searchParams.delete('set'); else u.searchParams.set('set', id);
    history.replaceState(history.state, '', u.pathname + u.search + u.hash);
  } catch (e) { /* the filter still works without the address */ }
};

const setOfId = (id) => SETS.find((s) => s.subsets.some((ss) => ss.items.some((it) => it.id === id)));

export default function Gallery() {
  const { hash, search } = useLocation();
  const navType = useNavigationType();
  // While hydrating, start from the prerendered layout (all sets); a client-side visit starts from the URL.
  const [filter, setFilter] = useState(() => (hydration.active ? 'all' : filterOf(search)));
  const [ready, setReady] = useState(false);
  const firstRun = useRef(true);
  const deepLink = useRef(hydration.active);
  // The filter bar is prerendered (hidden, so it already takes its space) and switched on after hydration.
  useEffect(() => {
    setReady(true);
    if (hydration.active === false && deepLink.current) setFilter(filterOf(search));
  }, []);
  // Highlight the linked item. :target does not update on client-side navigation, so track the hash here
  // (after hydration, so the prerendered markup still matches).
  const [targetId, setTargetId] = useState(null);
  useEffect(() => {
    let id = hash.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
    setTargetId(id || null);
  }, [hash]);
  // A link to a tag clears any filter that would hide its target.
  useEffect(() => {
    let id = hash.slice(1);
    try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
    const target = setOfId(id);
    if (target && filterOf(location.search) !== 'all' && filterOf(location.search) !== target.id) { setFilter('all'); writeFilter('all'); }
  }, [hash]);
  // Re-scroll to the linked item once the page has settled (images and fonts change heights after hydration).
  // Not on Back or Forward, where RouteEffects has already put back the saved position; a deep link still lands.
  useEffect(() => {
    const first = firstRun.current;
    firstRun.current = false;
    if (!targetId) return;
    if (navType === 'POP' && !(first && deepLink.current)) return;
    const f = requestAnimationFrame(() => {
      const el = document.getElementById(targetId);
      if (!el) return;
      const root = document.documentElement, prev = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      getComputedStyle(root).scrollBehavior;
      el.scrollIntoView({ block: 'start' });
      root.style.scrollBehavior = prev;
    });
    return () => cancelAnimationFrame(f);
  }, [ready, targetId]);
  const pick = (id) => { setFilter(id); writeFilter(id); };
  return (
    <>
      <div className="page-header">
        <p className="eyebrow">Gallery</p>
        <h1>Gallery</h1>
        <p className="page-header__summary">Every diagram, output, code sample and photo on this site, in sets and subsets, each with a tag such as ARC-01 and its source. Code and outputs are pinned to the commit they came from. Select an image to view it full size.</p>
        <div className="gallery-filter" role="group" aria-label="Filter the Gallery by set" style={{ visibility: ready ? 'visible' : 'hidden' }}>
          {[{ id: 'all', title: 'All' }, ...SETS].map((s) => (
            <button key={s.id} type="button" className="gallery-filter__btn" disabled={!ready} aria-pressed={filter === s.id} onClick={() => pick(s.id)}>{s.title}</button>
          ))}
        </div>
      </div>
      {SETS.map((set, si) => (
        <section key={set.id} id={`gallery-${set.id}`} className="section case-study" aria-labelledby={`gallery-${set.id}-title`} hidden={filter !== 'all' && filter !== set.id}>
          <h2 id={`gallery-${set.id}-title`} className="section__title"><span aria-hidden="true">{String(si + 1).padStart(2, '0')} / </span>{set.title}</h2>
          {set.subsets.map((sub) => (
            <div key={sub.id} className="gallery-subset">
              <h3 className="gallery-subset__title">{sub.title}</h3>
              <ul className="gallery">
                {sub.items.map((it) => (
                  <li key={it.id} id={it.id} className={'gallery__item' + (targetId === it.id ? ' is-target' : '')}>
                    <figure className={'figure gallery__figure' + (it.narrow ? ' gallery__figure--narrow' : '') + (it.code ? ' gallery__figure--code' : '')}>
                      {it.code
                        ? <CodeWindow title={it.codeTitle} language={it.language}>{CODE[it.code]}</CodeWindow>
                        : <img src={BASE + 'assets/' + it.src} width={it.w} height={it.h} alt={it.alt} loading="lazy" decoding="async" />}
                      <figcaption className="gallery__caption">
                        <span className="gallery__num">{it.id}</span>
                        <strong className="gallery__title">{it.title}</strong>
                        <span className="gallery__ref">{it.ref}</span>
                        <span className="gallery__used">Used on: {it.used.length
                          ? it.used.map(([to, label], i) => <span key={to + label}>{i > 0 && ', '}<Link to={to}>{label}</Link></span>)
                          : 'this page only'}</span>
                      </figcaption>
                    </figure>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ))}
    </>
  );
}
