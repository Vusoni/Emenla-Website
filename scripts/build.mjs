// Builds the static site into dist/. No bundler, no framework: Node only.
import { readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import home from '../src/pages/home.mjs';
import privacy from '../src/pages/privacy.mjs';
import terms from '../src/pages/terms.mjs';
import support from '../src/pages/support.mjs';
import notfound from '../src/pages/notfound.mjs';
import { siteUrl, isTodo } from '../src/layout.mjs';

const root = new URL('..', import.meta.url).pathname;
const dist = join(root, 'dist');
const config = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));
const claims = JSON.parse(readFileSync(join(root, 'content/claims.json'), 'utf8'));

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

const pages = [
  { out: 'index.html', render: home, path: '/' },
  { out: 'privacy/index.html', render: privacy, path: '/privacy/' },
  { out: 'terms/index.html', render: terms, path: '/terms/' },
  { out: 'support/index.html', render: support, path: '/support/' },
  { out: '404.html', render: notfound, path: null },
];

// Optional base path for hosts that serve the site under a sub-folder, e.g. GitHub
// Pages at https://<user>.github.io/<repo>/. Set BASE_PATH=/<repo>/ at build time.
// Production on a real domain leaves it empty.
const basePath = (process.env.BASE_PATH || '').replace(/\/?$/, '/').replace(/^\/?/, '/');
const rebase = (s) => basePath === '/' ? s : s
  .replace(/(href|src)="\/(?!\/)/g, `$1="${basePath}`)
  .replace(/url\('\/fonts/g, `url('${basePath}fonts`);

for (const p of pages) {
  const html = rebase(p.render({ config, claims }));
  const target = join(dist, p.out);
  mkdirSync(join(target, '..'), { recursive: true });
  writeFileSync(target, html);
}

// Static assets
cpSync(join(root, 'public'), dist, { recursive: true });
writeFileSync(join(dist, 'styles.css'), rebase(readFileSync(join(root, 'src/styles.css'), 'utf8')));
cpSync(join(root, 'src/main.js'), join(dist, 'main.js'));

// robots.txt and sitemap.xml from the configured domain
const base = siteUrl(config);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /404.html\n\nSitemap: ${base}/sitemap.xml\n`);
const urls = pages.filter(p => p.path).map(p => `  <url>\n    <loc>${base}${p.path}</loc>\n    <lastmod>${config.lastUpdated}</lastmod>\n  </url>`).join('\n');
writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

// Warnings for anything still TODO. `npm run check` turns these into failures.
const todos = [];
if (isTodo(config.domain)) todos.push('domain (canonical URLs, sitemap and share URLs are built against https://emenla.example)');
if (isTodo(config.supportEmail)) todos.push('supportEmail (privacy, terms, support and footer show a placeholder)');
if (isTodo(config.instagram)) todos.push('instagram (secondary action links to #)');
if (config.cta.mode === 'email' && isTodo(config.cta.emailEndpoint)) todos.push('cta.emailEndpoint (the sign-up form is a dead control until this is set, or switch cta.mode to instagram)');
if (config.cta.mode === 'appstore' && isTodo(config.cta.appStoreUrl)) todos.push('cta.appStoreUrl');
for (const k of ['operatorName', 'operatorAddress', 'governingLaw', 'hostingProvider', 'hostingRegion']) if (isTodo(config.legal[k])) todos.push(`legal.${k}`);

console.log(`Built ${pages.length} pages to dist/ (base ${base}${basePath === '/' ? '' : ', path ' + basePath})`);
if (todos.length) {
  console.log(`\n${todos.length} launch blockers still TODO in site.config.json:`);
  for (const t of todos) console.log(`  - ${t}`);
}
if (!existsSync(join(dist, 'og.png'))) console.log('\nWarning: dist/og.png missing. Run `npm run assets`.');
