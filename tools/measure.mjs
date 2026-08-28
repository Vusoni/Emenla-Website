// Page weight, LCP and CLS at a given viewport: node tools/measure.mjs <url> <w> <h> [touch]
import { connect } from './drive.mjs';
const [url, w, h, touch] = process.argv.slice(2);
const b = await connect();
const p = await b.page(url, { width: +w, height: +h, touch: !!touch, mobile: !!touch });
await p.send('Runtime.evaluate', { expression: `window.__po = []; try { new PerformanceObserver(l => window.__po.push(...l.getEntries())).observe({type:'largest-contentful-paint', buffered:true}); } catch(e){}; window.__cls = 0; try { new PerformanceObserver(l => l.getEntries().forEach(e => { if(!e.hadRecentInput) window.__cls += e.value; })).observe({type:'layout-shift', buffered:true}); } catch(e){}` });
await p.eval('new Promise(r => setTimeout(r, 6000))');
const r = await p.eval(`(() => {
  const res = performance.getEntriesByType('resource'); const byType = {};
  res.forEach(e => { const m = e.name.match(/\\.(mp4|jpg|png|webp|avif|woff2|css|js)(\\?|$)/); const k = m ? m[1] : 'other'; byType[k] = byType[k] || {n:0, kb:0}; byType[k].n++; byType[k].kb += (e.transferSize || e.encodedBodySize || 0)/1024; });
  const nav = performance.getEntriesByType('navigation')[0];
  const lcpE = window.__po.length ? window.__po[window.__po.length-1] : null;
  const lcp = lcpE ? { t: Math.round(lcpE.startTime), size: lcpE.size, el: lcpE.element ? (lcpE.element.tagName + '.' + (lcpE.element.className||'')) : '?', url: (lcpE.url||'').split('/').pop() } : null;
  const out = {}; let total = 0; Object.keys(byType).forEach(k => { out[k] = byType[k].n + ' files, ' + Math.round(byType[k].kb) + ' KB'; total += byType[k].kb; });
  return { domContentLoaded: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd), htmlKB: Math.round((nav.transferSize||nav.encodedBodySize)/1024), totalKB: Math.round(total), byType: out, lcp, cls: +window.__cls.toFixed(4), requests: res.length };
})()`);
console.log(JSON.stringify(r, null, 1));
await p.close(); b.close();
