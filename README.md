# Emenla website

The public site for Emenla, an iPhone app for people with endometriosis. Built with the 10k-websites
flow: one scroll-scrubbed hero video, plain HTML, CSS and vanilla JavaScript, no build step.

## Folders

| Path | What |
|------|------|
| `site/` | **The website. This is the folder that goes online.** `index.html` plus `assets/`, the privacy, terms and support pages, `404.html`, `og.png`, `robots.txt`, `sitemap.xml`, `.htaccess`. |
| `site/assets/js/site.js` | Entrances, the hold moment, the email form. **The Formspree endpoint goes in `FORM_ENDPOINT` at the top.** |
| `site/assets/js/hero.js` | The scroll-scrubbed hero. |
| `site/assets/css/site.css` | One stylesheet for every page. Tokens at the top. |
| `design-package.md` | Every design decision and every line of copy. |
| `Logo-Emenla/` | The founder's logo source (white background). `site/assets/img/logo.png` is the transparent cut, `logo-small.png` the nav and footer mark, `favicon.png` and `apple-touch-icon.png` come from it. |
| `review/` | Raw generations, inspection frames, the font tarball. Never uploaded. |
| `tools/` | `drive.mjs` (headless Chrome driver), `selftest.mjs` (the self-test). |
| `src/`, `dist/`, `scripts/`, `content/`, `public/` | The previous version of the site, kept for reference. Not used by `site/`. |

## Preview it

```
cd site && python3 -m http.server 8080
```

Then open http://localhost:8080/ in a browser. Double-clicking `site/index.html` also works, but shows
the still-image hero instead of the video, because browsers block the video loader on `file://` pages.

## Self-test

With Chrome running headless on port 9222 and the preview server on 8080:

```
node tools/selftest.mjs http://127.0.0.1:8080/ /tmp/emenla-selftest
```

Runs the flick test, the worst-frame contrast audit, the hold moment, reduced motion in both
directions, the video-blocked page, phone hit areas and overflow, and checks both consoles.

## Before launch

Domain: **emenla.com** (registered at GoDaddy, 2026-08-27). Host: **Cloudflare Pages**.

Done: the live domain is set in `og:url`, `og:image`, `robots.txt` and `sitemap.xml`; the support
address is `hello@emenla.com` across privacy, terms and support; the hosting sentence in the privacy
page names Cloudflare; `site/_headers` carries the `.htaccess` caching rules over to Pages.

Still open:

1. Create a free Formspree form, turn off reCAPTCHA, paste its endpoint into `FORM_ENDPOINT` in `site/assets/js/site.js`. **Until this is filled the waitlist button cannot collect a single address.**
2. Set up `hello@emenla.com` — Cloudflare Email Routing, free, once the nameservers move.
3. Replace the `[operator name]` and `[governing law]` placeholders in `site/privacy/` and `site/terms/`. Search for `data-todo`.
4. Replace the empty phone screen in the privacy section with real app screenshots.
5. Legal review of the terms, then remove the "Awaiting legal review" notice.
6. At App Store launch: swap the "Be told" buttons for the App Store link (nav, hero settle, static hero, the close).

## Deploy

### Rollback

Before the Cloudflare switch, emenla.com used GoDaddy's nameservers `ns03.domaincontrol.com` and
`ns04.domaincontrol.com`, with the apex pointed at 13.248.243.5 and 76.223.105.230 (GoDaddy's
builder page). Putting those two nameservers back in GoDaddy undoes the whole move.

Cloudflare's assigned nameservers for this zone: `derek.ns.cloudflare.com` and
`keyla.ns.cloudflare.com`. DNSSEC was verified off at the .com registry before the switch (no DS
record), so no registrar-side DNSSEC step was needed.

### Deploying

`site/` is the publish directory. On Cloudflare Pages: upload `site/` (or point Pages at this repo
with build command empty and output directory `site`), then add `emenla.com` and `www.emenla.com` as
custom domains. `.htaccess` is kept for a future move to an Apache host; Pages ignores it and reads
`site/_headers` instead. Pages serves `404.html` automatically.
