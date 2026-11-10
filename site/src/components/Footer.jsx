// Build stamp from vite.config.js: the commit this build was made from and its date (empty if git was unavailable).
const BUILD_SHA = __BUILD_SHA__;
const BUILD_DATE = __BUILD_DATE__;

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>BENJAMIN ELMORE <span aria-hidden="true">/</span> CBU ROBOTICS <span aria-hidden="true">/</span> CALIFORNIA BAPTIST UNIVERSITY</p>
      <p className="site-footer__stamp">2026{BUILD_SHA && <> <span aria-hidden="true">·</span> Built from <code>{BUILD_SHA}</code></>}{BUILD_DATE && <> <span aria-hidden="true">·</span> <time dateTime={BUILD_DATE}>{BUILD_DATE}</time></>}</p>
      <p className="site-footer__credit">Photo credits: In-N-Out San Marcos, <a href="https://www.flickr.com/photos/11438926@N00/4533263851" rel="noopener">JoeInSouthernCA</a>, <a href="https://creativecommons.org/licenses/by-nd/2.0/" rel="noopener">CC BY-ND 2.0</a>. LEGOLAND California entrance, <a href="https://commons.wikimedia.org/wiki/File:Legoland_California_entrance_%285712056741%29.jpg" rel="noopener">Simon_sees</a>, <a href="https://creativecommons.org/licenses/by/2.0/" rel="noopener">CC BY 2.0</a>.</p>
    </footer>
  );
}
