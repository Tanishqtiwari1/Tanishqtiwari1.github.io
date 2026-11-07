import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, copyFileSync, readFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

/**
 * The public URL of the deployed site. Set SITE_URL in your host's env
 * (e.g. Vercel / Netlify) or change the fallback below once you have a domain.
 */
const SITE_URL = (process.env.SITE_URL || 'https://tanishqtiwari1.github.io').replace(/\/$/, '')
const ROUTES = ['/', '/work/galligraph', '/work/blackbox', '/work/cardioguard', '/work/guildspace']
/** Per-route titles/descriptions baked into each prerendered HTML shell (good link previews + SEO). */
const META: Record<string, { title: string; description: string }> = {
  '/work/galligraph': { title: 'GalliGraph — Case study · Tanishq Tewari', description: 'AI-powered civic complaint intelligence platform. 2nd Place, OFFGRID Hackathon 2026.' },
  '/work/blackbox': { title: 'Black Box — Case study · Tanishq Tewari', description: 'Flight recorder and debugger for AI agents: a graph neural network finds the root cause of failed runs.' },
  '/work/cardioguard': { title: 'CardioGuard — Case study · Tanishq Tewari', description: 'Explainable, offline-first heart-disease risk screening for community health workers.' },
  '/work/guildspace': { title: 'Guildspace — Case study · Tanishq Tewari', description: 'Community skill-exchange and mentorship platform with time-banked credits and a faculty module.' },
}

function seoFiles(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-files',
    configResolved(c) { outDir = c.build.outDir },
    transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', SITE_URL),
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(resolve(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      const urls = ROUTES.map((r) => `  <url><loc>${SITE_URL}${r === '/' ? '/' : `${r}/`}</loc><lastmod>${today}</lastmod><priority>${r === '/' ? '1.0' : '0.7'}</priority></url>`).join('\n')
      writeFileSync(resolve(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
      // GitHub Pages SPA fallback: unknown paths serve the app, which routes client-side.
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'))
      // Prerender a real HTML shell per case study so /work/<slug> returns 200 (not 404) with its own meta.
      const shell = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      for (const [route, m] of Object.entries(META)) {
        const html = shell
          .replace(/<title>[^<]*<\/title>/, `<title>${m.title}</title>`)
          .replaceAll(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*"/g, `$1${m.description}"`)
          .replaceAll(/(<meta (?:property|name)="(?:og:title|twitter:title)" content=")[^"]*"/g, `$1${m.title}"`)
          .replace(/(<link rel="canonical" href=")[^"]*"/, `$1${SITE_URL}${route}/"`)
          .replace(/(<meta property="og:url" content=")[^"]*"/, `$1${SITE_URL}${route}/"`)
        mkdirSync(resolve(outDir, route.slice(1)), { recursive: true })
        writeFileSync(resolve(outDir, route.slice(1), 'index.html'), html)
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), seoFiles()],
  base: process.env.BASE_PATH || '/',
})
