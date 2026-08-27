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
