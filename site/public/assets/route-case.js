/* 404 page only: send a wrong-case URL to the real one. Never redirects to the path it is already on. */
(function () {
  var B = '/Benjamin-Elmore-Website/';
  var M = {"arc":"ARC/","markettesting":"MarketTesting/","cbu-robotics":"CBU-Robotics/","in-n-out":"In-N-Out/","legoland":"LEGOLAND/","about":"About/"};
  var p = location.pathname;
  if (p.indexOf(B) !== 0) return;
  var k = p.slice(B.length).replace(/index\.html$/, '').replace(/\/+$/, '').toLowerCase();
  if (!Object.prototype.hasOwnProperty.call(M, k)) return;
  var to = B + M[k];
  if (p === to) return;
  location.replace(to + location.search + location.hash);
})();
