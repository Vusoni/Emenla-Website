// Filmstrip and assertions for the history section (the clock and the record).
//   node tools/histshots.mjs http://127.0.0.1:8080/ <outDir>
// Desktop 1440x900 before the first node, inside every era, mid every captioned roll and the last one, and after;
// 1280x720 and 901x800; phone 375x812 and 375x667; reduced motion at 1440x900. Fails (exit 1) when the clock and the
// record disagree, a card or caption drops below full contrast, the clock is not stuck where the stylesheet puts it,
// the phone strip passes 140px, the page overflows sideways, or a console error is logged.
import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const INK = 'rgb(0, 0, 0)', ASH = 'rgb(113, 113, 113)', CANVAS = 'rgb(252, 249, 247)';
let failed = 0;
/* Everything the assertions need, read in the page in one go */
const check = `(() => {
  const hs = document.querySelector('[data-history]'), h = window.__emenlaHistory;
  const clock = hs.querySelector('.hist__clock'), rec = hs.querySelector('.hist__record'), year = hs.querySelector('.hs-year'), now = hs.querySelector('.hs-now');
  const cs = getComputedStyle(hs), hr = hs.getBoundingClientRect(), cr = clock.getBoundingClientRect(), rr = rec.getBoundingClientRect();
  const cards = [...hs.querySelectorAll('.hcard')], gaps = [...hs.querySelectorAll('.hs-gap')];
  const ghost = [...cards, ...gaps].filter(e => { const s = getComputedStyle(e); return s.display === 'none' || parseFloat(s.opacity) < 1; }).length;
  const cell = year.querySelector('.hs-cell'), cellH = cell ? parseFloat(getComputedStyle(cell).height) : 0;
  const strips = [...year.querySelectorAll('.hs-strip')].map(s => { const t = getComputedStyle(s).transform; return t === 'none' ? 0 : new DOMMatrixReadOnly(t).m42; });
  const brand = document.querySelector('.nav__brand').getBoundingClientRect();
  const lit = [...hs.querySelectorAll('.hcard.lit')], last = lit[lit.length - 1];
  return {
    era: h.era, year: h.year, read: Math.round(h.read), years: h.years, labels: cards.map(c => c.querySelector('.label').textContent),
    shown: year.getAttribute('data-year'), word: year.classList.contains('is-word'),
    label: now.textContent, labelEmpty: now.classList.contains('is-empty'),
    lit: lit.length, litGaps: hs.querySelectorAll('.hs-gap.lit').length,
    litTicks: hs.querySelectorAll('.hs-tick.lit').length, pen: hs.querySelector('.hs-ruler').style.getPropertyValue('--pen'),
    nodes: cards.map(c => getComputedStyle(c, '::before').backgroundColor),
    yearInk: cards.map(c => getComputedStyle(c.querySelector('.hcard__year')).color),
    ghost, hiddenGaps: hs.querySelectorAll('.hs-gap[aria-hidden]').length,
    media: cards.filter(c => getComputedStyle(c.querySelector('.hcard__media')).display !== 'none').length,
    credits: getComputedStyle(document.querySelector('.hist__credits')).display !== 'none',
    cardsWhole: cards.map(c => c.getBoundingClientRect()).filter(r => r.bottom > 0 && r.top < innerHeight).every(r => r.left >= 0 && r.right <= innerWidth),
    sticky: getComputedStyle(clock).position, clockBg: getComputedStyle(clock).backgroundColor, clockTop: cr.top, clockH: cr.height, clockRight: cr.right, recLeft: rr.left,
    histTop: hr.top, histBottom: hr.bottom,
    stickyTop: parseFloat(cs.getPropertyValue('--read')) * innerHeight - (parseFloat(cs.getPropertyValue('--lift')) || 0),
    yearTop: year.getBoundingClientRect().top, brandBottom: brand.bottom,
    cols: cs.display === 'grid' ? cs.gridTemplateColumns.split(' ').length : 0, display: cs.display,
    cellH, strips, cardTransition: getComputedStyle(cards[0]).transitionDuration, litTransform: last ? getComputedStyle(last).transform : 'none',
    overflow: document.documentElement.scrollWidth - innerWidth, vw: innerWidth, vh: innerHeight
  };
})()`;
/* Where the nodes and the boxes are, record-relative, as the script measured them */
const geom = p => p.eval('({ nodes: window.__emenlaHistory.nodes, holdEnd: window.__emenlaHistory.holdEnd })');
/* Scroll so the reading line sits `at` px below the record's top, then let the 700ms lift settle */
async function goto(p, at) {
  const g = await p.eval(`(() => { const hs = document.querySelector('[data-history]'); const r = hs.querySelector('.hist__record').getBoundingClientRect(); return { top: r.top + scrollY, read: parseFloat(getComputedStyle(hs).getPropertyValue('--read')), vh: innerHeight }; })()`);
  await p.scroll(Math.round(g.top + at - g.vh * g.read)); await p.eval(wait(900));
}
function near(a, b, tol) { return Math.abs(a - b) <= tol; }
/* One frame: scroll, photograph, measure, assert. `e` says which era is under the reading line (-1 before the first),
   whether the frame sits mid-roll, and whether the page runs under reduced motion */
