# Emenla design package

The single deliverable of the creative work. Every line of copy here ships verbatim. Numbers marked
(starting point) are validated by the flick test in the build and move if it says so. Palette values
are a direction until the video passes its gate, then they are sampled from the approved footage.

Tier 1: one continuous 6 second shot, scrubbed by scroll. Phones, portrait tablets, coarse-pointer
landscape and reduced motion get the designed still.

## 1. The brand premise

**Kept.**

Her words are kept, unchanged, beside the clinical term. The record is kept on this phone and nowhere
else. The page is kept for the appointment. The hero is a page arriving and staying. Every section
below the hero teaches one facet of kept: kept beside (Your words, their words), kept with almost no
effort and then counted and carried in (Three things it does), kept here (privacy), what will never be
done to what she kept (refusals), keeping is free (pricing), walk in with it (the close). The one
interactive moment is the visitor keeping a sentence.

Design direction, said out loud: the Alveos One system (warm cream canvas, one grotesk, 25px corners,
faint shadows, near-black button, a spotlight gradient) with Emenla's single signature idea kept:
violet belongs to the person. Her sentences and the voice headlines are violet. Nothing else is.
The cream canvas is earned, not a default reach: the world is paper, linen and daylight, the type is a
grotesk not a serif, there is no terracotta, and the tones come from the footage after the gate.

## 2. The palette (direction; final values sampled from the approved footage)

```css
:root {
  --canvas: #fcf9f7;        /* Linen Canvas, page background, never pure white */
  --panel: #ffffff;         /* Bone White, raised cards */
  --clay: #d1cfcd;          /* Clay Shadow, soft fills, decorative hairlines */
  --haze: #ecedef;          /* subtle borders */
  --ink: #000000;           /* primary text */
  --stone: #575757;         /* muted body text, 6.9:1 on canvas */
  --ash: #717171;           /* metadata only, 4.65:1 on canvas, never on clay */
  --night: #05060b;         /* Nightshade, the button, the refusal card, the closing band */
  --voice: #5b48d6;         /* Emenla Violet, her words and voice headlines only, 6.0:1 on canvas */
  --voice-muted: rgba(91, 72, 214, 0.12); /* focus glow, the hairline under her sentences */
  --spot-a: #fcf9f7;        /* spotlight gradient, centre */
  --spot-b: #e9e2dc;        /* spotlight gradient, edge (sampled from the footage's clay) */
}
```

Accent in rare doses: violet on her sentences, the two voice headlines, focus rings, one hairline.
Never a fill, never a button.

## 3. The type

- Display and body: **Hanken Grotesk** (variable, 400 to 700, self-hosted woff2, latin and latin-ext
  for Polish). Display work is done by weight contrast (500 or 600 over 400) and size, not by a second
  face. This is Alveos's own choice and it is stated here as a deliberate one-family system.
- Micro labels and verification lines: system mono stack (`ui-monospace, "SF Mono", Menlo, monospace`),
  12px minimum, 0.18em tracking, uppercase. No third font ships.
- Scale: hero hook clamp(40px, 4.6vw, 66px) weight 500 line-height 1.08 tracking -0.02em;
  display 52px/1.1/500; heading-lg 38/1.2/500; heading 36/1.2/500; heading-sm 28/1.4/500;
  subheading 24/1.4/500; body-lg 20/1.4; body 18/1.5; body-sm 16/1.6; caption 14/1.6.
  Mobile ceilings: hook 34px, display 36, heading-lg 30, heading 28, heading-sm 24.
- Headlines centred. Body left-aligned, measure 68ch set on the text element itself.

## 4. The band map (starting points)

Hero height 520vh (scroll range 420vh). Ramp cap 0.04 of progress (about 17vh).

| Band | Range | Footage moment | Copy (verbatim) | Position | Entrance |
|---|---|---|---|---|---|
| 1 | 0.00 to 0.25 | Sheet enters at the top edge and begins to fall | "You're not imagining it." (violet, voice) | lower centre, over the wall above the linen | Drift-down, with the one-time load ramp so the page opens settled. No ease-in. |
| 2 | 0.23 to 0.50 | Sheet mid-frame, rocking side to side | "Pain that gets brushed off is still pain." | left column | Sway-settle: each word starts offset sideways and eases in with a damped horizontal sway, echoing the rocking sheet |
| 3 | 0.48 to 0.75 | Sheet nears the linen, its shadow forming, coming into focus | "Emenla helps you keep a record of it, in your own words." | right column | Blur-to-sharp: a static-blur copy crossfades into the sharp one as focus arrives |
| 4 | 0.73 to 1.00 | Touchdown, one small rock, rest | "Turn what you feel into a clear conversation for your next appointment." then "Emenla is an iPhone app. It is not on the App Store yet." then the button "Be told the day it opens" | upper centre, above the resting sheet | Word-by-word rise into a staged settle: headline words, then the note, then the button. data-ramp 0.035. No ease-out. |

Plateaus at this geometry: about 88vh, 80vh, 80vh, 97vh. The flick test (120, 240, 360px steps)
validates them. A failing band merges into a neighbour; ramps are never shrunk to squeeze it in.

Legibility over light footage, the deliberate inversion of the skill's dark-scrim system:
cream base vignette instead of a dark one; cream per-band wash (peak 0.45 for ink bands, 0.6 for the
violet hook) riding the band's assembly progress; a cream halo text-shadow, off on the button; frosted
cream chips for small labels. The audit checks the darkest pixel under ink text and both the darkest
and lightest pixel under the violet hook. Floor 3.5:1, aim 4.5:1.

## 5. The static-hero copy block

Over the ending frame (sheet at rest, cover-cropped with the sheet kept at the bottom):

"You're not imagining it."
"Pain that gets brushed off is still pain. Emenla helps you keep a record of it, in your own words."
"Turn what you feel into a clear conversation for your next appointment."
"Emenla is an iPhone app. It is not on the App Store yet."
Button: "Be told the day it opens"

## 6. The below-fold outline

Nav: fixed top bar, cream wash with blur over the hero, "Emenla" wordmark left; links How it works,
Privacy, Support; one near-black button "Be told when it opens" anchoring to #notify. Mobile: wordmark
and button only.

The single call to action, everywhere: the email form at #notify, in the closing band. The nav button
and the settle button both anchor to it.

### 6.1 Settle strip (the landing of the settle, not a section of its own)
One row of four mono labels between two hairlines that draw themselves from the centre outward:
"Kept on this phone" · "No account" · "Free to log, always" · "Not on the App Store yet"

