// Prove the headline does not answer the pointer. node tools/inert.mjs <url>
import { connect } from './drive.mjs';
const [url] = process.argv.slice(2);
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
await p.eval(wait(2500));
const snap = () => p.eval("(() => { const h = document.querySelector('.band--1 .hook'); const cs = getComputedStyle(h); const r = h.getBoundingClientRect(); return { color: cs.color, shadow: cs.textShadow, translate: cs.translate, scale: cs.scale, top: Math.round(r.top), spans: h.querySelectorAll('.split .w, .split .c').length }; })()");
const r = await p.eval("(() => { const h = document.querySelector('.band--1 .hook').getBoundingClientRect(); return { x: h.left + h.width/2, y: h.top + h.height/2 }; })()");
const before = await snap();
await p.mouse('mouseMoved', r.x, r.y); await p.eval(wait(900));
const after = await snap();
console.log('headline at rest :', JSON.stringify(before));
console.log('headline hovered :', JSON.stringify(after));
console.log('IDENTICAL        :', JSON.stringify(before) === JSON.stringify(after));
const cap = await p.eval("(() => { const c = document.querySelector('.band--2 .split .c'); return { units: document.querySelectorAll('.band--2 .split .c').length }; })()");
console.log('caption units    :', JSON.stringify(cap), p.errors.length ? p.errors : 'console clean');
await p.close(); b.close();
