// Tile a page into viewport screenshots: node tools/tiles.mjs <url> <outdir> <prefix> [w] [h] [maxTiles]
import { connect } from './drive.mjs';
import { mkdirSync } from 'node:fs';

const [url, outdir, prefix = 'tile', w = '1440', h = '900', maxTiles = '18'] = process.argv.slice(2);
mkdirSync(outdir, { recursive: true });
const b = await connect();
const p = await b.page(url, { width: parseInt(w, 10), height: parseInt(h, 10) });
await p.eval('new Promise(r => setTimeout(r, 2500))');
await p.eval(`document.documentElement.style.scrollBehavior = 'auto'`);
const total = await p.eval('document.documentElement.scrollHeight');
console.log('page height', total);
const step = parseInt(h, 10);
let n = 0;
for (let y = 0; y < total && n < parseInt(maxTiles, 10); y += step, n++) {
  await p.eval(`window.scrollTo(0, ${y}); new Promise(r => setTimeout(r, 1400))`);
  await p.shot(`${outdir}/${prefix}-${String(n).padStart(2, '0')}-${y}.png`);
}
console.log('tiles', n);
if (p.errors.length) console.log('console:', p.errors.slice(0, 5));
await p.close();
b.close();
