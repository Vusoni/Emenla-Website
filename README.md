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
| `tools/` | `drive.mjs` (headless Chrome driver), `selftest.mjs` (the self-test), `histshots.mjs` (the history section's filmstrip and assertions), `devshots.mjs` (the device panels and the iPhone Duo band), `wordshots.mjs` (the Your words ledger, its live row, the history type and pictures, and a check that no serif is left), `newshots.mjs` (the What's in the app grid at two widths), `measure.mjs` (page weight), and the one-off filmstrips of earlier passes. |
| `scripts/` | The gate (`sync-legal.mjs`, `check-copy.mjs`, `check-links.mjs`), `set-app-store.mjs`, `serve.py` (the preview server) `make-devices.py` (the device images, see *Devices*) and `make-hist.py` (the history still lifes, see `HISTORY_ART.md`). `build.mjs`, `make-assets.py`, `preview.mjs` and `setup-seo.sh` belong to the previous version. |
| `src/`, `dist/`, `content/`, `public/` | The previous version of the site, kept for reference. Not used by `site/`. |

## Preview it

```
npm run serve
```

That is `scripts/serve.py`: the standard library's file server with its listen backlog raised from
five to 128, because a page that asks for a dozen lazy device images at once (the reduced-motion page
does) gets connection resets past the fifth from a bare `python3 -m http.server`.

Then open http://localhost:8080/ in a browser. Double-clicking `site/index.html` also works, but shows
the still-image hero instead of the video, because browsers block the video loader on `file://` pages.

## Self-test

With Chrome running headless on port 9222 and the preview server on 8080:

```
node tools/selftest.mjs http://127.0.0.1:8080/ /tmp/emenla-selftest
```

Runs the flick test, the worst-frame contrast audit, the hold moment, reduced motion in both
directions, the video-blocked page, phone hit areas and overflow, and checks both consoles.

The history section (`#history`, the clock and the record) has its own filmstrip and assertions on
the same Chrome and server:

```
node tools/histshots.mjs http://127.0.0.1:8080/ /tmp/emenla-hist
```

Desktop before the first node, inside every era and mid-roll, two short desktops, two phones and
reduced motion. It fails if the clock and the record ever disagree, a card or caption drops below
full contrast, the clock is not stuck where the stylesheet puts it, or the page overflows sideways.

## Devices

Every phone on the home page is Apple's product image of iPhone 18 Pro in Silver with an app screen
composited under its glass, and the `#duo` band adds iPhone Duo in Star White, open and closed, with
the app's launch screen. The composites (`site/assets/img/device-*`) and `devices.json` are committed;
Apple's source files are not, by their licence (PLACEHOLDERS.md has the URLs, checksums and the
sentence relied on). To rebuild them, or to put new screens in:

```
# Apple Design Resources, each into its own empty folder, mounted read only
curl -L -o <dl18>/Bezel-iPhone-18.dmg  https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-18.dmg
curl -L -o <dlduo>/Bezel-iPhone-Duo.dmg https://devimages-cdn.apple.com/design/resources/download/Bezel-iPhone-Duo.dmg
shasum -a 256 <dl18>/*.dmg <dlduo>/*.dmg          # compare with PLACEHOLDERS.md
hdiutil attach -readonly -nobrowse -mountpoint <mnt18> <dl18>/Bezel-iPhone-18.dmg
hdiutil attach -readonly -nobrowse -mountpoint <mntduo> <dlduo>/Bezel-iPhone-Duo.dmg
# copy the three flat PNGs into <bezels> under the names make-devices.py expects (its PHYSICAL table), then detach both
# six screens as PNG into <screens>: screen-bodymap, screen-detail, screen-overview, screen-assistant, screen-questions, screen-reach
python3 -E scripts/make-devices.py --bezels <bezels> --screens <screens> --mark site/assets/img/launch-mark.webp --out site/assets/img
node tools/devshots.mjs http://127.0.0.1:8080/ /tmp/emenla-dev
```

Run it with `-E`, not `-I`: Pillow lives in the user site-packages. A screen of any size is scaled to
cover the cutout and anchored at the top; the ones there now are frames of the recording, and a
simulator capture at 1206×2622 with `xcrun simctl status_bar booted override --time 9:41` drops in
the same way. `devshots.mjs` photographs the panels, the pair, the corner at 4×, the Duo band and the
privacy phone at desktop, at 375 and under reduced motion, and fails if an image is missing or off
its aspect, the pair is not a pair, the Duo band's floors or scale are off, the page overflows, a
console error is logged or anything is still moving when the frame is taken.

## Before launch

Domain: **emenla.com** (registered at GoDaddy, 2026-08-27). Host: **a Cloudflare Worker serving static assets**, configured in `wrangler.jsonc` and deployed with `npx wrangler deploy`. This file said Pages until 2026-09-10; it has been a Worker since `wrangler.jsonc` was added, and the difference matters because Pages and Workers are deployed by different commands.

