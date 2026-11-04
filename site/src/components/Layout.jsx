import { Outlet } from 'react-router';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import RouteEffects from './RouteEffects.jsx';

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />
      <main id="main"><Outlet /></main>
      <Footer />
      <RouteEffects />
    </>
  );
}
