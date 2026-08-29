import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
await p.eval(wait(2400));
await p.shot(`${out}/glass-k1.png`);
for (const k of [0.15, 0.35]) {
  await p.eval(`(() => { const b = document.querySelector('.band--1'); b.style.setProperty('--k', ${k}); b.style.setProperty('--op', 1); })()`);
  await p.eval(wait(150));
  await p.shot(`${out}/glass-k${k}.png`);
}
console.log('desktop', JSON.stringify(await p.eval(`(() => { const g = document.querySelector('.band--1 .hook-glass'); const cs = getComputedStyle(g); const r = g.getBoundingClientRect(); return { backdrop: cs.backdropFilter || cs.webkitBackdropFilter, w: Math.round(r.width), h: Math.round(r.height), sheen: getComputedStyle(g, '::after').animationName }; })()`)), p.errors.length ? p.errors : 'console clean');
await p.close();
const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true });
await m.eval(wait(1800)); await m.shot(`${out}/glass-m.png`);
console.log('phone', m.errors.length ? m.errors : 'console clean'); await m.close(); b.close();
