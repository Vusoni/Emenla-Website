// Internal links must resolve to a built file. External links are listed for a
// manual check, because this build environment cannot reach most of them.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out); else if (p.endsWith('.html')) out.push(p);
  }
  return out;
}

let bad = 0;
const external = new Set();
for (const file of walk(dist)) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href = m[1];
    if (href.startsWith('http')) { external.add(href); continue; }
    if (href.startsWith('mailto:')) continue;
    if (href === '#') { console.log(`DEAD    ${file.replace(dist, '')}: href="#" (a TODO control)`); bad++; continue; }
    if (href.startsWith('#')) { if (!ids.has(href.slice(1))) { console.log(`ANCHOR  ${file.replace(dist, '')}: ${href}`); bad++; } continue; }
    const [path, hash] = href.split('#');
    const candidates = [join(dist, path), join(dist, path, 'index.html')];
    if (!candidates.some(existsSync)) { console.log(`MISSING ${file.replace(dist, '')}: ${href}`); bad++; continue; }
    if (hash) {
      const target = candidates.find(existsSync);
      const t = existsSync(join(dist, path, 'index.html')) ? join(dist, path, 'index.html') : target;
      if (t.endsWith('.html')) {
        const tHtml = readFileSync(t, 'utf8');
        if (!tHtml.includes(`id="${hash}"`)) { console.log(`ANCHOR  ${file.replace(dist, '')}: ${href}`); bad++; }
      }
    }
  }
}
console.log(`\nInternal links: ${bad ? bad + ' problem(s)' : 'all resolve'}.`);
console.log(`External links to check by hand (${external.size}):`);
for (const u of [...external].sort()) console.log(`  ${u}`);
process.exit(bad ? 1 : 0);
