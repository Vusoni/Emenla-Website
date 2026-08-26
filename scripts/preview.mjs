// Inlines CSS, JS and the font into each built page so a single HTML file
// renders anywhere with no server. Preview only; not what gets deployed.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const out = join(root, 'preview');
mkdirSync(out, { recursive: true });
const font = readFileSync(join(dist, 'fonts/Manrope-latin-ext.woff2')).toString('base64');
const css = readFileSync(join(dist, 'styles.css'), 'utf8')
  .replace("url('/fonts/Manrope-latin-ext.woff2')", `url('data:font/woff2;base64,${font}')`);
const js = readFileSync(join(dist, 'main.js'), 'utf8');
const pages = { 'index.html': 'home', 'privacy/index.html': 'privacy', 'terms/index.html': 'terms', 'support/index.html': 'support', '404.html': '404' };
for (const [src, name] of Object.entries(pages)) {
  let html = readFileSync(join(dist, src), 'utf8');
  html = html.replace(/<link rel="preload"[^>]+>\s*/,'')
    .replace('<link rel="stylesheet" href="/styles.css">', `<style>${css}</style>`)
    .replace(/<script src="\/main.js" defer[^>]*><\/script>/, `<script>${js}</script>`)
    .replace(/<link rel="icon"[^>]+>\s*<link rel="apple-touch-icon"[^>]+>\s*/,'');
  writeFileSync(join(out, `emenla-${name}.html`), html);
}
console.log('preview files written');
