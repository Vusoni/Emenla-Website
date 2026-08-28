// The hero lines under the pointer. node tools/hovershots.mjs <url> <outdir>
import { connect } from './drive.mjs';
import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await connect();
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
const heroH = await p.eval("document.querySelector('.hero').offsetHeight");
const vh = 900;
for (const [name, prog, sel] of [['band2', 0.40, '.band--2 .split'], ['band3', 0.64, '.band--3 .split'], ['band4', 0.93, '.band--4 .split']]) {
  await p.scroll(Math.round(prog * (heroH - vh)));
  await p.eval('new Promise(r => setTimeout(r, 1500))');
  const r = await p.eval(`(() => { const b = document.querySelector('${sel}').getBoundingClientRect(); return { x: b.left + b.width * 0.42, y: b.top + b.height * 0.5, l: b.left, t: b.top, w: b.width, h: b.height }; })()`);
  await p.shot(`${out}/${name}-rest.png`);
  await p.mouse('mouseMoved', r.x, r.y);
  await p.eval('new Promise(r => setTimeout(r, 700))');
  await p.shot(`${out}/${name}-hover.png`);
  const hs = await p.eval(`Array.from(document.querySelectorAll('${sel} .c, ${sel} .w')).map(u => parseFloat(u.style.getPropertyValue('--h') || 0)).filter(v => v > 0).length`);
  console.log(name, JSON.stringify({ rect: [Math.round(r.l), Math.round(r.t), Math.round(r.w), Math.round(r.h)], lifted: hs }));
  await p.mouse('mouseMoved', 1300, 100);
  await p.eval('new Promise(r => setTimeout(r, 700))');
  const back = await p.eval(`Array.from(document.querySelectorAll('${sel} .c, ${sel} .w')).map(u => parseFloat(u.style.getPropertyValue('--h') || 0)).filter(v => v > 0).length`);
  console.log(name, 'settled back, still lifted:', back);
}
console.log('done', p.errors.length ? p.errors : 'console clean');
await p.close(); b.close();
