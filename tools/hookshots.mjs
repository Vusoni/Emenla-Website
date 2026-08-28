// Preview the hero headline at forced states: node tools/hookshots.mjs <url> <outdir>
import { connect } from './drive.mjs';
import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await connect();
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`new Promise(r => { const st = document.querySelector('.hero__stage'); const t = setInterval(() => { if (st.classList.contains('video-ready') || st.classList.contains('video-failed')) { clearInterval(t); r(); } }, 100); setTimeout(r, 8000); })`);
await p.eval('new Promise(r => setTimeout(r, 1600))');
const states = [['k0.15', 0.15, 1], ['k0.35', 0.35, 1], ['k0.6', 0.6, 1], ['k1', 1, 1], ['exit0.6', 1, 0.6], ['exit0.25', 1, 0.25]];
for (const [name, k, op] of states) {
  await p.eval(`(() => { document.querySelectorAll('.band--1 .hook').forEach(el => { el.style.setProperty('--k', ${k}); el.style.setProperty('--op', ${op}); }); return new Promise(r => setTimeout(r, 120)); })()`);
  await p.shot(`${out}/${name}.png`);
}
console.log('done', p.errors.length ? p.errors : 'console clean');
await p.close(); b.close();
