import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { BASE } from './routes.js';
import { hydration } from './hydration.js';

if (/\/index\.html$/.test(location.pathname)) {
  history.replaceState(null, '', location.pathname.replace(/index\.html$/, '') + location.search + location.hash);
}

// Give the initial entry a real router key, so it never shares the 'default' key of browser-made #frag entries.
if (!history.state || !history.state.key) {
  history.replaceState({ ...(history.state || {}), usr: null, key: Math.random().toString(36).slice(2, 10), idx: 0 }, '');
}

const root = document.getElementById('root');
const tree = (
  <BrowserRouter basename={BASE}>
    <App />
  </BrowserRouter>
);
hydration.active = !!root.querySelector('main');
if (hydration.active) hydrateRoot(root, tree);
else createRoot(root).render(tree);
