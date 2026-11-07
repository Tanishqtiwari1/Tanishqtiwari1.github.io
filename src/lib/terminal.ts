/**
 * Pure command interpreter for the optional terminal (no DOM — unit-tested in terminal.test.ts).
 * All output comes from the same data files as the rest of the site, so nothing can drift or be invented.
 */
import { mainProjects } from '../data/projects'
import { about, links, profile, stack, timeline } from '../data/site'

export type Line = { text: string; href?: string; tone?: 'muted' | 'accent' | 'error' }

export const COMMANDS: Record<string, string> = {
  help: 'list available commands',
  about: 'who I am and what I build',
  projects: 'shipped projects with links',
  skills: 'skills by category',
  experience: 'internships, programs, hackathons',
  contact: 'email, LinkedIn, GitHub, resume',
  clear: 'clear the screen',
  exit: 'close the terminal',
}

export function run(input: string): Line[] | 'clear' | 'exit' {
  const cmd = input.trim().toLowerCase()
  if (!cmd) return []
  switch (cmd) {
    case 'help':
      return [
        { text: 'Available commands:', tone: 'accent' },
        ...Object.entries(COMMANDS).map(([k, v]) => ({ text: `  ${k.padEnd(11)} ${v}` })),
      ]
    case 'about':
      return [
        { text: `${profile.name} — ${profile.roles}`, tone: 'accent' },
        ...about.paragraphs.map((p) => ({ text: p })),
      ]
    case 'projects':
      return mainProjects.flatMap((p) => [
        { text: `${p.index}  ${p.name} — ${p.tagline}`, tone: 'accent' as const },
        ...(p.highlight ? [{ text: `    ${p.highlight}`, tone: 'muted' as const }] : []),
        { text: '    case study →', href: `/work/${p.slug}` },
        ...(p.github ? [{ text: `    ${p.github}`, href: p.github }] : []),
      ])
    case 'skills':
      return stack.map((g) => ({ text: `${g.group.padEnd(15)} ${g.items.join(', ')}` }))
    case 'experience':
      return timeline.map((t) => ({
        text: `${t.period.padEnd(20)} ${t.org} — ${t.role}${t.start && new Date(t.start) > new Date() ? '  [upcoming]' : ''}`,
      }))
    case 'contact':
      return [
        { text: `email     ${links.email}`, href: `mailto:${links.email}` },
        { text: `linkedin  ${links.linkedin}`, href: links.linkedin },
        { text: `github    ${links.github}`, href: links.github },
        { text: 'resume    download PDF', href: links.resume },
      ]
    case 'clear':
      return 'clear'
    case 'exit':
    case 'quit':
      return 'exit'
    default:
      return [{ text: `command not found: ${cmd} — type "help"`, tone: 'error' }]
  }
}
