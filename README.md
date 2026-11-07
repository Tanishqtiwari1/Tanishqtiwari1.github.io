# Tanishq Tewari — Portfolio

Vite + React + TypeScript + Framer Motion. No UI framework, one CSS file.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/ (+ robots.txt, sitemap.xml, 404.html)
```

## Quality checks

```bash
npm run lint    # oxlint — TypeScript, React, React hooks, jsx-a11y
npm test        # vitest — content integrity + terminal commands
npm run check   # type-check + lint + tests
```

CI runs lint and tests before every deploy; a failure blocks the release.

- **Why oxlint, not ESLint:** the project uses TypeScript 7, which doesn't ship the JS compiler API that `typescript-eslint` needs.
- **Content tests** (`tests/content.test.ts`) fail the build if a metric loses its evaluation context, an image or the resume PDF goes missing, a project route isn't prerendered, or a `TODO` reaches the live site.
- **Rules relaxed on purpose** (`.oxlintrc.json`): `prefer-tag-over-role` (Framer Motion dialogs and `<svg role="img">` are valid ARIA), `no-autofocus` (focus moves into opened dialogs), `jsx-no-comment-textnodes` (the `//` in headings is visible text), `no-unassigned-import` (font/CSS side-effect imports). React-compiler purity/effect rules are warnings: `Date()` for "upcoming" badges and route-change effects are intentional.

## Editing content
- `src/data/site.ts` — profile, links, timeline (grouped), skills, highlights, hackathons, **Now**, Beyond Code, gallery
- `src/components/Cursor.tsx` — morphing cursor (snap / stretch / lens / labels); edit the `SNAP`, `LABELS`, `LENS` selector lists to change behaviour. Mouse/trackpad only, off with reduced motion.
- `src/lib/terminal.ts` — the optional terminal's commands (open with the `›_` button or the backtick key)
- `src/data/projects.ts` — projects + case studies: contribution, evaluation (data, method, limitations), docs links, architecture (nodes with `detail` become interactive)
- `public/Tanishq_Tewari_Resume.pdf` — resume served by the Resume buttons
- `public/og.png` — social preview image (source: `scripts/og.html`)

## Deploy

**Live:** https://tanishqtiwari1.github.io — every push to `main` rebuilds and redeploys via `.github/workflows/deploy.yml`.

Set `SITE_URL` (e.g. `https://yourdomain.com`) in the host's environment so canonical/OG URLs, robots.txt and sitemap.xml are correct.
- **GitHub Pages**: `.github/workflows/deploy.yml` builds and deploys on every push to `main` (Settings → Pages → Source: GitHub Actions). The build also writes `404.html` plus a prerendered `work/<slug>/index.html` per case study, so deep links return 200.
