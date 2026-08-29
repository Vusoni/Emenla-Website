// The self-test: flick test, worst-frame legibility audit, hit areas, overflow, reduced motion both ways,
// complete-without-video, the hold moment, console errors. Needs headless Chrome on :9222 and the site on :8080.
import { connect } from './drive.mjs';
import { execFileSync } from 'node:child_process';
import { mkdirSync } from 'node:fs';

const URL = process.argv[2] || 'http://127.0.0.1:8080/';
const OUT = process.argv[3] || '/tmp/emenla-selftest';
mkdirSync(OUT, { recursive: true });

const b = await connect();
const lines = [];
function log(s) { console.log(s); lines.push(s); }
const wait = (ms) => `new Promise(r => setTimeout(r, ${ms}))`;

function srgb(c) { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function lum(r, g, bl) { return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(bl); }
function contrast(a, c) { const hi = Math.max(a, c), lo = Math.min(a, c); return (hi + 0.05) / (lo + 0.05); }

/* ---------- Desktop ---------- */
const p = await b.page(URL, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 20000); })`);
log('hero state: ' + await p.eval(`document.querySelector('.hero__stage').className`));
await p.eval(`document.documentElement.style.scrollBehavior = 'auto'`);
const range = await p.eval(`document.querySelector('.hero').offsetHeight - innerHeight`);
log('hero scroll range: ' + range + 'px');

/* Flick test */
async function flick(step, count) {
  await p.eval(`window.scrollTo(0, 0); ${wait(400)}`);
  const rows = [];
  for (let i = 0; i < count; i++) {
    rows.push(await p.eval(`window.scrollBy(0, ${step}); new Promise(res => setTimeout(() => res(window.__emenlaHero.bands.map(b => +b.op.toFixed(2))), 400))`));
  }
  return rows;
}
for (const [step, count] of [[120, Math.ceil(range / 120) + 2], [240, Math.ceil(range / 240) + 2], [360, Math.ceil(range / 360) + 2]]) {
  const rows = await flick(step, count);
  const n = rows[0].length;
  const summary = [];
  for (let bi = 0; bi < n; bi++) {
    let best = 0, run = 0, max = 0;
    for (const r of rows) { const o = r[bi]; max = Math.max(max, o); if (o >= 0.97) { run++; best = Math.max(best, run); } else run = 0; }
    summary.push(`band${bi + 1}: ${best} full steps, max ${max}`);
  }
  log(`flick ${step}px: ` + summary.join(' | '));
}

/* Worst-frame audit */
const bands = await p.eval(`window.__emenlaHero.bands.map(b => ({a: b.a, b: b.b}))`);
const sels = ['.band--1 .band__text', '.band--2 .band__text', '.band--3 .band__text', '.band--4 .band__text'];
const kinds = ['ink', 'ink', 'ink', 'ink'];
for (let i = 0; i < bands.length; i++) {
  const mid = (bands[i].a + bands[i].b) / 2;
  const probes = [bands[i].a + (bands[i].b - bands[i].a) * 0.25, mid, bands[i].a + (bands[i].b - bands[i].a) * 0.75];
  let worst = 99;
  for (const prog of probes) {
    const y = Math.round(Math.min(1, prog) * range);
    await p.eval(`window.scrollTo(0, ${y}); ${wait(1100)}`);
    const box = await p.eval(`(() => { const el = document.querySelector('${sels[i]}'); const r = el.getBoundingClientRect(); el.style.visibility = 'hidden'; return {x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)}; })()`);
    await p.eval(wait(150));
    const shot = `${OUT}/audit-b${i + 1}-${prog.toFixed(2)}.png`;
    await p.shot(shot);
    await p.eval(`(() => { const el = document.querySelector('${sels[i]}'); el.style.visibility = ''; })()`);
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', shot, '-vf', `crop=${box.w}:${box.h}:${box.x}:${box.y},format=rgb24`, '-f', 'rawvideo', '-'], { maxBuffer: 64 * 1024 * 1024 });
    let minL = 1;
    for (let k = 0; k < raw.length; k += 3) { const L = lum(raw[k], raw[k + 1], raw[k + 2]); if (L < minL) minL = L; }
    /* Every band is flat ink: the darkest pixel of the frame under the text box is what the ink competes with */
    const c = contrast(0, minL);
    worst = Math.min(worst, c);
  }
  log(`audit band${i + 1} (${kinds[i]}): worst ${worst.toFixed(2)}:1 ${worst >= 3.5 ? 'ok' : 'FAIL'}`);
}

/* The hold moment: early release eases back, a full hold completes */
await p.eval(`document.querySelector('[data-hold]').scrollIntoView({block: 'center'}); ${wait(1500)}`);
const btn = await p.eval(`(() => { const r = document.querySelector('.hold__btn').getBoundingClientRect(); return {x: r.left + r.width / 2, y: r.top + r.height / 2}; })()`);
await p.mouse('mouseMoved', btn.x, btn.y);
await p.mouse('mousePressed', btn.x, btn.y);
await p.eval(wait(500));
await p.mouse('mouseReleased', btn.x, btn.y);
const early = await p.eval(`${wait(300)}.then(() => getComputedStyle(document.querySelector('[data-hold]')).getPropertyValue('--hp'))`);
const back = await p.eval(`${wait(1200)}.then(() => ({hp: getComputedStyle(document.querySelector('[data-hold]')).getPropertyValue('--hp'), done: document.querySelector('[data-hold]').classList.contains('is-done')}))`);
log(`hold early release: hp after release ${early.trim()} then ${JSON.stringify(back)}`);
await p.mouse('mousePressed', btn.x, btn.y);
await p.eval(wait(2200));
await p.mouse('mouseReleased', btn.x, btn.y);
log('hold full: ' + JSON.stringify(await p.eval(`${wait(300)}.then(() => ({done: document.querySelector('[data-hold]').classList.contains('is-done'), label: document.querySelector('.hold__btn').textContent}))`)));

/* Stagger delays retired: hover items after entrance */
log('pairs delays retired: ' + await p.eval(`(() => { const ul = document.querySelector('.pairs'); ul.scrollIntoView(); return new Promise(r => setTimeout(() => r(Array.from(ul.querySelectorAll('.part')).map(el => getComputedStyle(el).transitionDelay).join(',')), 2200)); })()`));

/* Reduced motion flipped ON live */
await p.eval(`window.scrollTo(0, 0); ${wait(300)}`);
await p.setMedia([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
await p.eval(wait(600));
log('rm on: ' + JSON.stringify(await p.eval(`({staticShown: getComputedStyle(document.querySelector('.hero__static')).display, videoShown: getComputedStyle(document.querySelector('.hero__video')).display, heroHeight: document.querySelector('.hero').offsetHeight, holdDone: document.querySelector('[data-hold]').classList.contains('is-done'), revealsIn: document.querySelectorAll('.reveal:not(.in)').length})`)));
log('rm statement + screens: ' + JSON.stringify(await p.eval(`(() => { const el = document.querySelector('[data-statement]'); const pn = document.querySelector('.panel').getBoundingClientRect(), d = document.querySelector('.panel .device').getBoundingClientRect(); return { statementP: getComputedStyle(el).getPropertyValue('--p').trim(), firstWordOpacity: getComputedStyle(el.querySelector('.w')).opacity, panelCrop: ((pn.bottom - d.top) / d.height).toFixed(2) }; })()`)));
/* and OFF again */
await p.setMedia([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
await p.eval(`window.scrollTo(0, 800); ${wait(1200)}`);
log('rm off: ' + JSON.stringify(await p.eval(`({staticShown: getComputedStyle(document.querySelector('.hero__static')).display, videoShown: getComputedStyle(document.querySelector('.hero__video')).display, t: +window.__emenlaHero.video.currentTime.toFixed(2), ops: window.__emenlaHero.bands.map(b => +b.op.toFixed(2))})`)));

/* Sideways */
log('desktop overflow: ' + JSON.stringify(await p.eval(`({sw: document.documentElement.scrollWidth, iw: innerWidth})`)));
log('desktop console: ' + JSON.stringify(p.errors));
await p.setSize(1280, 800);
await p.eval(`window.scrollTo(0, 0); ${wait(800)}`);
await p.shot(`${OUT}/d-1280-top.png`);
await p.close();

/* ---------- Video blocked ---------- */
const nb = await b.page(URL, { width: 1440, height: 900, block: ['*hero-scrub*'] });
await nb.eval(wait(2500));
log('video blocked: ' + JSON.stringify(await nb.eval(`({state: document.querySelector('.hero__stage').className, poster: document.querySelector('.hero__poster').classList.contains('is-set'), chevron: (el => el ? getComputedStyle(el).opacity : 'absent')(document.querySelector('.hero__chevron'))})`)));
await nb.shot(`${OUT}/d-noVideo.png`);
await nb.close();

/* ---------- Phone ---------- */
const m = await b.page(URL, { width: 375, height: 812, touch: true, mobile: true });
await m.eval(wait(1200));
const small = await m.eval(`Array.from(document.querySelectorAll('a, button, summary, input')).filter(el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const inline = el.tagName === 'A' && el.closest('p, li, .cite'); return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && !inline && (r.width < 44 || r.height < 44); }).map(el => el.tagName + ' "' + (el.textContent || el.placeholder || '').trim().slice(0, 30) + '" ' + Math.round(el.getBoundingClientRect().width) + 'x' + Math.round(el.getBoundingClientRect().height))`);
log('phone small targets: ' + JSON.stringify(small));
log('phone overflow: ' + JSON.stringify(await m.eval(`({sw: document.documentElement.scrollWidth, iw: innerWidth})`)));
log('phone requested heavy assets: ' + await m.eval(`performance.getEntriesByType('resource').filter(e => /hero-scrub|hero-poster/.test(e.name)).map(e => e.name).join(',') || 'none'`));
log('phone hero static: ' + await m.eval(`getComputedStyle(document.querySelector('.hero__static')).display`));
for (const a of ['#your-words', '#privacy', '#notify']) {
  await m.eval(`location.hash = '${a}'; ${wait(500)}`);
  log(`phone after ${a}: scrollWidth ${await m.eval('document.documentElement.scrollWidth')}`);
}
await m.eval(`window.scrollTo(0, 0); ${wait(600)}`);
await m.shot(`${OUT}/m-375x812.png`);
await m.setSize(375, 667, true);
await m.eval(wait(600));
await m.shot(`${OUT}/m-375x667.png`);
log('phone console: ' + JSON.stringify(m.errors));
await m.close();

b.close();
console.log('\nREPORT\n' + lines.join('\n'));
