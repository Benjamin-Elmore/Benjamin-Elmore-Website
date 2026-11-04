// Fills the built index.html once per route. Node built-ins only; LF output; no timestamps.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = resolve(root, process.env.SITE_OUT_DIR || '../docs');
const fail = (msg) => { console.error('prerender: ' + msg); process.exit(1); };

const template = readFileSync(join(out, 'index.html'), 'utf8').replace(/\r\n/g, '\n');
const slots = ['<!--app-head-->', '<!--app-css-->', '<!--app-script-->', '<!--app-html-->'];
for (const s of slots) if (template.split(s).length !== 2) fail(`placeholder ${s} must appear exactly once`);
const bundles = template.match(/<script type="module"[^>]*src="[^"]*assets\/app-[^"]+\.js"/g) || [];
if (bundles.length !== 1) fail('expected exactly one assets/app-*.js module script');

const { render, ROUTES, NOT_FOUND, headTags, arcLink, scriptTag } = await import(pathToFileURL(join(root, '.ssr', 'entry-server.js')).href);

for (const route of [...ROUTES, NOT_FOUND]) {
  const html = render(route.path || '/__not-found__/');
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${route.file}: need exactly one h1`);
  if (!/<main id="main">\s*\S/.test(html)) fail(`${route.file}: main#main is empty`);
  const page = template
    .replace('<!--app-head-->', () => headTags(route))
    .replace('<!--app-css-->', () => arcLink(route))
    .replace('<!--app-script-->', () => scriptTag(route))
    .replace('<!--app-html-->', () => html);
  const file = join(out, route.file);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
  console.log('wrote ' + route.file);
}
if (!existsSync(join(out, '.nojekyll'))) fail('.nojekyll missing');
