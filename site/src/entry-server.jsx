import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import App from './App.jsx';
import { BASE } from './routes.js';

export function render(url) {
  return renderToString(
    <StaticRouter basename={BASE} location={BASE + url.replace(/^\//, '')}>
      <App />
    </StaticRouter>
  );
}

export { ROUTES, NOT_FOUND } from './routes.js';
export { headTags, arcLink, scriptTag } from './head.js';
