import { Link } from 'react-router';
import { BASE } from '../routes.js';
import CodeWindow from '../components/CodeWindow.jsx';

export default function Arc() {
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/#work">← All work</Link></p>
        <p className="eyebrow">Project 01</p>
        <h1>ARC firmware for ARSENAL</h1>
        <p className="page-header__meta">CBU1 VEX U Robotics · C++ · ESP32-S3 · ESP-IDF</p>
        <p className="page-header__summary">ARC is a C++ firmware library for ARSENAL, the CBU1 robotics team's custom ESP32-S3 board. It is designed to acquire data from third-party I²C sensors and deliver that data to the VEX V5 Brain over RS-485 for autonomous control. The library is architected to persist across seasons, with each year's game-specific code layered on top.</p>
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
          <figcaption className="figure__caption">ARC software architecture. Each sensor runs as an independent FreeRTOS task and accesses the shared I²C bus under mutex protection. A dedicated RS-485 task services V5 Brain requests with the most recent cached readings.</figcaption>
        </figure>
        <figure className="photo-slot photo-slot--text" id="arc-serial">
          {/* Real capture: Ben's ESP32 monitor output, vault chat "2026-10-28 Create PROS RS485 packet sender" (the UART received: 37 block). Only the identical _lastReadBytes copy and all-zero rows 048-112 are cut. */}
          <CodeWindow title="ESP32-S3 serial monitor, October 28, 2026" language="Serial output" label="ARC serial monitor output">{`=== SERIAL STATUS ===
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
UART received: 37`}</CodeWindow>
          <figcaption className="figure__caption">Bench serial output from ARC, October 28, 2026, with the RS-485 link under isolated test. A read request from the V5 Brain was received and parsed without error: READ header, 22-byte body, sensor ID 1, valid checksum and both DE AD BE EF frame markers. Duplicate buffer output and all-zero rows are omitted.</figcaption>
        </figure>
        <h2 id="arc-title" className="section__title"><span aria-hidden="true">01 / </span>Case study</h2>
        <div className="case-study__block" id="role">
          <h3>Role</h3>
          <p>Sole committer on the public ARC repository; earlier development from August 2026 resides in the team's private repository. Development began with a review of the team's legacy firmware, from which selected components, such as the sensor status codes, were retained.</p>
          <ul>
            <li><strong>Sensor abstraction.</strong> A <code>{'Sensor<N>'}</code> template that defines each sensor as a configuration plus a single read function. Each sensor executes in a dedicated FreeRTOS task with configurable priority and reports a status code on failure.</li>
            <li><strong>Shared I²C bus.</strong> An <code>{'I2CBus<N>'}</code> class that owns the bus and its multiplexers, selects each sensor's channel, and serializes access with a mutex to prevent contention between sensor tasks.</li>
            <li><strong>RS-485 protocol.</strong> A half-duplex link to the V5 Brain with a byte-level state-machine parser, DE AD BE EF frame markers and checksum validation. Verified on the bench against multiple packet formats in late October 2026.</li>
          </ul>
        </div>
        <div className="case-study__block" id="data-path">
          <h3>Data path</h3>
          <p>Sensor data follows a three-stage path from acquisition to the V5 Brain. This is the designed path; as of November 2026, the complete chain has not yet been verified end to end on the robot.</p>
          <figure className="figure figure--diagram" id="arc-architecture">
            <picture>
              <source media="(max-width: 44.99875em)" srcSet={BASE + 'assets/arc-architecture-stacked.svg'} width="360" height="616" />
              <img src={BASE + 'assets/arc-architecture.svg'} width="960" height="360" alt="Block diagram of the intended ARC system architecture: sensors to I²C multiplexer to ESP32-S3 to VEX V5 Brain over half-duplex RS-485." loading="lazy" decoding="async" />
            </picture>
            <figcaption className="figure__caption">Designed data path: sensors, I²C multiplexer, ESP32-S3, then RS-485 to the V5 Brain.</figcaption>
          </figure>
          <ol>
            <li>The sensor's read function retrieves its registers over I²C and stores the result as three 16-bit values.</li>
            <li>The sensor task acquires the shared-bus lock, selects its multiplexer channel, performs the read, releases the lock and waits 10 ms before the next cycle.</li>
            <li>On request from the V5 Brain, ARC responds with a single packet containing two timestamps, up to 15 sensor IDs and six bytes of data per sensor, terminated by a checksum.</li>
          </ol>
          <p>Current status: the RS-485 protocol has been verified on the bench in isolation. Next steps are verification of I²C sensor reads and of the full pipeline on hardware.</p>
        </div>
        <div className="case-study__block" id="sensor-instances">
          <h3>Adding a sensor</h3>
          <p>Adding a sensor requires no new class: a <code>{'Sensor<N>'}</code> is configured and supplied with one read function, where <code>N</code> is the number of multiplexers on its bus.</p>
          <ol>
            <li>Implement a read function that reads the sensor's registers and calls <code>setReadings</code>.</li>
            <li>Construct the <code>{'Sensor<N>'}</code> with its name, bus, I²C address, ID, multiplexer channel, task priority and read function.</li>
            <li>Call <code>setup()</code> before starting RS-485. This registers the sensor on the bus, runs its initialization steps, registers it with the RS-485 link and starts its task.</li>
          </ol>
          <p>Because multiple sensor tasks share one I²C bus, every read executes under a lock. The RAII class below makes that lock difficult to misuse.</p>
          <CodeWindow title="lib/LockGuard.h (excerpt, ARC @ 7efb1f6)" language="C++">{`class LockGuard {
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
};`}</CodeWindow>
          <p>The lock is released automatically when the guard leaves scope, and only if this guard acquired it, so a failed acquisition can never release a lock held by another task. On a memory-constrained microcontroller such as the ESP32-S3, small and predictable components of this kind are essential.</p>
        </div>
        <p className="case-study__repo">Code: <a href="https://github.com/Benjamin-Elmore/ARC" rel="noopener">Benjamin-Elmore/ARC on GitHub</a>. Described at <code>main</code> 7efb1f6. Earlier commits are in a private team repository.</p>
      </section>
    </>
  );
}
