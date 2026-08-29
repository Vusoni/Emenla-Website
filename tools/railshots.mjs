import { connect } from './drive.mjs'; import { mkdirSync } from 'node:fs';
const [url, out] = process.argv.slice(2); mkdirSync(out, { recursive: true });
const b = await connect(); const wait = ms => `new Promise(r => setTimeout(r, ${ms}))`;
const p = await b.page(url, { width: 1440, height: 900 });
for (const id of ['asked', 'context']) {
  await p.scroll(await p.eval(`document.getElementById('${id}').offsetTop - 40`)); await p.eval(wait(1600));
  await p.shot(`${out}/${id}-d.png`);
  const nb = await p.eval(`(() => { const r = document.querySelector('#${id} [data-carousel-next]').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, vis: getComputedStyle(document.querySelector('#${id} [data-carousel-next]')).visibility }; })()`);
  console.log(id, 'next button', JSON.stringify(nb));
  await p.mouse('mousePressed', nb.x, nb.y); await p.mouse('mouseReleased', nb.x, nb.y); await p.eval(wait(900));
  await p.shot(`${out}/${id}-d-next.png`);
  console.log(id, 'after next', JSON.stringify(await p.eval(`(() => { const r = document.querySelector('#${id} .rail'); return { left: r.scrollLeft, prevOff: document.querySelector('#${id} [data-carousel-prev]').classList.contains('is-off') }; })()`)));
  const c = await p.eval(`(() => { const li = Array.from(document.querySelectorAll('#${id} .rail > li')).find(l => l.getBoundingClientRect().left > 40); const r = li.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; })()`);
  const before = await p.eval(`document.querySelector('#${id} .rail').scrollLeft`);
  await p.mouse('mousePressed', c.x, c.y); await p.mouse('mouseMoved', c.x - 120, c.y, { buttons: 1 }); await p.mouse('mouseMoved', c.x - 240, c.y, { buttons: 1 }); await p.mouse('mouseReleased', c.x - 240, c.y); await p.eval(wait(900));
  console.log(id, 'drag', JSON.stringify(await p.eval(`({ moved: document.querySelector('#${id} .rail').scrollLeft - ${before}, href: location.href, snapOn: getComputedStyle(document.querySelector('#${id} .rail')).scrollSnapType })`)));
}
console.log('desktop overflow', JSON.stringify(await p.eval(`({ sw: document.documentElement.scrollWidth, iw: innerWidth })`)), p.errors.length ? p.errors : 'console clean'); await p.close();
const m = await b.page(url, { width: 375, height: 812, touch: true, mobile: true });
for (const id of ['asked', 'context']) {
  await m.scroll(await m.eval(`document.getElementById('${id}').offsetTop - 20`)); await m.eval(wait(1400)); await m.shot(`${out}/${id}-m.png`);
  console.log(id, 'phone', JSON.stringify(await m.eval(`({ sw: document.documentElement.scrollWidth, iw: innerWidth, btn: getComputedStyle(document.querySelector('#${id} .rail__btn')).display, railW: document.querySelector('#${id} .rail').getBoundingClientRect().width })`)));
}
console.log('phone', m.errors.length ? m.errors : 'console clean'); await m.close();
const r = await b.page(url, { width: 1440, height: 900, rm: true });
await r.scroll(await r.eval(`document.getElementById('asked').offsetTop - 40`)); await r.eval(wait(400)); await r.shot(`${out}/asked-rm.png`);
console.log('rm revealsIn', await r.eval(`document.querySelectorAll('#asked .reveal:not(.in), #context .reveal:not(.in)').length`)); await r.close(); b.close();
