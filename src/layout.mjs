// Shared layout for every page. Copy rules: no em dashes, no "just", no "at least",
// say "people with endometriosis". Every claim-bearing line comes from content/claims.json.

export function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function isTodo(v) {
  return v === undefined || v === null || v === '' || String(v).trim().toUpperCase() === 'TODO';
}

export function siteUrl(config) {
  // Canonical URLs need a real domain. Until one exists we build against a placeholder
  // that `npm run check` will refuse to ship.
  return isTodo(config.domain) ? 'https://emenla.example' : `https://${config.domain.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;
}

// ---------------------------------------------------------------------------
// Primary action. One component, three modes, switched from site.config.json.
// email    -> single-field capture, "be told the day it opens"
// instagram-> link to the Instagram profile (zero data collection option)
// appstore -> the real App Store badge, used at launch
// The rule from the app applies here: no dead controls. If the mode's target is
// still TODO the build prints a warning and `npm run check` fails.
// ---------------------------------------------------------------------------
export function primaryAction(config, { compact = false, id = '', path = '/' } = {}) {
  const mode = config.cta.mode;

  if (mode === 'appstore') {
    const href = isTodo(config.cta.appStoreUrl) ? '#' : config.cta.appStoreUrl;
    return `<a class="pill pill--primary" href="${esc(href)}" ${href === '#' ? 'data-todo="appStoreUrl"' : ''}>
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.42 2.2-1.24 3.06-.98 1.06-2.14 1.66-3.4 1.55a3.5 3.5 0 0 1-.03-.43c0-1.1.47-2.27 1.31-3.14.42-.45.96-.82 1.6-1.11.64-.29 1.25-.45 1.82-.48.02.19.03.37.03.55Zm3.72 16.27c-.36.83-.79 1.6-1.29 2.3-.68.96-1.24 1.63-1.67 2-.66.61-1.37.93-2.13.95-.55 0-1.21-.16-1.98-.47-.77-.32-1.48-.47-2.13-.47-.68 0-1.41.15-2.19.47-.78.32-1.41.48-1.89.5-.73.03-1.46-.29-2.18-.98-.47-.4-1.05-1.09-1.75-2.08-.75-1.05-1.36-2.27-1.84-3.66-.51-1.5-.77-2.96-.77-4.37 0-1.62.35-3.01 1.05-4.18a6.15 6.15 0 0 1 2.2-2.23 5.92 5.92 0 0 1 2.97-.84c.58 0 1.34.18 2.29.53.94.35 1.55.53 1.81.53.2 0 .87-.21 2.01-.62 1.08-.38 1.99-.54 2.73-.48 2.02.16 3.53.96 4.54 2.39-1.8 1.09-2.69 2.62-2.67 4.58.02 1.53.57 2.8 1.66 3.81.49.47 1.04.83 1.65 1.09-.13.39-.27.76-.42 1.12Z"/></svg>
      <span>Download on the App Store</span>
    </a>`;
  }

  if (mode === 'instagram') {
    const href = isTodo(config.instagram) ? '#' : `https://www.instagram.com/${config.instagram.replace(/^@/, '')}/`;
    return `<a class="pill pill--primary" href="${esc(href)}" rel="me noopener" ${href === '#' ? 'data-todo="instagram"' : ''}>Follow Emenla on Instagram</a>`;
  }

  // email mode
  if (compact) {
    const href = path === '/' ? '#notify' : '/#notify';
    return `<a class="pill pill--primary" href="${href}">Be told when it opens</a>`;
  }
  const endpoint = isTodo(config.cta.emailEndpoint) ? '' : config.cta.emailEndpoint;
  const fid = id || 'notify';
  return `
  <form class="capture" id="${esc(fid)}" method="post" action="${esc(endpoint || '#')}" data-endpoint="${esc(endpoint)}" ${endpoint ? '' : 'data-todo="emailEndpoint"'} novalidate>
    <label class="capture__label" for="${esc(fid)}-email">Email address</label>
    <div class="capture__row">
      <input class="capture__input" id="${esc(fid)}-email" name="email" type="email" autocomplete="email" inputmode="email" required aria-describedby="${esc(fid)}-help ${esc(fid)}-status" placeholder="you@example.com">
      <button class="pill pill--primary" type="submit">Be told the day it opens</button>
    </div>
    <p class="capture__help" id="${esc(fid)}-help">One message, on the day Emenla is on the App Store. Nothing else. Your address is used for that one message and then deleted.</p>
    <p class="capture__status" id="${esc(fid)}-status" role="status" aria-live="polite"></p>
  </form>`;
}

