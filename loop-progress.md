# Design loop: progress

Bar: bar.md (alveoslabs.com home page + the augen hero screenshot). Founder asked for "not too strict":
critics fail on real gaps against the nine mechanisms, not on nitpicks.

Money path: Seedance 2.5 hero (54) + two Kling 3.0 Pro loops (21) + six images (12) = 87 of 93.5 credits.
Every generation is one shot.

Builder: the main session. Critics: three fresh-context agents per piece, judging renders only.

| Piece | What | Round | Brief | System | Craft | Biggest gap (latest) |
|---|---|---|---|---|---|---|
| P1 Hero | The woman, augen way, Seedance scroll video, captions | 2 | PASS (r1) | FAIL r1 | FAIL r1 | r1: settle headline ran to 3 lines; phone copy piled on her face. Fixed: 40px two-line settle; phone shows only the hook over the image, the rest below on cream. |
| P2 Cycle line | Drawn cycle across the screen, day nodes, her words + term cards | 2 | FAIL r1 | FAIL r1 | FAIL r1 | r1: five card templates, wrapping labels, no headline, thin line hidden by cards, phone render at wrong offset. Fixed: one template (day row, 18px sentence, 13px line), headline "One cycle, in her words.", 3.5px line, correct phone render. |
| P3 People grid | "What's in the app": 2 large loops + 3 stills of the cast | 2 | FAIL r1 | FAIL r1 | FAIL r1 | r1: phone render at wrong offset; Nourish had a window edge; Fitness figure too small; gradient read as grey fog. Fixed: re-crops of Nourish and Fitness, gradient starts lower and stays translucent, correct phone renders. |
| P4 Section polish | Privacy, refusals, context, pricing, close | 1 | FAIL r1 (render cut the FAQ; the page has three rows) | FAIL r1 | not run (session limit) | r1: refusals heading was the only left-aligned heading. Fixed: centred. |
| P5 History record | The measured record: ruled track on one foreshortened scale, giant year naming the milestone, cards in a band above the rule | 3 | FAIL r1 | PASS r1 | FAIL r1 | r1 brief: phone mid-gap left both cards clipped. r1 craft: a hairline and one lit card in 75 percent empty cream with 180px dead under the rule; readout said 1887 SEEN over an 1860 card; tick pitch reset at every node; pen read as a ninth node; figure panels shaped like the photo slot. Fixed in r2: card pinned over the reading point on phones with the rule sliding beneath; the big year moved into the space under the rule, cards up under the nav and larger; one global square-root scale from today; readout line says N years after it was first seen; pen hides under nodes; figures as ledger lines. |

## Round 2 results (2026-08-27, about 02:10)
- P1 hero: brief PASS, system PASS, craft FAIL: on the phone the dissolve was hidden behind the image (layering bug) and the copy stack was long. Fixed: image below the wash, one line dropped on phones.
- P2 cycle: brief PASS, system FAIL (says ahead cards look opaque; ghost opacity lowered from 0.32 to 0.22), craft FAIL: line occluded by cards, draw started before the band was in view. Fixed: taller band, larger wave, smaller cards set 64px off the line, draw timed to the band.
- P3 grid: brief PASS, craft PASS, system FAIL: four captions wrapped to two lines. Fixed: shorter captions.
- Round 3 not run: the account's session limit was hit by a critic (resets 3:50am Europe/Warsaw). Fixes verified by the builder's own renders and the self-test instead.

## Gap history
- r1 P1: system: 3-line settle headline; craft: phone copy over her face. Both addressed in r2.
- r1 P2: brief/system: claimed node/card desync (not reproduced in the end render; cards and nodes toggle together); craft: template sprawl and no headline. Template unified in r2.
- r1 P3: system: Nourish window edge; craft: phone card had no person (render offset error), gradient too grey. Addressed in r2.

## Gap history

(none yet)

## Generation ledger

| Asset | Model | Credits | Status |
|---|---|---|---|
| Hero woman start frame | nano_banana_pro 16:9 2k | 2 | done, approved by founder (review/raw/woman-v1.png) |
| Hero video | seedance_2_5 6s 1080p, from the frame | 54 | done (review/raw/hero-woman-v1.mp4), inspecting |
| Cast: Record, Document (4:5), Patterns, Nourish, Fitness (1:1) | nano_banana_pro, hero frame as style reference | 10 | done, all five pass inspection |
| Loops: Record, Document | kling3_0 pro 5s 1:1 from the stills | 17.5 | rendering |
| Balance after all of the above | | | 10 credits |
| Hero woman v2 frame (European, long hair) | nano_banana_pro 16:9 2k, v1 frame as style reference | 2 | done, approved (review/raw/woman-eu-v1.png) |
| Hero video v2 | kling3_0 std 5s 720p from the v2 frame | 7.5 | done, approved, now live in site/. v1 (Seedance) backed up in review/hero-v1-backup/. Balance: 0.5 |

