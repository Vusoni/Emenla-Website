// The headline under the pointer. node tools/headhover.mjs <url> <outdir>
import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
await p.eval(wait(2500));
const info = await p.eval("(() => { const h = document.querySelector('.band--1 .hook'); const ws = h.querySelectorAll('.split .w'); return { words: ws.length, texts: Array.from(ws).map(w => w.textContent), rect: (r => ({x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height)}))(ws[2] ? ws[2].getBoundingClientRect() : h.getBoundingClientRect()) }; })()");
console.log('split', JSON.stringify(info));
await p.shot(`${out}/rest.png`);
await p.mouse('mouseMoved', info.rect.x + info.rect.w / 2, info.rect.y + info.rect.h / 2);
await p.eval(wait(600));
await p.shot(`${out}/hover.png`);
console.log('lifted', await p.eval("Array.from(document.querySelectorAll('.band--1 .split .w')).map(w => +(w.style.getPropertyValue('--h') || 0)).filter(v => v > 0.02).length"));
await p.mouse('mouseMoved', 1350, 120); await p.eval(wait(900));
console.log('after leave', await p.eval("Array.from(document.querySelectorAll('.band--1 .split .w')).map(w => +(w.style.getPropertyValue('--h') || 0)).filter(v => v > 0.02).length"), p.errors.length ? p.errors : 'console clean');
await p.close(); b.close();
