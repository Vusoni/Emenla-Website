// Filmstrip and assertions for the devices on the home page: the four phone panels in #inside with the floating
// pair, the #duo band at true relative scale, and the #privacy phone.
//   node tools/devshots.mjs http://127.0.0.1:8080/ <outDir>
// Desktop 1440x900 (the panels, the pair at 2x, the front phone's corner at 4x, the Duo band, the privacy phone),
// phone 375x812, and reduced motion at 1440x900. Fails (exit 1) when a device picture has not loaded or draws at
// the wrong shape, the pair's back phone is not behind, right of and lifted from the front one, the Duo band's
// bottoms do not share a floor or the iPhone and the closed Duo are not 150.0 to 117.8 tall, a panel crops its
// phone outside 55 to 75 percent, the page overflows sideways, a console error is logged, or a part is still in
// motion under reduced motion.
import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
let failed = 0;
const RATIO = 150.0 / 117.8; /* iPhone 18 Pro to iPhone Duo, Apple's heights */
/* Everything the assertions need, read in the page in one go, for the devices near the viewport */
const check = `(() => {
  const near = r => r.bottom > -1500 && r.top < innerHeight + 1500, inView = r => r.bottom > 0 && r.top < innerHeight;
  const imgs = [...document.querySelectorAll('.device img')].map(i => ({ i, r: i.getBoundingClientRect() })).filter(o => near(o.r) && o.r.width > 0);
  const notLoaded = imgs.filter(o => o.r.bottom > 0 && o.r.top < innerHeight && !(o.i.complete && o.i.naturalWidth > 0)).length;
  const aspectOff = Math.max(0, ...imgs.map(o => { const a = +o.i.getAttribute('width') / +o.i.getAttribute('height'); return Math.abs(o.r.width / o.r.height - a) / a; }));
  const pair = document.querySelector('.twin'); let pr = null;
  if (pair && near(pair.getBoundingClientRect())) {
    const fe = pair.querySelector('.device--front'), ke = pair.querySelector('.device--back');
    const f = fe.querySelector('img').getBoundingClientRect(), k = ke.querySelector('img').getBoundingClientRect(), ks = getComputedStyle(ke);
    pr = { backShown: ks.display !== 'none', backRight: Math.round(k.right - f.right), backLift: Math.round(f.bottom - k.bottom), backTopBelow: Math.round(k.top - f.top),
      frontZ: getComputedStyle(fe).zIndex, backZ: ks.zIndex, backOpacity: ks.opacity, backTransform: ks.transform, frontW: Math.round(f.width), backW: Math.round(k.width) };
  }
  const panels = [...document.querySelectorAll('.grid5--screens .panel')].filter(p => p.querySelector('.device') && inView(p.getBoundingClientRect()));
  const crops = panels.map(p => { const pn = p.getBoundingClientRect(), d = p.querySelector('.device img').getBoundingClientRect(); return +((pn.bottom - d.top) / d.height).toFixed(2); });
  const duo = document.querySelector('.duo__stage'); let dr = null;
  if (duo && near(duo.getBoundingClientRect())) {
    const [a, c, o] = ['18pro', 'duo-closed', 'duo-open'].map(k => duo.querySelector('.device--' + k + ' img').getBoundingClientRect());
    dr = { bottoms: [a.bottom, c.bottom, o.bottom].map(v => Math.round(v)), heights: [a.height, c.height, o.height].map(Math.round), widths: [a.width, c.width, o.width].map(Math.round),
      ratio: +(a.height / c.height).toFixed(4), stageW: Math.round(duo.getBoundingClientRect().width), rows: new Set([a.bottom, c.bottom, o.bottom].map(Math.round)).size };
  }
  const parts = [...document.querySelectorAll('#inside .part, #duo .part, .device-wrap .part')].filter(e => inView(e.getBoundingClientRect()));
  const moving = parts.filter(e => { const s = getComputedStyle(e); return +s.opacity < 1 || s.transform !== 'none'; }).length;
  const bg = getComputedStyle(document.querySelector('.grid5--screens .panel')).backgroundImage;
  return { devices: imgs.length, notLoaded, aspectOff: +aspectOff.toFixed(4), pair: pr, crops, duo: dr, parts: parts.length, moving,
    violetPanel: /91, 72, 214/.test(bg), overflow: document.documentElement.scrollWidth - innerWidth, vw: innerWidth, vh: innerHeight };
})()`;
const rect = sel => `(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`;
/* Wait for every device picture near the viewport, then for the entrances (1100ms rise, 360ms for the back phone) */
const settle = ms => `(async () => { const t0 = Date.now(); for (;;) { const im = [...document.querySelectorAll('.device img')].filter(i => { const r = i.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; }); if (im.every(i => i.complete) || Date.now() - t0 > 6000) break; await ${wait(100)}; } await ${wait(ms)}; })()`;
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
/* One frame: scroll the section's top to `offset` below the viewport's top, let it settle, photograph (whole, or a clip at
   `scale`), measure, assert. `o.rm` says the page runs under reduced motion; `o.duo` that the band is the subject */
