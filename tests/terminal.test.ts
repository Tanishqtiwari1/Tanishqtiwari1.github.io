import { describe, expect, it } from 'vitest'
import { mainProjects } from '../src/data/projects'
import { COMMANDS, run, type Line } from '../src/lib/terminal'

const text = (out: ReturnType<typeof run>) => (Array.isArray(out) ? out.map((l: Line) => l.text).join('\n') : out)

describe('terminal', () => {
  it('help lists every required command', () => {
    for (const c of ['help', 'about', 'projects', 'skills', 'experience', 'contact']) {
      expect(COMMANDS[c]).toBeDefined()
      expect(text(run('help'))).toContain(c)
    }
  })

  it('projects lists every project with a case-study link', () => {
    const out = run('projects') as Line[]
    for (const p of mainProjects) {
      expect(text(out)).toContain(p.name)
      expect(out.some((l) => l.href === `/work/${p.slug}`)).toBe(true)
    }
  })

  it('contact exposes email, LinkedIn, GitHub and resume links', () => {
    const hrefs = (run('contact') as Line[]).map((l) => l.href)
    expect(hrefs.some((h) => h?.startsWith('mailto:'))).toBe(true)
    expect(hrefs.some((h) => h?.includes('linkedin.com'))).toBe(true)
    expect(hrefs.some((h) => h?.includes('github.com'))).toBe(true)
    expect(hrefs.some((h) => h?.endsWith('.pdf'))).toBe(true)
  })

  it('is case- and whitespace-insensitive, and reports unknown commands', () => {
    expect(text(run('  ABOUT '))).toContain('Tanishq Tewari')
    expect((run('sudo rm -rf /') as Line[])[0].tone).toBe('error')
  })

  it('clear and exit are control signals', () => {
    expect(run('clear')).toBe('clear')
    expect(run('exit')).toBe('exit')
    expect(run('')).toEqual([])
  })
})
