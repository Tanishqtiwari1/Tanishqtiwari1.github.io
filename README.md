# Tanishq Tewari — Portfolio

Vite + React + TypeScript + Framer Motion. No UI framework, one CSS file.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/ (+ robots.txt, sitemap.xml, 404.html)
```

## Editing content
- `src/data/site.ts` — profile, links, timeline, stack, highlights, hackathons, **Now**, Beyond Code
- `src/data/projects.ts` — projects + case studies (sections left out simply don't render)
- `public/Tanishq_Tewari_Resume.pdf` — resume served by the Resume buttons
- `public/og.png` — social preview image (source: `scripts/og.html`)

## Deploy

**Live:** https://tanishqtiwari1.github.io — every push to `main` rebuilds and redeploys via `.github/workflows/deploy.yml`.

Set `SITE_URL` (e.g. `https://yourdomain.com`) in the host's environment so canonical/OG URLs, robots.txt and sitemap.xml are correct.
- **GitHub Pages**: `.github/workflows/deploy.yml` builds and deploys on every push to `main` (Settings → Pages → Source: GitHub Actions). The build also writes `404.html` plus a prerendered `work/<slug>/index.html` per case study, so deep links return 200.
