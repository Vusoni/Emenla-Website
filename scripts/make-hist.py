#!/usr/bin/env python3
"""Cut the history's sourced originals into the files emenla.com serves.

    python3 -E scripts/make-hist.py 1690=<original.jpg>@left,top,width,height 1860=... --out site/assets/img

Each original is a scan or a photograph from a public collection; HISTORY_SOURCES.md records its source page, its
licence, the download URL, the file's sha256 and the crop box used here. The card frames a picture at 2:1, so the
box is a 2:1 window in source pixels (within 2%, and it must lie inside the image). Written per era:
hist-<era>-src-720.avif, hist-<era>-src-1080.avif and a progressive hist-<era>-src-720.jpg, with no metadata.
The "-src-" names are on purpose: /assets/* is cached immutable for a year, so a reused name would show returning
visitors the old picture. Run it with -E, never -I: Pillow lives in the user site-packages.
"""
import argparse, hashlib, os, sys
from PIL import Image

ERAS = ('1690', '1860', '1927', '2014')
WIDTHS = (720, 1080)
JPEG_QUALITY = 82
BUDGET = 70 * 1024  # per 1080 AVIF


def cut(path, box):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    left, top, cw, ch = box
    if abs(cw / ch - 2) > 0.02:
        sys.exit(f'{path}: box {cw}x{ch} is not 2:1')
    if left < 0 or top < 0 or left + cw > w or top + ch > h:
        sys.exit(f'{path}: box {box} leaves the {w}x{h} image')
    return im.crop((left, top, left + cw, top + ch))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pairs', nargs='+', help='era=original.jpg@left,top,width,height')
    ap.add_argument('--out', required=True)
    ap.add_argument('--avif-quality', type=int, default=52, help='52 for a scan; a photograph near the budget takes 48')
    a = ap.parse_args()
    over = False
    for pair in a.pairs:
        era, rest = pair.split('=', 1)
        if era not in ERAS:
            sys.exit(f'unknown era {era}; add it to ERAS')
        if '@' not in rest:
            sys.exit(f'{era}: give the crop box as path@left,top,width,height')
        path, box = rest.rsplit('@', 1)
        box = tuple(int(v) for v in box.split(','))
        sha = hashlib.sha256(open(path, 'rb').read()).hexdigest()
        src = cut(path, box)
        for wd in WIDTHS:
            out = os.path.join(a.out, f'hist-{era}-src-{wd}.avif')
            src.resize((wd, wd // 2), Image.LANCZOS).save(out, 'AVIF', quality=a.avif_quality, speed=4)
            kb = os.path.getsize(out)
            flag = ''
            if wd == 1080 and kb > BUDGET:
                flag, over = '  OVER BUDGET', True
            print(f'{out}  {kb / 1024:.1f} KB{flag}')
        out = os.path.join(a.out, f'hist-{era}-src-720.jpg')
        src.resize((720, 360), Image.LANCZOS).save(out, 'JPEG', quality=JPEG_QUALITY, progressive=True, optimize=True)
        print(f'{out}  {os.path.getsize(out) / 1024:.1f} KB')
        print(f'  original {path}\n  sha256 {sha}\n  box {box[0]},{box[1]},{box[2]},{box[3]}')
    sys.exit(1 if over else 0)


if __name__ == '__main__':
    main()
