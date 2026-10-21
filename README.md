# Oakwood Events Uganda: independent website concept

A multi-page redesign proposal for [Oakwood Events Uganda](https://oakwoodeventsuganda.com/) by
Arthur Kitandwe. **It is not the official website** and is not authorised by Oakwood. Every
photograph is an AI-generated illustration, not Oakwood's work. Every form is a demonstration
that stores and sends nothing.

Live preview: https://oakwood-events-concept.pages.dev (`noindex`)

## What's in it

| Route | What it does |
|---|---|
| `/` | Cinematic hero (art-directed desktop/mobile images, live headline), introduction, four occasions, floral moment, proposed process, selected concepts, enquiry band |
| `/work` | Four concept collections, filterable by occasion. The filter lives in the URL (`?category=weddings`), so Back, refresh and shared links keep it |
| `/work/:slug` | Collection detail: concept label, design narrative and notes, a labelled detail crop, next collection, and an enquiry that carries the occasion |
| `/services` | Oakwood's three published services. Each carries its service into the enquiry. Descriptions are marked as proposed wording |
| `/about` | Verified company story, the leads, the name's meaning, and the concept disclosure (`#concept`) |
| `/plan` | Four-step guided enquiry, then review, then demo confirmation (`DEMO-XXXXXX`, print, start again) |
| `/contact` | Oakwood's own published channels as separate real links, plus a short demo message form |
| anything else | Not-found page with working links, served with a real 404 status on Pages |

Business facts and their sources: [docs/CONTENT-NOTES.md](docs/CONTENT-NOTES.md). Images, crops
and reuse: [docs/ASSETS.md](docs/ASSETS.md).

## Stack

React 19, TypeScript, Vite 7, React Router 7 (lazy route chunks), GSAP + ScrollTrigger, plain
CSS with tokens, self-hosted Cormorant Garamond and Manrope. No backend, database, analytics or
third-party requests.

```
src/data/        business facts (with sources), collections, services, image manifest
src/forms/       declarative form engine, the two flows, in-memory drafts
src/animation/   one GSAP hook per page (useGSAP + matchMedia, reduced-motion aware)
src/components/  layout, header, footer, wordmark, figure, image
src/pages/       one file per route
scripts/         image/brand generation, screenshots, verification, performance read
assets-src/pack/ the supplied agent pack, unchanged
```

### Things worth knowing

- **Forms keep nothing.** Drafts and completed summaries live in React state only. Nothing
  goes to localStorage, the URL or the network. Only `?occasion=` and `?service=`, which are
  not personal, are ever put in a URL. Refreshing clears everything, and a direct
  `/plan?step=done` shows a recovery message. Completing replaces the review history entry and
  clears the draft, so Back cannot complete twice.
- **Dates use the Kampala calendar** (`Africa/Kampala`), so a visitor in another time zone
  cannot pick a day that has already passed in Uganda.
- **Motion:** two-stage hero headline while the photograph settles from 1.03 to 1. Figures get
  a mask reveal on desktop and a short fade on phones, and text uses one batched stagger. There
  is no pinning, no loops and no scroll hijacking. With reduced motion everything is shown
  static. All triggers are scoped with `useGSAP` and `matchMedia`, so they don't accumulate (the
  verify script checks this).
- **Hosting routes:** the build writes `dist/_redirects` with only the real routes (collection
  slugs come from `src/data/collections.ts`) and `dist/404.html`. Unknown URLs therefore get a
  true 404 that still renders the app's not-found page. There is deliberately no catch-all.

## Commands

```bash
npm install
npm run dev                       # http://127.0.0.1:5173
npm test                          # 12 focused unit tests (dates, validation, flow rules, filters)
npm run build                     # type-check + production build into dist/
npm run preview -- --port 4180    # serve dist/ locally
npm run verify                    # 52 browser checks against the preview (needs Chrome)
node scripts/perf.mjs 390 4       # LCP / CLS / bytes for the home page, 4x CPU slowdown
npm run images                    # regenerate WebP derivatives (Python 3 + Pillow)
py -P scripts/make-brand.py       # regenerate wordmark + favicon (fonttools + brotli)
node scripts/touch-icon.mjs       # regenerate apple-touch-icon.png
```

In Git Bash, prefix Node scripts that take URL paths with `MSYS_NO_PATHCONV=1`.

## Deploying

Cloudflare Pages project `oakwood-events-concept`, by **Direct Upload**. Pushing to GitHub does
**not** deploy. Each release is manual:

```bash
npm test && npm run build
npm run deploy                    # wrangler pages deploy dist --project-name oakwood-events-concept --branch main
VERIFY_URL=https://oakwood-events-concept.pages.dev npm run verify
```

`.env` holds only the public `VITE_SITE_URL` used in link-preview tags. There are no secrets in
the repo, and Wrangler uses your own logged-in session.
