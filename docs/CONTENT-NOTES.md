# Content notes: sources, verification and omissions

Checked on **21 October 2026** by Arthur Kitandwe (with Claude Code). Everything published on the
site about Oakwood Events Uganda comes from Oakwood's own website. Where something could not be
confirmed, it was left out.

## The live site was down

`https://oakwoodeventsuganda.com/` (and `www.`, `http://`, `/about`, `/contact`, `/services`,
`/sitemap.xml`, `/wp-json/`) returned **HTTP 500, a WordPress critical-error page**, on
21 October 2026. Only `robots.txt` responded.

The Internet Archive's most recent capture of the homepage (17 May 2026) showed **injected
spam text about personal loans** where the welcome copy should be. That suggests the WordPress
install was compromised before it began failing. None of that text is used on this site. It is
worth raising carefully in the pitch: the current site is both broken and showing third-party
spam to anyone who finds an archived copy.

Facts were therefore read from **earlier, clean Internet Archive captures** of Oakwood's own pages:

| Page | Capture used | Accessed |
|---|---|---|
| Home (`/home/`) | https://web.archive.org/web/20250611103727/https://oakwoodeventsuganda.com/home/ | 21 Oct 2026 |
| Root (`/`) | https://web.archive.org/web/20250611103709/https://oakwoodeventsuganda.com/ | 21 Oct 2026 |
| Who we are (`/who-we-are/`) | https://web.archive.org/web/20250611103740/https://oakwoodeventsuganda.com/who-we-are/ | 21 Oct 2026 |
| Our services (`/our-services/`) | https://web.archive.org/web/20250714023838/https://oakwoodeventsuganda.com/our-services/ | 21 Oct 2026 |
| Flower shop (`/flower-shop/`) | https://web.archive.org/web/20250714021300/https://oakwoodeventsuganda.com/flower-shop/ | 21 Oct 2026 |
| Spam-injected home | https://web.archive.org/web/20260517181431/https://oakwoodeventsuganda.com/ | 21 Oct 2026 |

Official profiles are linked from those pages: Instagram `https://www.instagram.com/oakwoodeventsug/`
and Facebook `https://www.facebook.com/oakwoodeventsuganda/`. Neither was opened in detail,
because both need a login to read properly.

## Published, and where each fact comes from

| Fact on the site | Source page |
|---|---|
| Name: Oakwood Events Uganda | every page |
| Operating since July 2017 | Home, Who we are |
| Led ("captained") by Stella and Charlotte; Oakwood founded by Stella | Home, Who we are |
| Stella: Lead Event Planner & Creative Design; business development, floral and creative design; trained economist, project planner and garden-style florist | Who we are |
| Charlotte: Lead Events Manager, Finance & Operations; operations and financial management; trained financial analyst and HR manager | Who we are |
| "More than a decade's experience in project planning, management and business administration" (together) | Who we are |
| "Style and practicality are at the heart of what we do" | Who we are |
| The name story: oak is heavy, durable and malleable; values of resilience, flexibility, longevity, premium value service; name proposed by Stella | Who we are (paraphrased) |
| Services: Event Planning & Management; Event Styling & Decoration; Flowers by Oakwood | Our services |
| Floral offerings: bridal bouquets, floral gift baskets, garden-style florals for home/office/hotel, weekly subscription florals | Navigation and links on Home, Flower shop |
| Process: enquiry form first; reply to confirm availability; vision conversation guides a preliminary quotation | "Our process" panel on every page |
| Address: Ntinda Business Village, 1st Floor, Bukenya Lane, Kampala | footer of every page |
| Email: oakwoodeventsuganda@gmail.com | footer of every page |
| Phones: +256 701 234 858, +256 701 624 222 | footer of every page |
| Kinds of events covered (white weddings, kuhingira and kukyala, christenings and birthdays, a corporate customer-engagement event) | Portfolio link titles on Home |

The site states that these details come from the July 2025 capture and that the live site was down.

## Deliberately left out

- **Client testimonials.** Oakwood's site has real reviews naming private individuals (brides,
  family members, managers). They aren't republished in a third-party pitch. A real build would
  bring them over with Oakwood's consent.
- **Portfolio projects and photographs.** The project titles name clients (for example a
  christening, kuhingira ceremonies and birthdays). Neither the names nor the photographs are used.
  The concept uses the eight supplied AI-generated images, all labelled as illustrations.
- **The Busoga royal wedding** and other named events. They are verifiable from Oakwood's own
  reviews, but they're client stories, so they are left out (see above).
- **Supporting team names** (admin, social media, IT and field staff). Real people, and not
  needed for the pitch.
- **"Elopement & destination weddings"**. A third-party search summary quoted this from the
  Facebook page's tagline, but it could not be confirmed on a page we could read, so it isn't
  presented as a service.
- **Surnames of Stella and Charlotte.** A search summary gave surnames, but Oakwood's own pages
  use first names only, so the site does too.
- **The "within two working days" reply time.** It is in Oakwood's process text, but repeating a
  response-time promise inside a demo could be read as a commitment. The site only says the team
  replies to confirm availability, and the demo confirmation promises nothing.
- **Opening hours, map pin and prices.** None were found.
- **"Hassan Graphix Ltd" credit, client logos ("Some of our clients")**: not relevant, or not
  verifiable as permission to show.
- **Structured data (schema.org).** Deliberately absent, so this deployment cannot present itself
  as the business. The site is also `noindex, nofollow`.

## Proposed copy (not Oakwood's words)

These are marked on the site as proposed wording for Oakwood to confirm:

- Service summaries and "An enquiry for this covers" lists (Services page).
- Process steps 3 and 4 on the home page (proposal and refinement; the day).
- Collection titles and design narratives. They describe the illustrative images, not events.
- The homepage hero line "Beautifully considered. Unforgettably yours." (from the brief).

## To confirm with Oakwood before any real launch

- Current phone numbers, email and address (last seen July 2025).
- Whether the service descriptions and process wording are accurate.
- Permission to use portfolio photographs and client reviews.
- Whether "elopement & destination weddings" is still offered.
- Whether the WordPress site's compromise has been dealt with.
