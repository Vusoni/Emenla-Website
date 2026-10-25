// Frames and assertions for "Your words, their words" (the ledger and its live row) and the history's type, clock and pictures.
//   node tools/wordshots.mjs http://127.0.0.1:8080/ <outDir>
// Fails (exit 1) when a serif face computes anywhere in #your-words, #history or the science hero, a row's sentence and
// term do not start level at desktop, a connecting line has not drawn after the reveal, the live row does not follow
// the hold or does not complete, a digit's ink would not fit inside its cell's mask, the clock is not rolling with its
// units strip blurred and its thousands crisp 100ms into a jump, a history picture fails to load, holds fewer pixels
// than it is shown at or wears a filter, a credit runs past its card on a phone, the page overflows sideways, or a
// console error is logged.
import { connect } from './drive.mjs'; import { mkdirSync, writeFileSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
let failed = 0;
const report = (name, bad, info = {}) => {
  if (bad.length) failed++;
  console.log(`${bad.length ? 'FAIL' : 'ok  '} ${name} ${JSON.stringify(info)}${bad.length ? '\n     ' + bad.join('\n     ') : ''}`);
};

/* Any element (or its quote marks) in these scopes computing the retired serif */
const serif = scopes => `(() => {
  const hits = [];
  for (const sel of ${JSON.stringify(scopes)}) for (const root of document.querySelectorAll(sel)) for (const el of [root, ...root.querySelectorAll('*')])
    for (const pseudo of [null, '::before', '::after']) if (/instrument/i.test(getComputedStyle(el, pseudo).fontFamily)) hits.push(el.className + (pseudo || ''));
  const faces = [...document.fonts].filter(f => /instrument/i.test(f.family)).length;
  return { hits: hits.slice(0, 5), faces };
})()`;
const scaleX = el => `(t => t === 'none' ? 1 : new DOMMatrixReadOnly(t).a)(getComputedStyle(${el}, '::before').transform)`;
const overflow = `document.documentElement.scrollWidth - window.innerWidth`;
const ledger = `(() => {
  const rows = [...document.querySelectorAll('#your-words .ledger__row')];
  return rows.map(r => {
    const said = r.querySelector('.ledger__said').getBoundingClientRect(), name = r.querySelector('.ledger__name').getBoundingClientRect();
    const line = r.querySelector('.ledger__line');
    return { live: r.hasAttribute('data-hold'), saidTop: Math.round(said.top), nameTop: Math.round(name.top), line: +${scaleX('line')}.toFixed(2), lineW: Math.round(line.getBoundingClientRect().width) };
  });
})()`;
const live = `(() => {
  const h = document.querySelector('[data-hold]'), hc = [...h.querySelectorAll('.hc')].map(c => +getComputedStyle(c).opacity);
  return { hp: +getComputedStyle(h).getPropertyValue('--hp') || 0, line: +${scaleX("h.querySelector('.ledger__line')")}.toFixed(2), done: h.classList.contains('is-done'),
    written: hc.filter(o => o > 0.95).length, faint: hc.filter(o => o < 0.3).length, chars: hc.length,
    name: +getComputedStyle(h.querySelector('.hold__result .ledger__name')).opacity, btn: h.querySelector('.hold__btn').textContent };
})()`;
const toWords = `document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('#your-words .ledger').scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); ${wait(1600)}`;
const toLive = `document.documentElement.style.scrollBehavior = 'auto'; document.querySelector('[data-hold]').scrollIntoView({ block: 'center' }); ${wait(1600)}`;
const centre = sel => `(() => { const r = document.querySelector('${sel}').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`;
/* The clock eases toward the scroll's target: wait until it has arrived (two seconds at most) */
const settle = `(async () => { const t0 = performance.now(); for (;;) { const h = window.__emenlaHistory; const there = !h.rolling && (typeof h.year === 'string' ? h.shown === h.year : Math.abs(h.year - h.shown) < 0.01); if (there || performance.now() - t0 > 2000) return; await new Promise(r => setTimeout(r, 50)); } })()`;
/* The clock's digits measured on a canvas at the glyphs' computed font: the widest digit's ink against the cell's width,
   and the ink's top and bottom against the cell's height, with the baseline where a line box of that height puts it */
const ink = `(() => {
  const yr = document.querySelector('.hs-year'), cell = yr.querySelector('.hs-cell'), glyph = yr.querySelector('.hs-strip > b');
  const c = getComputedStyle(cell), g = getComputedStyle(glyph);
  const ctx = document.createElement('canvas').getContext('2d'); ctx.font = g.fontWeight + ' ' + g.fontSize + ' ' + g.fontFamily;
  let w = 0, asc = 0, desc = 0, m;
  for (const d of '0123456789') { m = ctx.measureText(d); w = Math.max(w, m.actualBoundingBoxLeft + m.actualBoundingBoxRight); asc = Math.max(asc, m.actualBoundingBoxAscent); desc = Math.max(desc, m.actualBoundingBoxDescent); }
  const lh = parseFloat(g.lineHeight), base = (lh + m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2;
  return { font: ctx.font, cellW: +parseFloat(c.width).toFixed(1), cellH: +parseFloat(c.height).toFixed(1), glyphH: +parseFloat(g.height).toFixed(1), lh, ink: +w.toFixed(1), top: +(base - asc).toFixed(1), bottom: +(base + desc).toFixed(1) };
})()`;
const yearClip = `(() => { const r = document.querySelector('.hs-year').getBoundingClientRect(); return { x: r.left + scrollX - 8, y: r.top + scrollY - 8, width: r.width + 16, height: r.height + 16 }; })()`; // the clip is in document coordinates
const blurPx = f => parseFloat((f.match(/blur\(([\d.]+)px\)/) || [0, 0])[1]);
/* Lazy pictures: walk every card into view so each one loads, then read what arrived */
const pictures = `(async () => {
  document.documentElement.style.scrollBehavior = 'auto';
  const imgs = [...document.querySelectorAll('#history .hcard__img')];
  for (const img of imgs) { img.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 250)); if (!img.complete) await new Promise(r => { img.onload = img.onerror = r; setTimeout(r, 4000); }); }
  return imgs.map(i => ({ src: i.currentSrc.split('/').pop(), w: i.naturalWidth, shown: Math.round(i.getBoundingClientRect().width), file: parseInt(i.currentSrc.split('-').pop(), 10) || 0, ok: i.complete && i.naturalWidth > 0, filter: getComputedStyle(i).filter,
    credit: (i.closest('figure') || {}).querySelector ? i.closest('figure').querySelector('.hcard__credit a') !== null : false }));
})()`;

/* Desktop 1440x900: the ledger, the live row mid-hold and complete, the history type, clock and pictures */
const d = await b.page(url, { width: 1440, height: 900 }); await d.eval(wait(600));
{
  await d.eval(toWords);
  const rows = await d.eval(ledger), f = await d.eval(serif(['#your-words', '#history']));
  const bad = [];
  if (rows.length !== 4) bad.push(`${rows.length} ledger rows, expected 4 (three pairs and the live row)`);
  for (const [i, r] of rows.entries()) {
    // the live row's term waits 14px low and hidden until the hold completes; it is checked level after it
    if (!r.live && Math.abs(r.saidTop - r.nameTop) > 2) bad.push(`row ${i}: sentence top ${r.saidTop}, term top ${r.nameTop}`);
    if (!r.live && r.line !== 1) bad.push(`row ${i}: line at scaleX ${r.line} after the reveal`);
  }
  if (f.hits.length || f.faces) bad.push(`serif: ${JSON.stringify(f)}`);
  await d.shot(`${out}/d-words.png`);
  report('d-words', bad, { rows });
}
{
  await d.eval(toLive);
  const before = await d.eval(live);
  const btn = await d.eval(centre('.hold__btn'));
  await d.mouse('mouseMoved', btn.x, btn.y); await d.mouse('mousePressed', btn.x, btn.y);
  const mid = await d.eval(`${wait(850)}.then(() => ${live})`);
  await d.shot(`${out}/d-live-mid.png`);
  const bad = [];
  if (before.hp !== 0 || before.line !== 0 || before.done) bad.push(`before the hold: ${JSON.stringify(before)}`);
  if (!(mid.hp > 0.3 && mid.hp < 0.7)) bad.push(`--hp ${mid.hp} at 850ms, expected 0.3 to 0.7`);
  if (Math.abs(mid.line - mid.hp) > 0.05) bad.push(`line ${mid.line} does not follow --hp ${mid.hp}`);
  if (!(mid.written > 3 && mid.faint > 3)) bad.push(`sentence not part-written: ${mid.written} written, ${mid.faint} faint of ${mid.chars}`);
  if (mid.done) bad.push('done mid-hold');
  report('d-live-mid', bad, { before: { hp: before.hp, line: before.line }, mid });
  await d.eval(wait(1300)); await d.mouse('mouseReleased', btn.x, btn.y);
  const done = await d.eval(`${wait(1200)}.then(() => ${live})`);
  await d.shot(`${out}/d-live-done.png`);
  const bad2 = [];
  if (!done.done || done.hp !== 1 || done.line !== 1) bad2.push(`not complete: ${JSON.stringify(done)}`);
  if (done.written !== done.chars) bad2.push(`${done.written} of ${done.chars} characters written`);
  if (done.name < 0.99) bad2.push(`term opacity ${done.name}`);
  const rows = await d.eval(ledger), lr = rows[rows.length - 1];
  if (Math.abs(lr.saidTop - lr.nameTop) > 2) bad2.push(`live row: sentence top ${lr.saidTop}, term top ${lr.nameTop}`);
  report('d-live-done', bad2, { done });
}
{
  /* The clock at 4x: a year mid-history at rest, for clipped ink in the cells */
  await d.eval(`document.documentElement.style.scrollBehavior = 'auto'; document.querySelectorAll('#history .hcard')[2].scrollIntoView({ block: 'center' }); ${wait(300)}`);
  await d.eval(settle); await d.eval(wait(700));
  const { data } = await d.send('Page.captureScreenshot', { format: 'png', clip: { ...(await d.eval(yearClip)), scale: 4 } });
  writeFileSync(`${out}/d-clock-4x.png`, Buffer.from(data, 'base64'));
  const type = await d.eval(`(() => { const s = getComputedStyle(document.querySelector('.hs-year')), c = getComputedStyle(document.querySelector('.hs-cell')), g = getComputedStyle(document.querySelector('.hs-gap')), yr = getComputedStyle(document.querySelector('.hcard__year'));
    return { year: s.fontFamily.split(',')[0] + ' ' + s.fontWeight + ' ' + s.fontSize, cell: c.width, gap: g.fontStyle + ' ' + g.fontWeight, era: yr.fontWeight + ' ' + yr.fontSize }; })()`);
  const glyphs = await d.eval(ink);
  /* Then 100ms into a jump of two eras, caught while the strips still move: the units blurred most, the thousands crisp */
  const jump = await d.eval(`(() => { const r = document.querySelectorAll('#history .hcard')[4].getBoundingClientRect(); return Math.round(scrollY + r.top + r.height / 2 - innerHeight / 2); })()`);
  const roll = await d.eval(`(async () => { window.scrollTo(0, ${jump}); await ${wait(100)};
    const yr = document.querySelector('.hs-year'), r = yr.getBoundingClientRect(), h = window.__emenlaHistory;
    return { rolling: yr.classList.contains('is-rolling'), shown: typeof h.shown === 'number' ? +h.shown.toFixed(2) : h.shown, year: h.year, filters: [...yr.querySelectorAll('.hs-strip')].map(s => getComputedStyle(s).filter),
      clip: { x: r.left + scrollX - 8, y: r.top + scrollY - 8, width: r.width + 16, height: r.height + 16 } }; })()`);
  const { data: rollPng } = await d.send('Page.captureScreenshot', { format: 'png', clip: { ...roll.clip, scale: 4 } });
  writeFileSync(`${out}/d-clock-4x-roll.png`, Buffer.from(rollPng, 'base64'));
  await d.eval(settle);
  const pics = await d.eval(pictures);
  const nPics = await d.eval(`document.querySelectorAll('#history picture').length`), nCards = await d.eval(`document.querySelectorAll('#history .hcard').length`);
  const bad = [];
  if (glyphs.ink > glyphs.cellW + 0.5) bad.push(`digit ink ${glyphs.ink}px wide in a ${glyphs.cellW}px cell`);
  if (glyphs.top < 0.09 * glyphs.cellH - 0.5 || glyphs.bottom > 0.91 * glyphs.cellH + 0.5) bad.push(`digit ink from ${glyphs.top} to ${glyphs.bottom}px in a ${glyphs.cellH}px cell whose mask fades 9% at each edge`);
  if (!roll.rolling) bad.push('clock not rolling 100ms into a jump');
  if (!(blurPx(roll.filters[3]) > 0.5)) bad.push(`units strip filter ${roll.filters[3]} mid-jump, expected a blur`);
  if (blurPx(roll.filters[0]) > 0.01) bad.push(`thousands strip filter ${roll.filters[0]} mid-jump, expected crisp`);
  if (pics.length !== nPics || nPics < 1) bad.push(`${pics.length} pictures for ${nPics} <picture> elements`);
  // naturalWidth from a srcset is already divided by the density the browser picked, so compare the file's own width
  for (const p of pics) {
    if (!p.ok || p.file < p.shown) bad.push(`${p.src}: loaded ${p.ok}, file ${p.file}px for ${p.shown}px shown`);
    if (p.filter !== 'none') bad.push(`${p.src}: filter ${p.filter}, a sourced picture is shown as provided`);
    if (!p.credit) bad.push(`${p.src}: no linked credit under it`);
  }
  if (type.gap.startsWith('italic')) bad.push('gap caption still italic');
  for (let n = 0; n < nCards; n++) {
    await d.eval(`document.querySelectorAll('#history .hcard')[${n}].scrollIntoView({ block: 'center' }); ${wait(700)}`);
    const r = await d.eval(`(() => { const r = document.querySelectorAll('#history .hcard')[${n}].getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height }; })()`);
    const { data: png } = await d.send('Page.captureScreenshot', { format: 'png', clip: { ...r, scale: 1 } });
    writeFileSync(`${out}/d-hist-${n}.png`, Buffer.from(png, 'base64'));
  }
  const o = await d.eval(overflow);
  if (o > 0) bad.push(`overflow ${o}px`);
  if (d.errors.length) bad.push(...d.errors);
  report('d-history', bad, { type, glyphs, roll: { rolling: roll.rolling, shown: roll.shown, year: roll.year, filters: roll.filters }, pics: pics.map(p => `${p.src} ${p.file}/${p.shown}`) });
}
await d.close();

/* Phone 375x812: the ledger stacked, the history pictures and their credits on a phone */
const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true }); await m.eval(wait(600));
{
  await m.eval(toWords);
  const rows = await m.eval(ledger), o = await m.eval(overflow);
  const stack = await m.eval(`[...document.querySelectorAll('#your-words .ledger__row')].slice(0, 3).map(r => r.querySelector('.ledger__term').getBoundingClientRect().top > r.querySelector('.ledger__said').getBoundingClientRect().bottom)`);
  const bad = [];
  if (stack.includes(false)) bad.push(`term not below the sentence: ${stack}`);
  for (const [i, r] of rows.entries()) if (r.lineW !== 48) bad.push(`row ${i}: line ${r.lineW}px wide, expected 48`);
  if (o > 0) bad.push(`overflow ${o}px`);
  await m.shot(`${out}/m-words.png`);
  await m.eval(toLive); await m.shot(`${out}/m-live.png`);
  /* On a phone the button sits under the sentence and the term lands below it; a touch hold must still complete */
  const order = await m.eval(`(() => { const h = document.querySelector('[data-hold]'), t = s => h.querySelector(s).getBoundingClientRect();
    return { said: Math.round(t('.ledger__said').bottom), btn: Math.round(t('.hold__btn').top), term: Math.round(t('.ledger__term').top) }; })()`);
  if (!(order.said < order.btn && order.btn < order.term)) bad.push(`phone live row order: ${JSON.stringify(order)}`);
  const tb = await m.eval(centre('.hold__btn'));
  await m.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: tb.x, y: tb.y }] });
  await m.eval(wait(2200));
  await m.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  const mdone = await m.eval(`${wait(1200)}.then(() => ${live})`);
  if (!mdone.done || mdone.written !== mdone.chars || mdone.name < 0.99) bad.push(`phone touch hold: ${JSON.stringify(mdone)}`);
  await m.shot(`${out}/m-live-done.png`);
  await m.eval(`document.querySelector('#history .hcard__img').closest('.hcard').scrollIntoView({ block: 'center' }); ${wait(1500)}`);
  await m.shot(`${out}/m-hist.png`);
  await m.eval(`document.querySelector('#history .hcard[data-year="2014"]').scrollIntoView({ block: 'center' }); ${wait(1500)}`);
  await m.shot(`${out}/m-hist-2014.png`);
  /* Every credit stays inside its card */
  const credits = await m.eval(`[...document.querySelectorAll('#history .hcard__credit')].map(c => { const r = c.getBoundingClientRect(), p = c.closest('.hcard').getBoundingClientRect(); return { w: Math.round(r.width), over: Math.round(Math.max(0, r.right - p.right)), lines: Math.round(r.height / parseFloat(getComputedStyle(c).lineHeight)) }; })`);
  if (credits.some(c => c.over > 0)) bad.push(`a credit runs past its card: ${JSON.stringify(credits)}`);
  if (m.errors.length) bad.push(...m.errors);
  report('m-words', bad, { lines: rows.map(r => r.lineW), credits });
}
await m.close();

