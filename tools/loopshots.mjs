import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const p = await b.page(url, { width: 1440, height: 900 });
for (const id of ['asked', 'context']) {
  await p.scroll(await p.eval(`document.getElementById('${id}').offsetTop - 40`)); await p.eval(wait(1500));
  const rr = await p.eval(`(() => { const r = document.querySelector('#${id} .rail').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  await p.mouse('mouseMoved', rr.x, rr.y); await p.eval(wait(300));
  const info0 = await p.eval(`(() => { const r = document.querySelector('#${id} .rail'); return { items: r.children.length, clones: r.querySelectorAll('.is-clone').length, left: r.scrollLeft, sw: r.scrollWidth, cw: r.clientWidth }; })()`);
  console.log(id, 'init', JSON.stringify(info0));
  const nb = await p.eval(`(() => { const r = document.querySelector('#${id} [data-carousel-next]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  for (let i = 0; i < 9; i++) { await p.mouse('mousePressed', nb.x, nb.y); await p.mouse('mouseReleased', nb.x, nb.y); await p.eval(wait(650)); await p.mouse('mouseMoved', rr.x, rr.y); }
  await p.shot(`${out}/${id}-after9.png`);
  const info1 = await p.eval(`(() => { const r = document.querySelector('#${id} .rail'); const nextOff = document.querySelector('#${id} [data-carousel-next]').classList.contains('is-off'); const lis = Array.from(r.children); const vis = lis.filter(li => { const b = li.getBoundingClientRect(), rb = r.getBoundingClientRect(); return b.right > rb.left && b.left < rb.right; }).length; return { left: r.scrollLeft, remaining: r.scrollWidth - r.clientWidth - r.scrollLeft, visible: vis, nextOff }; })()`);
  console.log(id, 'after 9 next', JSON.stringify(info1));
  const pb = await p.eval(`(() => { const r = document.querySelector('#${id} [data-carousel-prev]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  for (let i = 0; i < 14; i++) { await p.mouse('mousePressed', pb.x, pb.y); await p.mouse('mouseReleased', pb.x, pb.y); await p.eval(wait(650)); await p.mouse('mouseMoved', rr.x, rr.y); }
  const info2 = await p.eval(`(() => { const r = document.querySelector('#${id} .rail'); return { left: r.scrollLeft, prevOff: document.querySelector('#${id} [data-carousel-prev]').classList.contains('is-off') }; })()`);
  console.log(id, 'after 14 prev', JSON.stringify(info2));
}
console.log(p.errors.length ? p.errors : 'console clean'); await p.close(); b.close();
