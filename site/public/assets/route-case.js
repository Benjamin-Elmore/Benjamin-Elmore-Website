/* 404 page only: send a wrong-case URL to the real one. Never redirects to the path it is already on. */
(function () {
  var B = '/Benjamin-Elmore-Website/';
  var M = {"arc":"ARC/","markettesting":"MarketTesting/","cbu-robotics":"CBU-Robotics/","in-n-out":"In-N-Out/","legoland":"LEGOLAND/","about":"About/","notes":"Notes/","gallery":"Gallery/","notes/i2c-bus-sharing":"Notes/i2c-bus-sharing/","notes/rs485-bring-up":"Notes/rs485-bring-up/","notes/false-status-flag":"Notes/false-status-flag/"};
  var p = location.pathname;
  if (p.slice(0, B.length).toLowerCase() !== B.toLowerCase()) return;
  var k = p.slice(B.length).replace(/index\.html$/, '').replace(/\/+$/, '').toLowerCase();
  var to = k === '' ? B : (Object.prototype.hasOwnProperty.call(M, k) ? B + M[k] : null);
  if (!to || p === to) return;
  location.replace(to + location.search + location.hash);
})();
