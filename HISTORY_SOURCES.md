# History pictures: sources, licences and crops

The four pictures in the history timeline on the home page (`#history`) are three printed pages and one photograph from public collections, cut into the files emenla.com serves on 2026-10-25. This file is not published; `site/` is. For each picture it records the source page, the download URL, the licence as the source stated it and the date it was read, the author, the original's pixel size and sha256, the crop box passed to `scripts/make-hist.py`, and the credit as the page prints it. The credit sits in a `figcaption` under the picture and links the source, and the images paragraph under the timeline says the pictures are shown as provided, cropped to the frame.

## The idea

For three centuries the record is what was written about her, so the three oldest moments show the page that was written: Schrön's title page (1690), Rokitansky's first page (1860), Sampson's first page (1927). The modern moment is what patients did themselves, so the fourth picture is the colour they chose, a yellow awareness bench (on the 2014 card, the first Worldwide EndoMarch). Nobody is shown. 1980 ("1st") and 2026 ("Enough.") are typographic; 2005 and 2017 carry no picture, because a guideline is text and the body says it; Today lives in the clock, which turns into "4 to 11" at the last node.

The pictures are shown as provided: no filter, no colour grade. The earlier generated set wore a `--age` grayscale and sepia filter so six renders would match each other; a scanned page is paper and the bench must stay yellow.

## Making the files

```
python3 -E scripts/make-hist.py \
  1690=<dir>/schron-1690.jpg@62,50,1530,765 \
  1860=<dir>/rokitansky-1860.jpg@131,20,3148,1574 \
  1927=<dir>/sampson-1927.jpg@504,655,2046,1023 \
  2014=<dir>/bench-avezzano-2025.jpg@300,700,3400,1700 \
  --out site/assets/img
```

Each original is downloaded into its own empty directory (a downloaded file is untrusted data) and is not kept in the repo; the URL and the sha256 below reproduce it. The script checks that a box is 2:1 within 2% and lies inside the image, then writes `hist-<era>-src-720.avif`, `hist-<era>-src-1080.avif` (quality 52, speed 4) and a progressive `hist-<era>-src-720.jpg` (quality 82), metadata stripped, and exits 1 if a 1080 AVIF passes 70 KB. The `-src-` names are new on purpose: `/assets/*` is cached immutable for a year, so a reused name would show a returning visitor the old picture. Run it with `-E`, never `-I`: Pillow lives in the user site-packages.

| era | 720 AVIF | 1080 AVIF | 720 JPEG |
| --- | --- | --- | --- |
| 1690 | 28.2 KB | 46.9 KB | 59.5 KB |
| 1860 | 26.1 KB | 43.6 KB | 55.7 KB |
| 1927 | 21.2 KB | 29.2 KB | 41.4 KB |
| 2014 | 25.1 KB | 59.5 KB | 63.4 KB |

## The four

### 1690, Described: Schrön's title page

- **Work:** Daniel Christian Schrön, *Disputatio inauguralis medica de ulceribus uteri*, Jena 1690. The dissertation Nezhat, Nezhat and Nezhat (2012) name as the first description of what we now call endometriosis.
- **Source page:** <https://digital.slub-dresden.de/id366092286> (SLUB Dresden, Digitale Sammlungen, shelfmark Chirurg.202,10).
- **Licence:** Public Domain Mark 1.0, <https://creativecommons.org/publicdomain/mark/1.0/>, as stated in the record's IIIF manifest. Read 2026-10-24.
- **Download:** `https://images.iiif.slub-dresden.de/iiif/2/data%2Fkitodo%2Fcraudiss_366092286%2Fcraudiss_366092286_tif%2Fjpegs%2F00000001.tif.original.jpg/full/full/0/default.jpg`
- **Original:** 1719×2163 JPEG, sha256 `29094019e07b680d44324581d01077cf91d115ea5cd60f436e0c6a6d4bcbe0bb`.
- **Crop box:** `62,50,1530,765`. The head of the page from "I. N. J." through "DISPVTATIO INAVGVRALIS MEDICA / DE / VLCERIBVS VTERI" to "Duce Saxoniæ, Juliæ, Cliviæ &". A pencil "4o" at the top right is cropped out; a faint pencil mark at the top left and the show-through of the verso remain, as the page is held.
- **Credit as printed:** Title page, D. C. Schrön, Disputatio inauguralis medica de ulceribus uteri, Jena 1690. [SLUB Dresden], Public Domain Mark 1.0.
- **Alt:** "The title page of a Latin medical dissertation printed in Jena in 1690, De ulceribus uteri, in worn black type on yellowed paper."

