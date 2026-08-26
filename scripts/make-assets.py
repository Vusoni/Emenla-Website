"""Generates favicon.svg, apple-touch-icon.png and og.png into public/.
Placeholder marks: a violet rounded square with a lowercase e drawn as a
geometric stroke. Not a logo. See PLACEHOLDERS.md."""
from PIL import Image, ImageDraw, ImageFont
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, 'public')
FONT = os.path.join(ROOT, 'fonts-src', 'Manrope.ttf')
VIOLET = (91, 72, 214)
INK = (0, 0, 0)
SLATE = (107, 107, 107)
WHITE = (255, 255, 255)

# favicon.svg: geometric e, no text so it needs no font.
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="18" fill="#5b48d6"/>
  <path d="M20 32h24a12 12 0 1 0-3.5 8.5" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
</svg>
'''
open(os.path.join(PUB, 'favicon.svg'), 'w').write(svg)

# apple-touch-icon.png (180x180), same mark rendered as raster.
im = Image.new('RGB', (180, 180), VIOLET)
d = ImageDraw.Draw(im)
# ring
d.ellipse((56, 56, 124, 124), outline=WHITE, width=14)
# cut the lower-right of the ring and add the bar, approximating the e
d.pieslice((56, 56, 124, 124), 20, 60, fill=VIOLET)
d.line((56, 90, 124, 90), fill=WHITE, width=14)
im.save(os.path.join(PUB, 'apple-touch-icon.png'))

# og.png 1200x630: the hero sentence in violet, wordmark, one line.
W, H = 1200, 630
im = Image.new('RGB', (W, H), WHITE)
d = ImageDraw.Draw(im)

def font(size, weight=400):
    f = ImageFont.truetype(FONT, size)
    try:
        f.set_variation_by_axes([weight])
    except Exception:
        pass
    return f

d.text((80, 72), 'Emenla', font=font(30, 500), fill=INK)
d.text((80, 200), "You're not", font=font(112, 400), fill=VIOLET)
d.text((80, 320), 'imagining it.', font=font(112, 400), fill=VIOLET)
d.text((80, 500), 'A record of your symptoms, in your own words,', font=font(30, 400), fill=SLATE)
d.text((80, 540), 'kept on your phone. For people with endometriosis.', font=font(30, 400), fill=SLATE)
im.save(os.path.join(PUB, 'og.png'), optimize=True)
print('assets written: favicon.svg, apple-touch-icon.png, og.png')
