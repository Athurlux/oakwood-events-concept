// Rough performance read for the home page (not Lighthouse): node scripts/perf.mjs [width] [cpuSlowdown]
// Reports LCP, CLS and bytes transferred by type, from one cold load in headless Chrome.
import { chromium } from 'playwright'

const BASE = (process.env.PERF_URL ?? 'http://127.0.0.1:4180').replace(/\/$/, '')
const [width = '390', slowdown = '4'] = process.argv.slice(2)
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const page = await browser.newPage({ viewport: { width: Number(width), height: Number(width) < 700 ? 800 : 900 } })
const cdp = await page.context().newCDPSession(page)
await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(slowdown) })
const bytes = {}
cdp.on('Network.loadingFinished', event => { bytes[event.requestId] = { ...(bytes[event.requestId] ?? {}), size: event.encodedDataLength } })
cdp.on('Network.responseReceived', event => { bytes[event.requestId] = { ...(bytes[event.requestId] ?? {}), type: event.type } })
await cdp.send('Network.enable')
await page.addInitScript(() => {
  window.__lcp = 0; window.__cls = 0
  window.__lcpEls = []
  new PerformanceObserver(list => { for (const entry of list.getEntries()) { window.__lcp = entry.startTime; window.__lcpEls.push(`${Math.round(entry.startTime)}ms ${entry.element?.tagName ?? '?'} ${(entry.element?.textContent || entry.url || '').slice(0, 30)}`) } }).observe({ type: 'largest-contentful-paint', buffered: true })
  new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__cls += entry.value }).observe({ type: 'layout-shift', buffered: true })
})
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await page.waitForTimeout(1500)
const { lcp, cls, els } = await page.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: window.__cls.toFixed(3), els: window.__lcpEls }))
const totals = {}
for (const { type = 'Other', size = 0 } of Object.values(bytes)) totals[type] = (totals[type] ?? 0) + size
const kb = n => `${Math.round(n / 1024)} KB`
console.log(`width ${width}, CPU ${slowdown}x slower, no network throttling`)
console.log(`LCP ${lcp} ms, CLS ${cls}`, '| candidates:', els.join(' → '))
console.log(Object.entries(totals).map(([type, size]) => `${type} ${kb(size)}`).join(', '), `| total ${kb(Object.values(totals).reduce((a, b) => a + b, 0))}`)
await browser.close()
