import { useEffect, useMemo, useState } from 'react'
import { projects } from '../data/projects'
import { links } from '../data/site'
import { ArrowUpRight, Ext, Reveal, SectionHead } from './ui'

/**
 * Public GitHub data only — no tokens. Unauthenticated GitHub API allows 60 req/h per visitor IP;
 * results are cached in sessionStorage and the section degrades gracefully if a request fails.
 */
const USER = links.githubUser
/** Repos to show first, in this order. Others fill remaining slots by recent activity. */
const PINNED = ['GalliGraph', 'BlackBox', 'CardioGuard', 'Guildspace']
const MAX_REPOS = 6

type Repo = { name: string; description: string | null; html_url: string; stargazers_count: number; language: string | null; fork: boolean; pushed_at: string; size: number }
type User = { avatar_url: string; public_repos: number; followers: number; name: string | null; html_url: string }
type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }
type Contrib = { total: Record<string, number>; contributions: Day[] }

/** Shown if the GitHub API is unreachable or rate-limited, so the section never breaks. */
const FALLBACK: Repo[] = [
  { name: 'GalliGraph', language: 'TypeScript' },
  { name: 'BlackBox', language: 'Python' },
  { name: 'CardioGuard', language: 'JavaScript' },
  { name: 'Guildspace', language: 'JavaScript' },
].map((r) => ({ ...r, description: null, html_url: `https://github.com/${USER}/${r.name}`, stargazers_count: 0, fork: false, pushed_at: '', size: 1 }))

function ago(iso: string) {
  if (!iso) return ''
  const d = (Date.now() - new Date(iso).getTime()) / 86400000
  if (d < 1) return 'updated today'
  if (d < 30) return `updated ${Math.round(d)}d ago`
  if (d < 365) return `updated ${Math.round(d / 30)}mo ago`
  return `updated ${Math.round(d / 365)}y ago`
}

async function cached<T>(key: string, url: string): Promise<T> {
  const hit = sessionStorage.getItem(key)
  if (hit) return JSON.parse(hit) as T
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 8000)
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' }, signal: ctrl.signal }).finally(() => clearTimeout(timer))
  if (!res.ok) throw new Error(`${res.status}`)
  const data = (await res.json()) as T
  try { sessionStorage.setItem(key, JSON.stringify(data)) } catch { /* quota */ }
  return data
}

