# Verification record, 21 October 2026

## Automated

- `npm test`: **12/12** unit tests (Kampala dates, phone and email formats, plan-flow rules,
  hidden-answer pruning, direct-URL step resolution, DEMO references, work filter, next collection).
- `npm run build`: type-check and production build pass.
- `npm run verify` (headless Chrome, one page): **52/52** against the local preview, and
  **52/52** against https://oakwood-events-concept.pages.dev. Covers:
  - the hero and header behaviour, and that only one hero image is preloaded per viewport
  - filters in the URL with Back, refresh and an unknown value
  - all four collections: concept label, enquiry preselecting the occasion, next link
  - services carrying the chosen service into the enquiry
  - the full plan flow: error summary and focus, past date against Kampala, flexible date,
    invalid phone, reply-method rule, review, edit from review, the "Demo only — your enquiry
    will not be sent." statement, double-click completion, DEMO reference, print and start
    again, no availability or callback claims, Back cannot resubmit, direct `?step=done` and
    `?step=review` recovery
  - contact: real links kept apart from the demo form, which completes as a demo
  - direct loads of nested routes and the not-found pages
  - mobile menu: focus, Escape, closes on navigation and starts at the top
  - reduced motion leaves everything visible
  - ScrollTrigger count stable (16 → 16) across navigation and resizing
  - no horizontal overflow and no broken images at 360, 390, 768 and 1440 on seven routes
  - no non-GET or third-party requests, no entered details in URLs, nothing personal in
    storage, and no failed requests or console errors

## Hosting

Live status codes after the final deploy: `/work`, `/work?category=weddings`,
`/work/garden-reception`, `/services`, `/about`, `/plan?step=review` and `/contact` return
**200**. `/no-such-page` and `/work/nowhere` return **404** with the app's not-found page.
`X-Robots-Tag: noindex, nofollow` and `X-Frame-Options: DENY` are present.

Found and fixed while checking: rewriting routes to `/index.html` made Pages answer every deep
link with a **308 to `/`**. The routes now rewrite to `/`.

## Performance (`scripts/perf.mjs`; not Lighthouse)

One cold load of the home page in headless Chrome, with no network throttling:

| Where | Width | CPU | LCP | CLS | Transferred |
|---|---|---|---|---|---|
| Local preview | 390 | 4× slower | ~1.95 s | 0 | 342 KB |
| Local preview | 1440 | 1× | ~0.76 s | 0 | 433 KB |
| Live (from Kampala) | 390 | 4× slower | 2.8–3.5 s (5.5 s on a cold edge just after deploy) | 0–0.013 | 347 KB |
| Live (from Kampala) | 1440 | 1× | 1.5–2.3 s | 0 | 437 KB |

The LCP element is the live headline. It waits for the main bundle, the home chunk, the
display font and the short two-stage entrance. JavaScript is 164 KB compressed, of which GSAP
is about 46 KB and loads with the pages that animate.

## Not done

- No Lighthouse or axe run; the keyboard and focus checks above are scripted, not a full audit.
- No real phones, Safari, Firefox or screen reader.
- Screenshots in `docs/screenshots/` were reviewed at 1440 and 390, with reduced motion so
  every section is shown settled.
