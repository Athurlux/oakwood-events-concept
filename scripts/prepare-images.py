"""Derive the website's images from the untouched asset pack in assets-src/pack.

Run with `npm run images` (Python 3 + Pillow). Outputs are committed, so the build never
depends on Python. Nothing is upscaled beyond its source width. WebP quality is 78 for
photographs (82 for the transparent floral layer, whose soft edges band at lower settings).

Writes public/images/<name>-<width>.webp, public/social/oakwood-concept-1200x630.jpg and
src/data/image-manifest.json, which the <Img> component reads for srcset widths and sizes.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image

root = Path(__file__).resolve().parents[1]
pack = root / 'assets-src' / 'pack'
images = root / 'public' / 'images'
social = root / 'public' / 'social'
for folder in (images, social):
    folder.mkdir(parents=True, exist_ok=True)

# The pack's manifest records each original's hash; refuse to derive from altered files.
for entry in json.loads((pack / 'manifest.json').read_text()):
    digest = hashlib.sha256((pack / entry['file']).read_bytes()).hexdigest()
    if digest != entry['sha256']:
        raise SystemExit(f"{entry['file']} does not match the pack manifest")

manifest = {}


def derive(source, name, widths, box=None, quality=78, focal='50% 50%'):
    with Image.open(pack / 'images' / source) as original:
        image = original.convert('RGBA' if original.mode == 'RGBA' else 'RGB')
        if box:
            image = image.crop(box)
        made = []
        for width in sorted(set(min(w, image.width) for w in widths)):
            height = round(image.height * width / image.width)
            image.resize((width, height), Image.Resampling.LANCZOS).save(
                images / f'{name}-{width}.webp', 'WEBP', quality=quality, method=6)
            made.append(width)
        manifest[name] = {'source': source, 'crop': list(box) if box else None, 'width': image.width,
                          'height': image.height, 'widths': made, 'focal': focal}
        print(f'{name}: {image.width}x{image.height} -> {made}')


# Heroes: the wide frame keeps its shaded left side for the headline; the portrait frame
# is used whole and positioned so the arch stays in view under the text.
derive('01-hero-desktop.png', 'hero-desktop', [960, 1280, 1672], focal='62% 50%')
derive('02-hero-mobile.png', 'hero-mobile', [480, 768, 1024], focal='55% 40%')

# The four event scenes, used whole.
derive('03-wedding-reception.png', 'wedding', [640, 1024, 1536], focal='40% 55%')
derive('04-traditional-celebration.png', 'traditional', [640, 1024, 1536], focal='50% 55%')
derive('05-corporate-dinner.png', 'corporate', [640, 1024, 1536], focal='35% 60%')
derive('06-private-celebration.png', 'private', [640, 1024, 1536], focal='45% 55%')

# Detail crops of those same scenes. They are labelled on the site as crops of the same
# concept image, never as additional photographs.
derive('03-wedding-reception.png', 'wedding-detail', [480, 800], box=(300, 230, 900, 980))
derive('04-traditional-celebration.png', 'traditional-detail', [480, 800], box=(60, 300, 700, 1024))
derive('05-corporate-dinner.png', 'corporate-detail', [480, 800], box=(0, 432, 792, 1024))
derive('06-private-celebration.png', 'private-detail', [480, 576], box=(0, 0, 576, 1024))

# Floral close-up for editorial moments, and the transparent corner (checked on ivory and
# olive at 100%: no visible fringing, so it is kept as a quiet decoration).
derive('07-floral-detail.png', 'floral', [480, 800, 1122], focal='55% 45%')
derive('08-floral-corner-transparent.png', 'floral-corner', [360, 720], quality=82)

# Link preview: the wide hero, cropped to 1.91:1 around the arch and tables.
with Image.open(pack / 'images' / '01-hero-desktop.png') as hero:
    w, h = hero.size
    crop_h = round(w / 1.905)
    top = (h - crop_h) // 2
    hero.convert('RGB').crop((0, top, w, top + crop_h)).resize((1200, 630), Image.Resampling.LANCZOS).save(
        social / 'oakwood-concept-1200x630.jpg', 'JPEG', quality=82, optimize=True, progressive=True)
print('social preview written')

(root / 'src' / 'data' / 'image-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('manifest written')
