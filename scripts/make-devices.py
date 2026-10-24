#!/usr/bin/env python3
"""Composite the app's screens into Apple's product bezels, for the devices on emenla.com.

    python3 -E scripts/make-devices.py --bezels <dir> --screens <dir> --mark site/assets/img/launch-mark.webp --out site/assets/img

`--bezels` holds the three flat PNGs copied out of Apple Design Resources (Bezel-iPhone-18.dmg and
Bezel-iPhone-Duo.dmg; see PLACEHOLDERS.md for the files, the URLs and the checksums). They are not committed.
`--screens` holds one PNG per screen, cut from the app (any size; it is scaled to cover the screen and anchored
at the top). The Duo screens take the app's launch screen instead: white, with the mark at 120 pt, which is what
iOS shows on any iPhone for a second (app.json, expo-splash-screen).

What it writes, per composite: WebP at each width in SIZES and a PNG fallback at the smallest, both with the
frame's transparent surround kept (the page's shadow follows the silhouette); plus devices.json with each
frame's geometry, each source's checksum and every output's size. Run it with -E, never -I: Pillow lives in the
user site-packages. The Apple files are only ever read as pixels.

The bezel is laid over the screen, never edited: the screen is pasted into the frame's transparent cutout
(found by flooding from its centre) and masked to that cutout grown by four pixels, so it runs under Apple's
anti-aliased inner edge and never past the rounded outer corner; then Apple's pixels composite over it, so the
island, the rounded corners and the anti-aliased edge are Apple's. Resizing goes through premultiplied alpha so no dark fringe appears.
"""
import argparse, hashlib, json, os, sys
from PIL import Image, ImageFilter

PHYSICAL = {  # from apple.com/iphone-18-pro/specs and the iPhone Duo announcement, 24 October 2026
    '18pro': dict(file='18pro-silver-portrait.png', height_mm=150.0, native=(1206, 2622),
                  label='iPhone 18 Pro, Silver, portrait'),
    'duo-closed': dict(file='duo-star-white-outer-closed-portrait.png', height_mm=117.8, native=(1398, 2034),
                       label='iPhone Duo, Star White, outer display, closed, portrait'),
    'duo-open': dict(file='duo-star-white-inner-open-landscape.png', height_mm=117.8, native=(2670, 1878),
                     label='iPhone Duo, Star White, inner display, open, landscape'),
}
SIZES = {'18pro': (480, 720, 1080), 'duo-closed': (400, 600, 800), 'duo-open': (640, 1000, 1540)}
COMPOSITES = [  # (device, name, screen file or None for the launch screen)
    ('18pro', 'bodymap', 'screen-bodymap.png'),
    ('18pro', 'detail', 'screen-detail.png'),
    ('18pro', 'overview', 'screen-overview.png'),
    ('18pro', 'assistant', 'screen-assistant.png'),
    ('18pro', 'questions', 'screen-questions.png'),
    ('18pro', 'reach', 'screen-reach.png'),
    ('duo-closed', 'launch', None),
    ('duo-open', 'launch', None),
]
LAUNCH_MARK_PT, SCALE = 120, 3   # app.json: expo-splash-screen imageWidth 120; both displays are @3x
WEBP_QUALITY = 84


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def measure(frame):
    """The screen cutout of a trimmed bezel: the transparent region reached by flooding from the centre.
    Returns its geometry and the cutout as a mask, grown by four pixels for the bleed under the inner edge."""
    fw, fh = frame.size
    px = frame.getchannel('A').load()
    cx, cy = fw // 2, fh // 2
    while px[cx, cy] != 0:  # a hinge or a camera in the middle: walk left to the glass
        cx -= 1
        if cx < 0:
            sys.exit('no transparent pixel on the centre row')
    seen = bytearray(fw * fh)
    stack = [(cx, cy)]
    seen[cy * fw + cx] = 1
    minx = maxx = cx
    miny = maxy = cy
    while stack:
        x, y = stack.pop()
        if x < minx: minx = x
        if x > maxx: maxx = x
        if y < miny: miny = y
        if y > maxy: maxy = y
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < fw and 0 <= ny < fh and not seen[ny * fw + nx] and px[nx, ny] == 0:
                seen[ny * fw + nx] = 1
                stack.append((nx, ny))
    sx, sy, sw, sh = minx, miny, maxx - minx + 1, maxy - miny + 1
    mask = Image.frombytes('L', (fw, fh), bytes(seen)).point(lambda v: 255 if v else 0).filter(ImageFilter.MaxFilter(9))
    # opaque pixels inside the cutout's box, away from its four corners: the Dynamic Island, if it is painted in
    inside = frame.getchannel('A').crop((sx, sy, sx + sw, sy + sh)).point(lambda v: 255 if v >= 128 else 0)
    c = int(min(sw, sh) * 0.25)
    for box in ((0, 0, c, c), (sw - c, 0, sw, c), (0, sh - c, c, sh), (sw - c, sh - c, sw, sh)):
        inside.paste(0, box)
    island = inside.getbbox()
    return dict(fw=fw, fh=fh, sx=sx, sy=sy, sw=sw, sh=sh,
                island=[island[0], island[1], island[2] - island[0], island[3] - island[1]] if island else None), mask


