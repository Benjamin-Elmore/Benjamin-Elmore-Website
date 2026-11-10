export const META = {
  home: {
    title: 'Benjamin Elmore | Software Engineer',
    description: 'Benjamin Elmore, software engineer and computer science student focused on embedded software. C++ firmware on ESP32-S3 and FreeRTOS, RS-485 communication, and machine learning in Python.',
    ogDescription: 'Software engineer and computer science student focused on embedded software. C++ firmware on ESP32-S3 and FreeRTOS, RS-485 communication, and machine learning in Python.',
  },
  arc: {
    title: 'ARC firmware for ARSENAL | Benjamin Elmore',
    description: 'Case study: ARC, C++ sensor firmware for a custom ESP32-S3 board designed to connect external sensors to a VEX V5 Brain. Role, two-way RS-485 protocol, data path and sensor integration.',
  },
  marketTesting: {
    title: 'MarketTesting | Benjamin Elmore',
    description: 'MarketTesting: an independent machine learning project with a data pipeline from CSV or yfinance data to a TensorFlow LSTM and a prediction table.',
  },
  cbuRobotics: {
    title: 'CBU1 VEX U Robotics | Benjamin Elmore',
    description: 'The roles of Benjamin Elmore on the CBU1 VEX U Robotics team at California Baptist University: Software Engineer since September 2025 and Vice President since October 2026.',
  },
  inNOut: {
    title: 'In-N-Out Burger | Benjamin Elmore',
    description: 'Benjamin Elmore has worked as an Associate at In-N-Out Burger since May 2024.',
  },
  legoland: {
    title: 'LEGOLAND California Resort | Benjamin Elmore',
    description: 'Benjamin Elmore worked as a seasonal Lifeguard at LEGOLAND California Resort from April to August 2026.',
  },
  about: {
    title: 'About | Benjamin Elmore',
    description: 'Benjamin Elmore is a computer science student at California Baptist University focused on embedded systems and machine learning software.',
  },
  gallery: {
    title: 'Gallery | Benjamin Elmore',
    description: 'Every diagram, output, code image and photo on the site of Benjamin Elmore, each with its source: the ARC and MarketTesting commits it came from, or the photo credit.',
  },
  notes: {
    title: 'Notes | Benjamin Elmore',
    description: 'Short notes on design decisions and bench results from ARC, C++ sensor firmware for an ESP32-S3 board on a VEX U robotics team.',
  },
  noteI2c: {
    title: 'Sharing one I²C bus between FreeRTOS sensor tasks | Benjamin Elmore',
    description: 'Why a mutex per I²C multiplexer is not enough when FreeRTOS sensor tasks share one bus, and how ARC locks the whole bus with an RAII guard.',
  },
  noteRs485: {
    title: 'Bringing up a half-duplex RS-485 link on the ESP32-S3 | Benjamin Elmore',
    description: 'Testing the ARC RS-485 receiver on the bench with a PROS packet sender, and what the ESP32-S3 serial monitor showed. Isolated bench test only.',
  },
  noteFalseFlag: {
    title: 'What a false status flag on the bench capture meant | Benjamin Elmore',
    description: 'A bench capture where the ARC _validPacket flag read false although the RS-485 packet parsed correctly, and why. Isolated bench test only.',
  },
  notFound: {
    title: 'Page not found | Benjamin Elmore',
    description: 'There’s no page at this address. Go to the portfolio home for Benjamin Elmore or one of the project pages.',
  },
};
