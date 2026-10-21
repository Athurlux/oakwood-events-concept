// Rasterise public/favicon.svg to the 180px apple-touch icon: node scripts/touch-icon.mjs
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'

const svg = readFileSync(new URL('../public/favicon.svg', import.meta.url), 'utf8')
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const page = await browser.newPage({ viewport: { width: 180, height: 180 } })
// iOS rounds the corners itself, so the square is filled edge to edge.
await page.setContent(`<style>*{margin:0}body{background:#303B2D}svg{width:180px;height:180px;display:block}</style>${svg.replace('rx="14"', 'rx="0"')}`)
await page.screenshot({ path: new URL('../public/apple-touch-icon.png', import.meta.url).pathname.replace(/^\/([A-Z]:)/, '$1') })
await browser.close()
console.log('apple-touch-icon.png written')