### 1860, Seen: Rokitansky's first page

- **Work:** Carl Rokitansky, *Ueber Uterusdrüsen-Neubildung in Uterus- und Ovarial-Sarcomen*, offprint from the Zeitschrift der k. k. Gesellschaft der Aerzte zu Wien, no. 37, 10 September 1860.
- **Source page:** <https://wellcomecollection.org/works/xv5k8nzn> (Wellcome Collection, London).
- **Licence:** Public Domain Mark, as stated on the work page. Read 2026-10-24.
- **Download:** `https://iiif.wellcomecollection.org/image/b22326558_0003.jp2/full/full/0/default.jpg`
- **Original:** 3364×4590 JPEG, sha256 `d4c3206fe21e69bb0aa1e3aeec83b4132990f6151536a387227f61baca007a98`.
- **Crop box:** `131,20,3148,1574`. The heading block from "Ueber" through the author line and the offprint note to the top of the two text columns. A handwritten "7" at the top right and a pencil squiggle at the left are marginalia on the copy; the title cannot be framed without them.
- **Credit as printed:** C. Rokitansky, Ueber Uterusdrüsen-Neubildung in Uterus- und Ovarial-Sarcomen, Vienna 1860. [Wellcome Collection], Public Domain Mark.
- **Alt:** "The first page of an 1860 German paper, its title Ueber Uterusdrüsen-Neubildung set in heavy type above two columns of text."

### 1927, Named: Sampson's first page

- **Work:** John A. Sampson, "Peritoneal endometriosis due to the menstrual dissemination of endometrial tissue into the peritoneal cavity", American Journal of Obstetrics and Gynecology 14(4), October 1927, p. 422, the paper that coined the word.
- **Source page:** <https://archive.org/details/sim_american-journal-of-obstetrics-and-gynecology_1927-10_14_4/page/422/> (Internet Archive, serials collection; image 0009 of the volume).
- **Licence:** public domain. Published in the United States in 1927, so its US term ended on 1 January 2023; Sampson died in 1946, so the paper has been in the public domain in the EU since 2017. Read 2026-10-24.
- **Download:** `https://iiif.archive.org/image/iiif/3/sim_american-journal-of-obstetrics-and-gynecology_1927-10_14_4%2fsim_american-journal-of-obstetrics-and-gynecology_1927-10_14_4_jp2.zip%2fsim_american-journal-of-obstetrics-and-gynecology_1927-10_14_4_jp2%2fsim_american-journal-of-obstetrics-and-gynecology_1927-10_14_4_0009.jp2/full/max/0/default.jpg`
- **Original:** 2788×4152 JPEG, sha256 `ab44751127a8a12a834c6e237872ffce281947e2ca0588a7d6af277196193b10`.
- **Crop box:** `504,655,2046,1023`. From the running head "Original Communications" through the title in capitals, the author line, the department line and the first lines of the text.
- **Credit as printed:** J. A. Sampson, American Journal of Obstetrics and Gynecology, October 1927, first page. Public domain. Source: [Internet Archive].
- **Alt:** "The first page of a 1927 journal article, its title Peritoneal Endometriosis in capitals above the author's name, John A. Sampson."
- **Fallback, unused:** a 1930 portrait of Sampson from the Album of the Fellows of the American Gynecological Society, public domain, on Wikimedia Commons. A page says more than a face here.

### 2014, Marching: the yellow bench