const LEVELS = ['rgba(255,255,255,.07)', 'rgba(255,79,0,.3)', 'rgba(255,79,0,.55)', 'rgba(255,79,0,.8)', '#ff4f00']
const LANG_COLORS: Record<string, string> = { TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572A5', 'Jupyter Notebook': '#DA5B0B', HTML: '#e34c26', CSS: '#663399', Java: '#b07219', 'C++': '#f34b7d' }
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
/** Fallback description: project tagline if it's one of the portfolio projects, else the repo name in words. */
const describe = (r: { name: string; description: string | null }) =>
  r.description || projects.find((p) => norm(p.name) === norm(r.name))?.tagline || r.name.replace(/[-_]+/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

function ContributionGraph({ days }: { days: Day[] }) {
  const weeks = useMemo(() => {
    const out: (Day | null)[][] = []
    if (!days.length) return out
    const pad = new Date(days[0].date).getUTCDay()
    let week: (Day | null)[] = Array(pad).fill(null)
    days.forEach((d) => {
      week.push(d)
      if (week.length === 7) { out.push(week); week = [] }
    })
    if (week.length) out.push(week)
    return out
  }, [days])

  const cell = 11, gap = 3
  const w = weeks.length * (cell + gap)
  const h = 7 * (cell + gap) + 16
  const months: { x: number; label: string }[] = []
  weeks.forEach((wk, i) => {
    const first = wk.find(Boolean)
    if (!first) return
    const d = new Date(first.date)
    if (d.getUTCDate() <= 7) months.push({ x: i * (cell + gap), label: d.toLocaleString('en', { month: 'short', timeZone: 'UTC' }) })
  })

  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="GitHub contribution graph for the last year">
      {months.map((m) => (
        <text key={m.x} x={m.x} y={9} fill="#8e8d88" fontSize="9" fontFamily="JetBrains Mono Variable, monospace">{m.label}</text>
      ))}
      {weeks.map((wk, i) =>
        wk.map((d, j) =>
          d ? (
            <rect key={d.date} x={i * (cell + gap)} y={16 + j * (cell + gap)} width={cell} height={cell} rx={2} fill={LEVELS[d.level]}>
              <title>{`${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`}</title>
            </rect>
          ) : null,
        ),
      )}
    </svg>
  )
}

export default function GitHub() {
  const [user, setUser] = useState<User | null>(null)
  const [repos, setRepos] = useState<Repo[] | null>(null)
  const [contrib, setContrib] = useState<Contrib | null>(null)
  const [failed, setFailed] = useState({ repos: false, contrib: false })

  useEffect(() => {
    cached<User>('gh-user', `https://api.github.com/users/${USER}`).then(setUser).catch(() => {})
    cached<Repo[]>('gh-repos', `https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`)
      .then((all) => {
        // Skip forks, empty repos and this site's own repo — only meaningful work.
        const own = all.filter((r) => !r.fork && r.size > 0 && r.name.toLowerCase() !== `${USER}.github.io`.toLowerCase())
        const pinned = PINNED.map((n) => own.find((r) => r.name.toLowerCase() === n.toLowerCase())).filter(Boolean) as Repo[]
        const others = own.filter((r) => !pinned.includes(r))
        setRepos([...pinned, ...others].slice(0, MAX_REPOS))
      })
      .catch(() => setFailed((f) => ({ ...f, repos: true })))
    cached<Contrib>('gh-contrib', `https://github-contributions-api.jogruber.de/v4/${USER}?y=last`)
      .then(setContrib)
      .catch(() => setFailed((f) => ({ ...f, contrib: true })))
  }, [])

  const total = contrib ? Object.values(contrib.total)[0] : null

  return (
    <section id="github" className="section" aria-labelledby="gh-title">
      <div className="container">
        <SectionHead id="gh-title" kicker="06 — GitHub" title="Building" sub="in public" aside={<Ext href={links.github} className="btn btn-primary">View GitHub <ArrowUpRight /></Ext>} />

        <Reveal className="gh-top">
          <div className="gh-profile">
            {user && <img src={user.avatar_url} alt="GitHub avatar of Tanishq Tewari" width={52} height={52} loading="lazy" />}
            <div>
              <div style={{ fontWeight: 500 }}>{user?.name || 'Tanishq Tewari'}</div>
              <div className="mono" style={{ textTransform: 'none' }}>github.com/{USER}</div>
            </div>
          </div>
          <div className="gh-stats">
            {user && (
              <div><b>{user.public_repos}</b><span className="mono">Public repos</span></div>
            )}
            {total != null && (
              <div><b>{total}</b><span className="mono">Contributions · last year</span></div>
            )}
          </div>
        </Reveal>

        <Reveal className="gh-graph gh-dark" delay={0.05}>
          {contrib ? (
            <ContributionGraph days={contrib.contributions} />
          ) : failed.contrib ? (
            <p className="mono" style={{ padding: '2rem 0' }}>Contribution graph unavailable right now — <Ext href={links.github} className="text-link">view on GitHub</Ext></p>
          ) : (
            <div className="skeleton" style={{ height: 112 }} aria-label="Loading contribution graph" />
          )}
          <div className="gh-graph-foot">
            <span className="mono">Public contribution activity</span>
            <span className="gh-legend mono" aria-hidden="true">
              Less {LEVELS.map((c) => <i key={c} style={{ background: c }} />)} More
            </span>
          </div>
        </Reveal>

        {failed.repos && <p className="mono gh-note" role="status">Couldn’t reach GitHub just now — showing the saved list of featured repositories.</p>}
        <ul className="gh-repos" aria-busy={!repos && !failed.repos}>
          {(repos ?? (failed.repos ? FALLBACK : null))
            ? (repos ?? FALLBACK).map((r, i) => (
                <Reveal as="li" key={r.name} delay={i * 0.05}>
                  <Ext href={r.html_url} className="gh-repo" label={`${r.name} repository on GitHub`}>
                    <span className="gh-top">
                      <span className="gh-idx">{String(i + 1).padStart(2, '0')}</span>
                      <span className="gh-arrow" aria-hidden="true"><ArrowUpRight size={16} /></span>
                    </span>
                    <span className="name">{r.name.replace(/[-_]+/g, ' ')}</span>
                    <span className="d">{describe(r)}</span>
                    <span className="m mono">
                      {r.language && <span className="lang"><i style={{ background: LANG_COLORS[r.language] ?? '#ff4f00' }} />{r.language}</span>}
                      {r.stargazers_count > 0 && <span>★ {r.stargazers_count}</span>}
                      {r.pushed_at && <span>{ago(r.pushed_at)}</span>}
                    </span>
                  </Ext>
                </Reveal>
              ))
            : Array.from({ length: 3 }, (_, i) => <li key={i} className="skeleton" style={{ height: 160 }} />)}
        </ul>
      </div>
    </section>
  )
}
