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

The phone: an HTML/CSS iPhone frame with an empty screen for now (the founder will drop real mockups
in at the end). Device shadow, 44px screen radius, aria-hidden. Living element: none until the real
screen arrives; the frame's soft glow breathes (6s).

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
App Store Connect needs a live privacy URL and support URL.

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
README, Before launch, item 3.

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
