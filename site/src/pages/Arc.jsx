import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function Arc() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <h1>ARC firmware for ARSENAL</h1>
        <p className="page-header__meta">CBU1 VEX U Robotics · C++ · ESP32-S3 · ESP-IDF</p>
        <p className="page-header__summary">[ARC-1] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      </div>
      <section className="section case-study" aria-labelledby="arc-title">
        <figure className="photo-slot" id="arc-board">
          {/* Photo slot "arc-board": replace the .photo-slot__box div with <img src={BASE + 'assets/photos/arc-board.jpg'} alt="..." width="..." height="..." /> (file: site/public/assets/photos/arc-board.jpg), then rebuild. Keep the caption. */}
          <div className="photo-slot__box">Photo: ARSENAL board</div>
          <figcaption className="figure__caption">[ARC-2] Caption.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--16x9" id="arc-software">
          {/* Diagram slot "arc-software": replace the .photo-slot__box div with <img src={BASE + 'assets/arc-software.svg'} alt="..." /> (files: site/public/assets/arc-software.puml and arc-software.svg) and add a "PlantUML source" link, then rebuild. Keep the caption. */}
          <div className="photo-slot__box">Diagram: ARC software architecture (PlantUML)</div>
          <figcaption className="figure__caption">[ARC-3] Caption.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--text" id="arc-serial">
          {/* Text slot "arc-serial": replace the placeholder line in the pre block with real captured output. */}
          <pre>{`No capture yet.`}</pre>
          <figcaption className="figure__caption">[ARC-4] Caption.</figcaption>
        </figure>
        <h2 id="arc-title" className="section__title">Case study</h2>
        <div className="case-study__block" id="role">
          <h3>My role</h3>
          <p>[ARC-5] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <ul>
            <li>[ARC-6] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[ARC-7] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[ARC-8] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ul>
        </div>
        <div className="case-study__block" id="data-path">
          <h3>Data path</h3>
          <p>[ARC-9] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <figure className="figure figure--diagram" id="arc-architecture">
            <picture>
              <source media="(max-width: 44.99875em)" srcSet={BASE + 'assets/arc-architecture-stacked.svg'} width="360" height="616" />
              <img src={BASE + 'assets/arc-architecture.svg'} width="960" height="360" alt="Block diagram of the intended ARC system architecture: sensors to I²C multiplexer to ESP32-S3 to VEX V5 Brain over half-duplex RS-485." loading="lazy" decoding="async" />
            </picture>
            <figcaption className="figure__caption">[ARC-10] Caption.</figcaption>
          </figure>
          <ol>
            <li>[ARC-11] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[ARC-12] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[ARC-13] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ol>
          <p>[ARC-14] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <div className="case-study__block" id="sensor-instances">
          <h3>Writing a sensor instance</h3>
          <p>[ARC-15] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <ol>
            <li>[ARC-16] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[ARC-17] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
            <li>[ARC-18] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
          </ol>
          <p>[ARC-19] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <pre className="code-block" tabIndex="0" role="region" aria-label="Code example"><code>{`// [ARC-20] Code example to come.`}</code></pre>
          <p>[ARC-21] Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
        </div>
        <p className="case-study__repo">Code: <a href="https://github.com/Benjamin-Elmore/ARC" rel="noopener">Benjamin-Elmore/ARC on GitHub</a>. [ARC-22] Lorem ipsum dolor sit amet.</p>
      </section>
    </>
  );
}
