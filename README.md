# Emenla website

The public site for Emenla, an iPhone app for people with endometriosis. Built with the 10k-websites
flow: one scroll-scrubbed hero video, plain HTML, CSS and vanilla JavaScript, no build step.

## Folders

| Path | What |
|------|------|
| `site/` | **The website. This is the folder that goes online.** `index.html` plus `assets/`, the privacy, terms and support pages, `404.html`, `og.png`, `robots.txt`, `sitemap.xml`, `.htaccess`. |
| `site/science/` | The science page: the evidence about endometriosis with 21 references (every DOI checked to resolve on 2026-08-28), the guidelines the app cites, and a plain statement of what has not been done (no trial, no clinician review). Update it when either changes. |
| `site/assets/js/site.js` | Entrances, the hold moment, reduced motion. No form: the site collects nothing. |
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

0. The Support page is gone; `site/_redirects` sends `/support/` to `/#faq`. For App Store Connect use `https://emenla.com/#faq` as the support URL (the footer on every page carries hello@emenla.com).
1. Set up `hello@emenla.com` — Cloudflare Email Routing, free, once the nameservers move.
2. Replace the `[operator name]` and `[governing law]` placeholders in `site/privacy/` and `site/terms/`. Search for `data-todo`.
3. Replace the empty phone screens with real app screenshots. There are three: one in `#privacy`
   and two in `#screens` (the Record and Document panels). In each `.device__screen`, delete
   `.device__mark` and `.device__hint` (keep `.device__notch` unless the screenshot carries its own
   status bar) and add
   `<picture><source type="image/avif" srcset="assets/img/screen-record.avif"><img src="assets/img/screen-record.jpg" alt="" width="560" height="1184" loading="lazy" decoding="async"></picture>`.
   Export at 560×1184 (twice the 280×592 screen); the existing `.device__screen img` rule crops it.
   New filenames need no `?v=` bump.
4. Legal review of the terms, then remove the "Awaiting legal review" notice.
5. At App Store launch: turn the "Coming soon" badge in the nav back into a link, pointing at the App Store page.
7. Quotes: `#asked` ("We asked before we built") shows the research record and no quotes. A woman's sentence goes on only with written consent that names this site; see "Adding a consented quote" below.
6. Press or partners: the `#promises` section under the hero carries a commented-out logo row (`.logos`, a seamless marquee). When there are real names, add one `<li><img>` per logo in both lists (SVG or PNG, 28px tall) and swap it in for the three promises.

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

## Performance budget

Measured with `node tools/measure.mjs http://127.0.0.1:8080/ 1440 900` (add `touch` for the phone) on 2026-08-28:

| | Desktop first load | Phone first load |
|---|---|---|
| Before | 3.96 MB, 11 requests | 681 KB, 10 requests |
| After | 1.52 MB, 10 requests (1.27 MB of it is the hero video, fetched behind the poster) | 203 KB, 8 requests |

What keeps it there: every photo ships as AVIF with a JPEG fallback, sized to about twice its displayed
width; the hero video is encoded at its native 720p; loop videos carry no eager `poster`; the LCP image
for each viewport is preloaded; fonts are subset and self-hosted; nothing loads from a third party.
Run the measure script after adding media, and keep the phone first load under 300 KB.

## Adding a consented quote to "We asked before we built"

Only with written consent that names this site. Add one `<li>` to the `#asked` rail, after the
"No reviews yet" card (keep that card until the app is on the App Store):

```html
<li class="card qcard qcard--quote part">
  <figure>
    <blockquote class="qcard__quote"><p>The sentence she agreed to, unchanged.</p></blockquote>
    <p class="qcard__tail">What she agreed to: this sentence, on this page, until she asks for it to go.</p>
    <figcaption class="qcard__meta">Instagram message · July 2026</figcaption>
  </figure>
</li>
```

Instrument and month only: no name, no handle, no photo. A sentence about how it felt is allowed
("it helped me feel heard"); anything about an outcome ("it got me diagnosed", "the pain is
better") is not, even if said. The quote files themselves stay out of this repository.