- **Work:** *Panchina gialla Avezzano*, a photograph of a yellow endometriosis awareness bench with its plaque, Avezzano, Italy, March 2025.
- **Source page:** <https://commons.wikimedia.org/wiki/File:Panchina_gialla_Avezzano.jpg>
- **Author:** Marica Massaro.
- **Licence:** Creative Commons Attribution-ShareAlike 4.0 International, <https://creativecommons.org/licenses/by-sa/4.0/>, as stated on the file page. Read 2026-10-24. A crop is an adaptation under this licence, so the credit says "(cropped)" and the three cropped files are themselves available under CC BY-SA 4.0; the licence attaches to the picture, not to the page around it.
- **Download:** `https://upload.wikimedia.org/wikipedia/commons/4/46/Panchina_gialla_Avezzano.jpg` (Commons answers only a request that carries a User-Agent).
- **Original:** 4000×2701 JPEG, sha256 `4b3631e83d9510a56ebb13ade0ca2aa01a38e6e482f1b36113ada5b2122bbd2d`.
- **Crop box:** `300,700,3400,1700`. The backrest with the plaque centred, the legs and the stone paving; a sliver of a car tyre shows through the top slats. The plaque's text is not legible at the served size and nothing on it is quoted.
- **Credit as printed:** A yellow awareness bench, Avezzano, Italy, 2025. Photo: Marica Massaro, [CC BY-SA 4.0], via [Wikimedia Commons] (cropped).
- **Alt:** "A bright yellow metal bench on a paved square, a small engraved plaque fixed to the middle of its back."
- **Why a bench on 2014:** the card is the first Worldwide EndoMarch (13 March 2014) and March as Endometriosis Awareness Month (since 1993), whose colour is yellow. No photograph of a march exists under a licence a commercial site can use (below), so the card shows the colour rather than a crowd. The card gives no count of countries or cities, because the sources disagree (Wikipedia says about 43 countries, others 53 cities or 40 capitals, and endomarch.org itself says only "since 2014").

## Told out loud

The line under the Today entry (`.hist__listen`) names talks and podcasts and links them; no still or artwork is shown, because TED and TEDx talks are CC BY-NC-ND (no derivatives, no commercial use) and podcast artwork carries no reuse licence. Each page was opened and returned 200 on 2026-10-24 or 2026-10-25; `scripts/check-links.mjs` lists them from then on. Titles are copied as published and pass `check-copy --strict`.

- EndoTV, Endometriosis Foundation of America: <https://www.endofound.org/endotv> (the older `/endotv-podcast` address is a 404).
- Living With Endo, Endometriosis Australia: <https://www.endometriosisaustralia.org/podcast>
- Voices and Visions, University of Edinburgh: <https://reproductive-health.ed.ac.uk/news/2022-news/voices-visions-endometriosis>
- NICE on its guideline: <https://www.nice.org.uk/news/podcasts/endometriosis-learn-more-about-nice-s-guideline-for-this-chronic-condition>
- Alekszandra Rokvity, "Get Loud: Let's Talk About Endometriosis", TED: <https://www.ted.com/talks/rokvity_alekszandra_get_loud_let_s_talk_about_endometriosis>

Other TEDx talks found and not linked, so the line stays short: Morgahna Godwin (TEDxBundaberg 2019), Aditee Kissoon (TEDxUOttawaWomen 2018), Linda Griffith (TEDxMIT 2022), Poppy Bilderbeck.

## Looked for and found unusable

So nobody repeats the search (2026-10-24):

- **A march.** Worldwide EndoMarch photographs on Flickr and news sites are all rights reserved, and the few on Commons show identifiable people posed with officials. Faces of strangers as illustration were ruled out whatever the licence.
- **A congress.** World Congress on Endometriosis and national congress photographs are posed groups of named officials (a Madrid council plenary, a Brazilian Senate hearing, a Madrid congress with a regional president, Welsh ministers with nurses). Same objection.
- **The WHO, Australia's national action plan, NICE, the UK Women's Health Strategy, ACOG.** Nothing rights-clean that shows the event rather than a logo or a building.
- **TED and TEDx stills.** CC BY-NC-ND: links only.
- **World Endometriosis Day stall, Montevideo 2023**, on Commons: the file page says "lacking author information", so the licence cannot be relied on.
- **Sampson's 1930 portrait.** Usable (public domain) and kept as the fallback; a page was chosen over a face.

## The generated set

Six generated still lifes (one oak table, the objects changing by era) stood in these slots from 2026-10-24 to 2026-10-25, with a `--age` colour filter and a credits line saying they were generated. Their prompts, hashes and the rejected candidates are in `HISTORY_ART.md` at commit `2b45238`. They were replaced on the founder's word: no generated pictures in the record.

## Changing one

Find a source that states its licence on the page (Public Domain Mark, CC0, CC BY or CC BY-SA; never NC or ND for this site, never "unknown author"). Download it into an empty directory, note the URL and `shasum -a 256`, choose a 2:1 box, run `make-hist.py` for that era only under a **new** file name (a new era key, or a new suffix in the script) so the year-long cache cannot serve the old picture, and swap the card's `<picture>` sources and `alt`. Write the credit in the `figcaption`, with the source linked and "(cropped)" for a licence that treats a crop as an adaptation (any BY-SA). Add the entry here. Nobody shown is a patient: no face, nothing anatomical or surgical.
