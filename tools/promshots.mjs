import { connect } from './drive.mjs';
import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2);
mkdirSync(out, { recursive: true });
const b = await connect();
for (const [tag, w, h, touch] of [['d', 1440, 900, false], ['m', 375, 812, true]]) {
  const p = await b.page(url, { width: w, height: h, touch, mobile: touch });
  const y = await p.eval("document.getElementById('promises').offsetTop - 60");
  await p.scroll(y);
  await p.eval('new Promise(r => setTimeout(r, 1500))');
  await p.shot(`${out}/prom-${tag}.png`);
  console.log(tag, p.errors.length ? p.errors : 'console clean');
  await p.close();
}
// the logo row, rendered with text stand-ins only for this check
const p = await b.page(url, { width: 1440, height: 900 });
await p.eval(`(() => { const sec = document.querySelector('#promises .wrap'); const names = ['Alpha Health', 'Beta Times', 'Gamma Journal', 'Delta Daily', 'Epsilon Weekly', 'Zeta News']; const track = () => '<ul class="logos__track">' + names.map(n => '<li><span style="font: 600 22px/1 Hanken Grotesk; letter-spacing:-0.02em; white-space:nowrap">' + n + '</span></li>').join('') + '</ul>'; const d = document.createElement('div'); d.className = 'logos'; d.innerHTML = track() + track(); sec.appendChild(d); })()`);
const y = await p.eval("document.getElementById('promises').offsetTop - 60");
await p.scroll(y);
await p.eval('new Promise(r => setTimeout(r, 600))');
await p.shot(`${out}/logos-a.png`);
await p.eval('new Promise(r => setTimeout(r, 1500))');
await p.shot(`${out}/logos-b.png`);
console.log('logos', p.errors.length ? p.errors : 'console clean');
await p.close(); b.close();
