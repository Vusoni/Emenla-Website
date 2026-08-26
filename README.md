# Emenla website

Public site for Emenla, an iPhone app for people with endometriosis. Static HTML built with Node,
no framework, no bundler, no third-party request of any kind. Design tokens are in `DESIGN.md`.

## Run it

```
npm run build      # generates favicon/og image, then builds dist/
npm run serve      # http://localhost:8080
npm run check      # fails on banned terms, em dashes, lorem ipsum, unresolved TODOs, dead links
```

`npm run check` is meant to be the deploy gate. It fails today, on purpose, because launch
blockers are still TODO in `site.config.json`.

## Where things live

| Path | What |
|------|------|
| `site.config.json` | Domain, support email, Instagram, CTA mode, analytics, cookie banner, legal facts, pricing. **Change values here, never in page files.** |
| `content/claims.json` | Every claim-bearing line with its source. Pages import from here; they contain no inline statistics or citations. |
| `content/banned-terms.json` | The claims policy as a machine-checkable list, plus the refusal sentences that are allowed to contain banned words. |
| `src/layout.mjs` | Head, nav, footer, the primary action component (email / instagram / appstore), the switched-off cookie banner. |
| `src/pages/*.mjs` | Home, privacy, terms, support, 404. |
| `src/styles.css`, `src/main.js` | All styling and the ~2 KB of JS (reveal, capture form, opt-out switch). |
| `scripts/build.mjs` | Renders pages, copies assets, writes robots.txt and sitemap.xml from the configured domain. |
| `scripts/check-copy.mjs` | The banned-terms test. Word-boundary, case-insensitive, visible text only. |
| `scripts/check-links.mjs` | Internal links and anchors must resolve. External links are listed for a manual check. |
| `PLACEHOLDERS.md` | Every placeholder, its licence, what replaces it. |

## The primary action

One component, three modes, set by `cta.mode` in `site.config.json`:

- `email` (current): single-field capture, "be told the day it opens". Needs `cta.emailEndpoint`, a
  first-party POST endpoint that stores only the address. Until it exists the form is a dead control.
- `instagram`: zero data collection. The action becomes a link to the profile. Needs `instagram`.
- `appstore`: at launch. The badge, from `cta.appStoreUrl`. No redesign, one value.

The waitlist tension from the go-to-market notes is real and unresolved. The site has to exist because
App Store Connect needs a privacy URL and a support URL. Whether it also collects emails is a separate
decision. If the answer is no, set `cta.mode` to `instagram` and nothing else changes.

## Consent, plainly

Nothing on this site sets a cookie or reads device storage without a user action. Fonts are served
from this domain. There is no analytics script. The only stored value is the "do not measure my visits"
switch on the privacy page, which the visitor sets themselves. **No consent banner is legally required
under the ePrivacy rules or GDPR as shipped.** The banner component exists behind
`cookieBanner.enabled: false` in case a consent-requiring technology is ever added.

If you turn on `analytics.enabled` with a self-hosted, cookieless counter (Plausible or Umami on this
domain, no fingerprinting, no cross-site identifier), the widely held position is that it does not
require consent because it stores nothing on the device. That position is not universal across EU
regulators. Ask the lawyer who reviews the terms.

## What was verified

- `npm run build` renders 5 pages. `check-copy` reports no banned terms, no em dashes, no lorem ipsum.
- `check-links`: every internal link and anchor resolves. The remaining "DEAD href=#" entries are the
  TODO controls (support email, Instagram) and disappear when the config is filled.
- Rendered in headless Chromium at 1280px and 390px. No horizontal overflow at 390px. Focus ring is
  visible on keyboard navigation. FAQ opens and closes with the keyboard (native `<details>`).
- Colour contrast, computed: violet on white 6.2:1, slate `#6b6b6b` on white 5.3:1, graphite 13:1.
  All text passes WCAG 2.2 AA. Form-control border is ink (21:1).
- Hit areas: nav links, footer links, pills, FAQ summaries and the opt-out row are 44px minimum in
  both axes by CSS. Not yet measured with a tool on a device.

## What was not verified

- **Lighthouse.** Not run; no Lighthouse in the build environment. The page ships one 29 KB font,
  one CSS file, one 2 KB script, no third-party requests and no render-blocking external resources,
  so 100 is plausible but unproven. Run it against a production deploy, on mobile.
- **Screen reader pass.** Semantic landmarks, one h1 per page, labelled controls and live regions are
  in place. Not tested with VoiceOver.
- **External links.** The build environment cannot reach them. Twelve URLs are listed by
  `check-links`; open each one before launch. The ESHRE URL in particular.
- **The email endpoint.** There is none. The form posts JSON `{ "email": "…" }` to whatever you set.
- **Terms of use.** Written by me, not by a lawyer. The banner on the page says so and stays until
  a lawyer removes it.
- **The app's privacy policy.** The repository text was not available, so the app section of the
  privacy page is a draft assembled from the brief's facts, marked as such in the source between
  `APP-POLICY-START` and `APP-POLICY-END`. Replace it verbatim.
- **The app's support document.** Same. `/support/` is a draft that keeps the three required lines.

## Launch checklist

Hard blockers (App Store Connect cannot be completed without the first two):

1. **Domain.** Set `domain`. Canonical URLs, sitemap, share URLs and both App Store Connect fields
   depend on it.
2. **Support email.** Set `supportEmail`. Dedicated address, not personal. It appears on the
   privacy, terms and support pages and in the footer.
3. **Operator name, address, governing law.** `legal.*`. The terms and privacy pages need them.
4. **Hosting provider and region.** `legal.hostingProvider`, `legal.hostingRegion`. The privacy page
   names the host because the host sees IP addresses.
5. **CTA decision.** Email (needs an endpoint and a way to actually send the launch message and then
   delete the list, as the page promises) or Instagram (needs the handle).
6. **Replace the draft app privacy section** with the repository text, verbatim.
7. **Merge the app's support document** into `/support/`.
8. **Legal review of the terms.** Then remove the `data-todo="legalReview"` marker and the banner.
9. **Verify the two statistics** against their linked sources (`verify_before_launch` in
   `content/claims.json`): the four-to-eleven-year wording, and the ESHRE URL.
10. **Open all twelve external links.**
11. **Real screenshots** in the hero device frame, when the mockups arrive. Update `PLACEHOLDERS.md`.
12. **Run Lighthouse** on the production deploy, mobile, and fix anything under 100.
13. **Founder visibility.** `founder.show` is `false`. Decide.
14. `npm run check` passes with `--strict`. Then deploy.

## Hosting

Any static host works. Prefer one with an EU region and no injected scripts. Cloudflare Pages,
Netlify and Vercel all inject nothing by default but do run analytics on their own dashboards from
server logs; that is the host processing IPs, which the privacy page discloses. Do not enable any host
"web analytics" beacon, as that adds a third-party request. Set the 404 page to `dist/404.html`.