### 6.2 Your words, their words. (the signature section)
Pill label: "Your words, their words"
Heading (centred): "Your words, their words."
Subheading: "Tell it in your own words. We'll find the clinical name for it."
Body: "You write what you feel. Emenla matches it to the term a clinician would recognise, shows you where that term comes from, and keeps your own sentence printed right beside it. A clinician can check the match at a glance. So can you."
Line (weight 500): "Emenla names symptoms in clinical language. It never names a condition."

Three cards, 25px radius, Bone White, medium shadow, three across on desktop, stacked on mobile.
Her sentence first, violet, with quotation marks. Term in ink, plain meaning in Stone, code in mono,
sources as links, the ICD-10 note when there is no code. No image, no icon, no face near this section.

1. "It hurts when I go to the bathroom, especially during my period." / Dyschezia / pain on defecation / Sources: ESHRE 2022 · NICE NG73 · ACOG 2026 / "No ICD-10 code. No verified symptom code exists, so Emenla prints none."
2. "Period pain. Menstrual cramps." / Dysmenorrhoea / painful menstruation / ICD-10 N94.6 / Sources: ESHRE 2022 · NICE NG73
3. "Painful sex." / Dyspareunia / pain during or after intercourse / ICD-10 N94.1 / Sources: ESHRE 2022 · NICE NG73

Source links: ESHRE 2022 https://www.eshre.eu/Guidelines-and-Legal/Guidelines/Endometriosis-guideline ·
NICE NG73 https://www.nice.org.uk/guidance/ng73 ·
ACOG 2026 https://www.acog.org/clinical/clinical-guidance/clinical-practice-guideline/articles/2026/03/diagnosis-of-endometriosis

Outro 1: "The word "cyclical" is never taken from a sentence. Emenla only uses it after counting your logged days against your logged period starts. Concepts come from your words. Qualifiers come from your data."
Outro 2: "Other apps turn a symptom log into a document for a clinician. What Emenla does differently is print your own sentence beside every clinical term, with its source, and refuse to say "cyclical" until it has counted."

Living element: a 1px violet hairline under each of her sentences breathes (opacity 0.35 to 0.6, 8s).

### 6.2b What's in the app. (added in the design loop, 2026-08-27)
Pill label: "Inside Emenla". Heading: "What's in the app."
Five photo cards of the cast (two large with breathing loops, three small): Record "A few words is enough. Say it, or type it." · Document "One clean page for your appointment, in your words and theirs." · Patterns "Your flare calendar and your cycle position. Counted, never forecast." · Nourish "Food and endometriosis, built carefully. No calories, no weight, no restriction." · Fitness "Gentle movement and physical therapy. It cannot score you."
Line: "Also inside: Community, voices from real women, told properly, with a stated position on what Emenla will and won't do with other people's stories. And Learn, plain-language articles on the condition."

### 6.3 Three things it does. (three columns, then the cycle; replaced the numbered rail in the design loop)
Cycle headline: "One cycle, in her words." Subline: "Five days from one month. The line draws as you scroll."
Cards: Day 2 (the hold moment) · Day 9 "Fine today. Walked to work." / "Kept as written. No score, no streak." · Day 17 "Nothing logged. A quiet week is fine." / "No streak to break. Nothing to catch up on." · Day 26 "It hurts when I go to the bathroom, especially during my period." / "Dyschezia · pain on defecation · no ICD-10 code" · Day 28 (period start) the bars, "Pain logged in the 3 days before your period in 4 of your last 5 cycles." / "A count, not a forecast."
The hero became the woman (Seedance 2.5, from the augen-style frame); the paper ending frame stays on the "Walk in with proof." card.

### 6.3 (original) Three things it does. (numbered timeline, 01 02 03, self-drawing rail)
Heading: "Three things it does."

01 "A few words is enough."
"Type or speak. "Bad cramps, back pain, stayed in bed" is a complete entry. Add severity and a period start if you want to. Skip everything else."
Card: **the one interactive moment**, "Hold to say it in your words". A press-and-hold button. While
held, a sentence writes itself in violet, character by character: "Bad cramps since morning. Back pain. Stayed in bed."
Release early and it un-writes, easing back, never snapping. Completing it lights the card in sequence:
"Dysmenorrhoea" (ink), "painful menstruation" and "ICD-10 N94.6" (Stone and mono), "Sources: ESHRE 2022 · NICE NG73" (links),
then a frosted chip "Kept on this phone". Button label before: "Hold to say it". During: "Keep holding".
After: "Kept." Keyboard: hold Space or Enter. Reduced motion: the completed state, no hold needed.

02 "See what you logged."
"Counts from your own entries. Which days, how often, how bad, and how that lines up with your logged periods. Nothing forecast, nothing scored, no streaks."
Card: a counts card drawn in CSS. Small bars for logged days set against two period-start markers.
Caption in the counting register: "Pain logged in the 3 days before your period in 4 of your last 5 cycles." Mono footer: "A count, not a forecast."

03 "Walk in with proof."
"A one-page summary in clinical terms, with your own words printed beside each one, for you to bring to your appointment. What it is for is you feeling clear about your own body. Whether a clinician reads it is up to them."
Card: the hero ending frame as an image card (25px radius, dark vertical gradient, white headline "Walk in with proof.").

All three cards the same size. Living element: the caret in card 01 blinks (1.1s), paused off-screen.

### 6.4 Everything you write stays on this phone. (privacy, two columns: phone left, rows right)
Pill label: "Privacy"
Heading: "Everything you write stays on this phone."
Intro: "There is no account and nothing to sign into. Your entries are not uploaded to a server, not sold, and not shared with anyone."
Rows (hairline between each):
1. "Data lives in the app's own private on-device database. There is no server and no user database."
2. "Speech recognition runs on the device. No audio leaves the phone and no recording is kept."
3. "Photos are copied into the app's private storage. They are never uploaded and never written back to your photo library."
4. "No analytics of any kind. No ads, no ad identifiers, no third-party trackers, no crash reporting, no remote configuration, no tracking prompt."
5. "No account, nothing to sign into. Emenla does not collect an email address."
6. "Notifications are local only. No push service, no device token."
7. (weight 500) "The one exception, said plainly." "Logging is free forever. The optional summary export is an Apple in-app purchase handled through RevenueCat, which receives an anonymous purchase identity and your purchase status. It never receives your symptoms, notes, photos, cycle dates or your name."
8. "Under GDPR, health data is special category data under Article 9. That is exactly why Emenla has no server." (weight 500) "There is nothing to breach and nothing to hand over."
Link: "Read the full privacy policy" to /privacy/

