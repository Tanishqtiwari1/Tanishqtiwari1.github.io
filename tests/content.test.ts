/**
 * Content-integrity tests: the site must never show an unverified number or a missing image.
 */
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { mainProjects, projects } from '../src/data/projects'
import { featuredPost, gallery, highlights, timeline } from '../src/data/site'

const pub = (p: string) => resolve(__dirname, '../public', p)

describe('projects', () => {
  it('has exactly the four approved projects, GalliGraph featured', () => {
    expect(mainProjects.map((p) => p.slug)).toEqual(['galligraph', 'blackbox', 'cardioguard', 'guildspace'])
    expect(mainProjects.find((p) => p.featured)?.slug).toBe('galligraph')
  })

  it.each(mainProjects)('$name links to its GitHub repository and has a real screenshot', (p) => {
    expect(p.github).toMatch(/^https:\/\/github\.com\/Tanishqtiwari1\//)
    expect(p.image).toBeDefined()
    expect(existsSync(pub(p.image!))).toBe(true)
  })

  it.each(mainProjects)('$name: every headline metric states how it was measured', (p) => {
    for (const m of p.stats ?? []) expect(m.how, `${p.name}: "${m.label}"`).toBeTruthy()
    for (const m of p.study.results ?? []) {
      if (/tests?$/i.test(m.label)) continue // a count, not a measurement
      expect(m.how, `${p.name}: "${m.label}"`).toBeTruthy()
    }
  })

  it.each(mainProjects.filter((p) => p.study.results))('$name: results are labelled as experimental', (p) => {
    expect(p.study.resultsNote).toMatch(/not (production|clinical)/i)
    expect(p.evaluation?.limitations.length).toBeGreaterThan(0)
  })

  it('GalliGraph and Black Box have interactive architecture diagrams', () => {
    for (const slug of ['galligraph', 'blackbox']) {
      const nodes = projects.find((p) => p.slug === slug)!.study.architecture!.nodes
      expect(nodes.every((n) => n.detail && n.detail.length > 20)).toBe(true)
    }
  })

  it('every gallery image in case studies exists', () => {
    for (const p of projects) for (const g of p.study.gallery ?? []) expect(existsSync(pub(g.src)), g.src).toBe(true)
  })
})

describe('site content', () => {
  it('never renders a TODO placeholder on the live site', () => {
    const visible = JSON.stringify({ projects, timeline, highlights, gallery, featuredPost })
    expect(visible).not.toMatch(/TODO/)
  })

  it('upcoming HCLTech internship makes no claims about responsibilities', () => {
    const hcl = timeline.find((t) => t.org === 'HCLTech')!
    expect(hcl.group).toBe('Internships')
    expect(hcl.details.join(' ')).toMatch(/will be added/i)
  })

  it('all referenced images exist', () => {
    const imgs = [...gallery.map((g) => g.src), ...highlights.flatMap((h) => (h.img ? [h.img] : [])), featuredPost.avatar, ...featuredPost.slides]
    for (const src of imgs) expect(existsSync(pub(src)), src).toBe(true)
  })

  it('every project route is prerendered and in the sitemap', () => {
    const cfg = readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf8')
    for (const p of mainProjects) expect(cfg).toContain(`'/work/${p.slug}'`)
    expect(cfg).toContain("'/resume'")
  })

  it('resume PDF is present', () => {
    expect(existsSync(pub('Tanishq_Tewari_Resume.pdf'))).toBe(true)
  })
})