async function frame(p, tag, sel, o = {}) {
  const top = await p.eval(`document.querySelector('${sel}').getBoundingClientRect().top + scrollY`);
  await p.scroll(Math.round(top - (o.offset ?? 40)));
  await p.eval(settle(o.rm ? 300 : 1800));
  if (o.clip) { const c = await p.eval(rect(o.clip)); const pad = o.pad || 0; await p.shot(`${out}/${tag}.png`, { clip: { x: c.x - pad, y: c.y - pad, width: o.w || c.width + 2 * pad, height: o.h || c.height + 2 * pad, scale: o.scale || 2 } }); }
  else await p.shot(`${out}/${tag}.png`);
  await p.eval(wait(300)); /* the capture re-emulates the viewport */
  const c = await p.eval(check), bad = [], phone = c.vw <= 900;
  if (!c.devices) bad.push('no device near the viewport');
  if (c.notLoaded) bad.push(`${c.notLoaded} device picture(s) not loaded`);
  if (c.aspectOff > 0.003) bad.push(`a device draws ${(c.aspectOff * 100).toFixed(2)}% off its shape`);
  if (c.pair) {
    const r = c.pair;
    if (phone) { if (r.backShown) bad.push('back phone shown on a phone'); }
    else {
      if (!r.backShown) bad.push('back phone hidden');
      if (!(r.backRight > 40)) bad.push(`back phone not right of the front (${r.backRight}px)`);
      if (!(r.backLift > 10)) bad.push(`back phone not lifted (${r.backLift}px)`);
      if (!(r.backTopBelow > 0)) bad.push('back phone taller than the front');
      if (!(+r.frontZ > +r.backZ)) bad.push(`paint order ${r.frontZ} over ${r.backZ}`);
      if (!o.rm && r.backTransform !== 'none') bad.push('back phone still rising ' + r.backTransform);
    }
  }
  for (const k of c.crops) if (!phone && (k < 0.55 || k > 0.75)) bad.push(`panel crops its phone at ${k}`);
  if (o.duo) {
    const d = c.duo; if (!d) bad.push('duo band not measured');
    else {
      if (!near(d.bottoms[0], d.bottoms[1], 2)) bad.push(`iPhone and closed Duo on different floors ${d.bottoms}`);
      if (!phone && !near(d.bottoms[1], d.bottoms[2], 2)) bad.push(`open Duo on another floor ${d.bottoms}`);
      if (Math.abs(d.ratio / RATIO - 1) > 0.02) bad.push(`iPhone to Duo height ${d.ratio}, expected ${RATIO.toFixed(4)}`);
      if (!near(d.heights[1], d.heights[2], 2)) bad.push(`open and closed Duo heights ${d.heights[1]} and ${d.heights[2]}`);
      if (phone && d.rows !== 2) bad.push(`expected two rows on a phone, got ${d.rows}`);
      if (d.widths[2] > c.vw) bad.push('open Duo wider than the viewport');
    }
  }
  if (c.violetPanel) bad.push('panel still violet');
  if (c.overflow > 0) bad.push(`page overflows by ${c.overflow}px`);
  if (c.moving && (o.rm || !o.allowMotion)) bad.push(`${c.moving} part(s) still in motion`);
  if (p.errors.length) bad.push('console: ' + p.errors.join(' | '));
  console.log(tag, JSON.stringify(c));
  if (bad.length) { failed++; console.log('  FAIL ' + bad.join('; ')); }
}

const d = await b.page(url, { width: 1440, height: 900 }); await d.eval(wait(600));
await frame(d, 'd-inside', '.grid5--screens', { offset: 24 });
await frame(d, 'd-pair', '.grid5--screens', { offset: 24, clip: '.grid5--screens .panel--lg', pad: 8, scale: 2 });
await frame(d, 'd-corner', '.grid5--screens', { offset: 24, clip: '.twin .device--front img', pad: 12, w: 260, h: 200, scale: 4 });
await frame(d, 'd-duo', '#duo', { offset: 0, duo: true });
await frame(d, 'd-duo-stage', '.duo__stage', { offset: 60, duo: true, clip: '.duo__stage', pad: 24, scale: 2 });
await frame(d, 'd-privacy', '#privacy', { offset: 0 });
await d.close();

const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true }); await m.eval(wait(600));
await frame(m, 'm-inside', '.grid5--screens .panel--lg', { offset: 24 });
await frame(m, 'm-inside-sm', '.grid5--screens .panel--sm', { offset: 24 });
await frame(m, 'm-duo', '.duo__stage', { offset: 24, duo: true });
await frame(m, 'm-privacy', '.device-wrap', { offset: 24 });
await m.close();

const r = await b.page(url, { width: 1440, height: 900, rm: true }); await r.eval(wait(600));
await frame(r, 'rm-inside', '.grid5--screens', { offset: 24, rm: true });
await frame(r, 'rm-duo', '#duo', { offset: 0, duo: true, rm: true });
await r.close();

b.close();
console.log(failed ? `${failed} frame(s) failed` : 'all frames pass');
process.exit(failed ? 1 : 0);