The phone: since 24 October 2026, Apple's own iPhone 18 Pro in Silver with the What Emenla can reach
screen under its glass (`device-18pro-reach-*`), whole, standing on a soft ground shadow; aria-hidden.
The CSS frame it replaced (device shadow, 44px screen radius, an empty screen) is gone. Living element:
the warm glow behind it breathes (6s).

### 6.5 What Emenla will never do. (one wide Nightshade card, white text, the page's one dark moment)
Heading: "What Emenla will never do."
1. "Tell you whether you have endometriosis. It never will."
2. "Predict your next period or your next flare. Cycle data in Emenla looks backwards only, at what you logged. Nothing in Emenla is a prediction."
3. "Give you a streak. There are no streaks anywhere in Emenla, and there never will be."
4. "Score your day, or judge it."
5. "Show you an ad."
6. "Sell your data. There is no data to sell, because none of it leaves your phone."
7. "Ask you to create an account."
8. "Ask you to wear anything."
9. "Talk about a root cause or a cure. There is no cure for endometriosis, and Emenla will not pretend otherwise."
Living element: a soft spotlight glow drifts across the card on a 20s cycle, transform only.

### 6.6 Why a record in your own words matters. (prose column beside one image card)
Heading: "Why a record in your own words matters."
"The World Health Organization estimates it affects roughly 10 percent of women and girls of reproductive age worldwide, which is around 190 million people." Link: WHO fact sheet on endometriosis https://www.who.int/news-room/fact-sheets/detail/endometriosis
"Studies have found the delay between first symptoms and a diagnosis is commonly between four and eleven years, and a large part of that delay is people not being believed." Links: ACOG, February 2026 https://www.acog.org/news/news-releases/2026/02/acog-publishes-new-endometriosis-clinical-guidance-aiming-shorten-time-diagnosis-improve-access-care · scoping review, 2024 https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11633989/
"The European Society of Human Reproduction and Embryology's 2022 guideline says patients are encouraged to keep a diary of their symptoms to support the history-taking process." Link: ESHRE endometriosis guideline, 2022
"In March 2026, the American College of Obstetricians and Gynecologists published a clinical practice guideline saying that a clinical diagnosis, made from your symptoms, your history and a physical examination, is enough for a clinician to begin treatment. Laparoscopy is not required first." Link: ACOG Clinical Practice Guideline No. 11, March 2026
Muted: "None of this is a claim about what Emenla does for your health. It is why a clear record, kept by you, in your words, is worth having."
Image card: supporting still A (three blank sheets stacked on linen, same world). Living element: its warm highlight overlay breathes (12s).

### 6.7 Free to log, always. (two cards)
Heading: "Free to log, always."
Card 1: "Logging" / "Free, always" / "Logging cannot be put behind a paywall. There is no account and no server, so there is nothing to lock. This is how Emenla is built, not a promise about the future."
Card 2: "Doctor-summary export" / "$34.99 a year, or $6.99 a month" / "One tier. Bought through Apple's in-app purchase, refunded through Apple's process." / muted: "Not purchasable yet. Prices are shown in US dollars and will be shown in your local currency on the App Store."
No badge, no strike-through. Living element: a faint border glow on the Logging card (10s).

### 6.8 Social proof: an empty, commented slot
No testimonials. The comment in the markup explains why: "It helped me feel heard" would be allowed,
"It got me diagnosed" is a medical outcome claim. Credibility on this site comes from mechanism,
citations and refusals. Do not fill this slot without written permission and a claims review.

### 6.9 Questions people ask first. (three native details rows)
Heading: "Questions people ask first."
1. "Does Emenla tell me whether I have endometriosis?" / "No, and it never will. Emenla names symptoms in clinical language and keeps your words beside each term. Whether those symptoms add up to a condition is a conversation for you and a clinician."
2. "What happens to my entries if I change phones?" / "You will lose them unless you export first. There is no account and no cloud copy, on purpose. Export before you switch."
3. "Is there a streak, a score, or a daily reminder I will feel bad about?" / "No. There are no streaks anywhere in Emenla and there never will be. Reminders are optional and never leave your phone."
Link: "All questions, and how to reach us" to /support/

### 6.10 The close (full-bleed Nightshade band, the form, then the footer)
Heading (violet, voice): "Walk in with proof."
Line: "One message, on the day Emenla is on the App Store. Nothing else."
Form at #notify: label "Email address", placeholder "you@example.com", button "Be told the day it opens".
Help: "Your address is used for that one message and then deleted."
Invalid: "Check the address. It needs an @ and a dot after it."
Sending: "Sending…"
Success (replaces the row): "Noted. You will get one message on the day Emenla opens, and nothing else."
Failure: "That did not go through. Try again in a moment."
Not connected yet (until the Formspree endpoint is pasted): "Sign-up is not connected yet. This is a build that has not been launched."
Handling: Formspree. The form posts email to https://formspree.io/f/<id> with fetch and an
Accept: application/json header, so no third-party script loads and nothing leaves the page until the
visitor presses the button. The founder creates the free Formspree form, turns off reCAPTCHA, and
pastes the endpoint into one constant in site.js. The privacy page names Formspree as the processor.
All states in ink on cream or white on night. No red, no green.

Footer: "Emenla" wordmark; links Privacy, Terms, Support, Contact, Instagram;
"Made in Poland. Emenla is not a medical device and does not give medical advice."
Disclosure line: "The paper and light on this site are generated images, not photographs. No person appears anywhere on it."
Living element: the spotlight gradient drifts (60s or slower).

Layout skeletons in order: full-viewport video settle / one-row strip / three-card grid / numbered
zigzag rail / two-column phone and rows / single dark card / prose beside image / two cards / accordion /
dark band. No two neighbours share a skeleton.

## 7. The vector layer plan

- One fixed environment layer behind everything: the spotlight gradient (cream to warm clay) on a
  large pseudo-element drifting on a 90s cycle, transform only, plus an SVG feTurbulence paper grain at
  about 3 percent, static. Zero image weight.
- The timeline rail in section 6.3: a self-drawing vertical line, stroke-dashoffset driven by scroll.
- Section hairlines that draw from the centre on entrance (settle strip, privacy rows).
- The violet hairline under her sentences.
- No particles. Paper does not drift; the dust lives in the footage only.
- Reduced motion: every line drawn, every hold complete, every drive stopped, the video never requested.

## 8. The engineering list