async function frame(p, tag, at, e) {
  await goto(p, at);
  await p.shot(`${out}/${tag}.png`);
  await p.eval(wait(300)); /* the capture re-emulates the viewport */
  const c = await p.eval(check);
  const bad = [], i = e.era, n = c.years.length, phone = c.vw <= 900;
  if (c.era !== i) bad.push(`era ${c.era}, expected ${i}`);
  if (c.lit !== i + 1) bad.push(`${c.lit} lit cards, expected ${i + 1}`);
  const gapsLit = Math.min(3, e.roll ? i + 1 : Math.max(0, i)); /* captions light by position, reduced motion or not */
  if (c.litGaps !== gapsLit) bad.push(`${c.litGaps} lit captions, expected ${gapsLit}`);
  if (e.roll && !e.rm) {
    const a = c.years[i], z = i === n - 2 ? a : c.years[i + 1];
    if (!c.labelEmpty) bad.push('label shown mid-roll');
    if (i === n - 2) { if (c.shown !== String(a)) bad.push(`last gap shows ${c.shown}, expected ${a}`); }
    else {
      const s = Number(c.shown);
      if (!(s > a && s < z)) bad.push(`shows ${c.shown}, expected strictly between ${a} and ${z}`);
      if (Number.isInteger(c.year)) bad.push(`year ${c.year} is whole mid-roll`);
    }
  } else {
    const k = Math.max(0, i), word = i === n - 1;
    if (c.labelEmpty || c.label !== c.labels[k]) bad.push(`label "${c.label}" (${c.labelEmpty ? 'empty' : 'shown'}), expected "${c.labels[k]}"`);
    if (c.shown !== (word ? 'Today' : String(c.years[k]))) bad.push(`shows ${c.shown}, expected ${word ? 'Today' : c.years[k]}`);
    if (c.word !== word) bad.push(`is-word ${c.word}`);
    if (!word && c.year !== c.years[k]) bad.push(`year ${c.year}, expected ${c.years[k]}`);
  }
  for (let k = 0; k < n; k++) {
    const on = k <= i;
    if (c.nodes[k] !== (on ? INK : CANVAS)) bad.push(`node ${k} ${c.nodes[k]}`);
    if (c.yearInk[k] !== (on ? INK : ASH)) bad.push(`year ${k} ${c.yearInk[k]}`);
  }
  if (c.ghost) bad.push(`${c.ghost} cards or captions below full contrast`);
  if (c.hiddenGaps) bad.push('a caption is aria-hidden');
  if (c.overflow > 0) bad.push(`page overflows by ${c.overflow}px`);
  if (c.sticky !== 'sticky') bad.push(`clock position ${c.sticky}`);
  if (c.media !== n) bad.push(`${c.media} of ${n} media shown`);
  if (!c.credits) bad.push('credits hidden');
  if (!c.cardsWhole) bad.push('a card runs off the side');
  if (phone) {
    if (c.display !== 'block') bad.push(`phone layout ${c.display}`);
    if (c.histTop < -1 && !near(c.clockTop, 0, 1)) bad.push(`strip top ${c.clockTop.toFixed(1)} while stuck`);
    if (c.yearTop < c.brandBottom + 6) bad.push(`year top ${c.yearTop.toFixed(1)} under the wordmark (${c.brandBottom.toFixed(1)})`);
    if (c.clockH > 140) bad.push(`strip ${c.clockH.toFixed(1)}px tall`);
    /* solid only while stuck; in flow it must show the page's ground through */
    if (c.histTop < -1 && c.clockBg !== CANVAS) bad.push(`stuck strip background ${c.clockBg}`);
    if (c.histTop > 1 && c.clockBg !== 'rgba(0, 0, 0, 0)') bad.push(`strip in flow has background ${c.clockBg}`);
  } else {
    if (c.cols !== 2) bad.push(`${c.cols} columns`);
    if (c.clockRight + 16 > c.recLeft) bad.push(`clock right ${c.clockRight.toFixed(1)} meets record left ${c.recLeft.toFixed(1)}`);
    const stuck = c.histTop < c.stickyTop - 1 && c.histBottom > c.stickyTop + c.clockH;
    if (stuck && !near(c.clockTop, c.stickyTop, 2)) bad.push(`clock top ${c.clockTop.toFixed(1)}, expected ${c.stickyTop.toFixed(1)}`);
  }
  if (e.rm) {
    if (!Number.isInteger(c.year)) bad.push(`year ${c.year} not whole under reduced motion`);
    c.strips.forEach((ty, k) => { const q = -ty / c.cellH; if (!near(q, Math.round(q), 0.02)) bad.push(`strip ${k} at ${q.toFixed(3)} cells`); });
    if (c.cardTransition !== '0s') bad.push(`card transition ${c.cardTransition}`);
    if (c.litTransform !== 'none') bad.push(`lit card transform ${c.litTransform}`);
  }
  /* python3 -m http.server keeps a listen backlog of 5, so a page's burst of image connections can be reset by the
     test server itself; that is a warning. A 404, a CSP report or an exception is still a failure. */
  const errors = p.errors.filter(e => !/net::ERR_(CONNECTION_RESET|SOCKET_NOT_CONNECTED)/.test(e));
  if (errors.length < p.errors.length && !p.warned) { p.warned = true; console.log('  WARN test server reset a connection on this page'); }
  if (errors.length) bad.push('console: ' + errors.join(' | '));
  const line = { era: c.era, year: c.year, shown: c.shown, label: c.labelEmpty ? '' : c.label, lit: c.lit, litGaps: c.litGaps, litTicks: c.litTicks, pen: c.pen, read: c.read, clockTop: Math.round(c.clockTop), stickyTop: Math.round(c.stickyTop), clockH: Math.round(c.clockH), overflow: c.overflow };
  console.log(tag, JSON.stringify(line));
  if (bad.length) { failed++; console.log('  FAIL', bad.join('; ')); }
}
/* The reading line inside era i's box, and 0.47 of the way through the roll after it (never a whole year) */
const hold = (g, i) => g.nodes[i] + 24;
const roll = (g, i) => g.holdEnd[i] + 0.47 * (g.nodes[i + 1] - g.holdEnd[i]);