/* Reduced motion: every line drawn and the live row complete with no hold */
const r = await b.page(url, { width: 1440, height: 900, rm: true }); await r.eval(wait(600));
{
  await r.eval(toWords);
  const rows = await r.eval(ledger), l = await r.eval(live);
  const btn = await r.eval(`getComputedStyle(document.querySelector('.hold__btn')).display`);
  const bad = [];
  for (const [i, row] of rows.entries()) if (row.line !== 1) bad.push(`row ${i}: line ${row.line}`);
  if (!l.done || l.written !== l.chars) bad.push(`live row not pinned: ${JSON.stringify(l)}`);
  if (btn !== 'none') bad.push(`hold button display ${btn}`);
  await r.shot(`${out}/rm-words.png`);
  await r.eval(toLive); await r.shot(`${out}/rm-live.png`);
  if (r.errors.length) bad.push(...r.errors);
  report('rm-words', bad, { lines: rows.map(x => x.line), done: l.done });
}
await r.close();

/* The science hero: its one violet word is Hanken now */
const s = await b.page(new URL('science/', url).href, { width: 1440, height: 900 }); await s.eval(wait(600));
{
  const f = await s.eval(serif(['.sci-hero', 'main']));
  const v = await s.eval(`(() => { const e = document.querySelector('.voice'); if (!e) return null; const c = getComputedStyle(e); return { family: c.fontFamily.split(',')[0], style: c.fontStyle, color: c.color }; })()`);
  const bad = [];
  if (f.hits.length || f.faces) bad.push(`serif: ${JSON.stringify(f)}`);
  if (v && v.style !== 'normal') bad.push(`.voice is ${v.style}`);
  if (s.errors.length) bad.push(...s.errors);
  await s.shot(`${out}/sci-hero.png`);
  report('science', bad, { voice: v });
}
await s.close();

b.close();
console.log(failed ? `${failed} check(s) failed` : 'all checks pass');
process.exit(failed ? 1 : 0);
