"""Build the concept wordmark and favicon as outlined SVG (no font needed to display them).

Run once with `py -P scripts/make-brand.py` (needs fonttools + brotli). Outputs are committed.
These are proposal assets for the pitch, not Oakwood's official identity.

- public/brand/oakwood-wordmark-concept-dark.svg   charcoal, for light grounds
- public/brand/oakwood-wordmark-concept-light.svg  ivory, for dark grounds and photographs
- public/favicon.svg                               botanical "O" on olive
- src/components/wordmark.json                     the same paths for the inline header logo
"""
import json
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

root = Path(__file__).resolve().parents[1]
fonts = root / 'node_modules' / '@fontsource-variable'


def outline(font_file, weight, text, size, x, baseline, tracking=0.0):
    font = instantiateVariableFont(TTFont(font_file), {'wght': weight})
    scale = size / font['head'].unitsPerEm
    glyphs = font.getGlyphSet()
    cmap = font.getBestCmap()
    pen = SVGPathPen(glyphs, ntos=lambda n: f'{n:.1f}'.rstrip('0').rstrip('.'))
    for char in text:
        name = cmap[ord(char)]
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, baseline)))
        x += glyphs[name].width * scale + tracking
    return pen.getCommands(), x - tracking


serif = fonts / 'cormorant-garamond' / 'files' / 'cormorant-garamond-latin-wght-normal.woff2'
sans = fonts / 'manrope' / 'files' / 'manrope-latin-wght-normal.woff2'

name_path, name_end = outline(serif, 500, 'Oakwood', 64, 0, 50)
# The descriptor is tracked out and sized to sit under the name's full width.
_, natural = outline(sans, 600, 'EVENTS UGANDA', 11, 0, 72)
sub_path, sub_end = outline(sans, 600, 'EVENTS UGANDA', 11, 2, 72, tracking=(name_end - 4 - natural) / 12)
width = round(max(name_end, sub_end) + 2)
height = 78
data = {'viewBox': f'0 0 {width} {height}', 'name': name_path, 'sub': sub_path}
(root / 'src' / 'components' / 'wordmark.json').write_text(json.dumps(data) + '\n')
print('wordmark', width, 'x', height, 'name ends', round(name_end), 'sub ends', round(sub_end))

brand = root / 'public' / 'brand'
brand.mkdir(parents=True, exist_ok=True)
for variant, ink, accent in (('dark', '#252724', '#303B2D'), ('light', '#F6F2E9', '#E4D7BC')):
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{data["viewBox"]}" width="{width * 3}" height="{height * 3}" role="img" '
           f'aria-label="Oakwood Events Uganda, concept wordmark (independent proposal)">'
           f'<path fill="{ink}" d="{name_path}"/><path fill="{accent}" d="{sub_path}"/></svg>\n')
    (brand / f'oakwood-wordmark-concept-{variant}.svg').write_text(svg)

# Botanical O: a thin ring with a single leafed sprig crossing its upper right.
favicon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#303B2D"/>
  <ellipse cx="31" cy="34" rx="15.5" ry="17" fill="none" stroke="#F6F2E9" stroke-width="4"/>
  <path d="M38 22c4-6 9-9 14-10" fill="none" stroke="#B69A6A" stroke-width="2.4" stroke-linecap="round"/>
  <path d="M45 15.5c1-4.5 4.5-7 8.5-7-0.5 4.5-4 7.5-8.5 7Z" fill="#B69A6A"/>
  <path d="M41.5 19c-4.2-1.5-6.4-5-6-8.8 4 0.6 6.6 4 6 8.8Z" fill="#B69A6A"/>
</svg>
'''
(root / 'public' / 'favicon.svg').write_text(favicon)
print('brand files written')