const d = await b.page(url, { width: 1440, height: 900 }); await d.eval(wait(600));
let g = await geom(d);
await frame(d, 'd-before', g.nodes[0] - 200, { era: -1 });
for (let i = 0; i < 8; i++) await frame(d, `d-era${i}`, hold(g, i), { era: i });
for (let i = 0; i < 3; i++) await frame(d, `d-gap${i}`, roll(g, i), { era: i, roll: true });
await frame(d, 'd-roll6', roll(g, 6), { era: 6, roll: true });
await frame(d, 'd-after', g.nodes[7] + 300, { era: 7 });
await d.close();

const s = await b.page(url, { width: 1280, height: 720 }); await s.eval(wait(600)); g = await geom(s);
await frame(s, 'short-era3', hold(g, 3), { era: 3 });
await frame(s, 'short-gap0', roll(g, 0), { era: 0, roll: true });
await s.close();

const t = await b.page(url, { width: 901, height: 800 }); await t.eval(wait(600)); g = await geom(t);
await frame(t, 't901-era1', hold(g, 1), { era: 1 });
await t.close();

const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true }); await m.eval(wait(600)); g = await geom(m);
await frame(m, 'm-strip', hold(g, 0), { era: 0 });
await frame(m, 'm-gap0', roll(g, 0), { era: 0, roll: true });
await frame(m, 'm-today', hold(g, 7), { era: 7 });
await m.close();

const m2 = await b.page(url, { width: 375, height: 667, touch: true, mobile: true }); await m2.eval(wait(600)); g = await geom(m2);
await frame(m2, 'm667-era2', hold(g, 2), { era: 2 });
await m2.close();

const r = await b.page(url, { width: 1440, height: 900, rm: true }); await r.eval(wait(600)); g = await geom(r);
await frame(r, 'rm-gap1', roll(g, 1), { era: 1, roll: true, rm: true });
await frame(r, 'rm-era5', hold(g, 5), { era: 5, rm: true });
await r.close();

b.close();
console.log(failed ? `${failed} frame(s) failed` : 'all frames pass');
process.exit(failed ? 1 : 0);
