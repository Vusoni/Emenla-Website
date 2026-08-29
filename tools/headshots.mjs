// The hero headline: entrance states, settled, phone. node tools/headshots.mjs <url> <outdir>
import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
await p.eval(wait(2500));
await p.shot(`${out}/settled.png`);
console.log('type', JSON.stringify(await p.eval("(() => { const h = document.querySelector('.band--1 .hook'); const cs = getComputedStyle(h); return { family: cs.fontFamily.split(',')[0], weight: cs.fontWeight, size: cs.fontSize, tracking: cs.letterSpacing, style: cs.fontStyle, color: cs.color, shadow: cs.textShadow.slice(0, 60), after: getComputedStyle(h, '::after').content }; })()")));
for (const k of [0.2, 0.6, 1]) {
  await p.eval(`(() => { const el = document.querySelector('.band--1'); el.style.setProperty('--k', ${k}); el.style.setProperty('--op', 1); })()`);
  await p.eval(wait(200));
  await p.shot(`${out}/k${k}.png`);
}
await p.eval("(() => { const el = document.querySelector('.band--1'); el.style.removeProperty('--k'); el.style.removeProperty('--op'); })()");
console.log(p.errors.length ? p.errors : 'console clean');
await p.close();
const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true });
await m.eval(wait(1800)); await m.shot(`${out}/phone.png`);
console.log('phone', m.errors.length ? m.errors : 'console clean'); await m.close(); b.close();
