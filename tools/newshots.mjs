// The statement at three scroll positions and the screens panels. node tools/newshots.mjs <url> <outdir>
import { connect } from './drive.mjs';
import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await connect();
for (const [tag, w, h, touch] of [['d', 1440, 900, false], ['m', 375, 812, true]]) {
  const p = await b.page(url, { width: w, height: h, touch, mobile: touch });
  const ys = await p.eval("(() => { const el = document.querySelector('[data-statement]'); const t = el.getBoundingClientRect().top + scrollY, h = el.offsetHeight, vh = innerHeight; return [0.05, 0.5, 1].map(p => Math.round(t - vh * 0.82 + p * (h + vh * 0.3))); })()");
  for (let i = 0; i < ys.length; i++) { await p.scroll(ys[i]); await p.shot(`${out}/stmt-${tag}-${i}.png`); }
  const info = await p.eval("(() => { const el = document.querySelector('[data-statement]'); const ws = el.querySelectorAll('.w'); const last = ws[ws.length - 1]; return { words: ws.length, n: getComputedStyle(el).getPropertyValue('--n').trim(), p: getComputedStyle(el).getPropertyValue('--p').trim(), lastOpacity: getComputedStyle(last).opacity, lastColor: getComputedStyle(last).color, firstColor: getComputedStyle(ws[0]).color }; })()");
  console.log(tag, 'statement', JSON.stringify(info));
  const sy = await p.eval("document.getElementById('screens').offsetTop - 40");
  await p.scroll(sy);
  await p.eval('new Promise(r => setTimeout(r, 1500))');
  await p.shot(`${out}/screens-${tag}.png`);
  const crop = await p.eval("(() => { const pn = document.querySelector('.panel').getBoundingClientRect(), d = document.querySelector('.panel .device').getBoundingClientRect(), a = document.querySelector('.panel__link').getBoundingClientRect(); return { crop: ((pn.bottom - d.top) / d.height).toFixed(2), linkH: Math.round(a.height), panelH: Math.round(pn.height) }; })()");
  console.log(tag, 'screens', JSON.stringify(crop));
  console.log(tag, p.errors.length ? p.errors : 'console clean');
  await p.close();
}
const r = await b.page(url, { width: 1440, height: 900, rm: true });
const rmInfo = await r.eval("(() => { const el = document.querySelector('[data-statement]'); const ws = el.querySelectorAll('.w'); return { p: getComputedStyle(el).getPropertyValue('--p').trim(), firstOpacity: getComputedStyle(ws[0]).opacity, firstColor: getComputedStyle(ws[0]).color }; })()");
console.log('rm', JSON.stringify(rmInfo), r.errors.length ? r.errors : 'console clean');
await r.close(); b.close();