Built to the standard in 10k-websites/references/scrub-pipeline.md, in full: Blob fetch with the
loading ring when the file is over 8 MB and the poster set from JS inside the gated path only;
dt-normalised rAF lerp that rests when converged and when the hero is off-screen; gated seeks with the
error-handler escape; DOM writes only on change, delta-gated at 0.008; band pacing validated by the
flick test at 120, 240 and 360px; the four-layer legibility system (inverted to cream, section 4);
the five static-hero gates (max-width 720px; portrait and max-width 1024px; portrait and coarse pointer;
landscape and coarse pointer and max-height 560px; reduced motion) matched character for character in
CSS and JS and kept live with matchMedia change listeners that re-arm through one applyHeroMode();
complete without the video; overflow-x clip on html and body; reduced motion honoured in both
directions; IntersectionObserver entrances with retired stagger delays; one living element per section
at whisper level with negative delays, paused off-screen and on hidden tabs; the one interactive
moment; the quality floor (self-hosted trimmed fonts with unicode-range, ch measure on the text
element, computed contrast, landmarks, skip link, focus-visible in violet, 44px targets under coarse
pointer, title, meta description, theme-color, inline SVG favicon, a DEPLOY STEP comment for og:url and
og:image). Architecture: site/index.html plus site/assets/, plain HTML, CSS and vanilla JS, no build
step. Three subpages (privacy, terms, support) and a 404 share the stylesheet; they exist because
App Store Connect needs a live privacy URL and support URL. The 404 is one centred screen: the 404
chip, the hook.voice headline, one line, a black pill back to the start and a text link to write to
us, a slim footer line on the same screen, no script.

## 9. The copy gate

Every viewer-facing line ships verbatim from this package. Before anyone sees the built page it must
pass the grep gate: zero em dashes, zero stock words (leverage, seamless, empower, unlock, robust,
actionable, data-driven, solutions, testament, landscape, delve, elevate), then the body-copy sweep for
"not just X, it's Y", false ranges, vague attributions and big-finish endings. The designed devices in
this package (the four-label strip, the staccato refusals, "A count, not a forecast.") are craft and
stay.

## Added 29 August 2026

### The statement (`#statement`, between the settle strip and Your words)

