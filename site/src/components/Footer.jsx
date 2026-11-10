// Build stamp from vite.config.js: the commit this build was made from and its date (empty if git was unavailable).
const BUILD_SHA = __BUILD_SHA__;
const BUILD_DATE = __BUILD_DATE__;

export default function Footer() {
  return (
    <footer className="site-footer">
      <p>BENJAMIN ELMORE <span aria-hidden="true">/</span> CBU ROBOTICS <span aria-hidden="true">/</span> CALIFORNIA BAPTIST UNIVERSITY</p>
      <p className="site-footer__stamp">2026{BUILD_SHA && <> <span aria-hidden="true">·</span> Built from <code>{BUILD_SHA}</code></>}{BUILD_DATE && <> <span aria-hidden="true">·</span> Last updated <time dateTime={BUILD_DATE}>{BUILD_DATE}</time></>}</p>
      <p className="site-footer__links"><a href="https://github.com/Benjamin-Elmore/Benjamin-Elmore-Website" rel="noopener">Source on GitHub</a></p>
    </footer>
  );
}
