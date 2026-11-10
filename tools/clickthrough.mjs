// Click-through test in headless Edge/Chrome over CDP. Node 22+ built-ins only (global WebSocket and fetch).
//   node tools/clickthrough.mjs --browser "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --profile <empty dir> [--root docs]
//   add --shots <fresh docs dir> [--out <dir>] to shoot hover/indicator/open-details states of both builds instead (A4).
// Starts tools/pages_server.py on a free port, prints PASS or FAIL per step, exits 1 on any FAIL.
import { spawn, spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).reduce((a, x, i, all) => (x.startsWith('--') ? [...a, [x.slice(2), all[i + 1]]] : a), []));
const here = dirname(fileURLToPath(import.meta.url));
const repo = resolve(here, '..');
const root = resolve(repo, args.root || 'docs');
const browser = args.browser || process.env.BROWSER;
if (!browser) { console.error('usage: --browser <exe> --profile <dir> [--root docs]'); process.exit(2); }
const profile = args.profile ? resolve(args.profile) : mkdtempSync(join(tmpdir(), 'clickthrough-'));
mkdirSync(profile, { recursive: true });

const BASE = '/Benjamin-Elmore-Website/';
const SITE_URL = 'https://benjamin-elmore.github.io' + BASE;
const PAGES = ['', 'ARC/', 'MarketTesting/', 'CBU-Robotics/', 'In-N-Out/', 'LEGOLAND/', 'About/', 'Notes/', 'Notes/i2c-bus-sharing/', 'Notes/rs485-bring-up/', 'Notes/false-status-flag/'];
async function get(url) {  // fetch without following redirects, body always drained
  const r = await fetch(url, { redirect: 'manual' });
  await r.arrayBuffer();
  return r;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// scrollY on the next painted frame: route scrolls must be instant, so there is no waiting for them to settle.
const FRAME_Y = 'new Promise(r=>requestAnimationFrame(()=>r(scrollY)))';

const children = [];
function kill(c) {
  try { process.platform === 'win32' ? spawnSync('taskkill', ['/pid', String(c.pid), '/T', '/F']) : c.kill('SIGKILL'); } catch {}
}
let failures = 0;
function report(step, ok, detail = '') {
  if (!ok) failures++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${step}${detail && !ok ? ' - ' + detail : ''}`);
}
async function step(name, fn) {
  try { const r = await fn(); report(name, r === undefined || r === true, typeof r === 'string' ? r : ''); }
  catch (e) { report(name, false, e.message); }
}
const check = (cond, msg) => { if (!cond) throw new Error(msg); };

async function startServer(dir = root) {
  const py = spawn(process.platform === 'win32' ? 'python' : 'python3', [join(here, 'pages_server.py'), '--root', dir, '--port', '0'], { stdio: ['ignore', 'pipe', 'inherit'] });
  children.push(py);
  const url = await new Promise((res, rej) => {
    py.on('error', rej);
    py.on('exit', (c) => rej(new Error('server exited ' + c)));
    py.stdout.on('data', (d) => { const m = /listening (http:\/\/\S+)/.exec(String(d)); if (m) res(m[1]); });
  });
  return url;
}

async function startBrowser() {
  const proc = spawn(browser, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run',
    '--no-default-browser-check', '--disable-gpu', '--window-size=1280,900', 'about:blank'], { stdio: 'ignore' });
  children.push(proc);
  for (let i = 0; i < 100; i++) {
    try {
      const [port] = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n');
      if (port) return Number(port);
    } catch {}
    await sleep(100);
  }
  throw new Error('browser did not start');
}

class Tab {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.errors = []; }
  static async open(port) {
    const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(t.webSocketDebuggerUrl);
    await new Promise((res, rej) => { ws.onopen = res; ws.onerror = () => rej(new Error('ws failed')); });
    const tab = new Tab(ws);
    ws.onmessage = (m) => tab.onMessage(JSON.parse(m.data));
    for (const d of ['Page', 'Runtime', 'Log']) await tab.send(d + '.enable');
    await tab.send('Page.addScriptToEvaluateOnNewDocument', { source:
      "document.addEventListener('DOMContentLoaded',function(){window.__dclTheme=document.documentElement.getAttribute('data-theme')})" });
    return tab;
  }
  onMessage(m) {
    if (m.id && this.pending.has(m.id)) {
      const { res, rej } = this.pending.get(m.id); this.pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
    } else if (m.method === 'Runtime.consoleAPICalled' && ['error', 'warning', 'assert'].includes(m.params.type)) {
      this.errors.push('console.' + m.params.type + ': ' + m.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 300));
    } else if (m.method === 'Runtime.exceptionThrown') {
      this.errors.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).slice(0, 300));
    } else if (m.method === 'Log.entryAdded' && m.params.entry.source !== 'network' && ['error', 'warning'].includes(m.params.entry.level)) {
      this.errors.push('log: ' + m.params.entry.text.slice(0, 300));
    }
  }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((res, rej) => {
      const timer = setTimeout(() => { this.pending.delete(id); rej(new Error(method + ' timed out')); }, 30000);
      this.pending.set(id, { res: (v) => { clearTimeout(timer); res(v); }, rej: (e) => { clearTimeout(timer); rej(e); } });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  async eval(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
    return r.result.value;
  }
  async until(expr, what, ms = 8000) {
    const end = Date.now() + ms;
    while (Date.now() < end) { try { if (await this.eval(expr)) return; } catch {} await sleep(50); }
    throw new Error('timed out waiting for ' + what);
  }
  async goto(url, ready = "document.readyState==='complete'") {
    await this.send('Page.navigate', { url });
    await sleep(50);
    await this.until(ready, 'load of ' + url);
  }
}

const SETTLE = "document.readyState==='complete' && !!document.querySelector('main h1')";
const q = {
  path: 'location.pathname',
  click: (href) => `(()=>{const a=[...document.querySelectorAll('main a, header a, nav a')].find(x=>x.getAttribute('href')===${JSON.stringify(href)});if(!a)throw new Error('no link '+${JSON.stringify(href)});a.click();return true})()`,
  clickText: (t) => `(()=>{const a=[...document.querySelectorAll('a')].find(x=>x.textContent.includes(${JSON.stringify(t)}));if(!a)throw new Error('no link text '+${JSON.stringify(t)});a.click();return true})()`,
  inView: (id) => `(()=>{const e=document.getElementById(${JSON.stringify(id)});if(!e)return false;const r=e.getBoundingClientRect();return r.top<innerHeight&&r.bottom>0})()`,
  arcMedia: "(document.querySelector('link[data-arc]')||{}).media||''",
  canonical: "(document.querySelector('link[rel=canonical]')||{}).href||''",
};

async function main() {
  const server = await startServer();
  const port = await startBrowser();
  const tab = await Tab.open(port);
  await tab.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  const url = (p) => server + BASE + p;
  const consoleProblems = tab.errors; // all console problems across the run are checked in K12

  // K1 home loads
  await step('K1 home loads', async () => {
    await tab.goto(url(''), SETTLE);
    check(await tab.eval(q.path) === BASE, 'path ' + await tab.eval(q.path));
    check(await tab.eval("document.querySelector('main h1').textContent.trim().length>0"), 'no h1');
    await tab.eval('window.__marker=1');
  });

  const homeTitle = await tab.eval('document.title').catch(() => '');
  let homeScroll = 0;
  async function openFromHome(name, href, expectPath, arc) {
    await step(name, async () => {
      await tab.eval("window.scrollTo({top:300,behavior:'instant'})");
      await sleep(150);
      homeScroll = await tab.eval('scrollY');
      await tab.eval(q.click(href));
      await tab.until(`location.pathname===${JSON.stringify(BASE + expectPath)} && (document.querySelector('link[rel=canonical]')||{}).href===${JSON.stringify(SITE_URL + expectPath)}`, 'route change');
      const y0 = await tab.eval(FRAME_Y);
      check(y0 === 0, 'not at 0 on first frame (scrollY ' + y0 + ')');
      await tab.until("!!document.querySelector('main h1')", 'h1');
      check(await tab.eval('window.__marker') === 1, 'page reloaded (marker lost)');
      check(await tab.eval('document.title') !== homeTitle, 'title unchanged');
      check(await tab.eval(q.canonical) === SITE_URL + expectPath, 'canonical ' + await tab.eval(q.canonical));
      const media = await tab.eval(q.arcMedia);
      check(arc ? media !== 'not all' : media === 'not all', `arc.css media "${media}"`);
    });
  }
  async function back(name) {
    await step(name, async () => {
      await tab.eval('history.back()');
      await tab.until(`location.pathname===${JSON.stringify(BASE)} && document.title===${JSON.stringify(homeTitle)}`, 'back to home');
      const y = await tab.eval(FRAME_Y);
      check(await tab.eval('window.__marker') === 1, 'page reloaded (marker lost)');
      check(Math.abs(y - homeScroll) <= 5, `scrollY ${y}, expected ${homeScroll}`);
      check(await tab.eval('document.title') === homeTitle, 'home title not restored');
    });
  }

  await openFromHome('K2 home -> ARC (no reload, head, arc.css, scroll 0)', BASE + 'ARC/', 'ARC/', true);
  await back('K3 back -> home at the old scroll');
  await step('K3c ARC skip link lands on main; Back twice keeps ARC at 0 and the home scroll', async () => {
    await tab.eval("window.scrollTo({top:300,behavior:'instant'})");
    await sleep(150);
    homeScroll = await tab.eval('scrollY');
    await tab.eval(q.click(BASE + 'ARC/'));
    await tab.until(`location.pathname===${JSON.stringify(BASE + 'ARC/')} && !!document.querySelector('link[data-arc]:not([media])')`, 'ARC');
    check(await tab.eval(FRAME_Y) === 0, 'ARC not at 0 on first frame');
    await sleep(150);
    await tab.eval("document.querySelector('a.skip-link').click()");
    await tab.until("location.hash==='#main'", '#main');
    await sleep(300);
    const top = await tab.eval("document.getElementById('main').getBoundingClientRect().top");
    check(top >= 0 && top <= 80, 'main.top ' + top);
    await tab.eval('history.back()');
    await tab.until("location.hash===''", 'back to ARC');
    const arcY = await tab.eval(FRAME_Y);
    check(await tab.eval(`location.pathname===${JSON.stringify(BASE + 'ARC/')}`), 'not on ARC');
    check(arcY === 0, 'ARC scrollY ' + arcY);
    await tab.eval('history.back()');
    await tab.until(`location.pathname===${JSON.stringify(BASE)} && document.title===${JSON.stringify(homeTitle)}`, 'back to home');
    const y = await tab.eval(FRAME_Y);
    check(Math.abs(y - homeScroll) <= 5, `home scrollY ${y}, expected ${homeScroll}`);
  });
  await openFromHome('K4 home -> MarketTesting', BASE + 'MarketTesting/', 'MarketTesting/', false);
  await back('K4b back -> home at the old scroll');
  await openFromHome('K5 home -> CBU-Robotics', BASE + 'CBU-Robotics/', 'CBU-Robotics/', false);
  await back('K5b back -> home at the old scroll');
  for (const id of ['vice-president', 'software-engineer']) {
    await step(`K5 home -> CBU-Robotics/#${id}`, async () => {
      await tab.eval(q.click(BASE + 'CBU-Robotics/#' + id));
      await tab.until(`location.pathname===${JSON.stringify(BASE + 'CBU-Robotics/')} && location.hash==='#${id}'`, 'route and hash');
      await tab.until(q.inView(id), `#${id} in view`);
      check(await tab.eval('window.__marker') === 1, 'page reloaded');
      await tab.eval('history.back()');
      await tab.until(`location.pathname===${JSON.stringify(BASE)}`, 'back');
    });
  }
  for (const [name, href] of [['In-N-Out', 'In-N-Out/'], ['LEGOLAND', 'LEGOLAND/'], ['About link', 'About/']]) {
    await step(`K6 home -> ${name}`, async () => {
      await tab.eval(q.click(BASE + href));
      await tab.until(`location.pathname===${JSON.stringify(BASE + href)}`, 'route change');
      await tab.until("!!document.querySelector('main h1')", 'h1');
      check(await tab.eval('window.__marker') === 1, 'page reloaded');
      await tab.eval('history.back()');
      await tab.until(`location.pathname===${JSON.stringify(BASE)}`, 'back');
    });
  }
  await step('K6b home nav #experience then #contact scrolls to each', async () => {
    await tab.eval("window.scrollTo({top:0,behavior:'instant'})");
    await sleep(150);
    await tab.eval(q.click('#experience'));
    await tab.until(q.inView('experience'), '#experience in view', 3000);
    await sleep(300);
    await tab.eval(q.click('#contact'));
    await tab.until("location.hash==='#contact'", '#contact hash');
    await sleep(300);
    check(await tab.eval(q.inView('contact')), '#contact not in view (scrollY ' + await tab.eval('scrollY') + ')');
  });
  await step('K6c home #work click, scroll, Vice President row, Back keeps the scroll', async () => {
    await tab.goto(url(''), SETTLE);
    await tab.eval('window.__marker=1');  // K7 below checks this marker too
    await tab.eval(q.click('#work'));
    await tab.until("location.hash==='#work'", '#work hash');
    await sleep(300);
    await tab.eval("scrollTo({top:1100,behavior:'instant'})");
    await sleep(150);
    const saved = await tab.eval('scrollY');
    await tab.eval(q.click(BASE + 'CBU-Robotics/#vice-president'));
    await tab.until(`location.pathname===${JSON.stringify(BASE + 'CBU-Robotics/')} && location.hash==='#vice-president'`, 'route');
    await tab.eval('history.back()');
    await tab.until(`location.pathname===${JSON.stringify(BASE)} && location.hash==='#work' && document.title===${JSON.stringify(homeTitle)}`, 'back to home #work');
    const y = await tab.eval(FRAME_Y);
    check(await tab.eval('window.__marker') === 1, 'page reloaded (marker lost)');
    check(Math.abs(y - saved) <= 5, `scrollY ${y}, expected ${saved}`);
  });
  await step('K7 subpage nav "Experience" -> /#experience, "All work" -> /#work', async () => {
    await tab.eval(q.click(BASE + 'ARC/'));
    await tab.until(`location.pathname===${JSON.stringify(BASE + 'ARC/')}`, 'ARC');
    await tab.eval(q.clickText('Experience'));
    await tab.until(`location.pathname===${JSON.stringify(BASE)} && location.hash==='#experience'`, '/#experience');
    await tab.until(q.inView('experience'), '#experience in view');
    await tab.eval(q.click(BASE + 'ARC/'));
    await tab.until(`location.pathname===${JSON.stringify(BASE + 'ARC/')}`, 'ARC again');
    await tab.eval(q.clickText('All work'));
    await tab.until(`location.pathname===${JSON.stringify(BASE)} && location.hash==='#work'`, '/#work');
    await tab.until(q.inView('work'), '#work in view');
    check(await tab.eval('window.__marker') === 1, 'page reloaded');
  });
  await step('K7b keyboard: Enter on the ARC row, then Tab goes to the skip link', async () => {
    const key = async (k, code, vk, text) => {
      await tab.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, ...(text ? { text } : {}) });
      await tab.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk });
    };
    await tab.goto(url(''), SETTLE);
    await tab.eval('window.__marker=3');
    let hit = false;
    for (let i = 0; i < 40 && !hit; i++) {
      await key('Tab', 'Tab', 9);
      hit = await tab.eval("!!document.activeElement && document.activeElement.classList.contains('work-row')");
    }
    check(hit, 'never tabbed to a .work-row');
    check(await tab.eval("document.activeElement.getAttribute('href')") === BASE + 'ARC/', 'first work row is not ARC');
    await key('Enter', 'Enter', 13, '\r');
    await tab.until(`location.pathname===${JSON.stringify(BASE + 'ARC/')} && !!document.querySelector('link[data-arc]:not([media])')`, 'ARC');
    check(await tab.eval('window.__marker') === 3, 'page reloaded');
    await key('Tab', 'Tab', 9);
    const now = await tab.eval("(document.activeElement.className||document.activeElement.tagName)+''");
    check(await tab.eval("document.activeElement.classList.contains('skip-link')"), 'Tab went to ' + now);
  });

  // K8 direct loads and the directory 301
  for (const p of PAGES) {
    await step(`K8 direct load ${BASE + p}`, async () => {
      const r = await get(url(p));
      check(r.status === 200, 'HTTP ' + r.status);
      await tab.goto(url(p), SETTLE);
      check(await tab.eval(q.path) === BASE + p, 'path ' + await tab.eval(q.path));
      check(await tab.eval("document.querySelector('main h1').textContent.trim().length>0"), 'no h1');
      check(await tab.eval(q.canonical) === SITE_URL + p, 'canonical');
      // hydrated: a client-side nav from a deep link does not reload
      if (p) {
        await tab.eval('window.__marker=2');
        await tab.eval(q.click(BASE));
        await tab.until(`location.pathname===${JSON.stringify(BASE)}`, 'home via header link');
        check(await tab.eval('window.__marker') === 2, 'header link reloaded the page (not hydrated?)');
      }
    });
  }
  await step('K8 /ARC -> 301 /ARC/', async () => {
    const r = await get(server + BASE + 'ARC');
    check(r.status === 301 && r.headers.get('location') === BASE + 'ARC/', `HTTP ${r.status} ${r.headers.get('location')}`);
  });

  // K9 lowercase redirects and the 404 page
  // Entries are relative to the base, except the root-absolute wrong-case base one.
  const from9 = (f) => (f.startsWith('/') ? server + f : url(f));
  for (const [from, to] of [['arc', 'ARC/'], ['arc/', 'ARC/'], ['markettesting/', 'MarketTesting/'],
    ['cbu-robotics/#vice-president', 'CBU-Robotics/#vice-president'], ['in-n-out', 'In-N-Out/'], ['legoland/', 'LEGOLAND/'], ['about', 'About/'],
    ['/benjamin-elmore-website/arc', 'ARC/']]) {
    await step(`K9 ${from.startsWith('/') ? from : '/' + from} -> /${to}`, async () => {
      await tab.goto(from9(from), 'true');
      const want = BASE + to.split('#')[0];
      await tab.until(`location.pathname===${JSON.stringify(want)} && !!document.querySelector('main h1') && document.readyState==='complete'`, 'redirect');
      if (to.includes('#')) check(await tab.eval('location.hash') === '#' + to.split('#')[1], 'hash lost');
      const r = await get(from9(from.split('#')[0]));
      check(r.status === 404 || r.status === 301, 'server gave ' + r.status);
    });
  }
  await step('K9 /nope -> 404 page, no loop', async () => {
    const r = await get(url('nope'));
    check(r.status === 404, 'HTTP ' + r.status);
    await tab.goto(url('nope'), SETTLE);
    await sleep(500);
    check(await tab.eval(q.path) === BASE + 'nope', 'path changed to ' + await tab.eval(q.path));
    check((await tab.eval("document.querySelector('main h1').textContent")).includes('Page not found'), 'no "Page not found"');
    check((await tab.eval("document.querySelector('meta[name=robots]')?.content")) === 'noindex', 'no noindex');
  });

  // K11 JavaScript off
  await step('K11 JavaScript off: content, anchors on every route', async () => {
    await tab.send('Emulation.setScriptExecutionDisabled', { value: true });
    try {
      for (const p of [...PAGES, 'nope']) {
        await tab.goto(url(p), "document.readyState==='complete'");
        const r = await tab.send('Runtime.evaluate', { returnByValue: true, expression:
          "JSON.stringify({h1:document.querySelector('main h1')?.textContent.trim()||'',len:document.querySelector('main').innerText.length,anchors:document.querySelectorAll('main a[href]').length})" });
        const v = JSON.parse(r.result.value);
        check(v.h1 && v.len > 20 && v.anchors > 0, `${p || '/'}: ${JSON.stringify(v)}`);
      }
    } finally { await tab.send('Emulation.setScriptExecutionDisabled', { value: false }); }
  });

  // K12 console
  await step('K12 zero console errors or hydration warnings', async () => {
    check(consoleProblems.length === 0, `${consoleProblems.length} console problem(s): ${consoleProblems.slice(0, 3).join(' | ')}`);
  });
}

