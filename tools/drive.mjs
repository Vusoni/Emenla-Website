// Minimal Chrome DevTools driver on Node 22's built-in WebSocket. No dependencies.
// Usage as a library: import { connect } from './drive.mjs'
// Usage as a CLI:
//   node tools/drive.mjs shot <url> <w> <h> <out.png> [scrollY] [touch] [rm] [block=<substring>]
//   node tools/drive.mjs eval <url> <w> <h> "<js expression>" [scrollY] [touch] [rm] [block=<substring>]
import { writeFileSync } from 'node:fs';

const PORT = process.env.CDP_PORT || 9222;

export async function connect() {
  const v = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json();
  const ws = new WebSocket(v.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0;
  const pending = new Map();
  const listeners = [];
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    if (msg.id && pending.has(msg.id)) {
      const { res, rej } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) rej(new Error(msg.error.message)); else res(msg.result);
    } else if (msg.method) {
      for (const l of listeners) l(msg);
    }
  };
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => {
    const msgId = ++id;
    pending.set(msgId, { res, rej });
    ws.send(JSON.stringify({ id: msgId, method, params, sessionId }));
  });
  const on = (fn) => listeners.push(fn);

  async function page(url, opts = {}) {
    const { width = 1440, height = 900, touch = false, rm = false, block = null, mobile = false } = opts;
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    const s = (m, p) => send(m, p, sessionId);
    const errors = [];
    on((msg) => {
      if (msg.sessionId !== sessionId) return;
      if (msg.method === 'Runtime.exceptionThrown') errors.push('exception: ' + (msg.params.exceptionDetails.exception?.description || msg.params.exceptionDetails.text));
      if (msg.method === 'Log.entryAdded' && msg.params.entry.level === 'error') errors.push('log: ' + msg.params.entry.text + ' ' + (msg.params.entry.url || ''));
    });
    await s('Page.enable');
    await s('Runtime.enable');
    await s('Log.enable');
    await s('Network.enable');
    await s('Network.setCacheDisabled', { cacheDisabled: true });
    await s('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
    if (touch) await s('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    if (rm) await s('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    if (block) await s('Network.setBlockedURLs', { urls: Array.isArray(block) ? block : [block] });
    const loaded = new Promise((res) => on((msg) => { if (msg.sessionId === sessionId && msg.method === 'Page.loadEventFired') res(); }));
    await s('Page.navigate', { url });
    await loaded;
    return {
      sessionId,
      errors,
      send: s,
      async eval(expression) {
        const r = await s('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
        return r.result.value;
      },
      async scroll(y) {
        await this.eval(`document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, ${y}); new Promise(r => setTimeout(r, 1300))`);
      },
      async shot(path, opts2 = {}) {
        const { data } = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, ...opts2 });
        writeFileSync(path, Buffer.from(data, 'base64'));
      },
      async setMedia(features) { await s('Emulation.setEmulatedMedia', { features }); },
      async setTouch(enabled) { await s('Emulation.setTouchEmulationEnabled', { enabled, maxTouchPoints: 5 }); },
      async setSize(w, h, m = false) { await s('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: m }); },
      async mouse(type, x, y, extra = {}) { await s('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1, ...extra }); },
      async close() { await send('Target.closeTarget', { targetId }); }
    };
  }
  return { send, page, close: () => ws.close() };
}

function parseFlags(args) {
  const o = { scrollY: 0, touch: false, rm: false, block: null };
  for (const a of args) {
    if (/^\d+$/.test(a)) o.scrollY = parseInt(a, 10);
    else if (a === 'touch') o.touch = true;
    else if (a === 'rm') o.rm = true;
    else if (a.startsWith('block=')) o.block = a.slice(6);
  }
  return o;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [cmd, url, w, h, target, ...rest] = process.argv.slice(2);
  const flags = parseFlags(rest);
  const b = await connect();
  const p = await b.page(url, { width: parseInt(w, 10), height: parseInt(h, 10), touch: flags.touch, rm: flags.rm, block: flags.block, mobile: flags.touch });
  await p.eval('new Promise(r => setTimeout(r, 900))');
  if (flags.scrollY) await p.scroll(flags.scrollY);
  if (cmd === 'shot') {
    await p.shot(target);
    console.log('saved', target);
  } else if (cmd === 'eval') {
    console.log(JSON.stringify(await p.eval(target), null, 2));
  }
  if (p.errors.length) console.log('console errors:', p.errors);
  else console.log('console clean');
  await p.close();
  b.close();
}
