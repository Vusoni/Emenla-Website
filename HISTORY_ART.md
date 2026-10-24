# History pictures: one table, three centuries

Six generated still lifes for the history timeline on the home page (`#history`), made on 2026-10-24. This file is not published; `site/` is.

## The idea

Every picture is the same worn oak table against the same plaster wall, in the same soft window light from the left, from the same camera. Only the objects change, and they follow the record from what was written about her to who finally listened. No people, no hands, no faces, no legible text, no logos. 2026 ("Enough.") and Today ("4 to 11") stay typographic on purpose: the past is objects, the present is a sentence.

They replaced a mismatched set: an archival endpaper (1690), two portraits of men (1860, 1927) and two laparoscopy photographs (2005, 2017) that had nothing to do with those events and were graphic for this audience.

On the page each picture is shown through `filter: grayscale(calc(0.25 + var(--age) * 0.75)) sepia(calc(var(--age) * 0.45))`, with `--age` from 0.9 (1690) to 0.1 (2017), so colour returns as the record nears today.

## How they were made

- **Route:** Codex CLI 0.164.0, signed in with the ChatGPT Plus account, using its built-in `image_gen.imagegen` tool. The underlying image model is not disclosed and is not inferred here. Each run was `codex exec --ephemeral -s read-only`, so Codex kept no session log; the masters stay in `~/.codex/generated_images/`.
- **1690 came first, with no reference image,** at `model_reasoning_effort="medium"`, and became the reference for the set. Its wrapper: "Use your image generation tool to create exactly one image, landscape orientation (wider than tall, 1536x1024 if you can choose). Do not write any files yourself and do not edit anything; just generate the image and reply with one line saying it is done. The image: <era prompt> <style block>"
- **Every later era attached the 1690 master with `-i`,** at `model_reasoning_effort="low"`, with this wrapper: "Use your image generation tool to create exactly one image, landscape orientation (wider than tall, 1536x1024). The attached image is a reference for the setting only: match its table, wall, window light from the left, camera height and colour, but do not copy its objects. Do not write any files and do not run shell commands; just generate the image and reply with one line saying it is done. The image: <era prompt> <style block>"
- **The style block,** appended to every prompt:

```text
Photographic still life, documentary realism, 50mm lens at f/4, soft north window daylight from the left, a plain warm off-white plaster wall behind, everything resting on the same worn oak tabletop, quiet and uncluttered with generous empty space, muted natural colour, fine film grain. No people, no hands, no faces. No legible text, letters or numbers anywhere: any writing is soft, out of focus, abstract marks. No logos or brand marks. Wide landscape framing (3:2, landscape); keep the main objects inside the middle third of the height so the picture survives a crop to 2:1.
```

- **Picking,** in this order: no legible text or logo at 200%; nothing anatomical or surgical; the same table and light direction as 1690; the objects read at 360 by 180.
- **Processing:** `python3 -E scripts/make-hist.py 1690=<master> 1860=<master> ... --out site/assets/img` cuts each master to 2:1 across its full width (`FOCUS_Y` 0.7 for every era, because the objects stand low on the table), then writes `hist-<era>-1080.avif`, `hist-<era>-720.avif` (quality 52, speed 4) and `hist-<era>-720.jpg` (q82, progressive, no metadata). New names every time: `/assets/*` is cached immutable for a year.
- **Disclosed** in the credits line under the timeline ("still lifes generated for Emenla with ChatGPT image generation. They show objects of each period, not historical originals.") and in the footer's Images note on the home and science pages.

## The six

### 1690, Described

Master: `~/.codex/generated_images/01a16e3e-246f-74c2-b9f4-80dcb4c5ed61/exec-2b276563-cb69-4f8d-a6d5-c5d6d78aa38c.png`, sha256 `82dd9d8247adf4138f47f0f4eb19a9c8ae6b1ed3d1b2111f21506f8635044be6`.

```text
On the oak tabletop, an open leather-bound book from the late seventeenth century, its pages covered in dense handwritten ink that is too soft and out of focus to read, a goose feather quill standing in a small pewter inkwell beside it, and the stub of an unlit beeswax candle in a simple brass holder.
```

### 1860, Seen

Master: `~/.codex/generated_images/01a16e40-a261-70a2-8d6a-f3de1b040987/exec-a94473e8-81ed-4b59-9432-df97433cdff8.png`, sha256 `3a6d970d3c21acc2ac2d93936f6aaddf3a2fc87f647684c0ddc3f609ec4d685b`.