// A4 state shots: the same states in this build and in fresh, saved side by side and compared byte for byte.
async function shots() {
  const out = resolve(args.out || join(tmpdir(), 'clickthrough-shots'));
  mkdirSync(out, { recursive: true });
  const servers = { react: await startServer(root), fresh: await startServer(resolve(args.shots)) };
  const tab = await Tab.open(await startBrowser());
  await tab.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  // Instant scrolls (the CSS may ask for smooth ones), then measure once the page is still.
  const hover = async (sel) => {
    await tab.eval(`document.querySelector(${JSON.stringify(sel)}).scrollIntoView({block:'center',behavior:'instant'})`);
    await sleep(300);
    const [x, y] = await tab.eval(`(()=>{const r=document.querySelector(${JSON.stringify(sel)}).getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]})()`);
    await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
  };
  const states = {
    'work-hover': () => hover('.work-row'),
    'exp-hover': () => hover('.exp-row__link'),
    'details-open': async () => { await tab.eval("(()=>{const d=document.querySelector('.exp-details');d.open=true;d.scrollIntoView({block:'start',behavior:'instant'})})()"); await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 }); },
  };
  const { writeFileSync } = await import('node:fs');
  for (const w of [360, 1280]) for (const theme of ['dark']) for (const [name, act] of Object.entries(states)) {
    const pngs = {};
    for (const [build, srv] of Object.entries(servers)) {
      await tab.send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: false });
      await tab.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: theme }] });
      await tab.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 1, y: 1 });
      await tab.goto(srv + BASE, SETTLE);
      await sleep(300);
      await act();
      await sleep(600);
      await tab.send('Page.bringToFront');
      pngs[build] = (await tab.send('Page.captureScreenshot', { format: 'png', fromSurface: true })).data;
      writeFileSync(join(out, `${name}-${w}-${theme}-${build}.png`), Buffer.from(pngs[build], 'base64'));
    }
    const same = pngs.react === pngs.fresh;
    console.log(`${same ? 'SAME' : 'DIFF'} ${name}-${w}-${theme}`);
  }
  console.log('shots in ' + out + ' (DIFF means bytes differ: compare the pair by eye)');
}

try { await (args.shots ? shots() : main()); } catch (e) { report('harness', false, e.stack || e.message); }
for (const c of children) kill(c);
console.log(failures ? `FAILED: ${failures}` : 'ALL PASSED');
process.exit(failures ? 1 : 0);
