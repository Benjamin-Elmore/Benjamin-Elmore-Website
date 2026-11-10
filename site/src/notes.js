// Notes index data: one entry per note, in display order. Dates are the publish date.
export const NOTES = [
  {
    slug: 'i2c-bus-sharing',
    title: 'Sharing one I²C bus between FreeRTOS sensor tasks',
    date: '2026-11-10',
    dateText: 'November 10, 2026',
    summary: 'Why a mutex per multiplexer is not enough, and why one lock covers the whole bus.',
  },
  {
    slug: 'rs485-bring-up',
    title: 'Bringing up a half-duplex RS-485 link on the ESP32-S3',
    date: '2026-11-10',
    dateText: 'November 10, 2026',
    summary: 'Testing the receiver with a PROS packet sender, and what the serial monitor showed.',
  },
  {
    slug: 'false-status-flag',
    title: 'What a "false" status flag on the bench capture actually meant',
    date: '2026-11-10',
    dateText: 'November 10, 2026',
    summary: 'A status block that reads false next to a packet that parsed correctly.',
  },
];
