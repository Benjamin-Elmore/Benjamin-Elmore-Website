import { META } from './meta.js';

export const BASE = '/Benjamin-Elmore-Website/';
export const SITE_URL = 'https://benjamin-elmore.github.io/Benjamin-Elmore-Website/';

export const ROUTES = [
  { path: '/', file: 'index.html', meta: META.home },
  { path: '/ARC/', file: 'ARC/index.html', meta: META.arc, arc: true },
  { path: '/MarketTesting/', file: 'MarketTesting/index.html', meta: META.marketTesting },
  { path: '/CBU-Robotics/', file: 'CBU-Robotics/index.html', meta: META.cbuRobotics },
  { path: '/In-N-Out/', file: 'In-N-Out/index.html', meta: META.inNOut },
  { path: '/LEGOLAND/', file: 'LEGOLAND/index.html', meta: META.legoland },
  { path: '/About/', file: 'About/index.html', meta: META.about },
  { path: '/Notes/', file: 'Notes/index.html', meta: META.notes },
  { path: '/Notes/i2c-bus-sharing/', file: 'Notes/i2c-bus-sharing/index.html', meta: META.noteI2c },
  { path: '/Notes/rs485-bring-up/', file: 'Notes/rs485-bring-up/index.html', meta: META.noteRs485 },
  { path: '/Notes/false-status-flag/', file: 'Notes/false-status-flag/index.html', meta: META.noteFalseFlag },
];

export const NOT_FOUND = { path: null, file: '404.html', meta: META.notFound, notFound: true, script: 'route-case.js' };

export function routeFor(pathname) {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  return ROUTES.find((r) => r.path === p) || NOT_FOUND;
}
