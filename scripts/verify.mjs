// Compact browser journey check. Run against a preview build:
//   npm run build && npm run preview -- --port 4180   (another terminal)
//   npm run verify     or   VERIFY_URL=https://oakwood-events-concept.pages.dev npm run verify
// One headless Chrome, one page at a time. Checks wait for state rather than sampling once.
import { chromium } from 'playwright'

const BASE = (process.env.VERIFY_URL ?? 'http://127.0.0.1:4180').replace(/\/$/, '')
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const results = []
const check = (name, ok, detail = '') => { results.push({ name, ok }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`) }

const browser = await chromium.launch({ executablePath: CHROME })
const context = await browser.newContext({ viewport: { width: 1280, height: 860 } })
const page = await context.newPage()
const requests = []
const failures = []
const errors = []
page.on('request', request => requests.push({ method: request.method(), url: request.url() }))
page.on('response', response => { if (response.status() >= 400 && !response.url().includes('/no-such-page') && !response.url().includes('/work/nowhere')) failures.push(`${response.status()} ${response.url()}`) })
page.on('pageerror', error => errors.push(error.message))
page.on('console', message => { if (message.type() === 'error' && !/404/.test(message.text())) errors.push(message.text()) })

const go = async path => { await page.goto(BASE + path, { waitUntil: 'networkidle' }) }
const sees = async (text, timeout = 8000) => page.getByText(text).first().waitFor({ timeout }).then(() => true, () => false)
const waitFor = (fn, arg) => page.waitForFunction(fn, arg, { timeout: 5000 }).then(() => true, () => false)
const button = name => page.getByRole('button', { name, exact: true })
const items = n => waitFor(n => document.querySelectorAll('.work-item').length === n, n)
const runSample = async finalLabel => {
  for (let step = 0; step < 6 && !(await button(finalLabel).count()); step++) {
    if (await button('Use sample details').count()) await button('Use sample details').click()
    await page.locator('.flow__actions button[type="submit"]').click()
    await page.waitForTimeout(150)
  }
  return (await button(finalLabel).count()) > 0
}
// Positive claims only: the honest copy ("Nothing was sent", "No date has been checked or held") must not match.
const CLAIMS = /availab(le|ility) (is )?confirmed|date is (reserved|held|booked)|(is|are) booked|we will (call|contact)|we'll (call|be in touch)|callback|(enquiry|message) (has been|was) sent/i

try {
  // 1. Home: live headline, transparent header that turns solid, CTAs
  await go('/')
  check('live hero headline', await page.getByRole('heading', { level: 1, name: 'Beautifully considered. Unforgettably yours.' }).isVisible())
  check('header is transparent over the hero', await page.locator('.site-header.is-transparent').count() === 1)
  await page.mouse.wheel(0, 900)
  check('header turns solid on scroll', await waitFor(() => !document.querySelector('.site-header.is-transparent')))
  check('only one hero image is preloaded for this viewport', await page.evaluate(() => [...document.querySelectorAll('link[rel=preload][as=image]')].filter(link => matchMedia(link.media).matches).length === 1))
  await page.getByRole('link', { name: 'Explore the concept' }).click()
  check('Explore the concept opens Our work', await page.waitForURL(/\/work$/).then(() => true, () => false) && await items(4))

  // 2. Filters live in the URL; Back and refresh keep them
  await page.locator('.filters').getByRole('link', { name: 'Weddings' }).click()
  await page.waitForURL(/category=weddings/)
  check('filter narrows to one collection', await items(1) && await sees('Showing the weddings concept.'))
  await page.locator('.filters').getByRole('link', { name: 'Corporate' }).click()
  await page.waitForURL(/category=corporate/)
  await page.goBack()
  check('Back restores the previous filter', await page.waitForURL(/category=weddings/).then(() => true, () => false) && await items(1))
  await page.reload({ waitUntil: 'networkidle' })
  check('refresh keeps the filter', await items(1) && await page.locator('.filter[aria-current="true"]').innerText() === 'Weddings')
  await go('/work?category=bogus')
  check('an unknown filter shows everything', await items(4))

  // 3. Every collection opens, is labelled a concept, and carries its occasion into the enquiry
  for (const [slug, occasion] of [['garden-reception', 'Wedding'], ['courtyard-ceremony', 'Traditional celebration'], ['evening-dinner', 'Corporate event'], ['terrace-celebration', 'Private occasion']]) {
    await go('/work')
    await page.locator(`a[href="/work/${slug}"]`).first().click()
    await page.waitForURL(new RegExp(slug))
    const labelled = await page.locator('h1 .concept-label').isVisible() && await sees('do not show an event Oakwood has delivered')
    await page.locator('.collection__notes').getByRole('link').click()
    await page.waitForURL(/\/plan\?occasion=/)
    check(`${slug}: labelled concept, enquiry preselects ${occasion}`, labelled && await page.getByRole('radio', { name: new RegExp(`^${occasion}`) }).isChecked())
  }
  await go('/work/garden-reception')
  await page.locator('.next-collection__link').click()
  check('next collection link works', await page.waitForURL(/courtyard-ceremony/).then(() => true, () => false))

  // 4. Services carry the chosen service
  await go('/services')
  await page.getByRole('link', { name: 'Enquire about flowers' }).click()
  check('service enquiry preselects floral design', await page.waitForURL(/service=florals/).then(() => true, () => false) && await page.getByRole('checkbox', { name: 'Floral design' }).isChecked())

  // 5. Plan your event: validation, Kampala dates, flexible answers, edits, demo completion
  await go('/plan')
  await button('Next').click()
  check('empty step shows an error summary and focuses the first field', await page.locator('.error-summary').isVisible() && await waitFor(() => document.activeElement?.closest('#occasion') !== null))
  await page.getByRole('radio', { name: /^Wedding/ }).check()
  await page.getByRole('checkbox', { name: 'Not sure yet' }).check()
  await button('Next').click()
  await page.getByRole('radio', { name: 'We have a date' }).check()
  await page.locator('#date').fill('2020-01-01')
  await page.getByRole('radio', { name: 'Not decided yet' }).nth(1).check()
  await page.locator('#guests').selectOption('unsure')
  await button('Next').click()
  check('a past date is rejected against Kampala today', (await page.locator('#date-error').innerText()).includes('Kampala time'))
  await page.getByRole('radio', { name: 'Roughly, not fixed' }).check()
  check('flexible date asks for approximate timing instead', !(await page.locator('#date').count()) && await page.locator('#timing').isVisible())
  await page.locator('#timing').fill('Mid 2027')
  await button('Next').click()
  await page.locator('#name').fill('Test Person')
  await page.locator('#phone').fill('12345')
  await page.getByRole('radio', { name: 'Email' }).check()
  await page.locator('#budget').selectOption('discuss')
  await button('Review').click()
  check('an invalid phone is rejected', (await page.locator('#phone-error').innerText()).includes('international number'))
  await page.locator('#phone').fill('+44 7700 900123')
  await button('Review').click()
  check('email reply needs an email address', (await page.locator('#contactPref-error').innerText()).includes('email address'))
  await page.getByRole('radio', { name: 'WhatsApp message' }).check()
  await button('Review').click()
  check('review shows the answers, including a flexible date', await sees('Review your enquiry') && await sees('Mid 2027') && await sees('+447700900123'))
  await page.getByRole('button', { name: /Edit Date, venue and guests/ }).click()
  await page.getByRole('radio', { name: 'Not decided yet' }).first().check()
  await button('Next').click(); await button('Review').click()
  check('editing from review keeps other answers and drops the hidden one', await sees('Test Person') && !(await page.getByText('Mid 2027').count()))
  check('states “Demo only — your enquiry will not be sent.” before completion', await sees('Demo only — your enquiry will not be sent.'))
  await button('Complete demo enquiry').dblclick()
  check('confirmation: DEMO reference, nothing sent', await sees(/DEMO-[A-HJ-NP-Z2-9]{6}/) && await sees('Nothing was sent to Oakwood Events Uganda'))
  check('confirmation offers print and start again', await page.getByRole('button', { name: 'Print summary' }).isVisible() && await button('Start a new enquiry').isVisible())
  check('confirmation claims no availability, booking or callback', !CLAIMS.test(await page.locator('main').innerText()))
  await page.goBack({ waitUntil: 'networkidle' })
  check('Back cannot resubmit: the draft is gone', !(await button('Complete demo enquiry').count()) && await sees('Occasion and services'))
  await go('/plan?step=done')
  check('a direct confirmation URL shows a recovery path', await sees('There’s no summary to show.') && await button('Start again').isVisible())
  await go('/plan?step=review')
  check('a direct review URL starts at step one', await sees('Occasion and services') && page.url().includes('step=occasion'))
  check('sample details complete the whole flow', await runSample('Complete demo enquiry'))

  // 6. Contact: verified channels apart from the demo form
  await go('/contact')
  check('verified contact links are separate actions', (await page.locator('.real-contact a[href^="mailto:"]').count()) === 1 && (await page.locator('.real-contact a[href^="tel:"]').count()) === 2)
  check('the demo form has no email or WhatsApp action', (await page.locator('.contact__form a[href^="mailto:"], .contact__form a[href*="wa.me"], .contact__form a[href*="whatsapp"]').count()) === 0)
  check('contact message completes as a demo', await runSample('Complete demo message') && await sees('Demo only — your message will not be sent.') && (await button('Complete demo message').click(), await sees('No message was sent')))

  // 7. Direct loads and not found
  for (const [path, text] of [['/about', 'Why “Oakwood”'], ['/services', 'Flowers by Oakwood'], ['/work/terrace-celebration', 'Terrace Celebration'], ['/work/nowhere', 'We couldn’t find that collection.'], ['/no-such-page', 'This page isn’t here.']]) {
    await go(path); check(`direct load ${path}`, await sees(text))
  }
  await page.locator('.not-found__links').getByRole('link', { name: 'Our work' }).click()
  check('not-found links work', await page.waitForURL(/\/work$/).then(() => true, () => false))

  // 8. Mobile menu: focus, Escape, closes on navigation
  await page.setViewportSize({ width: 390, height: 800 })
  await go('/about')
  await page.getByRole('button', { name: 'Open menu' }).click()
  check('mobile menu focuses its first link', await page.evaluate(() => document.activeElement?.textContent === 'Home'))
  await page.keyboard.press('Escape')
  check('Escape closes the menu and restores focus', await page.evaluate(() => document.activeElement?.getAttribute('aria-label') === 'Open menu') && await page.locator('#mobile-menu').isHidden())
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.locator('#mobile-menu').getByRole('link', { name: 'Services' }).click()
  await page.waitForURL(/services/)
  check('menu closes on navigation and the page starts at the top', await waitFor(() => document.getElementById('mobile-menu')?.hidden === true && window.scrollY === 0))

  // 9. Reduced motion: complete static composition
  const reduced = await browser.newPage({ reducedMotion: 'reduce', viewport: { width: 1280, height: 860 } })
  await reduced.goto(BASE + '/', { waitUntil: 'networkidle' })
  check('reduced motion: headline and content fully visible', await reduced.evaluate(() => !document.documentElement.classList.contains('hero-pending')
    && [...document.querySelectorAll('[data-hero="line"], [data-anim="rise"]')].every(el => getComputedStyle(el).transform === 'none' && getComputedStyle(el).opacity === '1')))
  await reduced.close()

  // 10. No trigger build-up across navigation and resizing
  await page.setViewportSize({ width: 1280, height: 860 })
  await go('/')
  const initial = await page.evaluate(() => window.__scrollTriggerCount?.())
  for (let i = 0; i < 3; i++) {
    await page.locator('.site-nav').getByRole('link', { name: 'Our work' }).click()
    await page.waitForURL(/work/)
    await page.getByRole('link', { name: 'Oakwood Events Uganda concept, home' }).click()
    await page.waitForURL(url => new URL(url).pathname === '/')
  }
  for (const width of [800, 1280, 900, 1300, 1280]) { await page.setViewportSize({ width, height: 860 }); await page.waitForTimeout(200) }
  await page.waitForTimeout(400)
  const after = await page.evaluate(() => window.__scrollTriggerCount?.())
  check('ScrollTrigger count stable after navigation and resizing', typeof initial === 'number' && initial > 0 && after === initial, `${initial} → ${after}`)

  // 11. Overflow and image sweep at the brief's widths
  const overflow = []
  const broken = []
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 860 })
    for (const path of ['/', '/work', '/work/courtyard-ceremony', '/services', '/about', '/plan', '/contact']) {
      await go(path)
      await page.evaluate(async () => {
        for (const img of document.images) img.loading = 'eager'
        await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
      })
      const extra = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      if (extra > 0) overflow.push(`${path}@${width}:${extra}`)
      const bad = await page.evaluate(() => [...document.images].filter(img => getComputedStyle(img).display !== 'none' && !img.naturalWidth).map(img => img.currentSrc || img.src))
      if (bad.length) broken.push(`${path}@${width}: ${bad.join(', ')}`)
    }
  }
  check('no horizontal overflow at 360–1440', overflow.length === 0, overflow.join(', '))
  check('no broken images', broken.length === 0, broken.join(' | '))

  // 12. Nothing leaves the browser; nothing personal is stored
  const origin = new URL(BASE).origin
  const nonGet = requests.filter(request => request.method !== 'GET')
  const thirdParty = requests.filter(request => !request.url.startsWith(origin) && !request.url.startsWith('data:'))
  const personal = requests.filter(request => /test%20person|test person|sample guest|example\.com|7700|0700/i.test(decodeURIComponent(request.url)))
  check('no non-GET requests', nonGet.length === 0, nonGet.map(request => request.url).join(', '))
  check('no third-party requests', thirdParty.length === 0, [...new Set(thirdParty.map(request => new URL(request.url).host))].join(', '))
  check('no entered details in any request URL', personal.length === 0)
  const storage = await page.evaluate(() => ({ local: Object.keys(localStorage), session: Object.keys(sessionStorage), all: JSON.stringify({ ...localStorage, ...sessionStorage }) }))
  // React Router keeps scroll positions (paths and numbers) in sessionStorage; nothing else is allowed.
  check('no personal data in browser storage', storage.local.length === 0 && storage.session.every(key => key === 'react-router-scroll-positions') && !/test person|sample|example\.com|7700/i.test(storage.all), [...storage.local, ...storage.session].join(', '))
  check('no failed requests (images, chunks)', failures.length === 0, failures.slice(0, 3).join(' | '))
  check('no console or page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
} catch (error) {
  check('journey ran to completion', false, error.message.split('\n')[0])
} finally {
  await browser.close()
}

const failed = results.filter(result => !result.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
