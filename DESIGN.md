# Emenla — Design Reference
> Printed editorial on white paper. One voice in violet, everything else in ink.

Reference systems: Hims App (primary, https://styles.refero.design/style/0a489bce-4f93-4b38-b612-d87b1d00999e)
and Alveos One (secondary, https://styles.refero.design/style/811f0fc6-3353-4ed6-bf3e-c98b261dcc1c).
Structure, spacing, radii, shadows and the "one accent, never filled" rule come from Hims.
Where this file deviates from Hims it is for one of three reasons: WCAG 2.2 AA contrast,
self-hosting (no third-party requests), or Emenla being its own brand.

**Theme:** light only. Honour `prefers-color-scheme` later, not in v1.

## The one design rule that is Emenla's own

Violet belongs to the person. It is used for **her own sentences** in the "Your words, their
words" section, for display headlines that speak in her voice ("You're not imagining it."),
and for hairline borders. Clinical terms, citations, product copy, navigation and buttons are
always black. A reader should be able to tell whose voice a line is by its colour alone.
This is the Hims "single chromatic voice" rule with a reason attached.

## Tokens — Colours

| Name | Value | Token | Role |
|------|-------|-------|------|
| Emenla Violet | `#5b48d6` | `--color-violet` | Her words, voice headlines, focus ring, occasional 1px borders. Never a fill, never a button, never body copy. 6.2:1 on white. |
| Ink | `#000000` | `--color-ink` | Primary text, clinical terms, button borders, icon strokes, form-control borders. |
| Graphite | `#2e2e2e` | `--color-graphite` | Section headings that are not in her voice. Softer than pure black at 32–44px. |
| Slate | `#6b6b6b` | `--color-slate` | Muted body copy, citations, metadata. 5.3:1 on white. **Replaces Hims Stone #8f8f8f, which fails AA at 3.2:1.** |
| Linen | `#e0e0e0` | `--color-linen` | Decorative hairlines and list separators only. Not for form-control edges (fails 3:1). |
| Vellum | `#f0f0f0` | `--color-vellum` | Row dividers, the quietest structural stroke. |
| Paper | `#ffffff` | `--color-paper` | Page canvas, card surface, nav surface. Cards are the same colour as the page; elevation comes from shadow and radius only. |

Optional warm canvas: `#fcf9f7` (Alveos Linen Canvas) can replace Paper as the page background
with cards staying `#ffffff`. It is one token change. Default is pure white to match Hims.

No second accent. No gradients on UI surfaces. If a gradient ever appears it lives inside a
phone mockup as part of the app's own screen, never on the site chrome.

## Tokens — Typography

Hims uses Sofia Pro, which is a paid webfont and cannot be hot-linked (the privacy page forbids
third-party font requests). Two options:

- **Default: Manrope** (SIL OFL, self-hosted as woff2, weights 400 and 500 only, subset to
  latin + latin-ext for Polish diacritics). Geometric, low contrast, takes tight tracking well.
- If a Sofia Pro self-hosting licence is bought later, swap the family name in one token.
  Alternate free choice: Hanken Grotesk (from the Alveos reference) if a plainer grotesque is wanted.

One family carries everything. Weight 400 is the default at every size. Weight 500 is for
emphasis and the clinical term in a translation pair. No bold, no italics.

`--font-sans: 'Manrope', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;`
`font-display: swap` and preload the 400 file.

### Type scale (desktop / mobile)

Hims scales to 141–280px on desktop. That does not fit a 375px phone held by someone in a
flare at 2am, so every display role has a mobile ceiling. Use `clamp()`.

| Role | Desktop | Mobile ≤640px | Line height | Tracking | Weight | Token |
|------|---------|---------------|-------------|----------|--------|-------|
| display | 128px | 44px | 1.04 | -0.04em | 400 | `--text-display` |
| heading-lg | 84px | 36px | 1.10 | -0.02em | 400 | `--text-heading-lg` |
| heading | 44px | 28px | 1.15 | -0.017em | 400 | `--text-heading` |
| heading-sm | 32px | 24px | 1.20 | -0.017em | 400 | `--text-heading-sm` |
| subheading | 20px | 18px | 1.25 | -0.012em | 400 | `--text-subheading` |
| body | 18px | 17px | 1.5 | -0.012em | 400 | `--text-body` |
| body-sm | 16px | 16px | 1.5 | -0.012em | 400 | `--text-body-sm` |
| caption | 14px | 14px | 1.6 | 0 | 400 | `--text-caption` |

Body line height is 1.5, not Hims' 1.33. Long reading (privacy policy, terms, FAQ) needs it,
and WCAG 1.4.12 text-spacing tests assume it. Nothing below 14px anywhere. Never set body
above 20px without moving to a heading role.

Headlines centred. Body left-aligned, max line length 68ch. Never centre a paragraph.

## Tokens — Spacing, radius, elevation

**Base unit:** 4px · **Density:** spacious · **Max width:** 1200px

| Purpose | Desktop | Mobile |
|---------|---------|--------|
| Section gap | 96px | 64px |
| Card padding | 32px | 24px |
| Element gap | 20px | 16px |
| Page gutter | 40px | 20px |

Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 64, 96, 160.

### Radius (exactly three tiers, as in Hims)

| Element | Value | Token |
|---------|-------|-------|
| cards, buttons, inputs | 30px | `--radius-card` |
| feature cards, icon tiles | 45px | `--radius-feature` |
| nav pill | 52px | `--radius-nav` |

Nothing below 30px, nothing above 52px, no square corners anywhere except the 404 page's
big number if you want it.

### Shadows

| Name | Value | Token | Use |
|------|-------|-------|-----|
| card | `rgba(0,0,0,0.12) 0 27px 104px` | `--shadow-card` | Standard cards, icon tiles |
| feature | `rgba(0,0,0,0.11) 0 8px 127px` | `--shadow-feature` | Feature / hero cards |
| device | `rgba(0,0,0,0.25) 0 9px 46px` | `--shadow-device` | Phone mockup only |
| nav | `rgba(0,0,0,0.06) 0 8px 30px` | `--shadow-nav` | Floating nav pill |

The long vertical spread is the signature; never use a tight `0 2px 4px`. Performance note:
large blur radii are expensive to repaint. Keep to at most six shadowed elements in any
viewport and never animate a shadow. Cards in long lists (FAQ, refusal list) use a 1px Vellum
divider instead of a shadow.

## Components

### Floating nav
Pill container, `--radius-nav`, Paper fill, `--shadow-nav`, fixed top with 16px inset from the
viewport edge. Padding 16px vertical, 22px horizontal. Left: "Emenla" wordmark in body-sm,
weight 500, Ink. Right: one outlined pill action (see below). On mobile the nav shrinks to
wordmark + action only; no hamburger, there are not enough pages to need one.

### Outlined pill action (the only button style)
Paper fill, 1px Ink border, `--radius-card`, padding 16px × 22px, body-sm weight 400 Ink.
Minimum hit area 44×44px measured on **both axes** (the app once shipped a control that passed
on height and failed on width; the site will not). Hover: background Vellum. Focus: 2px solid
Violet outline, 3px offset. Active: border Graphite. No filled variant exists. At launch the
same component swaps its label and href to the App Store badge from one config value.

### Email capture (pre-launch primary action)
Single field + pill action in one row on desktop, stacked on mobile. Input: 56px tall,
`--radius-card`, 1px **Ink** border (not Linen; form-control edges need 3:1), Paper fill,
padding 0 24px, body size. Label visible above the field, not placeholder-only. Error text in
Ink with a leading "Check the address:" not red, there is no red in this system. Success
replaces the row with one line of body text and no confetti.

### "Your words, their words" — translation pair (signature element)
This is the hero of the site and the only place the two voices sit side by side.

Each pair is one card, Paper fill, `--radius-feature`, `--shadow-feature`, 40px padding
(24px mobile). Layout:

```
┌──────────────────────────────────────────────────────┐
│ "It hurts when I go to the bathroom,                 │  ← her sentence, heading role,
│  especially during my period."                       │    Violet, weight 400, quotes kept
│                                                      │
│ Dyschezia                                            │  ← clinical term, heading-sm,
│ pain on defecation                                   │    Ink, weight 500 / body Slate
│                                                      │
│ Sources: ESHRE 2022 · NICE NG73 · ACOG 2026          │  ← caption, Slate, each a link
│ No ICD-10 code. No verified symptom code exists.     │  ← caption, Slate
└──────────────────────────────────────────────────────┘
```

Rules that survive onto the page: her sentence is always printed, always first, always in
Violet. The clinical term is never larger than her sentence. Citations are real links. If a
pair has no ICD-10 code, say so in the caption rather than leaving it blank. Three pairs on
the home page, stacked vertically on mobile, three-across on desktop with 20px gaps. No
photograph, no face, no icon near this section.

### Icon tile + section heading
Paper card 120×120px (96px mobile), `--radius-feature`, `--shadow-card`, one single-stroke
Ink icon at 40px centred. 40px below it, the section heading at heading-lg (36px mobile),
Graphite, centred. Body copy 32px below, left-aligned, 68ch max. Use sparingly: privacy
section, pricing section, "What Emenla will never do".

### "What Emenla will never do" — refusal list
A single Paper card, `--radius-feature`, `--shadow-feature`. Heading in Graphite. Each refusal
is one row: body text in Ink, 1px Vellum divider between rows, 20px vertical padding per row.
No icons, no ticks, no crosses. The plainness is the point. Rows have no hover state; they are
not links.

### Pricing
Two Paper cards side by side (stacked mobile), `--radius-card`, `--shadow-card`, 32px padding.
Left: "Logging" with "Free, always" in heading-sm Ink and one body-sm line explaining why it
cannot be paywalled. Right: "Doctor-summary export" with the price in heading-sm Ink and a
caption "Not purchasable yet" in Slate. No "most popular" badge, no strike-through prices.

### Privacy list
Same row pattern as the refusal list. Each row is one specific fact ("Speech recognition runs
on-device. No audio leaves the phone.") in Ink. The RevenueCat exception is a row in the same
list at the same size, not a footnote.

### FAQ
Accordion, one Paper card per question, `--radius-card`, 1px Linen border, no shadow.
Question in subheading weight 500 Ink, 24px padding. Chevron is a single-stroke Ink icon that
rotates 180°, or stays still under reduced motion. Answers in body Ink (Slate is for metadata
only). Use native `<details>` / `<summary>` so keyboard and screen readers work without
JavaScript.

### Long-form pages (privacy, terms, support)
Same nav and footer. Content column 68ch, left-aligned, body at 18px / 1.5. Headings at
heading-sm with 64px above and 20px below. A sticky in-page table of contents on desktop,
inline list on mobile. Legal-review banner on terms: Vellum fill, 1px Linen border, body-sm Ink,
positioned at the top and not dismissable.

### Footer
Paper, 100px top padding (64px mobile), 1px Vellum rule above. Body-sm Ink links in a single
row on desktop, stacked on mobile with 16px gaps. Wordmark left, links right. No newsletter box
here, the email capture lives above the fold only.

### Phone mockup (added at the end)
Device frame with `--shadow-device`, centred on a soft radial glow: Violet at 8% opacity
fading to transparent, the only atmospheric element on the site. No hand, no face, no
lifestyle context. Under reduced motion the glow is static.

## Motion

One orchestrated moment: on load, the hero headline and the first translation pair fade up
over 400ms with a 16px translate, eased `cubic-bezier(0.2, 0.7, 0.2, 1)`. Scroll reveals for
sections below, same easing, 300ms, triggered once. Nothing loops. Nothing bounces. Hover
states are colour-only. Every animation is wrapped in `@media (prefers-reduced-motion: no-preference)`;
with reduced motion on, elements are simply visible.

## Accessibility floor (checked at every phase, not at the end)

- All text ≥ 4.5:1: Ink, Graphite, Slate and Violet on Paper all pass. Never put text on Linen or Vellum darker than Slate.
- Non-text contrast ≥ 3:1: form borders and focus rings use Ink or Violet, never Linen.
- Focus: 2px solid Violet, 3px offset, on every interactive element. Never `outline: none` without a replacement.
- Hit areas 44×44px on both axes, including footer links and the FAQ summary rows.
- Semantic landmarks: `header`, `nav`, `main`, `footer`, one `h1` per page, headings in order.
- Real alt text on every image; decorative icons `aria-hidden`.
- Text can zoom to 200% without horizontal scroll (test at 375px width).
- Nothing conveyed by colour alone. The violet/ink voice rule is reinforced by position and quotation marks, not colour only.

## Do

- Use Violet only for her sentences, voice headlines, focus rings and occasional 1px borders.
- Keep cards the same colour as the page and let shadow and radius do the lifting.
- Use exactly three radius tiers: 30 / 45 / 52.
- Self-host one font family at two weights, subset, preloaded.
- Centre headlines, left-align everything else.
- Measure tap targets in both axes.
- Leave a commented, empty social-proof slot in the markup with the reason it is empty.

## Don't

- Don't fill a button with colour. The white pill with an Ink border is the only action.
- Don't use `#8f8f8f` or anything lighter than Slate for text.
- Don't use Linen as a form-control border.
- Don't introduce a second hue, a gradient on chrome, or a tight shadow.
- Don't put a face, a hand or a name anywhere near a patient sentence or a citation.
- Don't use red for errors, green for success, or badges of any kind.
- Don't load anything from a third-party origin: fonts, icons, analytics, embeds.

## CSS custom properties

```css
:root {
  /* Colours */
  --color-violet: #5b48d6;
  --color-ink: #000000;
  --color-graphite: #2e2e2e;
  --color-slate: #6b6b6b;
  --color-linen: #e0e0e0;
  --color-vellum: #f0f0f0;
  --color-paper: #ffffff;

  /* Type */
  --font-sans: 'Manrope', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  --text-display: clamp(44px, 9vw, 128px);
  --leading-display: 1.04;
  --tracking-display: -0.04em;
  --text-heading-lg: clamp(36px, 6vw, 84px);
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -0.02em;
  --text-heading: clamp(28px, 3.5vw, 44px);
  --leading-heading: 1.15;
  --tracking-heading: -0.017em;
  --text-heading-sm: clamp(24px, 2.5vw, 32px);
  --leading-heading-sm: 1.2;
  --tracking-heading-sm: -0.017em;
  --text-subheading: clamp(18px, 1.5vw, 20px);
  --leading-subheading: 1.25;
  --text-body: clamp(17px, 1.2vw, 18px);
  --leading-body: 1.5;
  --text-body-sm: 16px;
  --leading-body-sm: 1.5;
  --text-caption: 14px;
  --leading-caption: 1.6;
  --tracking-body: -0.012em;
  --measure: 68ch;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-16: 64px;
  --space-24: 96px;
  --space-40: 160px;

  /* Layout */
  --page-max-width: 1200px;
  --page-gutter: clamp(20px, 4vw, 40px);
  --section-gap: clamp(64px, 8vw, 96px);
  --card-padding: clamp(24px, 3vw, 32px);
  --element-gap: 20px;

  /* Radius */
  --radius-card: 30px;
  --radius-feature: 45px;
  --radius-nav: 52px;

  /* Shadows */
  --shadow-card: rgba(0, 0, 0, 0.12) 0px 27px 104px 0px;
  --shadow-feature: rgba(0, 0, 0, 0.11) 0px 8px 127px 0px;
  --shadow-device: rgba(0, 0, 0, 0.25) 0px 9px 46px 0px;
  --shadow-nav: rgba(0, 0, 0, 0.06) 0px 8px 30px 0px;

  /* Focus */
  --focus-ring: 2px solid var(--color-violet);
  --focus-offset: 3px;

  /* Motion */
  --ease-out: cubic-bezier(0.2, 0.7, 0.2, 1);
  --duration-reveal: 300ms;
  --duration-hero: 400ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-reveal: 0ms;
    --duration-hero: 0ms;
  }
}
```

## Tailwind v4

```css
@theme {
  --color-violet: #5b48d6;
  --color-ink: #000000;
  --color-graphite: #2e2e2e;
  --color-slate: #6b6b6b;
  --color-linen: #e0e0e0;
  --color-vellum: #f0f0f0;
  --color-paper: #ffffff;

  --font-sans: 'Manrope', ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;

  --radius-card: 30px;
  --radius-feature: 45px;
  --radius-nav: 52px;

  --shadow-card: rgba(0, 0, 0, 0.12) 0px 27px 104px 0px;
  --shadow-feature: rgba(0, 0, 0, 0.11) 0px 8px 127px 0px;
  --shadow-device: rgba(0, 0, 0, 0.25) 0px 9px 46px 0px;
  --shadow-nav: rgba(0, 0, 0, 0.06) 0px 8px 30px 0px;
}
```

## Open items (design only)

- Exact Violet hex: `#5b48d6` is close to Hims' `#5d48db` but not identical. Change it or keep it, one token.
- White vs warm canvas: default white, one token to switch.
- Wordmark: text-only "Emenla" in Manrope 500 until a logo exists. Do not invent a mark.
- Icon set: single-stroke, self-hosted SVG (Lucide is OFL-compatible and fits the Hims icon language).