## P5 History record (2026-08-29)
Bar: bar.md mechanisms 3, 4, 7 plus the addendum 10 to 14. Builder: the main session. Frames: tools/histshots.mjs at 1440x900 (seven points), 1280x720, 375x812, reduced motion. Blind pair for the craft and brief critics: A = the Alveos One wave, B = ours at 30 percent.

### Round 1 (2026-08-29, ~15:40)
- Brief FAIL (check 5): m-0_5 showed the outgoing 1980 card clipped and the incoming one a sliver. System PASS. Craft FAIL: M4 (six sizes on screen), M11 (decade pitch resets at every node), M13 (figure numeral outranks the card year; the 1980 panel), plus readout noise, fussy pen, phone breaks. Blind pair: A (Alveos) better: "A commits; B arranges".
- Builder r2: phones pin the card and slide the rule; the readout moves to the bottom left (172px), cards 300 to 340px start under the nav, the rule is placed between the tallest card and the year block; scale is one square-root-from-today curve (K from the tightest gap); readout line = label at a node, otherwise "N years after …"; pen 5px hidden within 14px of a node; future node years clay; figure panels are ledger lines between hairlines at the card-year size; captions 30px; body 15px; a second fallback step (.hscroll--tight) for very short windows.
- Harness: tools/histshots.mjs now waits for scrollY to stand still and the current card to reach opacity 1 before and after each shot (the first version measured mid-fade), and asserts label row / year block clearance.

### Round 2 (2026-08-29, ~16:20)
- Brief PASS on all six checks: no card touched the rule in any frame, the mechanic read, the blind pair read as different designs, nothing looked unfinished, the phone card was whole, reduced motion was sane.
- System FAIL on one check, and it does not survive measurement: the critic read the 38px section heading as bolder than the 18px card titles. Both compute to weight 500; the only 600 on screen is the nav wordmark outside the section. Not changed — matching it would desync this heading from every other section heading on the site.
- Craft FAIL: M4 (six sizes), M11 (2 years sits nearly as wide as 12, so the "honest spacing" claim overreached), M13 (mono used five ways), and the named gap: the reading point ran 220 to 380px ahead of the lit card, so a centred 1927 card sat under a giant 1943.
- Builder r3: the giant year now names the milestone the ink has reached and its label sits above it (year, card, dot and rule label always agree); the ink front became a thin cursor hidden within 24px of a dot; milestone years under the rule became serif italic so grid and event are distinguishable; figure panels took the same box as photographs so the band is one height. bar.md items 11 and 12 were rewritten to describe the scale truthfully (foreshortened toward today, the words carrying the spans) rather than claiming proportionality it cannot have with a card-width floor.

### Round 3 (2026-08-29, ~17:00)
- System: six of seven PASS. The one FAIL was the dot hierarchy — the rule was applied (12px passed, 18px current, measured in the browser) but 12 against 18 could not be read at 1x. Strengthened to 9px passed, 20px current, 11px hollow ahead, a ratio no one can miss. The round-2 heading-weight FAIL did not recur.
- Brief was not re-run: it passed in round 2 and nothing it judged regressed (the geometry assertions in tools/histshots.mjs still pass on every frame).
- Craft: the Fable run died on a credit limit mid-judgement and was relaunched on Opus; verdict in the session log. Round 3 is the agreed ceiling, so remaining craft objections are reported to the founder rather than chased.
- Craft (Opus, after the Fable run hit a credit limit): M3, M7, M10, M11, M12, M14 PASS — the line reads, the scale widens monotonically with no reset (measured 371px per 50 years at 1700 rising to 915px at 1950), the giant year agrees with the lit card and the dot, motion resolves one way. M4 FAIL was refuted by measurement: the gap captions, card years and figures are all exactly 30px, not three sizes; the section runs three serif sizes (172 display / 30 / 16), sans 18 and 15, mono 10 to 12. M13 FAIL was right and is fixed: the two laparoscopy photographs were the only saturated things in an ink-and-cream section and did not match the sepia plates, so every picture now shares one warm monochrome key (grayscale .88 plus a sepia that --age only makes browner). Also fixed from its notes: the phone stem pointed at bare rule 72px from its dot (removed in pin mode, where the card is a heads-up panel), and the display year at 1280x720 fell to 56px (now 76px).
- Left open, and reported to the founder rather than chased: the craft critic wants a person rather than a specimen in the recent cards, and the figure panels to say something their card does not. Both need licensed photography or a copy decision that is not mine to take. Loop stopped at the agreed three-round ceiling.