```text
On the same oak tabletop, a brass Victorian compound microscope, with a single glass slide on its stage carrying a small pink and violet stained tissue section, a small open wooden box of glass slides beside it, and an unlit brass oil lamp.
```

### 1927, Named

Master: `~/.codex/generated_images/01a16e40-a26f-7e60-a226-0e693f0ca3ea/exec-faaf8d4d-23fc-416b-ab34-7ffa275bc80d.png`, sha256 `4bfae0552629707da0cb1b41d7a22b75b96f0f211c665c4231cabacd7db5cb5b`.

```text
On the same oak tabletop, a black 1920s manual typewriter with one sheet of paper rolled in, its typed lines soft and blurred beyond reading, a black fountain pen lying beside it, and a closed dark green cloth-bound journal with a blank spine. The typewriter carries no brand name.
```

### 1980, Organised

Master: `~/.codex/generated_images/01a16e40-a31c-7d82-ad0f-9001645aae2c/exec-1f6e3967-d7e4-4713-894f-49698f9ed593.png`, sha256 `61c5b234ec9dcda46cb05cfb3e5b6e355d9f7cf5cae3adb7a42e47c7325412b1`. The letters are "women's own accounts"; this picture replaced the typographic "1st".

```text
On the same oak tabletop, a loose stack of opened handwritten letters and their envelopes, in many different hands and paper colours, tied loosely with plain string, a spiral notebook, a cup of tea on a saucer, and a beige push-button telephone from around 1980. Every bit of handwriting is soft and impossible to read, and no envelope has a readable address or stamp.
```

### 2005, Guided

Master: `~/.codex/generated_images/01a16e40-a37f-71d3-82c2-a9069b7466b7/exec-6420a6eb-1a44-4d70-93cd-a3115a6eced9.png`, sha256 `8e276ee9938230c738a1ee6a32c2492e2461e12faff04c20c48c174f5a1b45a6`.

```text
On the same oak tabletop, a thick printed clinical guideline, spiral-bound, with a plain pale blue cover that has no readable title, a pair of folded reading glasses resting on it, a yellow highlighter, and a closed silver laptop from the mid-2000s with no logo, slightly behind.
```

### 2017, Heard (candidate b)

Master: `~/.codex/generated_images/01a16e42-9376-7e70-a342-cf78fb9c733b/exec-026dbe7e-70e8-4c1a-a898-e53442d4aff5.png`, sha256 `c3f8e7f601b75101dcc84b385f585b0ae9232187a8fb98e6fddd5ad2c6482c04`. Two cups across the table say "a conversation"; the stethoscope put aside says the clinician is listening rather than examining.

```text
On the same oak tabletop, two plain white ceramic cups of tea, one at each side of the table, as if two people are sitting across from each other in conversation, and between them an open notepad with a pen lying on it, its page holding only a few soft unreadable pencil lines. A stethoscope has been set aside, coiled loosely near the back edge of the table, not in use.
```

## Rejected

- **2017, candidate a** (`~/.codex/generated_images/01a16e40-a272-7263-9866-2fe2416d36d9/exec-fb96c48d-8c23-4d65-9679-61eed7b498e6.png`, sha256 `11ad480ddcd20c6da0dfb3097d13497bd26e0b5ff8a41a86e11c4dcffc89d0e4`): two armchairs facing each other in a consulting room. The step back into the room broke the series and the chairs read as doll furniture. Prompt: "The camera steps back in the same room, with the same plaster wall and the same window light from the left: two simple upholstered armchairs in a quiet consulting room, turned towards each other at the same height, close enough for a conversation, and a small oak side table between them with a glass of water and a closed notepad with a pen. Nobody is in the room."
- **2017, candidate c** (`~/.codex/generated_images/01a16e42-9a57-7853-82b4-3c23ea11a86c/exec-c6152820-e3b6-4699-a2b8-2efde96bb9aa.png`, sha256 `0a10472e5d34fc0bee21499fdf2acac39102e677c748188bab530bc6df0df170`): candidate b's prompt without the stethoscope. Without it nothing says clinician, so "Heard" could be any tea.

## Changing one

Generate with the later-era wrapper and the 1690 master attached, run `make-hist.py` for that era only, and give the files a new name (or a new era key) so the year-long cache does not serve the old picture. Update the alt text in `site/index.html` to say what is in the new picture, objects only, and add the master and its hash here.
