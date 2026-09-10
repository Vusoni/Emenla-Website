# Emenla website

The public site for Emenla, an iOS app for people with endometriosis. Built with the 10k-websites
flow: one scroll-scrubbed hero video, plain HTML, CSS and vanilla JavaScript, no build step.

## Folders

| Path | What |
|------|------|
| `site/` | **The website. This is the folder that goes online.** `index.html` plus `assets/`, the privacy, terms, support and science pages, `404.html`, `og.png`, `robots.txt`, `sitemap.xml`, `_headers`, `_redirects`, `.htaccess`. |
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

Domain: **emenla.com** (registered at GoDaddy, 2026-08-27). Host: **a Cloudflare Worker serving static assets**, configured in `wrangler.jsonc` and deployed with `npx wrangler deploy`. This file said Pages until 2026-09-10; it has been a Worker since `wrangler.jsonc` was added, and the difference matters because Pages and Workers are deployed by different commands.

Done: the live domain is set in `og:url`, `og:image`, `robots.txt` and `sitemap.xml`; the support
address is `hello@emenla.com` across privacy, terms and support; the hosting sentence in the privacy
page names Cloudflare; `site/_headers` carries the `.htaccess` caching rules over, which the Worker reads the same way Pages did.

Still open:

0. Confirm `hello@emenla.com` actually delivers. The Cloudflare Email Routing MX records are live and DMARC `rua` points at it, but a destination address still has to be verified in the dashboard. It is now the GDPR contact on `/privacy/`, the support address in App Store Connect, and the address in the app. An address that bounces is worse than an ugly one.
2. Replace the `[operator name]` and `[governing law]` placeholders in `site/privacy/` and `site/terms/`. Search for `data-todo`.
3. Replace the empty phone screens with real app screenshots. There are three: one in `#privacy`
   and two in `#screens` (the Record and Document panels). In each `.device__screen`, delete
   `.device__mark` and `.device__hint` (keep `.device__notch` unless the screenshot carries its own
   status bar) and add
   `<picture><source type="image/avif" srcset="assets/img/screen-record.avif"><img src="assets/img/screen-record.jpg" alt="" width="560" height="1184" loading="lazy" decoding="async"></picture>`.
   Export at 560×1184 (twice the 280×592 screen); the existing `.device__screen img` rule crops it.
   New filenames need no `?v=` bump.
4. Legal review of the terms, then remove the "Awaiting legal review" notice.
5. At App Store launch: `node scripts/set-app-store.mjs --live`. The nav badge is already a link on all five pages (it points at `/#faq` while the app is unlisted); the script swaps it for `apps.apple.com/app/id6799958379`, adds that domain to the health check's allowlist, and then refuses to finish while any of the 19 remaining "not on the App Store yet" sentences are still on the page, listing each with its line. Rewrite those, re-run, and `npm run check` will confirm the site is not half-flipped.
7. Reviews: `#asked` is six empty slots on a rail that loops without end. After launch, replace a slot with a real review typed in the same markup, exactly as posted (the HTML comment above the section gives the formats, including a rated one and a consented quote). Drop the `qcard--slot` class with the slot. Keep one honest slot until there are three real reviews.
8. Clinicians: `#context` is three cards marked Example whose portrait area is a blank white panel. Fill one only after a licensed clinician has actually reviewed the clinical wording and agreed to be named; the HTML comment above the section gives the markup (photo 784×708, name, credentials, what they reviewed and when). Remove the pill and the `gcard--slot` class with the portrait, then update the note under the rail and `PLACEHOLDERS.md`. Never before.
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

`site/` is the publish directory, and `wrangler.jsonc` points the Worker at it. Deploy with:

```bash
npm run check          # must be green first: banned terms, and every internal link
npx wrangler deploy
```

`wrangler` is not a dependency of this repo, so it comes through `npx`. Pin the major
(`npx wrangler@4 deploy`) if you would rather npx did not pull a newer one mid-deploy.
`npx wrangler versions upload` uploads without shifting traffic and gives you a preview URL to
check first, then `npx wrangler versions deploy` promotes it; `npx wrangler deployments list` and
`npx wrangler rollback <id>` are the undo. `.htaccess` is kept for a future move to an Apache host;
the Worker ignores it and reads `site/_headers`, and serves `404.html` through
`not_found_handling`.

After deploying, run the health check once by hand rather than waiting for the hour:
`gh workflow run healthcheck.yml && gh run watch`. It re-verifies the page codes, the security
headers, the absence of third-party resources, the certificate, DNS, and that `/privacy/` still
names OpenAI and Supabase.

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

## Adding a consented quote

If a woman agrees, in writing and naming this site, to a sentence of hers appearing on it, use the
third Example card in `#asked` as the format (who line "Consented quote", "Month year / Structured
interview", her sentence as the title or the body): instrument and month only, no name, no handle,
no photo. A sentence about how it felt is allowed ("it helped me feel heard"); anything about an
outcome ("it got me diagnosed", "the pain is better") is not, even if said. `.qcard--quote` remains
as the serif-voice alternative. The quote files themselves stay out of this repository.
