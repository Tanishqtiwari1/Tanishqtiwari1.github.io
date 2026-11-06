import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, copyFileSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The public URL of the deployed site. Set SITE_URL in your host's env
 * (e.g. Vercel / Netlify) or change the fallback below once you have a domain.
 */
const SITE_URL = (process.env.SITE_URL || 'https://tanishqtiwari1.github.io').replace(/\/$/, '')
const ROUTES = [
  '/',
  '/work/blackbox',
  '/work/galligraph',
  '/work/guildspace',
  '/work/cardioguard',
]

function seoFiles(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-files',
    configResolved(c) { outDir = c.build.outDir },
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      const urls = ROUTES.map((r) => `  <url><loc>${SITE_URL}${r}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n')
      writeFileSync(resolve(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      // GitHub Pages SPA fallback: unknown paths serve the app, which routes client-side.
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
    },
  }
}

export default defineConfig({
  plugins: [react(), seoFiles()],
  base: process.env.BASE_PATH || '/',
})