export function secondaryAction(config) {
  if (config.cta.mode === 'instagram') return '';
  const href = isTodo(config.instagram) ? '#' : `https://www.instagram.com/${config.instagram.replace(/^@/, '')}/`;
  return `<a class="link link--secondary" href="${esc(href)}" rel="me noopener" ${href === '#' ? 'data-todo="instagram"' : ''}>Follow along on Instagram</a>`;
}

// ---------------------------------------------------------------------------
// Cookie consent. Switched off. Nothing on this site sets a cookie or reads
// device storage without a user action (the only storage is the opt-out switch
// on the privacy page, which is set by the visitor and exempt from consent).
// Self-hosted fonts, no analytics, no embeds, no pixels. A banner on a site
// whose whole brand is "we collect nothing" would undercut the message, so the
// mechanism exists behind config.cookieBanner.enabled and stays false.
// ---------------------------------------------------------------------------
function cookieBanner(config) {
  if (!config.cookieBanner.enabled) return '<!-- cookie consent: disabled in site.config.json, nothing here requires consent -->';
  return `
  <div class="consent" role="region" aria-label="Cookie choices" hidden data-consent>
    <p>This site would like to set a cookie. It does not need to for anything you came here to do.</p>
    <div class="consent__actions">
      <button class="pill" type="button" data-consent-decline>No thanks</button>
      <button class="pill" type="button" data-consent-accept>Allow</button>
    </div>
  </div>`;
}

export function page({ config, path, title, description, body, ogImage = '/og.png', bodyClass = '', noindex = false }) {
  const base = siteUrl(config);
  const canonical = `${base}${path}`;
  const fullTitle = path === '/' ? `Emenla. ${title}` : `${title}. Emenla`;
  const founderLine = config.founder.show
    ? `Made by ${esc(config.founder.name)} in ${esc(config.founder.country)}.`
    : `Made in ${esc(config.founder.country)}.`;
  const supportHref = isTodo(config.supportEmail) ? '#' : `mailto:${config.supportEmail}`;

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  ${noindex ? '<meta name="robots" content="noindex">' : ''}
  <meta name="color-scheme" content="light">
  <meta name="theme-color" content="#ffffff">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Emenla">
  <meta property="og:title" content="${esc(fullTitle)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(base + ogImage)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Emenla. You're not imagining it.">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(fullTitle)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(base + ogImage)}">
  <link rel="preload" href="/fonts/Manrope-latin-ext.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="/styles.css">
</head>
<body class="${esc(bodyClass)}">
  <a class="skip" href="#main">Skip to content</a>

  <header class="nav" data-nav>
    <a class="nav__brand" href="/" aria-label="Emenla, home">Emenla</a>
    <nav class="nav__links" aria-label="Primary">
      <a href="/#your-words">How it works</a>
      <a href="/privacy/">Privacy</a>
      <a href="/support/">Support</a>
    </nav>
    ${primaryAction(config, { compact: true, path })}
  </header>

  <main id="main" tabindex="-1">
${body}
  </main>

  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <span class="footer__wordmark">Emenla</span>
        <p class="footer__line">${founderLine} Emenla is not a medical device and does not give medical advice.</p>
      </div>
      <nav class="footer__links" aria-label="Footer">
        <a href="/privacy/">Privacy</a>
        <a href="/terms/">Terms</a>
        <a href="/support/">Support</a>
        <a href="${esc(supportHref)}" ${supportHref === '#' ? 'data-todo="supportEmail"' : ''}>Contact</a>
        ${isTodo(config.instagram) ? '<a href="#" data-todo="instagram" rel="me">Instagram</a>' : `<a href="https://www.instagram.com/${esc(config.instagram.replace(/^@/, ''))}/" rel="me noopener">Instagram</a>`}
      </nav>
    </div>
  </footer>

  ${cookieBanner(config)}
  <script src="/main.js" defer data-analytics="${config.analytics.enabled && config.analytics.scriptUrl ? esc(config.analytics.scriptUrl) : ''}"></script>
</body>
</html>`;
}
