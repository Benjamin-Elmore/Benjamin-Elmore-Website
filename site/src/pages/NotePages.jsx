import { Link } from 'react-router';
import { NOTES } from '../notes.js';

function NoteShell({ slug, children }) {
  const n = NOTES.find((x) => x.slug === slug);
  return (
    <>
      <div className="page-header">
        <p><Link className="back-link" to="/Notes/">← All notes</Link></p>
        <p className="eyebrow">Note</p>
        <h1>{n.title}</h1>
        <p className="page-header__meta"><time dateTime={n.date}>{n.dateText}</time> · ARC, CBU1 VEX U Robotics</p>
      </div>
      <section className="section case-study note" aria-labelledby="note-body">
        <h2 id="note-body" className="visually-hidden">Note</h2>
        {children}
        <p className="case-study__repo">Part of the <Link to="/ARC/">ARC case study</Link>. Described at the <code>CPPDev</code> branch, commit 49d54a0.</p>
        <p className="next-project"><Link to="/Notes/">All notes →</Link></p>
      </section>
    </>
  );
}

export function NoteI2c() {
  return (
    <NoteShell slug="i2c-bus-sharing">
      <p>ARC runs one FreeRTOS task per sensor, and several sensors can sit behind I²C multiplexers on one bus. Reading a sensor behind a multiplexer takes two transactions: select the channel, then talk to the sensor. If another task selects a different channel between those two steps, the read goes to the wrong device or fails.</p>
      <p>A mutex per multiplexer does not fix this. Two tasks can hold different multiplexer locks and still share the same upstream bus, so the whole bus needs one lock, held across the select and the transfer.</p>
      <p>Where the lock lives also matters. An early version took the lock only around the read function, leaving setup and loop callbacks outside it, so a callback that touched I²C could interleave with another task's transaction. In the current design the <code>I2CBus</code> class owns the bus and its multiplexers, and every register read or write takes the held lock as an argument and is refused without it.</p>
      <p>The lock is a small RAII class, <code>LockGuard</code>. It releases the mutex when it goes out of scope, and only if it actually took the mutex, so a failed acquisition cannot release another task's lock.</p>
      <p><strong>Scope:</strong> this is a design note. The full sensor-to-V5 path has not been run on hardware.</p>
    </NoteShell>
  );
}

export function NoteRs485() {
  return (
    <NoteShell slug="rs485-bring-up">
      <p>ARC talks to the VEX V5 Brain over half-duplex RS-485: one wire pair, so only one side transmits at a time. ESP-IDF's UART driver has an RS-485 half-duplex mode that drives the transceiver's direction pin from the UART RTS line, so the firmware does not toggle it by hand.</p>
      <p>To test the receiver without the real robot, I wrote a PROS program that sends a 37-byte read request at 115200 baud once per second. When nothing arrived, the first check was the transceiver's receiver-output wiring to the ESP32 RX pin, ideally with a scope or logic analyzer.</p>
      <p>On October 28, 2026 the ESP32-S3 serial monitor showed the request received and parsed: READ header, 22-byte body, sensor ID 1, valid checksum, and both DE AD BE EF frame markers. The capture is on the <Link to="/ARC/#arc-serial">ARC page</Link>.</p>
      <p><strong>Scope:</strong> that was an isolated bench test of an earlier, read-only protocol. Configuration and reboot packets, and the full pipeline with a real sensor, are not tested on hardware.</p>
    </NoteShell>
  );
}

export function NoteFalseFlag() {
  return (
    <NoteShell slug="false-status-flag">
      <p>ARC's RS-485 parser reads one byte at a time through a state machine instead of waiting for a whole buffer. A packet is framed by the bytes DE AD BE EF and carries a checksum; the read request used in testing is 37 bytes. The parser accepts six packet types: read, a three-stage configuration sequence, reboot and failure.</p>
      <p>The October 28 bench capture shows a result that looks like a failure and is not. The status block printed <code>_validPacket</code> as false even though the packet was parsed correctly, because the receive loop clears that flag as soon as the reply is sent, before the status block prints. The fields that matter, header state, a 22-byte body, sensor ID 1 and the checksum, showed a good parse. The capture is on the <Link to="/ARC/#arc-serial">ARC page</Link>.</p>
      <p>One design choice sits next to this: a sensor with no valid reading is reported as 0xFFFF rather than its last value, so the Brain cannot mistake stale data for a current reading.</p>
      <p><strong>Scope:</strong> isolated bench test, earlier read-only version.</p>
    </NoteShell>
  );
}
