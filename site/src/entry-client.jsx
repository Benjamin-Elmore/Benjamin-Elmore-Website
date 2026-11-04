import { hydrateRoot, createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import App from './App.jsx';
import { BASE } from './routes.js';

if (/\/index\.html$/.test(location.pathname)) {
  history.replaceState(null, '', location.pathname.replace(/index\.html$/, '') + location.search + location.hash);
}

const root = document.getElementById('root');
const tree = (
  <BrowserRouter basename={BASE}>
    <App />
  </BrowserRouter>
);
if (root.querySelector('main')) hydrateRoot(root, tree);
else createRoot(root).render(tree);
