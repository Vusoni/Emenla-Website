#!/usr/bin/env python3
"""Cut the history's generated still lifes into the files emenla.com serves.

    python3 -E scripts/make-hist.py 1690=<master.png> 1860=<master.png> ... --out site/assets/img

Each master is a 1536x1024 PNG from ChatGPT image generation (HISTORY_ART.md records the prompt, the master's
path and its sha256). The card frames a picture at 2:1, so each master is cut to 2:1 across its full width; how
far down the cut sits is FOCUS_Y per era (0 is the top, 1 the bottom), because the objects stand on the table in
the lower part of the frame. Written per era: hist-<era>-720.avif, hist-<era>-1080.avif and a progressive
hist-<era>-720.jpg, with no metadata. New names on purpose: /assets/* is cached immutable for a year, so a
reused name would show returning visitors the old picture. Run it with -E, never -I: Pillow lives in the user
site-packages.
"""
import argparse, hashlib, os, sys
from PIL import Image

FOCUS_Y = {'1690': 0.7, '1860': 0.7, '1927': 0.7, '1980': 0.7, '2005': 0.7, '2017': 0.7}
WIDTHS = (720, 1080)
AVIF_QUALITY = 52
JPEG_QUALITY = 82
BUDGET = 70 * 1024  # per 1080 AVIF


def cut(path, fy):
    im = Image.open(path).convert('RGB')
    w, h = im.size
    ch = w // 2
    if ch > h:
        sys.exit(f'{path}: {w}x{h} is too short for a 2:1 cut')
    top = round((h - ch) * fy)
    return im.crop((0, top, w, top + ch))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('pairs', nargs='+', help='era=master.png')
    ap.add_argument('--out', required=True)
    a = ap.parse_args()
    over = False
    for pair in a.pairs:
        era, path = pair.split('=', 1)
        if era not in FOCUS_Y:
            sys.exit(f'unknown era {era}; add it to FOCUS_Y')
        sha = hashlib.sha256(open(path, 'rb').read()).hexdigest()
        src = cut(path, FOCUS_Y[era])
        for wd in WIDTHS:
            out = os.path.join(a.out, f'hist-{era}-{wd}.avif')
            src.resize((wd, wd // 2), Image.LANCZOS).save(out, 'AVIF', quality=AVIF_QUALITY, speed=4)
            kb = os.path.getsize(out)
            flag = ''
            if wd == 1080 and kb > BUDGET:
                flag, over = '  OVER BUDGET', True
            print(f'{out}  {kb / 1024:.1f} KB{flag}')
        out = os.path.join(a.out, f'hist-{era}-720.jpg')
        src.resize((720, 360), Image.LANCZOS).save(out, 'JPEG', quality=JPEG_QUALITY, progressive=True, optimize=True)
        print(f'{out}  {os.path.getsize(out) / 1024:.1f} KB')
        print(f'  master {path}\n  sha256 {sha}')
    sys.exit(1 if over else 0)


if __name__ == '__main__':
    main()