Done: the live domain is set in `og:url`, `og:image`, `robots.txt` and `sitemap.xml`; the support
address is `hello@emenla.com` across privacy, terms and support; the hosting sentence in the privacy
page names Cloudflare; `site/_headers` carries the `.htaccess` caching rules over, which the Worker reads the same way Pages did.

Still open:

0. Confirm `hello@emenla.com` actually delivers. The Cloudflare Email Routing MX records are live and DMARC `rua` points at it, but a destination address still has to be verified in the dashboard. It is now the GDPR contact on `/privacy/`, the support address in App Store Connect, and the address in the app. An address that bounces is worse than an ugly one.
2. ~~Operator name and governing law.~~ Done 2026-09-11: both pages name Vusoni Oliwier and Polish law, because both are now generated from the app repository (see *Legal pages* below). A postal address is still to come once the business structure is settled, and the operator named there must be the Apple Account Holder.
3. ~~Replace the empty phone screens with real app screenshots.~~ Done 2026-10-20: `#inside` shows five
   frames of the app and the sample doctor's page, and the `#privacy` phone shows What Emenla can reach.
   Sources, timestamps and the export commands' sizes are in PLACEHOLDERS.md. New filenames need no `?v=` bump;
   `node tools/newshots.mjs <url> <outdir>` photographs the section at desktop and phone width.
   Then 2026-10-24: every phone became Apple's own iPhone 18 Pro in Silver with the screen under its
   glass, the Record panel a floating pair, and `#duo` shows iPhone Duo at true relative size; see
   *Devices* and PLACEHOLDERS.md. The screens still carry no status bar (the simulator was busy that
   day); the recapture is six PNGs and one run of `make-devices.py`.
4. Legal review of the terms before launch. The site carries no notice about it (removed on Oliwier's word, 2026-10-03); the review is tracked in the app repository's `legal/terms-of-service.REVIEW.md`.
5. At App Store launch: `node scripts/set-app-store.mjs --live`. The nav badge is a link on all six pages; while the app is unlisted it reads "For iPhone" and points at `/#inside`, and the site says nothing about availability anywhere. The script swaps it for `apps.apple.com/app/id6799958379`, adds that domain to the health check's allowlist, and refuses to finish if any "not on the App Store yet" sentence has come back. `npm run check` confirms the site is not half-flipped.
7. Reviews: the six empty review slots (`#asked`) were removed on 2026-10-03. Add a reviews section only once there are three real reviews, typed exactly as posted; the markup and its formats are in git history before that date (`.qcard`).
8. Clinicians: the three Example cards (`#context`) were removed on 2026-10-03. Add a clinician only after one has actually reviewed the clinical wording and agreed to be named; the `.gcard` markup is in git history before that date (photo 784×708, name, credentials, what they reviewed and when).
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
npm run sync:legal     # regenerate privacy and terms from the app repository
npm run check          # must be green first: legal pages in sync, banned terms, every internal link
npx wrangler deploy
```

### Legal pages

**The privacy policy and the terms are not written here.** Their text lives in the Emenla app
repository, in `legal/privacy-policy.md` and `legal/terms-of-service.md`, beside the code whose
behaviour they describe, and `scripts/sync-legal.mjs` renders it into `site/privacy/` and
`site/terms/` between `LEGAL-SYNC-START` and `LEGAL-SYNC-END`. Edit the markdown there; an edit
between the markers here is overwritten on the next sync.

Everything outside the markers is still this repository's: the label, the heading, the head and
the footer. The script expects the app repository beside this
one at `../Emenla`; set `EMENLA_APP_REPO` if it is elsewhere.

This replaced hand transcription on 2026-09-11, after the two copies had drifted in both
directions at once: this site still said the app had no account, and the app's markdown still
claimed a retention promise from OpenAI that this site had already corrected. `npm run check`
now fails when the pages differ from the markdown, so a stale policy cannot be deployed, and the
markdown itself must pass `content/banned-terms.json` because this is where it is published.

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
| 2026-10-24, with Apple's devices | 1.88 MB, 10 requests (1.59 MB of it is the hero video) | 262 KB, 8 requests |
| 2026-10-24, one sans and the still lifes | 1.84 MB, 8 requests (1.59 MB of it is the hero video) | 219 KB, 6 requests |

What keeps it there: every photograph ships as AVIF with a JPEG fallback, and every device image as WebP
with a PNG fallback, both lazy and sized to about twice the displayed
width; the hero video is encoded at its native 720p; loop videos carry no eager `poster`; the LCP image
for each viewport is preloaded; fonts are subset and self-hosted; nothing loads from a third party.
Run the measure script after adding media, and keep the phone first load under 300 KB.

## Adding a consented quote

If a woman agrees, in writing and naming this site, to a sentence of hers appearing on it, use the
consented-quote format from the removed `#asked` section (git history before 2026-10-03) (who line "Consented quote", "Month year / Structured
interview", her sentence as the title or the body): instrument and month only, no name, no handle,
no photo. A sentence about how it felt is allowed ("it helped me feel heard"); anything about an
outcome ("it got me diagnosed", "the pain is better") is not, even if said. `.qcard--quote` remains
as the serif-voice alternative. The quote files themselves stay out of this repository.
