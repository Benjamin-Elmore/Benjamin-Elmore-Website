import { Link } from 'react-router';
import { BASE } from '../routes.js';
import CodeWindow from '../components/CodeWindow.jsx';
import { SERIAL_CAPTURE, LOCKGUARD_CODE } from '../codeSamples.js';
import FigTag from '../components/FigTag.jsx';

export default function Arc() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <p className="eyebrow">Project 01</p>
        <h1>ARC firmware for ARSENAL</h1>
        <p className="page-header__meta">CBU1 VEX U Robotics · C++ · ESP32-S3 · ESP-IDF</p>
        <p className="page-header__summary">ARC is a C++ firmware library for ARSENAL, the custom ESP32-S3 board of the CBU1 robotics team. It is designed to acquire data from third-party I²C sensors, deliver that data to the VEX V5 Brain over RS-485 for autonomous control, and accept configuration from the Brain, including sensor type, register offsets and reboot commands. The library is architected to persist across seasons, with the game-specific code for each year layered on top.</p>
      </div>
      <section className="section case-study" aria-labelledby="arc-title">
        <figure className="photo-slot" id="arc-board">
          {/* Photo "arc-board": Ben's iPhone photo 20261111_045206199_iOS.jpg (November 10, 2026, 8:52 PM PST), resized to 1600x1200, levels and gamma lifted, metadata stripped; original in the private notes folder. */}
          <img src={BASE + 'assets/photos/arc-rs485-bench.jpg'} width="1600" height="1200" loading="lazy" decoding="async" alt="The ARSENAL-3 board, a black circuit board on pink anti-static foam with its status LEDs lit, cabled to a VEX V5 Brain labelled CBU 3. The Brain screen shows the ARC three-temperature bus test with zero bad packets." />
          <figcaption className="figure__caption"><FigTag id="ARC-01" />ARSENAL-3 running ARC on the bench, November 10, 2026, linked to the V5 Brain over RS-485. The Brain is polling the board and showing the three temperature readings it receives.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--diagram" id="arc-software">
          {/* Diagram "arc-software": hand-drawn SVG of Ben's PlantUML layout, updated to CPPDev 49d54a0 with a black background. The original PNG (from photos/ARC_Architecture.pdf) is kept at assets/arc-software.png. */}
          <img src={BASE + 'assets/arc-software-cppdev.svg'} width="2000" height="1250" loading="lazy" decoding="async" alt="ARC system architecture at the CPPDev branch, in three packages. 01 Sensor hardware: I²C sensors, reached directly or through optional I²C multiplexers. 02 ARC controller, a Seeed XIAO ESP32-S3 running ESP-IDF and FreeRTOS firmware: I2CBus provides I²C access to Sensor, which runs one task per sensor, holds sensor types and appendable offsets, and implements the RS485InterfaceSensor interface. LockGuard guards the bus mutex and is passed to register reads and writes. RS485Comm hands packets to RS485PacketComp, which dispatches read, three-stage configuration and reboot packets to RS485CommParser. An SD logger is optional and off by default. 03 Robot interface: an RS-485 transceiver links over half-duplex RS-485 to the V5 Brain, which sends read, configuration and reboot requests and receives sensor data. The read direction of the sensor-to-Brain chain was verified on the bench on November 10, 2026, but not yet on the robot." />
          <p className="photo-slot__link"><a href={BASE + 'assets/arc-software-cppdev.svg'}>Open full-size diagram</a></p>
          <figcaption className="figure__caption"><FigTag id="ARC-02" />ARC software architecture. Each sensor runs as an independent FreeRTOS task and accesses the shared I²C bus under mutex protection. A dedicated RS-485 task services V5 Brain requests with the most recent cached readings. Design view of <code>CPPDev</code> 49d54a0.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--text" id="arc-serial">
          {/* Real capture: Ben's ESP32 monitor output, vault chat "2026-10-28 Create PROS RS485 packet sender" (the UART received: 37 block). Only the identical _lastReadBytes copy and all-zero rows 048-112 are cut. */}
          <CodeWindow title="ESP32-S3 serial monitor, October 28, 2026" language="Serial output" label="ARC serial monitor output">{SERIAL_CAPTURE}</CodeWindow>
          <figcaption className="figure__caption"><FigTag id="ARC-03" />Bench serial output from ARC, October 28, 2026, with the RS-485 link under isolated test. A read request from the V5 Brain was received and parsed without error: READ header, 22-byte body, sensor ID 1, valid checksum and both DE AD BE EF frame markers. <code>_validPacket</code> reads false because the receive loop clears the flag as soon as the reply is sent, before the status block prints. Captured before the protocol was extended to configuration packets; duplicate buffer output and all-zero rows are omitted.</figcaption>
        </figure>
        <h2 id="arc-title" className="section__title"><span aria-hidden="true">01 / </span>Overview</h2>
        <div className="case-study__block" id="arc-what">
          <h3>What it does</h3>
          <p>ARC reads I²C sensors on ARSENAL and serves their data to the V5 Brain over RS-485. The Brain can also configure ARC, including sensor types, register offsets and reboot commands. Sole committer on the public ARC repository; earlier development from August 2026 resides in the private team repository.</p>
        </div>
        <div className="case-study__block" id="arc-built">
          <h3>What was built</h3>
          <ul>
            <li><strong>Sensor template.</strong> A <code>{'Sensor<N>'}</code> template that defines each sensor as a configuration plus a single read function. Each sensor executes in a dedicated FreeRTOS task with configurable priority and reports a status code on failure. A sensor can be assigned a type, which attaches the register offsets of that type automatically; offsets and setup and loop callbacks are appendable rather than hard-coded.</li>
            <li><strong>Shared I²C bus with a lock.</strong> An <code>{'I2CBus<N>'}</code> class that owns the bus and its multiplexers, selects the channel of each sensor, and serializes access with a mutex to prevent contention between sensor tasks. Every register read and write takes the held lock as an argument and is refused without it, and each bus error is logged with the operation that produced it.</li>
            <li><strong>RS-485 protocol with 6 packet types.</strong> A half-duplex link to the V5 Brain with a byte-level state-machine parser, DE AD BE EF frame markers and checksum validation. The parser accepts six packet types (read, a three-stage configuration sequence, reboot and failure) and dispatches each to its own parser and response compiler.</li>
            <li><strong>Optional SD logger.</strong> An optional SD-card logger that records uptime and heap usage, disabled by default.</li>
          </ul>
          <p>Development began with a review of the legacy team firmware, from which selected components, such as the sensor status codes, were retained.</p>
        </div>
        <div className="case-study__block" id="arc-results">
          <h3>Results so far</h3>
          <ul>
            <li>An earlier, read-only version of the RS-485 link was verified on the bench against multiple packet formats in late October 2026, with the link under isolated test.</li>
            <li>On November 10, 2026, three TMP117 temperature sensors on ARSENAL-3 were read by the V5 Brain through ARC over RS-485, with valid frame markers and checksums and 0 bad packets. The read path ran end to end on the bench.</li>
          </ul>
        </div>
        <div className="case-study__block" id="arc-status-block">
          <h3>Status and next steps</h3>
          <table className="status-table" id="arc-status">
            <caption>Status as of the November 10, 2026 bench test (<code>CPPDev</code> b24ce84)</caption>
            <tbody>
              <tr><th scope="row">RS-485 read protocol</th><td>Verified on the bench: in isolation in late October 2026, then with live sensor data on November 10, 2026</td></tr>
              <tr><th scope="row">Configuration and reboot packets</th><td>Implemented; not yet tested on hardware</td></tr>
              <tr><th scope="row">Sensors registered at entry point</th><td>Three TMP117 temperature sensors on two I²C multiplexers, each registered with the RS-485 link</td></tr>
              <tr><th scope="row">Combined sensor and RS-485 test</th><td>Passed on the bench, November 10, 2026: three temperature sensors on ARSENAL-3 read by the V5 Brain, 0 bad packets</td></tr>
              <tr><th scope="row">Full sensor-to-V5 pipeline</th><td>Read direction verified on the bench; not yet run on the robot</td></tr>
            </tbody>
          </table>
          <p>Still to do: run the read path on the robot, and test the configuration and reboot packets on hardware.</p>
        </div>
        <div className="case-study__block" id="data-path">
          <h3>Data path</h3>
          <p>Sensor data follows a three-stage path from acquisition to the V5 Brain, and configuration follows the reverse path. On November 10, 2026, the read direction of this chain ran end to end on the bench: three temperature sensors on the ARSENAL-3 I²C bus, through ARC, over RS-485 to the V5 Brain. It has not yet run on the robot.</p>
          <figure className="figure figure--diagram" id="arc-architecture">
            <picture>
              <source media="(max-width: 44.99875em)" srcSet={BASE + 'assets/arc-architecture-stacked.svg'} width="360" height="750" />
              <img src={BASE + 'assets/arc-architecture.svg'} width="1000" height="370" alt="Data path diagram: I²C sensors to an I²C multiplexer to the ESP32-S3 running ARC firmware, then half-duplex RS-485 to the V5 Brain." loading="lazy" decoding="async" />
            </picture>
            <figcaption className="figure__caption"><FigTag id="ARC-04" />Designed data path: sensors, I²C multiplexer, ESP32-S3, then RS-485 to the V5 Brain. Read direction verified on the bench, November 10, 2026; not yet run on the robot.</figcaption>
          </figure>
          <figure className="photo-slot" id="arc-rs485-test">
            {/* Photo "arc-rs485-test": Ben's iPhone photo 20261111_044950481_iOS.jpg (November 10, 2026, 8:49 PM PST), resized to 1600x1200, levels and gamma lifted, metadata stripped; original in the private notes folder. */}
            <img src={BASE + 'assets/photos/arc-rs485-v5-screen.jpg'} width="1600" height="1200" loading="lazy" decoding="async" alt="V5 Brain screen titled V5PacketSender, ARC three-temperature bus test: port 21 at 115200 baud, 510 sent, 59 received, 0 bad; reply OK with markers and checksum; header 82, 34-byte body, 49 bytes total; turnaround 17 microseconds; sensor IDs 2, 3 and 4 reading 27.40, 28.02 and 26.30 degrees C; and a hex dump of the reply ending in DE AD BE EF." />
            <figcaption className="figure__caption"><FigTag id="ARC-05" />The V5 Brain side of the November 10 bench test. Each reply from ARC is a 49-byte packet (header 82, 34-byte body) with valid DE AD BE EF markers and checksum, carrying readings from sensors 2, 3 and 4 at about 26 to 28 °C. At this point 0 packets were bad and turnaround was 17 µs.</figcaption>
          </figure>
          <ol>
            <li>The read function of the sensor retrieves its registers over I²C and stores the result as three 16-bit values.</li>
            <li>The sensor task acquires the shared-bus lock, selects its multiplexer channel and passes the lock to the read function, which cannot access the bus without it. The task then releases the lock, runs any loop callbacks and waits 10 ms before the next cycle.</li>
            <li>On request from the V5 Brain, ARC responds with a single packet containing two timestamps, up to 15 sensor IDs and six bytes of data per sensor, terminated by frame markers and a checksum. A sensor without a valid reading is reported as 0xFFFF rather than as stale data.</li>
            <li>Configuration requests run in stages: the first sets the type of each sensor, the following packets carry up to three offset vectors per sensor, and the final packet writes those offsets to the registers of the sensor. A reboot request restores the default offsets of each sensor and clears its readings.</li>
          </ol>
        </div>
        <div className="case-study__block" id="arc-numbers">
          <h3>By the numbers</h3>
          <table className="status-table">
            <caption>Values from the code at <code>CPPDev</code> 49d54a0</caption>
            <tbody>
              <tr><th scope="row">RS-485 UART</th><td>115200 baud, 8 data bits, no parity, 1 stop bit (8N1)</td></tr>
              <tr><th scope="row">Sensor IDs</th><td>1 to 15</td></tr>
              <tr><th scope="row">Packet types</th><td>6</td></tr>
              <tr><th scope="row">Receive buffer</th><td>128 bytes</td></tr>
              <tr><th scope="row">Sensor task delay</th><td>10 ms between cycles</td></tr>
              <tr><th scope="row">Bench read request</th><td>37 bytes (as in the serial capture above)</td></tr>
            </tbody>
          </table>
        </div>
        <div className="case-study__block" id="sensor-instances">
          <h3>Adding a sensor</h3>
          <p>Adding a sensor requires no new class: a <code>{'Sensor<N>'}</code> is configured and supplied with one read function, where <code>N</code> is the number of multiplexers on its bus.</p>
          <ol>
            <li>Implement a read function that receives the sensor and the held bus lock, reads the registers of the sensor through that lock and calls <code>setReadings</code>.</li>
            <li>Construct the <code>{'Sensor<N>'}</code> with its name, bus, I²C address, ID (1 to 15), multiplexer channel, task priority and read function, plus an optional sensor type, callbacks and offsets.</li>
            <li>Assign a sensor type, in the constructor or with <code>SensorOffsetConfig::addOffsets</code>, to attach the offset registers of that type.</li>
            <li>Call <code>setup()</code> before starting RS-485. This registers the sensor on the bus, runs its initialization steps, registers it with the RS-485 link and starts its task. The RS-485 sensor registry is closed to changes once its task starts.</li>
          </ol>
          <p>Because multiple sensor tasks share one I²C bus, every read executes under a lock. The RAII class below makes that lock difficult to misuse.</p>
          <figure className="photo-slot photo-slot--text" id="arc-lockguard">
            <CodeWindow title="lib/LockGuard.h (condensed)" language="C++">{LOCKGUARD_CODE}</CodeWindow>
            <figcaption className="figure__caption"><FigTag id="ARC-06" />LockGuard, condensed from <code>lib/LockGuard.h</code> at <code>CPPDev</code> 49d54a0.</figcaption>
          </figure>
          <p>The lock is released automatically when the guard leaves scope, and only if this guard acquired it, so a failed acquisition can never release a lock held by another task.</p>
        </div>
        <p className="case-study__repo">Code: <a href="https://github.com/Benjamin-Elmore/ARC/tree/CPPDev" rel="noopener" data-umami-event="repo-arc">Benjamin-Elmore/ARC on GitHub</a>. Described at the <code>CPPDev</code> development branch, commit 49d54a0 (November 9, 2026); the default <code>main</code> branch is an earlier revision. Earlier commits are in a private team repository.</p>
        <p className="next-project"><Link to="/MarketTesting/">Next project: MarketTesting →</Link></p>
      </section>
    </>
  );
}
