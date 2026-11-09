import { Routes, Route } from 'react-router';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Arc from './pages/Arc.jsx';
import MarketTesting from './pages/MarketTesting.jsx';
import CbuRobotics from './pages/CbuRobotics.jsx';
import InNOut from './pages/InNOut.jsx';
import Legoland from './pages/Legoland.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="ARC" caseSensitive element={<Arc />} />
        <Route path="MarketTesting" caseSensitive element={<MarketTesting />} />
        <Route path="CBU-Robotics" caseSensitive element={<CbuRobotics />} />
        <Route path="In-N-Out" caseSensitive element={<InNOut />} />
        <Route path="LEGOLAND" caseSensitive element={<Legoland />} />
        <Route path="About" caseSensitive element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
