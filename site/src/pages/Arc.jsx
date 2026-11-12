import { useLayoutEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router';
import { BASE } from '../routes.js';
import CodeWindow from '../components/CodeWindow.jsx';
import { SERIAL_CAPTURE, LOCKGUARD_CODE, SENSOR_EXAMPLE_CODE } from '../codeSamples.js';
import FigTag from '../components/FigTag.jsx';

// Full URLs written out, so every URL in the bundle is one the page links to.
const BENCH_COMMIT = 'https://github.com/Benjamin-Elmore/ARC/tree/b24ce841a3a69272ea8067226672b592abb3ae8f';
const DESCRIBED_COMMIT = 'https://github.com/Benjamin-Elmore/ARC/tree/49d54a0584fecc4dd5a5edd4ad0cba9e79eb81d6';
const Commit = ({ href }) => <a className="commit-link" href={href} rel="noopener"><code>{href.slice(-40, -33)}</code></a>;

// Open state of the Technical detail section per history entry, so Back to ARC (a fresh mount) reopens it
// before RouteEffects puts back the saved scroll position.
const openByKey = new Map();

export default function Arc() {
  const { key } = useLocation();
  const technical = useRef(null);
  useLayoutEffect(() => {
    const d = technical.current;
    if (!d) return undefined;
    if (openByKey.get(key)) d.open = true;
    else if (d.open) openByKey.set(key, true); // opened by the browser for a deep link before hydration
    const onToggle = () => openByKey.set(key, d.open);
    d.addEventListener('toggle', onToggle);
    return () => d.removeEventListener('toggle', onToggle);
  }, [key]);
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <p className="eyebrow">Project 01</p>
        <h1>ARC firmware for the ARSENAL</h1>
        <p className="page-header__meta">CBU1 VEX U Robotics · C++ · ESP32-S3 · ESP-IDF</p>
        <p className="page-header__summary">ARC (ARSENAL Runtime Code) is C++ firmware for the ARSENAL, the custom sensor board of CBU1, built around a Seeed XIAO ESP32-S3. It reads I²C sensors and sends their data to the VEX V5 Brain over RS-485, and is meant to be reused from season to season. Benjamin Elmore is the sole author of the firmware. In a bench test on November 10, 2026, the V5 display recorded 59 replies and 0 bad packets.</p>
      </div>
      <section className="section case-study" aria-labelledby="arc-title">
        <figure className="figure figure--diagram" id="arc-data-path">
          <picture>
            <source media="(max-width: 44.99875em)" srcSet={BASE + 'assets/arc-architecture-stacked.svg'} width="360" height="750" />
            <img src={BASE + 'assets/arc-architecture.svg'} width="1000" height="370" alt="Data path diagram: I²C sensors to an I²C multiplexer to the ESP32-S3 running ARC firmware, then half-duplex RS-485 to the V5 Brain." loading="lazy" decoding="async" />
          </picture>
          <figcaption className="figure__caption"><FigTag id="ARC-01" />Designed data path: sensors, I²C multiplexer, ESP32-S3, then RS-485 to the V5 Brain.</figcaption>
        </figure>
        <h2 id="arc-title" className="section__title"><span aria-hidden="true">01 / </span>Overview</h2>
        <div className="case-study__block" id="arc-what">
          <h3>Operation</h3>
          <p>The sensors of the ARSENAL sit on an I²C bus, either directly or behind I²C multiplexers. Some sensors, such as the three TMP117 temperature sensors of the ARSENAL-3, are soldered onto the board; additional sensors connect through RJ9 ports. ARC runs each sensor in its own FreeRTOS task, which selects the multiplexer channel of that sensor, reads its registers and stores the latest reading. A separate RS-485 task listens for requests from the V5 Brain and answers each read request with one packet that carries the readings of the requested sensors. The Brain can also send configuration packets, which set the type and register offsets of each sensor, and a reboot command, which restores the default offsets and clears the stored readings.</p>
          <h3>Role</h3>
          <p>I am the sole author of the ARC firmware; selected definitions, such as the sensor status codes, were retained from the legacy team firmware. I co-designed the RS-485 protocol with the teammate who writes the V5 Brain software. The CBU electronics team designed the board. Development began in August 2026 in a private team repository and continues in the public ARC repository.</p>
        </div>
        <div className="case-study__block" id="arc-results">
          <h3>Verification</h3>
          <p>On November 10, 2026, the ARSENAL-3 ran ARC on the bench with its three on-board TMP117 temperature sensors while the V5 Brain polled the board over RS-485. The captured V5 display recorded 59 replies and 0 bad packets, with valid frame markers and checksums. Each packet carries a mod-256 checksum. A failed or missing read is reported as 0xFFFF for that sensor.</p>
          <figure className="photo-slot" id="arc-board">
            {/* Photo "arc-board": Ben's iPhone photo 20261111_045206199_iOS.jpg (November 10, 2026, 8:52 PM PST), resized to 1600x1200, levels and gamma lifted, metadata stripped; original in the private notes folder. */}
            <img src={BASE + 'assets/photos/arc-rs485-bench.jpg'} width="1600" height="1200" loading="lazy" decoding="async" alt="The ARSENAL-3 board, a black circuit board on pink anti-static foam with its status LEDs lit, cabled to a VEX V5 Brain labelled CBU 3. The Brain screen shows the ARC three-temperature bus test." />
            <figcaption className="figure__caption"><FigTag id="ARC-02" />The ARSENAL-3 on the bench, cabled to the V5 Brain over RS-485, November 10, 2026.</figcaption>
          </figure>
          <figure className="photo-slot" id="arc-rs485-test">
            {/* Photo "arc-rs485-test": Ben's iPhone photo 20261111_044950481_iOS.jpg (November 10, 2026, 8:49 PM PST), resized to 1600x1200, levels and gamma lifted, metadata stripped; original in the private notes folder. */}
            <img src={BASE + 'assets/photos/arc-rs485-v5-screen.jpg'} width="1600" height="1200" loading="lazy" decoding="async" alt="V5 Brain screen titled V5PacketSender, ARC three-temperature bus test: port 21 at 115200 baud, 510 sent, 59 received, 0 bad; reply OK with markers and checksum; header 82, 34-byte body, 49 bytes total; sensor IDs 2, 3 and 4 reading 27.40, 28.02 and 26.30 degrees C; and a hex dump of the reply ending in DE AD BE EF." />
            <figcaption className="figure__caption"><FigTag id="ARC-03" />The V5 Brain display during the same test, with readings from sensors 2, 3 and 4.</figcaption>
          </figure>
          <p>In October 2026, an earlier version of ARC ran on the ARSENAL-2.5 with the RS-485 link under isolated test, and a read request from the V5 Brain was received and parsed without error; the serial capture is in Technical detail.</p>
        </div>
        <div className="case-study__block" id="arc-decisions">
          <h3>Engineering decisions</h3>
          <ul>
            <li><strong>Sensor abstraction.</strong> Every sensor uses one acquisition framework, the <code>{'Sensor<N>'}</code> template. The register reads specific to a sensor are supplied by its sensor type or by a read callback, so a new sensor needs no new class. <a href="#sensor-instances">Adding a sensor</a> shows an example.</li>
            <li><strong>Shared-bus ownership.</strong> Each sensor task holds the bus mutex across multiplexer channel selection and the register transaction, so no other task can switch channels mid-read. The held lock is passed to every register read and write. <a href="#arc-lock">Bus lock</a> shows the guard class.</li>
            <li><strong>Separate communication.</strong> A dedicated RS-485 task answers V5 requests from cached readings, so requests do not wait on sensor acquisition. <a href="#data-path">Packets and configuration</a> describes the packets.</li>
          </ul>
        </div>
        <div className="case-study__repo" id="arc-source">
          <p>ARC was bench-tested at <code>CPPDev</code> <Commit href={BENCH_COMMIT} />. The class structure and code excerpts on this page come from <Commit href={DESCRIBED_COMMIT} />; the TMP117 example comes from <code>b24ce84</code>.</p>
          <p><a href="https://github.com/Benjamin-Elmore/ARC/tree/CPPDev" rel="noopener" data-umami-event="repo-arc">Benjamin-Elmore/ARC on GitHub</a></p>
        </div>
        <details className="arc-technical" id="arc-technical" ref={technical}>
          <summary>Technical detail</summary>
          <div className="case-study__block" id="arc-architecture">
            <h3>Software architecture</h3>
            <figure className="photo-slot photo-slot--diagram" id="arc-software">
              {/* Diagram "arc-software": hand-drawn SVG of Ben's PlantUML layout, updated to CPPDev 49d54a0 with a black background. */}
              <div className="diagram-frame"><img src={BASE + 'assets/arc-software-cppdev.svg'} width="2000" height="1250" loading="lazy" decoding="async" alt="ARC system architecture at the CPPDev branch, in three packages. 01 Sensor hardware: I²C sensors, reached directly or through optional I²C multiplexers. 02 ARC controller, a Seeed XIAO ESP32-S3 running ESP-IDF and FreeRTOS firmware: I2CBus provides I²C access to Sensor, which runs one task per sensor, holds sensor types and appendable offsets, and implements the RS485InterfaceSensor interface. LockGuard guards the bus mutex and is passed to register reads and writes. RS485Comm hands packets to RS485PacketComp, which dispatches read, three-stage configuration and reboot packets to RS485CommParser. An SD logger is optional and off by default. 03 Robot interface: an RS-485 transceiver links over half-duplex RS-485 to the V5 Brain, which sends read, configuration and reboot requests and receives sensor data. The read direction of the sensor-to-Brain chain was verified on the bench on November 10, 2026." /></div>
              <p className="photo-slot__link"><a href={BASE + 'assets/arc-software-cppdev.svg'}>Open full-size diagram</a></p>
              <figcaption className="figure__caption"><FigTag id="ARC-04" />ARC software architecture in three packages: sensor hardware, the ARC controller classes and the RS-485 robot interface.</figcaption>
            </figure>
          </div>
          <div className="case-study__block" id="sensor-instances">
            <h3>Adding a sensor</h3>
            <p>Adding a sensor requires no new class: a <code>{'Sensor<N>'}</code> is configured and given one read function, either directly or through its sensor type, where <code>N</code> is the number of multiplexers on its bus. Each sensor task runs at a configurable priority and reports a status code on failure, and offsets, setup callbacks and loop callbacks are appendable rather than hard-coded.</p>
            <ol>
              <li>Implement a read function that receives the sensor and the held bus lock, reads the registers of the sensor through that lock and calls <code>setReadings</code> with three 16-bit values, unless the sensor type already supplies one.</li>
              <li>Construct the <code>{'Sensor<N>'}</code> with its name, bus, I²C address and ID (1 to 15). Optional arguments follow in this order: a flag to print readings (the <code>false</code> in the example below), sensor type, multiplexer channel, task priority (default 2), setup and loop callbacks, methods, variables, offsets, a read function and an offset register.</li>
              <li>Assign a sensor type, in the constructor or with <code>SensorOffsetConfig::addOffsets</code>, to attach the offset registers of that type. At <code>b24ce84</code>, the temperature type also attaches its read function and offset register, so the example below passes no read function.</li>
              <li>Call <code>setup()</code> before starting RS-485. This registers the sensor on the bus, runs its initialization steps, registers it with the RS-485 link and starts its task. The RS-485 sensor registry is closed to changes once its task starts.</li>
            </ol>
            <figure className="photo-slot photo-slot--text" id="arc-sensor-example">
              <CodeWindow title="Example: TMP117 temperature sensor (condensed)" language="C++">{SENSOR_EXAMPLE_CODE}</CodeWindow>
              <figcaption className="figure__caption"><FigTag id="ARC-06" />Excerpts that follow one sensor: its construction and setup in <code>src/main.cpp</code>, the temperature type attaching the read function and offset register in <code>lib/Sensor/ARC_Sensor.h</code>, and the read function and offsets in <code>lib/Sensor/SensorOffsetConfig.h</code>. Omitted lines are marked <code>// ...</code>.</figcaption>
            </figure>
          </div>
          <div className="case-study__block" id="arc-lock">
            <h3>Bus lock</h3>
            <p>Because multiple sensor tasks share one I²C bus, every read executes under a lock. The RAII class below makes that lock difficult to misuse.</p>
            <figure className="photo-slot photo-slot--text" id="arc-lockguard">
              <CodeWindow title="lib/LockGuard.h (condensed)" language="C++">{LOCKGUARD_CODE}</CodeWindow>
              <figcaption className="figure__caption"><FigTag id="ARC-07" />LockGuard, condensed from <code>lib/LockGuard.h</code>.</figcaption>
            </figure>
            <p>The lock is released automatically when the guard leaves scope, and only if this guard acquired it, so a failed acquisition can never release a lock held by another task. A register read or write is refused without a held lock, and each bus error is logged with the operation that produced it. After each read, the sensor task releases the lock, runs any loop callbacks and waits 10 ms before the next cycle.</p>
          </div>
          <div className="case-study__block" id="data-path">
            <h3>Packets and configuration</h3>
            <p>A byte-level state machine parses incoming packets and accepts six packet types: read, a three-stage configuration sequence, reboot and failure. Read, configuration and reboot packets are dispatched to their own parsers. The RS-485 task answers each read request from the cached readings that the sensor tasks keep current.</p>
            <ul>
              <li>A read reply is a single packet containing two timestamps, up to 15 sensor IDs and six bytes of data per sensor, with DE AD BE EF frame markers around the checksum.</li>
              <li>Configuration runs in stages: the first packet sets the type of each sensor, the following packets carry up to three offset vectors per sensor, and the final packet writes those offsets to the registers of the sensor.</li>
              <li>A reboot request restores the default offsets of each sensor and clears its readings.</li>
            </ul>
          </div>
          <div className="case-study__block" id="arc-numbers">
            <h3>Specifications</h3>
            <table className="status-table">
              <caption>Values from the code at <code>CPPDev</code> 49d54a0</caption>
              <tbody>
                <tr><th scope="row">RS-485 UART</th><td>115200 baud, 8 data bits, no parity, 1 stop bit (8N1)</td></tr>
                <tr><th scope="row">Sensor IDs</th><td>1 to 15</td></tr>
                <tr><th scope="row">Packet types</th><td>6</td></tr>
                <tr><th scope="row">Receive buffer</th><td>128 bytes</td></tr>
                <tr><th scope="row">Sensor task delay</th><td>10 ms between cycles</td></tr>
                <tr><th scope="row">Bench read request</th><td>37 bytes (as in the serial capture below)</td></tr>
              </tbody>
            </table>
            <p>An optional SD logger records uptime and heap usage to an SD card; it is disabled by default.</p>
          </div>
          <div className="case-study__block" id="arc-serial-block">
            <h3>Serial capture, October 2026</h3>
            <figure className="photo-slot photo-slot--text" id="arc-serial">
              {/* Real capture: Ben's ESP32 monitor output, vault chat "2026-10-28 Create PROS RS485 packet sender" (the UART received: 37 block). Only the identical _lastReadBytes copy and all-zero rows 048-112 are cut. */}
              <CodeWindow title="ESP32-S3 serial monitor, October 28, 2026" language="Serial output" label="ARC serial monitor output">{SERIAL_CAPTURE}</CodeWindow>
              <figcaption className="figure__caption"><FigTag id="ARC-05" />Serial output from an earlier ARC version on the ARSENAL-2.5, October 28, 2026, with the RS-485 link under isolated test. Duplicate buffer output and all-zero rows are omitted.</figcaption>
            </figure>
            <p>The capture shows a read request from the V5 Brain received and parsed without error: READ header, 22-byte body, sensor ID 1, valid checksum and both DE AD BE EF frame markers. <code>_validPacket</code> reads false because the receive loop clears the flag as soon as the reply is sent, before the status block prints. The capture predates the configuration packets.</p>
          </div>
        </details>
        <p className="next-project"><Link to="/MarketTesting/">Next project: MarketTesting →</Link></p>
      </section>
    </>
  );
}
