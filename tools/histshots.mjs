// Filmstrip and geometry assertions for the history section (the measured record).
//   node tools/histshots.mjs http://127.0.0.1:8080/ <outDir>
// Desktop 1440x900 at seven progress points, a short 1280x720 frame, three phone frames, one reduced-motion shot.
// Fails (exit 1) if any visible card touches the rule, two cards overlap, or a card runs into the year readout.
import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
let failed = 0;
const check = `(() => {
  const hs = document.querySelector('[data-hscroll]'); const st = hs.querySelector('.hscroll__stage');
  const sr = st.getBoundingClientRect(); const ruleY = sr.top + parseFloat(getComputedStyle(hs).getPropertyValue('--rule-y'));
  const cards = [...hs.querySelectorAll('.hcard')].map(c => c.getBoundingClientRect());
  const vis = cards.filter(r => r.right > 0 && r.left < innerWidth);
  const touching = vis.filter(r => r.bottom > ruleY - 8).length;
  const pin = hs.classList.contains('hscroll--pin');
  let overlap = 0; if (!pin) for (let i = 1; i < cards.length; i++) if (cards[i].left - cards[i - 1].right < 24) overlap++;
  const nowEl = hs.querySelector('.hcard.now'); const nr = nowEl && nowEl.getBoundingClientRect();
  const nowCut = pin ? (!nr || nr.left < 0 || nr.right > innerWidth || getComputedStyle(nowEl).opacity < 0.99) : false;
  const shown = pin ? [...hs.querySelectorAll('.hcard')].filter(c => getComputedStyle(c).opacity > 0.5).length : null;
  const nowOp = nowEl ? parseFloat(getComputedStyle(nowEl).opacity) : 1;
  const head = hs.querySelector('.hs-head').getBoundingClientRect();
  const headClash = vis.filter(r => r.top < head.bottom + 8 && r.bottom > head.top - 8 && r.left < head.right && r.right > head.left).length;
  const labelsClear = ruleY + 36 < head.top - 8; const headClear = head.bottom < innerHeight - (innerWidth <= 720 ? 80 : 96);
  return { ruleY: Math.round(ruleY - sr.top), year: hs.querySelector('.hs-year').textContent, now: hs.querySelector('.hs-now').textContent,
    draw: hs.querySelector('.hscroll__draw').style.getPropertyValue('--draw'), litTicks: hs.querySelectorAll('.hs-tick.lit').length,
    nowIdx: [...hs.querySelectorAll('.hnode')].findIndex(n => n.classList.contains('now')), visible: vis.length, touching, overlap, headClash, labelsClear, headClear, pin, nowCut, shown, nowOp,
    compact: hs.classList.contains('hscroll--compact'), tight: hs.classList.contains('hscroll--tight'), spacer: hs.offsetHeight, hint: getComputedStyle(hs.querySelector('.hscroll__hint')).opacity };
})()`;
const settle = `new Promise(r => { let last = -1, still = 0, n = 0; const t = setInterval(() => { const y = scrollY; const now = document.querySelector('.hcard.now'); const op = now ? parseFloat(getComputedStyle(now).opacity) : 1; if (y === last && op >= 0.99) still++; else still = 0; last = y; if (still >= 6 || ++n > 200) { clearInterval(t); setTimeout(r, 250); } }, 50); })`;
async function frames(p, tag, ps) {
  const geo = await p.eval(`(() => { const hs = document.querySelector('[data-hscroll]'); const r = hs.getBoundingClientRect(); return { top: r.top + scrollY, h: hs.offsetHeight, vh: innerHeight }; })()`);
  for (const f of ps) {
    await p.scroll(Math.round(geo.top + f * (geo.h - geo.vh)));
    /* The page glides under its own damper after scrollTo; wait until it has stood still and the current card has finished fading in */
    await p.eval(settle); await p.eval(`new Promise(r => { let last = -1, still = 0, n = 0; const t = setInterval(() => { const y = scrollY; const now = document.querySelector('.hcard.now'); const op = now ? parseFloat(getComputedStyle(now).opacity) : 1; if (y === last && op >= 0.99) still++; else still = 0; last = y; if (still >= 6 || ++n > 200) { clearInterval(t); setTimeout(r, 400); } }, 50); })`);
    await p.shot(`${out}/${tag}-${String(f).replace('.', '_')}.png`);
    /* Capturing re-emulates the viewport and fires resize; let the layout and the fades settle again before measuring */
    await p.eval(settle);
    const c = await p.eval(check);
    const bad = c.touching || c.overlap || c.headClash || c.nowCut || !c.labelsClear || !c.headClear || c.nowOp < 0.99;
    if (bad) failed++;
    console.log(tag, f, bad ? 'FAIL' : 'ok', JSON.stringify(c));
  }
}
const p = await b.page(url, { width: 1440, height: 900 }); await p.eval(wait(1200));
await frames(p, 'd', [0, 0.15, 0.3, 0.5, 0.7, 0.9, 1]);
console.log('desktop', p.errors.length ? p.errors : 'console clean'); await p.close();
const s = await b.page(url, { width: 1280, height: 720 }); await s.eval(wait(1000));
await frames(s, 'short', [0.5]); console.log('short', s.errors.length ? s.errors : 'console clean'); await s.close();
const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true }); await m.eval(wait(1200));
await frames(m, 'm', [0, 0.5, 1]); console.log('phone', m.errors.length ? m.errors : 'console clean'); await m.close();
const r = await b.page(url, { width: 1440, height: 900, rm: true }); await r.eval(wait(1000));
await r.scroll(await r.eval(`document.getElementById('history').offsetTop`)); await r.eval(wait(500)); await r.shot(`${out}/rm.png`);
console.log('rm', JSON.stringify(await r.eval(`(() => { const hs = document.querySelector('[data-hscroll]'); return { stagePos: getComputedStyle(hs.querySelector('.hscroll__stage')).position, lit: hs.querySelectorAll('.hcard.lit').length, spacer: hs.style.height || 'auto' }; })()`)), r.errors.length ? r.errors : 'console clean'); await r.close();
b.close(); if (failed) { console.log('ASSERTIONS FAILED:', failed); process.exit(1); }
