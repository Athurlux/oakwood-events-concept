import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, type Plugin } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { COLLECTIONS } from './src/data/collections'

/**
 * Cloudflare Pages routing. Instead of a catch-all SPA fallback (which answers 200 for any
 * URL), only the app's real routes are rewritten to the app shell. Anything else falls through
 * to 404.html: a copy of the app that renders the not-found page, served with status 404.
 * Collection slugs come from the data file, so a new collection cannot be forgotten here.
 */
const ROUTES = ['/work', '/services', '/about', '/plan', '/contact', ...COLLECTIONS.map(collection => `/work/${collection.slug}`)]

function pagesRouting(): Plugin {
  return {
    name: 'pages-routing',
    apply: 'build',
    closeBundle() {
      const dist = fileURLToPath(new URL('./dist', import.meta.url))
      const html = readFileSync(resolve(dist, 'index.html'), 'utf8')
      writeFileSync(resolve(dist, '404.html'), html)
      // The target is "/", not "/index.html": Pages normalises /index.html with a 308 to "/",
      // which would send every deep link to the home page.
      writeFileSync(resolve(dist, '_redirects'), ROUTES.map(route => `${route}  /  200`).join('\n') + '\n')
    },
  }
}

export default defineConfig({
  plugins: [react(), pagesRouting()],
  test: { environment: 'node', include: ['src/**/*.test.ts'] },
})
