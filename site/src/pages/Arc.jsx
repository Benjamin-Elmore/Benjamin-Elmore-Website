import { Link } from 'react-router';
import { BASE } from '../routes.js';

export default function Arc() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <p className="eyebrow">Project 01</p>
        <h1>ARC firmware for ARSENAL</h1>
        <p className="page-header__meta">CBU1 VEX U Robotics · C++ · ESP32-S3 · ESP-IDF</p>
        <p className="page-header__summary">ARC is the C++ firmware library I'm writing for ARSENAL, my robotics team's custom ESP32-S3 board. It reads sensors VEX doesn't make over I²C and is built to hand their data to the VEX V5 Brain over RS-485 for autonomous control. It's meant to outlast a single season, with each year's game-specific code built on top of it.</p>
      </div>
      <section className="section case-study" aria-labelledby="arc-title">
        <figure className="photo-slot" id="arc-board">
          {/* Photo slot "arc-board": replace the .photo-slot__box div with <img src={BASE + 'assets/photos/arc-board.jpg'} alt="..." width="..." height="..." /> (file: site/public/assets/photos/arc-board.jpg), then rebuild. Keep the caption. */}
          <div className="photo-slot__box">Photo: ARSENAL board</div>
          <figcaption className="figure__caption">The ARSENAL hardware, which ARC runs on.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--diagram" id="arc-software">
          {/* Diagram "arc-software": PNG extracted at native size (2754x1692) from Ben's site/public/assets/photos/ARC_Architecture.pdf. Click or tap zooms it (Lightbox); the link opens the full image for small screens. */}
          <img src={BASE + 'assets/arc-software.png'} width="2754" height="1692" loading="lazy" decoding="async" alt="ARC system architecture. Sensor hardware: I²C sensors, through optional I²C muxes. ARC controller, a Seeed XIAO ESP32-S3 running ESP-IDF / FreeRTOS firmware: I2CBus handles the device registry, mux selection and register reads and writes; one Sensor task per sensor caches readings and offsets; RS485Comm runs the sensor ID registry, the receive state machine and packet validation. A LockGuard and bus mutex protect mux selection and sensor transfers, and sensors implement the RS485InterfaceSensor interface (getID, getReadings, setOffsets). Robot interface: an RS-485 transceiver on UART1 links over half-duplex RS-485 to the VEX V5 Brain, which sends requests and configuration and receives sensor data." />
          <p className="photo-slot__link"><a href={BASE + 'assets/arc-software.png'}>Open full-size diagram</a></p>
          <figcaption className="figure__caption">How ARC's software fits together. Each sensor runs in its own task and shares one I²C bus through a lock. A separate RS-485 task answers the V5 Brain with the latest stored readings.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--text" id="arc-serial">
          {/* Real capture: Ben's ESP32 monitor output, vault chat "2026-10-28 Create PROS RS485 packet sender" (the UART received: 37 block). Only the identical _lastReadBytes copy and all-zero rows 048-112 are cut. */}
          <pre>{`=== SERIAL STATUS ===
_status: ESP_OK (0)
_isFirstRead: false
_validPacket: false
_currentPacketState: WAITING_FOR_HEADER (0)
_packetLength: 22 body bytes
_timeSinceLastReceive: 0
_timeOfSending: 164438584
_packet [full buffer] (128 bytes, hex):
  000: 80 00 16 00 00 00 00 09 CD 22 38 10 00 00 00 00
  016: 00 00 00 00 00 00 00 00 00 DE AD BE EF 00 00 00
  032: 40 DE AD BE EF 00 00 00 00 00 00 00 00 00 00 00
  ... (rows 048-112: all 00)
_sensorIDS (slot order): 1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0
=====================
UART received: 37`}</pre>
          <figcaption className="figure__caption">Serial output from ARC on the bench, October 28, 2026, with ARC's RS-485 link running alone. A read request from the V5 Brain arrived and parsed cleanly: READ header, 22-byte body, sensor ID 1, a correct checksum and both DE AD BE EF markers. The repeated buffer and the all-zero rows are trimmed.</figcaption>
        </figure>
        <h2 id="arc-title" className="section__title"><span aria-hidden="true">01 / </span>Case study</h2>
        <div className="case-study__block" id="role">
          <h3>My role</h3>
          <p>I'm the only committer on the public ARC repository, and my earlier work from August 2026 is in the team's private repository. Before starting, I studied the team's earlier firmware and carried over a few pieces from it, like the sensor status codes.</p>
          <ul>
            <li><strong>Sensor abstraction.</strong> A <code>{'Sensor<N>'}</code> template where each sensor is a configuration plus one read function. Each sensor runs in its own FreeRTOS task with an adjustable priority and reports a status code when something fails.</li>
            <li><strong>Shared I²C bus.</strong> An <code>{'I2CBus<N>'}</code> class that owns the bus and its multiplexers, selects each sensor's channel, and guards the bus with a mutex so sensor tasks don't collide.</li>
            <li><strong>RS-485 protocol.</strong> A half-duplex link to the V5 Brain with a byte-by-byte parser, escape sequences and a checksum. It parsed several packet formats on the bench in late October 2026.</li>
          </ul>
        </div>
        <div className="case-study__block" id="data-path">
          <h3>Data path</h3>
          <p>A reading moves from the sensor to the V5 Brain in three steps. This is the designed path. As of November 2026, the full chain hasn't been run end to end on the robot.</p>
          <figure className="figure figure--diagram" id="arc-architecture">
            <picture>
              <source media="(max-width: 44.99875em)" srcSet={BASE + 'assets/arc-architecture-stacked.svg'} width="360" height="616" />
              <img src={BASE + 'assets/arc-architecture.svg'} width="960" height="360" alt="Block diagram of the intended ARC system architecture: sensors to I²C multiplexer to ESP32-S3 to VEX V5 Brain over half-duplex RS-485." loading="lazy" decoding="async" />
            </picture>
            <figcaption className="figure__caption">The designed data path: sensors, an I²C multiplexer, the ESP32-S3, then RS-485 to the V5 Brain.</figcaption>
          </figure>
          <ol>
            <li>The sensor's read function pulls its registers over I²C and stores the result as three 16-bit values.</li>
            <li>The sensor's task locks the shared bus, selects its multiplexer channel, reads, releases the lock, then waits 10 ms before the next read.</li>
            <li>When the V5 Brain sends a request, ARC replies with one packet: two timestamps, the IDs of up to 15 sensors, and six bytes of data per sensor, closed by a checksum.</li>
          </ol>
          <p>So far, the RS-485 protocol has been checked on the bench on its own. Next is validating the I²C sensor reads and the full pipeline on real hardware.</p>
        </div>
        <div className="case-study__block" id="sensor-instances">
          <h3>Writing a sensor instance</h3>
          <p>Adding a sensor doesn't need a new class. You configure a <code>{'Sensor<N>'}</code> and give it one read function, where <code>N</code> is the number of multiplexers on its bus.</p>
          <ol>
            <li>Write a read function that reads the sensor's registers and calls <code>setReadings</code>.</li>
            <li>Construct the <code>{'Sensor<N>'}</code> with its name, bus, I²C address, ID, multiplexer channel, task priority and read function.</li>
            <li>Call <code>setup()</code> before starting RS-485. It adds the sensor to the bus, runs its setup steps, registers it with the RS-485 link and starts its task.</li>
          </ol>
          <p>Several sensor tasks share one I²C bus, so every read happens under a lock. This small class makes that lock hard to misuse.</p>
          <pre className="code-block" tabIndex="0" role="region" aria-label="Code example"><code>{`// lib/LockGuard.h (excerpt, Benjamin-Elmore/ARC @ 7efb1f6)
class LockGuard {
public:
    explicit LockGuard(SemaphoreHandle_t& mutex) : _mutexReference(mutex) {
        if (_mutexReference != nullptr &&
            xSemaphoreTake(_mutexReference, portMAX_DELAY) != pdFALSE) {
            _isLockedByLockGuard = true;
        }
    }
    // Releases only if this guard took the mutex.
    ~LockGuard() noexcept {
        if (_isLockedByLockGuard) xSemaphoreGive(_mutexReference);
    }
    LockGuard(const LockGuard&) = delete;
    LockGuard& operator=(const LockGuard&) = delete;
    bool isMutexLocked() { return _isLockedByLockGuard; }
private:
    SemaphoreHandle_t& _mutexReference;
    bool _isLockedByLockGuard = false;
};`}</code></pre>
          <p>The lock is released when the guard goes out of scope, and only if this guard took it, so a failed attempt can never release a lock another task holds. The ESP32-S3 doesn't have much memory to spare, so small, predictable pieces like this matter.</p>
        </div>
        <p className="case-study__repo">Code: <a href="https://github.com/Benjamin-Elmore/ARC" rel="noopener">Benjamin-Elmore/ARC on GitHub</a>. Described at <code>main</code> 7efb1f6. Earlier commits are in a private team repository.</p>
      </section>
    </>
  );
}