One paragraph, Hanken 500 at up to 48px, left-aligned, 24ch wide. Words start as a lavender ghost
(#cfc6f6, 3px blur) and turn ink as the paragraph scrolls through the viewport, three words at a
time; three inline glyphs (a speech mark, the Emenla ring, a page) travel with the words.

> Emenla is a record of endometriosis kept in your own words. Say what you feel, see it named in
> clinical language, count what you logged against your periods, and walk into the appointment
> with one clear page.

### Screens (`#screens`, after Three things it does)

Label "On the phone". Heading "One app, kept in your words." Two tinted panels, a phone rising out
of each with 62% of it visible:

- Record — "A few words is enough. Say it, or type it." — Learn more → #your-words
- Document — "One clean page for your appointment." — Learn more → #how

The screens are placeholders ("Screens on their way") until the founder drops real screenshots; see
README, Before launch, item 3. Superseded twice: frames of the app in the CSS phone on 20 October 2026,
then Apple's devices with the screens under their glass on 24 October 2026 (the dated entry below).

### The headline, 29 August 2026

"You're not imagining it." stays in Instrument Serif italic (the face that fits the hero), on a
single-hue plum gradient that sweeps left to right: deep plum #4a2352 → soft plum #7d4a86 → #35183d,
one full period per 8 s so the loop is seamless. One colour breathing, not a rainbow: it is a
healthcare product. Under a fine pointer its letters lift and glow
plum; the other three caption lines lift and warm to violet. The hero lines show the arrow
cursor, not the text I-beam. Everything else on the site keeps the violet voice.

### Two bands from the Lóvi reference, 29 August 2026

**We asked before we built** (`#asked`, between Pricing and the FAQ): the testimonial-carousel
layout with research-record cards instead of reviews. Six cards on a card rail (round chevron
buttons, faded edges, drag on the mouse, native swipe on touch): 515 comments · 108 questions ·
two structured interviews · four replies · "No reviews yet". A consented quote is added later as a
`.qcard--quote`, instrument and month only.

**Built on what the guideline actually says** (`#context`): the "backed by professionals" layout,
with named, dated, linked guidelines instead of faces. A white panel holding four cards, each with
a large serif year as its portrait: ACOG 2026, ESHRE 2022, NICE NG73, WHO fact sheet. The
subheading says plainly that nobody has reviewed Emenla clinically yet.

The statement paragraph is now centred.

### The liquid-glass lens, 29 August 2026

"You're not imagining it." is solid plum again (the tonal sweep intact). The glass is a capsule
that follows the pointer across the headline: frosted (12px backdrop blur), bright along its rim,
carrying a second copy of the headline aligned to the first, magnified by 12% about the capsule's
centre and run through a slow turbulence so the letters ripple as it moves; a blurred third copy
fills in the rim. Fine pointers only; hidden under reduced motion; the phone still is untouched.
The per-letter lift now belongs to the three caption lines only.

### The two bands, second pass (Lóvi 1:1), 29 August 2026

"We asked before we built." now reads like the review carousel: a display heading alone, a
full-bleed rail centred on three tall flat white cards with the neighbours peeking in under wide
fades (the rail opens one stride in on desktop), body text in ink, the explanatory copy as one note
under the rail. "Built on what the guideline actually says." reads like the professionals band: a
48px-radius white panel, tall soft-grey cards whose visual, a rendered white sheet carrying the
guideline's real title, fades into the name, the organisation and date, the one-line finding and
the link. No clinician faces: there is no clinician to show.

### Reserved, 29 August 2026

At the founder's request the two bands are now reserved spaces, each saying it is empty:
"Reviews, after launch." (five slots for App Store review screenshots; nothing paid for, edited or
invented) and "Specialists, once they have reviewed it." (three slots for licensed clinicians,
filled only after a real review). The research record and the guideline cards live in git history
(`f60ce86`); the guidelines stay on the science page.

### The two bands matched to Lóvi, 29 August 2026

"Reviews, after launch." is the Lóvi review rail measured from the reference: a 1000px centred
container, 310×378 white cards with 12px gaps and 24px corners, fading at the container's edges,
opened one card in, chevrons on hover. Three cards marked Example show the shape a review takes
(App Store, rated, consented quote); three are honest empties. "Reviewed by clinicians, once it has
been." is the professionals panel: 1000px white, 56px corners, three 392×492 warm-grey cards with a
white portrait area melting into the card, the third cut by the panel's edge, a translucent 48px
chevron at the right. The portrait areas are held white (the founder's rule for generated pictures)
until a real clinician exists.

### The headline, neutral glass, 29 August 2026

"You're not imagining it." is clear glass in white and black only: an almost transparent body with
a dark edge, a white highlight along the top of every glyph, a band of light travelling through
the words, and a soft shadow beneath. No plum. The lens is smaller now (2.3 × 1.12 headline ems)
and warps the letters harder, as in the Liquid Glass demo the founder sent.

### Reviews rail, six slots and no end, 29 August 2026

Every card in "Reviews, after launch." is the plain App Store slot (glyph, "App Store review", five
hollow stars, "Reviews appear here after launch, as they were written."); the Example format cards
are gone, their markup kept in the HTML comment. Both rails now loop: a copy of the card set sits on
either side and the scroll position is moved back by one set whenever it drifts half a set away,
onto identical cards, so scrolling right or left never reaches an end.

### The measured record, 29 August 2026

Superseded 2026-10-23, below. `#history` is no longer the Alveos wave. The line is a straight hairline rule inked as far as the
reading point, with a thin vertical cursor at the ink front (hidden within 24px of a milestone, so it
can never read as a ninth dot). Milestones sit on ONE scale for the whole rule, no reset at any node:
`x = x0 + K(u(1690) - u(year))` with `u(y) = sqrt(2028 - y)`, K taken from whichever is larger, the
tightest gap holding a card (card + 48px; 120px on phones) or the whole record running about 3.3
screens wide (4 on phones). Time is therefore foreshortened toward today: distant decades tighten,
recent ones open out, and the geometry cannot carry a two-year span and a two-hundred-year span at
once, so the words do it instead — each long stretch carries a serif caption ("170 years pass.",
"Sixty-seven more.", "Another fifty-three."). Decade ticks run 1700 to 2020 under the rule in mono,
the fiftieth years taller and numbered; a decade number steps aside when a milestone sits within
44px. Milestone years sit under their own dots in serif italic, so the ruler's grid and the events on
it cannot be confused.

A giant Instrument Serif year at the BOTTOM left (clamp 88 to 172px, every digit in a 0.5em cell so it
does not jitter) names the milestone the ink has reached, its label above it in mono: the giant year,
the lit card, the solid dot and the year under the rule always say the same thing at the same moment.
Cards (300 to 340px) hang in a band starting 100px under the nav, bottom-aligned on 56px stems, so the
rule can never enter one; the rule is placed between the tallest card and the year block, and if that
will not fit the scene steps down through `.hscroll--compact` (smaller year, three-line bodies) and
then `.hscroll--tight`. Nodes are 12px rings ahead, filled dots behind, one 18px dot where the reader
is. The card year is ink, not violet: nothing in this section uses violet.

The three milestones with no honest picture (1980, 2026, Today) carry a typographic figure in the
media slot — a ledger line between two haze hairlines, filling the same box as a photograph so every
card in the band is one height: "1st / patient-led organisation", "Enough. / symptoms · history ·
examination", "4–11 / years to a diagnosis". On phones the card stays pinned over the reading point
and the ruler slides beneath it like a tape, the next card crossfading in as its dot passes, so no
mid-scroll moment leaves a half-cut card. `body.hs-pinned` lifts the page's bottom blur strip while
the scene is pinned. Reduced motion keeps the stacked list, capped at 560px. Render and assert with
`node tools/histshots.mjs http://127.0.0.1:8080/ <dir>`, which waits for the page to stand still and
the current card to reach full opacity before and after every frame.

### The clock and the record, 23 October 2026

The measured record above is gone. It pinned the viewport for five screens of wheel input and panned
a 5,700px track sideways on top of the site's wheel smoother; phones got a lesser rail with every
picture hidden and everything below the reading line at a quarter strength; and the captions, the
dots and the giant year were all hidden from assistive tech. The founder named all three: he disliked
the carousel, doubted it on phones, and thought it could be bad for people.

What replaced it keeps native scrolling everywhere and never pins. Two columns on desktop. Left, the
clock: a sticky block carrying the era's mono label, a giant Instrument Serif year that rolls like an
odometer under the visitor's own scroll (four half-em cells, each a strip of 0 to 9 and a trailing 0,
moved by a custom property the script sets), and a ruler on the same square-root scale from 1690 to
today, decade ticks, century labels, inked as far as the year with a pen at the ink's tip. Right, the
record: the eight eras in reading order, each with its serif year, chip, picture or figure, title and
body; a spine beside them inked down to a reading line 58% of the way down the screen (62% on
phones), with a node per era that fills as the line reaches it; the three gap captions as visible
text between eras, each given height in proportion to the years it counts; Today as the one raised
white card. The contrast between the columns is the point: the record gives every era the same room,
the ruler shows how uneven the real time was, and the speed of the rolling year says the same thing.

The hold-and-roll rule: while the reading line is inside an era's box the clock shows that era's year
exactly and its chip as the label; across the gap to the next node it rolls, linearly in scroll,
from one year to the next, and the label fades out. The clock and the lit card never disagree, and
the fast spin of the small digits happens only where a caption says time is passing. The readout
never passes 2026: the last gap holds it while the pen runs out the ruler, and the last node turns it
into the word Today. Scrolling back rolls back and un-lights: the state is a function of the scroll
position and nothing else, so no latch and no loop.

Phones get the same thing in one column: the clock is a strip that sits on the page's own ground
while in flow and, from the moment it sticks to the top of the screen, turns solid under the floating
wordmark, about 130px tall with a fade beneath it (the ground is a fixed spotlight, so a solid band in
flow would show its edge); the record follows with the spine, the
pictures at column width and the captions; and the CC BY credits now show on phones too, which the
licence requires once the pictures do. Reduced motion keeps the layout and the sticky clock, steps
the year to whole milestones with no roll, and drops every transition; the spine ink and the ruler
fill still follow the scroll, as a scrollbar does. Nothing in the copy changed; the one new sentence
is a visually hidden line for assistive tech. The breakpoint is 900px, where every other two-column
layout on the page collapses; type sizes change with the site's 720px rules.

Gone with it: `.hscroll` and its `--compact`, `--tight`, `--rail` and `--pin` states, `body.hs-pinned`,
`span.hnode`, the `.hs-head` block, the hint and the inner `.card` wrappers.
`node tools/histshots.mjs http://127.0.0.1:8080/ <dir>` was rewritten for the new section: it
photographs the desktop before the first node, inside every era and mid every captioned roll, two
short desktops, two phones and reduced motion, and fails if the clock and the record disagree, a card
or caption drops below full contrast, the clock is not stuck where the stylesheet puts it, the phone
strip passes 140px, the page overflows sideways or a console error is logged.

### Apple's devices on the page, 24 October 2026

Every phone on the home page was a CSS rectangle (300×612, `#111114`, a 92×28 notch) with a frame of
the recording inside it. Now each is Apple's own product image of iPhone 18 Pro in Silver, straight on,
with the app's screen under its glass, and a new band after `#inside` shows iPhone Duo in Star White
beside it. The brief was thirteen photoreal renders Oliwier sent (silver and titanium phones, floating
pairs, macro corners, studio light, one book-style foldable open) and "I like silver cases".

**The device is one picture, not a frame over a frame.** `scripts/make-devices.py` pastes the screen
into the cutout of Apple's PNG (the transparent region flooded from the centre), masks it to that cutout
grown by four pixels, and composites Apple's pixels over it. The result ships as WebP at three widths
with a PNG fallback at the smallest, transparent surround kept, so the island, the rounded corners and
the anti-aliased inner edge are Apple's and the page's shadow follows the silhouette. The bare frame is
never served and Apple's files are not committed: the licence (PLACEHOLDERS.md) allows showing the
resources in depictions of a mock-up and forbids making them available over a network, so only the
composite goes out. Shown as provided: straight on, not recoloured, not tilted, no reflection or
highlight drawn on it. The inspiration's angles, back views and macro corners are therefore out. The one
departure the page keeps is a phone cropped by its panel's bottom edge, which is the page's layout, not
an edit of the image.

**Markup.** One `div.device.device--<kind>` holding one `picture`: a WebP `srcset` at 480/720/1080 for
the 18 Pro, 400/600/800 for the closed Duo and 640/1000/1540 for the open one, `sizes` per place, and a
PNG `img` with `width` and `height` so nothing shifts. `.device` is `width: min(100%, 300px)` under a
two-layer `drop-shadow` filter; `.device--floor` drops the filter for a blurred ground ellipse (`::after`,
6% of the device's height, 0.24 ink) under `isolation: isolate`. The class stays `device`, so
`tools/selftest.mjs` and `tools/newshots.mjs` keep measuring the panel crop from it. No CSS notch, screen
box or hint is left.

**The Record panel is a floating pair** (`.twin`, because `.pair` already names the "your words, their
words" cards): the body map in front at 71.4% of a 448px wrapper, the symptom detail sheet behind it at
55.8%, flush right, its foot 7% up, opacity 0.96, under the front in paint order, rising 28px into place
360 ms after the panel. Under 900px the back phone hides and the front fills the wrapper. The three
small panels show one device each at 280px. The paper panel is untouched.

**The stage went neutral.** The panels' violet tint is gone: `linear-gradient(180deg, #eeedf0, #f8f6f4
55%, var(--canvas))` with a white radial highlight behind the device's foot, so silver reads as silver
and not as a sticker on violet. Violet stays on her words. The privacy glow (`.device-wrap::before`,
still breathing over 6s) is a warm neutral, `rgba(230, 220, 207, 0.35)`.

**`#duo`.** Label "iPhone Duo", heading "Made for iPhone. iPhone Duo is next.", and copy that says every
app screen on the page is from iPhone, that Emenla will come to iPhone Duo later, and that the two Duo
screens show the app's launch screen because the page shows only what is real. The stage is
`aria-hidden` and stands three devices on one floor at true relative size: `--mm: clamp(1.9px, 0.26vw,
3.1px)` and each device `calc(var(--mm) * <its frame's width in mm>)`, 72.8 for the iPhone, 84.4 for
the closed Duo, 164.4 for the open one (from Apple's figures, 18 Pro 71.9 × 150.0 mm, Duo 84.1 × 117.8
closed and 164.6 × 117.8 open, scaled through each frame's height, which is the exact one). So the
closed Duo stands shorter and wider than the iPhone and the open one is as tall as the closed. Under
900px `--mm` is the column over 166, so the open Duo fills the column and the iPhone and the closed Duo
share the row above it. The Duo screens show the launch screen, white with the mark at 120 pt, because
no Duo simulator exists and a layout we have not built does not appear; when one ships, the two
composites are rebuilt from a capture and the copy's last sentence goes. A note under the stage reads
"Devices at their relative size. iPhone 18 Pro in Silver, iPhone Duo in Star White." No script changed:
the band uses `.reveal` and `.part`.

**Reduced motion.** The global kill zeroes the transitions, `.twin .device--back` is set to
`transform: none`, and every device is whole and still from the first paint.

**Checked** with `node tools/devshots.mjs http://127.0.0.1:8080/ <dir>`: every device image loaded and at
its stated aspect within 0.3%; the back phone right of, above and under the front on desktop and hidden
at 375; the panel crop between 0.55 and 0.75; the Duo band's three floors within 2px, the iPhone to
closed-Duo height ratio within 2% of 150 / 117.8 and the open Duo as tall as the closed; two rows at
375; no sideways overflow, no console error, nothing still moving when a frame is taken. Twelve frames
were looked at: desktop, the pair at 2×, the corner at 4× (the island over the blank band, no seam), the
Duo band, privacy, three at 375 and two under reduced motion. The self-test, the history filmstrip and
`npm run check` pass; the phone first load is 262 KB in 8 requests, and the device images are lazy.

**What did not happen.** The screens are the recording's frames cut again at full size, not a fresh
capture with the 9:41 status bar: the simulator was held by another session, Metro was down and the
load was high. The band under the island is therefore blank. The recapture is six PNGs and one run of
`make-devices.py`, no markup change. Nobody has scrolled this in a real browser or with VoiceOver yet.

### Sans everywhere, and one table, three centuries, 24 October 2026

The founder sent two screenshots of the live page. Of "Your words, their words" he said he did not
like it and wanted the site's main font in place of the serif, something "more like helvetica, for
simplicity and modern". Of the history he wanted the timeline's type changed too, and new pictures
that make sense there.

**The serif is gone from the site.** Instrument Serif in violet italic was her voice in the pairs, the
hold demo and the history (the rolling year, the era years, the gap captions and the figure panels),
and one word on the science page. Once both sections changed, that one word was all that was left, so
the face went entirely: four woff2 files (66 KB together), the OFL text, the @font-face block,
`--font-voice` and three preloads. Hanken Grotesk is the only face. Her voice is a colour now, not a
face: `.voice` is violet upright Hanken.

**Your words is a ledger.** Three cards each stacked a big violet quote over its term, so the layout
never showed the idea it sells, that her sentence sits beside the clinical term. Now it is one table,
the way the doctor summary prints it: headed Your words and Their words, one row per pair between haze
hairlines. Her sentence is on the left in Hanken 400 ink with violet curly quotes, the opening one hung
outside the column; the term is on the right in 600 at the same size (`clamp(22px, 2.1vw, 28px)`),
with its meaning in stone, then the code and the sources in ash at caption size. Between them a 1px
line, clay to violet, draws from her words to theirs when the row arrives (700ms, from 300ms, rows
120ms apart) and lands on a 5px violet dot. Violet is only the line, the dot and her quote marks.
Every word of copy, every link, every code and the "No ICD-10 code" sentence are as they were. Each
cell starts with a visually hidden "Your words:" or "In clinical language:", and the line is hidden
from assistive tech. At 900px and below the middle column narrows to 40px. At 720px and below each row
stacks: her sentence, a 48px line with its dot, the term and what it means, and the codes and per-row
sources give way to the one sources line under the table, as before.

**Try it is the ledger's live last row.** The markup keeps every hook the script reads (`[data-hold]`,
`.hold__sentence`, `.hold__btn`, the status line, `.hold__result`), so `site.js` is unchanged. While
she holds, the sentence inks in from a faint draft and the line draws with `--hp`; the dot lights at
the end; on completion the term, its meaning, the code, the sources and the "Kept on this phone" chip
arrive on the right one after another. Three changes from the plan, made on the frames: the faint
draft (0.22) applies at every width, not only on phones, so the row is never empty before the hold;
the caret the script still builds is hidden, because the draft already shows where the sentence goes;
and the closing quote mark waits at the same 0.22 until the hold completes. On phones the button sits
right under the sentence, and the line and the term arrive below it: the room kept for the term is
where the answer lands, not a gap between her words and her thumb.

**The history in Hanken.** The rolling year is Hanken 500 at the same size. Hanken's digits are
tabular at 0.56em at every weight, so the odometer's strips still work; the cells are `--digit` 0.54em
wide, a touch under the advance and never under the ink, because letter-spacing inside a one-digit
cell only shifts the glyph. Era years are 500 at 28px with tabular numbers. The gap captions ("170
years pass.") are 400 upright in stone: Hanken ships no italic and a synthetic slant looks broken.
"Enough." and "4 to 11" are 600.

**One table, three centuries.** The old pictures did not belong together or to their eras: an
archival endpaper for 1690, two portraits of men for 1860 and 1927, and two laparoscopy photographs
for 2005 and 2017 that had nothing to do with a guideline or with listening, and were graphic for this
audience. Six generated still lifes replace them, made with ChatGPT image generation on the founder's
account. Each is the same worn oak table against the same plaster wall in the same window light from
the left, from the same camera; only the objects change, following the record from what was written
about her to who finally listened. 1690: an open handwritten book, a quill, a candle. 1860: a brass
microscope with a stained slide. 1927: a typewriter, a fountain pen, a journal. 1980: opened letters
in many hands tied with string, a notebook, tea and a push-button phone, women's own accounts, in
place of the "1st" figure. 2005: a spiral-bound guideline with reading glasses and a highlighter, a
laptop behind. 2017: two cups of tea across the table from each other, a notepad between them and a
stethoscope set aside, a conversation rather than an examination. No people, no hands, no faces, no
legible text, no logos. 2026 ("Enough.") and Today ("4 to 11") stay typographic: the past is objects,
the present is a sentence. The plan's 2017 was two armchairs in a consulting room; generated, the
chairs read as doll furniture and the step back into a room broke the series, so the table stayed.
The prompts, masters, hashes, the rubric and both rejected 2017 candidates are in `HISTORY_ART.md`.
`scripts/make-hist.py` cuts each master to 2:1 and writes a 720 and a 1080 AVIF and a 720 JPEG under
new names, because `/assets/*` is cached for a year; it fails if a 1080 AVIF passes 70 KB.

**Colour returns as the record nears today.** The old filter pressed every picture to near monochrome
to hide that they did not match. A set that matches does not need that:
`grayscale(calc(0.25 + var(--age) * 0.75)) sepia(calc(var(--age) * 0.45))`, with `--age` falling
from 0.9 at 1690 to 0.1 at 2017.

**Said where it shows.** The credits line under the timeline reads "Images: still lifes generated for
Emenla with ChatGPT image generation. They show objects of each period, not historical originals."
The footer note on the home and science pages says the same. The alt text names objects only.

**Reduced motion.** Every static line shows drawn with its dot; the live row is pinned complete, the
sentence written and the term showing, and the hold button is gone, as before. "Try it." and its
instruction go too, since there is nothing to press (before this they stayed, over no button), and the
row joins the table as its fourth entry.

`node tools/wordshots.mjs http://127.0.0.1:8080/ <dir>` photographs the ledger, the live row mid hold
and done, a phone, reduced motion, the clock at 4×, each history picture and the science hero, and
fails if any element in those sections computes a serif, a row's two sides are not level, a line is
not drawn, the hold does not track or finish (by mouse at 1440, by touch at 375), a picture is missing
or holds fewer pixels than it is shown at, the page overflows sideways or a console error is logged.
First load fell from 1.88 MB in 10 requests to 1.84 MB in 8 on a desktop, and from 262 KB in 8 to
219 KB in 6 on a phone.

### The clock, the record's sources and Today, 25 October 2026

The founder sent a screenshot of the history on the preview and asked for three things. The rolling
year on the left should be bigger and different, "with a smoother animation, blur, and stuff like
that". The pictures should be real ones, from events, conferences and the things that matter in a
patient's life, each with a source "to not get an issue later", and something like TED talks and
podcasts, in place of the generated still lifes he called AI slop. And the white Today card holding
"4 to 11" should go, in favour of a different design "or maybe just information".

**The clock eases and blurs.** The year is Hanken 600 at `clamp(104px, 12.5vw, 180px)`, up from 500
at `clamp(88px, 10vw, 150px)`; four digits at the top size are 389px in the 400px column, and a 4×
clip shows every digit's ink whole. The scroll position still sets a target year, but the shown year
no longer tracks it one to one: every frame it moves a fraction of the way (`hsK`, 0.22 on a fine
pointer where Lenis already eases the wheel, 0.12 on touch where the finger scrolls natively and the
lerp alone supplies the ease), so a flick lands softly and the digits never stutter with the wheel's
steps. While it rolls, each digit strip blurs in proportion to its own speed (`HS_BLUR`, 0.2em per
cell per frame, capped at `HS_CAP`, 0.035em, about 6px at the top size), so the units digit smears
while the thousands stays crisp; at rest no filter is applied and the edges are sharp. Each cell fades
its top and bottom 9% with a mask, so a digit comes up out of the edge rather than appearing at it.
The era label leaves through a 6px blur and a 6px drop over 320ms, and the swap between a year and the
Today figure is a 180ms blur to nothing, then the other state back in. The ruler's lift under the
clock is measured from the ruler's own offset instead of a fixed 196px, so the label and sub lines can
change without the ticks drifting. Under reduced motion none of this runs: the year snaps to whole
numbers, no strip blurs and no state crossfades.

**Today lives in the clock.** At the last node the clock itself becomes the figure: the label reads
Today, the digits give way to "4 to 11" (at 0.69em of the year, so the block keeps the clock's
height), and a reserved line under it says "years to a diagnosis". The white card is gone: the right
column's Today entry is a plain entry like the others, Today, Still waiting, "Four to eleven years."
as its title and the same paragraph. The figure and its line are attributes on that card, so the copy
lives in one place. On a phone the strip stays one 132px row, the figure at 0.84em beside the sub
line at a tighter tracking; under 340px the sub line hides, because the entry below says the same in
words.

**Pages, then a bench.** Nothing rights-clean shows a march, a congress, the WHO, NICE or ACOG: what
exists on Commons is posed groups of named officials and politicians, and putting strangers' faces on
the page as illustrations was rejected. TED and TEDx talks are CC BY-NC-ND, so no stills on a
commercial site. What does exist are the documents themselves, and that became the set's idea: for
three centuries the record is what was written about her, so the first three pictures are pages, and
the modern moment is what patients did themselves, so the fourth is the colour they chose. 1690 is
the title page of Schrön's Jena dissertation (SLUB Dresden, Public Domain Mark), 1860 the first page
of Rokitansky's Vienna offprint (Wellcome Collection, Public Domain Mark), 1927 the first page of
Sampson's paper in the American Journal of Obstetrics and Gynecology (an Internet Archive scan,
public domain), and a new 2014 card, Marching, carries the one clean community photograph found: a
yellow awareness bench with its plaque in Avezzano, Italy, by Marica Massaro, CC BY-SA 4.0. Each sits
in a figure with its credit and links under it, shown as provided and cropped to the 2:1 frame, with
no grayscale or sepia: a sourced page is not made to match the others, and the bench stays yellow.
1980 returns to its typographic "1st" panel, 2005 and 2017 carry no picture (a guideline is text, and
the body says it), and 2026 keeps "Enough.". The 2014 card gives no count of cities or countries
because the sources disagree. Under the Today entry a line, "Told out loud", links EndoTV, Living
With Endo, Voices and Visions, NICE on its guideline, Get Loud and a TED talk, names only, since
podcasts and talks have no artwork to reuse. `HISTORY_SOURCES.md` records every source page, its
licence statement and the date it was read, the download URL, the original's size and sha256, the
crop box, the credit as printed and the alt text, plus what was looked for and found unusable so
nobody repeats the search. The six still lifes and `HISTORY_ART.md` are gone; their record is at
`2b45238`.

`node tools/histshots.mjs http://127.0.0.1:8080/ <dir>` now settles the clock after every scroll
before it photographs, photographs a frame 100ms into a roll and asserts the units strip is blurred
and the thousands is not, holds every era (nine, read from the page rather than counted), the three
gaps and the Today figure with its sub line on a desktop and on a phone, and reduced motion with
whole years and no filter; every frame passes at 1440×900, 1280×720, 901×800, 375×812 and 375×667.
`wordshots.mjs` measures the widest digit's ink against its cell with canvas `measureText` (96.9px in
a 97.2px cell at 180px, top and bottom inside the mask's opaque band), clips the clock at 4× at rest
and mid-roll, and checks that every picture holds at least the pixels it is shown at, has no filter
and has a linked credit. First load is 1.85 MB in 8 requests on a desktop (1.59 MB of it the hero video) and 227 KB in 6 on a phone, from 1.84 MB and 219 KB, the difference being the captions, the credit lines and the new card in the HTML; layout shift stays at 0 on both, the reserved sub line under the clock included. Not verifiable headless: the wheel feel of Lenis plus the lerp,
Safari's mask and filter rendering, VoiceOver (the clock stays `aria-hidden`; the Today entry's
visible title carries the figure) and 120Hz devices.

### The headline, re-set to the reference, 29 August 2026

The founder sent the Alveos One and Lóvi heroes: both are a clean grotesque sans, one flat colour,
no effects. "You’re not imagining it." now matches that register — Hanken Grotesk 500 at
clamp(38px, 4.2vw, 62px), tracking -0.03em, leading 1.1, flat ink, carried by the cream halo every
band already uses. Alveos can set white because its ground is a mid-tone sky; Emenla's wall is pale
cream, which is why white there needed a drop shadow, and that shadow was the thing that read cheap.

Gone with it: the serif italic on this line (the voice token stays for quotes and the science
title), the three-part shadow, the light-sweep overlay and the pointer-lit lean. Kept: the cream
mask wipe, the rise, the exit lift and the blurred twin — the entrance is the motion, and neither
reference animates its headline. The apostrophe is typographic now, which shows at this size.

### The hover in the hero, 30 August 2026

Every line in the hero answers the pointer now. The headline's words rise 12px and take 2.5% of
scale with them, the nearest word most, its neighbours following in a falloff, and they warm to the same violet as the rest,
its halo spread wider to match the type. The three caption lines keep the proximity lift (letters near the pointer rise 5px and
settle back) and the violet they warm to, which was only ever meant to leave the headline. Lit, those
words sit near 6:1, which clears AA for their size; the headline is the line that stays ink.

The headline was left still at first, on the grounds that neither reference animates its hero line.
The founder asked for it twice, so it has one: transforms only, because a variable-weight change
would alter the advance widths and reflow the line under the cursor. The reach scales with the type
(`max(150px, lineHeight * 2.6)`), so a 60px headline word answers from further away than a 20px
caption. Splitting the headline into words puts a screen-reader copy in the markup and hides the
split one, so the sentence still reads as one line.

The headline rests in ink and only warms under the pointer; the violet the founder rejected was the
resting colour of the old serif treatment, not this.

### The headline stays still, 30 August 2026

Final: the headline has no hover at all. It rests in ink, arrives on the cream wipe with the scroll,
and does not answer the pointer. The three caption lines keep the proximity lift and the violet they
warm to. The hero's one loud moment is the scroll itself.