def cover(img, sw, sh):
    """Scale to cover sw x sh, centred sideways, anchored at the top."""
    img = img.convert('RGB')
    k = max(sw / img.width, sh / img.height)
    w, h = max(sw, round(img.width * k)), max(sh, round(img.height * k))
    img = img.resize((w, h), Image.LANCZOS)
    x = (w - sw) // 2
    return img.crop((x, 0, x + sw, sh))


def launch(mark, sw, sh, native_w):
    """The app's launch screen: white, the mark 120 pt wide, centred on the display."""
    screen = Image.new('RGBA', (sw, sh), (255, 255, 255, 255))
    mw = round(LAUNCH_MARK_PT * SCALE * sw / native_w)
    m = mark.convert('RGBA')
    m = m.resize((mw, round(m.height * mw / m.width)), Image.LANCZOS)
    screen.alpha_composite(m, ((sw - mw) // 2, (sh - m.height) // 2))
    return screen.convert('RGB'), mw


def resized(im, w):
    h = round(im.height * w / im.width)
    return im.convert('RGBa').resize((w, h), Image.LANCZOS).convert('RGBA')


def save_webp(im, path):
    try:
        im.save(path, 'WEBP', quality=WEBP_QUALITY, method=6, alpha_quality=100)
    except TypeError:
        im.save(path, 'WEBP', quality=WEBP_QUALITY, method=6)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bezels', required=True)
    ap.add_argument('--screens', required=True)
    ap.add_argument('--mark', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--only', default='', help='comma-separated composite names to rebuild')
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    only = set(filter(None, a.only.split(',')))
    mark = Image.open(a.mark)
    frames, report = {}, dict(devices={}, composites=[])
    masks = {}
    for key, spec in PHYSICAL.items():
        path = os.path.join(a.bezels, spec['file'])
        im = Image.open(path).convert('RGBA')
        bb = im.getchannel('A').getbbox()
        frame = im.crop(bb)
        g, masks[key] = measure(frame)
        nw, nh = spec['native']
        if abs((g['sw'] / g['sh']) / (nw / nh) - 1) > 0.003:
            sys.exit(f"{key}: cutout {g['sw']}x{g['sh']} is not the display's aspect {nw}x{nh}")
        px_per_mm = g['fh'] / spec['height_mm']
        g.update(label=spec['label'], source=spec['file'], source_sha256=sha256(path), canvas=list(im.size),
                 trim=list(bb), native=[nw, nh], px_per_mm=round(px_per_mm, 3),
                 width_mm=round(g['fw'] / px_per_mm, 1), height_mm=spec['height_mm'], sizes=list(SIZES[key]))
        frames[key] = frame
        report['devices'][key] = g
        print(f"{key}: frame {g['fw']}x{g['fh']} (canvas {im.size[0]}x{im.size[1]}, trimmed {bb}), "
              f"screen {g['sw']}x{g['sh']} at {g['sx']},{g['sy']}, island {g['island']}, "
              f"{g['width_mm']} x {g['height_mm']} mm at {g['px_per_mm']} px/mm")
    for key, name, screen_file in COMPOSITES:
        if only and name not in only and f'{key}-{name}' not in only:
            continue
        g, frame = report['devices'][key], frames[key]
        if screen_file:
            src = os.path.join(a.screens, screen_file)
            screen = cover(Image.open(src), g['sw'], g['sh'])
            src_sha, mark_px = sha256(src), None
        else:
            src, src_sha = a.mark, sha256(a.mark)
            screen, mark_px = launch(mark, g['sw'], g['sh'], g['native'][0])
        canvas = Image.new('RGBA', (g['fw'], g['fh']), (0, 0, 0, 0))
        canvas.paste(screen, (g['sx'], g['sy']))
        canvas.putalpha(masks[key])  # only inside the cutout and its four-pixel bleed: nothing past the rounded corner
        comp = Image.alpha_composite(canvas, frame)
        outputs = []
        for i, w in enumerate(SIZES[key]):
            small = resized(comp, w)
            p = os.path.join(a.out, f'device-{key}-{name}-{w}.webp')
            save_webp(small, p)
            outputs.append(dict(file=os.path.basename(p), width=w, height=small.height, bytes=os.path.getsize(p)))
            if i == 0:
                p = os.path.join(a.out, f'device-{key}-{name}-{w}.png')
                small.save(p, 'PNG', optimize=True)
                outputs.append(dict(file=os.path.basename(p), width=w, height=small.height, bytes=os.path.getsize(p)))
        report['composites'].append(dict(device=key, name=name, screen=os.path.basename(src), screen_sha256=src_sha,
                                         mark_px=mark_px, outputs=outputs))
        print(f"  {key} {name}: " + ', '.join(f"{o['file']} {o['bytes'] // 1024} KB" for o in outputs))
    with open(os.path.join(a.out, 'devices.json'), 'w') as f:
        json.dump(report, f, indent=1)
        f.write('\n')
    print('\nCSS, one millimetre being var(--mm):')
    for key, g in report['devices'].items():
        print(f"  .device--{key} {{ width: calc(var(--mm) * {g['width_mm']}); }}   /* {g['fw']} x {g['fh']} px */")


if __name__ == '__main__':
    main()
