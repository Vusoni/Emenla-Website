import { connect } from './drive.mjs';
import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await connect();
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
const heroH = await p.eval("document.querySelector('.hero').offsetHeight");
for (const prog of [0.50, 0.56, 0.62, 0.70, 0.76]) {
  await p.scroll(Math.round(prog * (heroH - 900)));
  await p.eval('new Promise(r => setTimeout(r, 1200))');
  const st = await p.eval("(() => { const b = document.querySelector('.band--3'); const cs = getComputedStyle(b); const soft = b.querySelector('.soft'), sharp = b.querySelector('.sharp'); return { op: cs.getPropertyValue('--op').trim(), k: cs.getPropertyValue('--k').trim(), softOp: getComputedStyle(soft).opacity, sharpOp: getComputedStyle(sharp).opacity, sharpH: sharp.getBoundingClientRect().height, softH: soft.getBoundingClientRect().height, sharpLines: Math.round(sharp.getBoundingClientRect().height / 29), top: Math.round(b.getBoundingClientRect().top) }; })()");
  console.log(prog, JSON.stringify(st));
  await p.shot(`${out}/b3-${prog}.png`);
}
await p.close(); b.close();
