# Assets

All eight photographs are **AI-generated illustrative concepts** supplied in
`Oakwood_Events_Agent_Pack.zip`. None of them shows Oakwood's work, venues or clients. Every
place an image appears carries a visible caption saying so.

Originals are kept unchanged in `assets-src/pack/images/`. `scripts/prepare-images.py` checks
each one against the pack's `manifest.json` SHA-256 before deriving anything.

## Derivatives

`npm run images` (Python 3 + Pillow) writes WebP files to `public/images/` and the widths,
intrinsic size and focal point of each to `src/data/image-manifest.json`, which `<Img>` reads.
Quality is **78** for photographs and **82** for the transparent floral layer, whose soft
edges band at lower settings. Nothing is upscaled. Full-resolution PNGs are never shipped.

| Source | Derived name | Widths | Crop (x1, y1, x2, y2) | Used on |
|---|---|---|---|---|
| 01-hero-desktop.png (1672×941) | hero-desktop | 960, 1280, 1672 | none | Home hero ≥768px; focal 62% 50%; link preview (1200×630 JPEG crop) |
| 02-hero-mobile.png (1024×1536) | hero-mobile | 480, 768, 1024 | none | Home hero <768px; focal 55% 40% |
| 03-wedding-reception.png | wedding | 640, 1024, 1536 | none | Garden Reception collection; Home selected concepts; Our work |
| 03-wedding-reception.png | wedding-detail | 480, 600 | 300, 230, 900, 980 | Garden Reception detail; Services (planning) |
| 04-traditional-celebration.png | traditional | 640, 1024, 1536 | none | Courtyard Ceremony collection; Our work |
| 04-traditional-celebration.png | traditional-detail | 480, 640 | 60, 300, 700, 1024 | Courtyard Ceremony detail |
| 05-corporate-dinner.png | corporate | 640, 1024, 1536 | none | Evening Dinner collection; Home selected concepts; Our work |
| 05-corporate-dinner.png | corporate-detail | 480, 792 | 0, 432, 792, 1024 | Evening Dinner detail; Services (styling) |
| 06-private-celebration.png | private | 640, 1024, 1536 | none | Terrace Celebration collection; Our work |
| 06-private-celebration.png | private-detail | 480, 576 | 0, 0, 576, 1024 | Terrace Celebration detail |
| 07-floral-detail.png (1122×1402) | floral | 480, 800, 1122 | none | Home floral moment; Services (Flowers by Oakwood); About |
| 08-floral-corner-transparent.png | floral-corner | 360, 720 | none | Decorative corner in the closing enquiry band, ≥900px only |

## Honest reuse

- Each collection is **one image plus one crop of that same image**. The crop's caption says
  "Detail crop of the same concept image", so a crop is never presented as another photograph
  or another event.
- The same crops are reused on Services, where they illustrate a mood, captioned as concept images.
- Image 07 (the floral close-up) appears three times. It is always captioned "not Oakwood's floral
  work" and is never described as a studio photograph.

## Image 08 check

Composited at 100% on ivory `#F6F2E9` and olive `#303B2D`: no visible yellow-green fringing on
leaf or petal edges, so it is kept. Most of the image is very slightly translucent (only 166
fully opaque pixels), which is invisible on both grounds. It is `aria-hidden`, has
`pointer-events: none`, sits behind the band's content with the text column padded clear of it,
and is hidden below 900px, so it never covers a control.

## Brand

`scripts/make-brand.py` (fonttools + brotli) outlines the proposed wordmark from the bundled
Cormorant Garamond (name, weight 500) and Manrope (descriptor, weight 600). The SVGs don't
depend on any font being installed.

- `public/brand/oakwood-wordmark-concept-dark.svg` charcoal, for light grounds
- `public/brand/oakwood-wordmark-concept-light.svg` ivory, for dark grounds
- `public/favicon.svg` botanical "O": an ivory ring with a champagne sprig on olive
- `public/apple-touch-icon.png` rendered from the favicon by `scripts/touch-icon.mjs`

These are **proposal assets**, not a recreation of Oakwood's identity. Oakwood's real logo
(seen on their site) was not copied.

## Fonts

Self-hosted through `@fontsource-variable/cormorant-garamond` and `@fontsource-variable/manrope`
(SIL Open Font License). Only the subsets a page uses are downloaded. Fallbacks are Georgia and
the system sans-serif.
