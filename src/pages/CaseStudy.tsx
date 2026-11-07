import { motion } from 'framer-motion'
import { Fragment, type ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CountUp } from '../components/Effects'
import { ArrowLeft, ArrowUpRight, EASE, Ext, Magnetic, Reveal } from '../components/ui'
import { getProject, projects, type FlowNode } from '../data/projects'
import { links } from '../data/site'
import { useTitle } from '../hooks/useTitle'
import NotFound from './NotFound'

function Diagram({ nodes, caption, label }: { nodes: FlowNode[]; caption: string; label: string }) {
  return (
    <figure className="diagram" aria-label={label}>
      <ol>
        {nodes.map((n, i) => (
          <Fragment key={n.label}>
            <motion.li
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: EASE, delay: i * 0.07 }}
            >
              {i > 0 && <span className="edge" aria-hidden="true" />}
              <span className="node">
                <span className="l">{n.label}</span>
                {n.sub && <span className="s">{n.sub}</span>}
              </span>
            </motion.li>
          </Fragment>
        ))}
      </ol>
      <figcaption>{caption}</figcaption>
    </figure>
  )
}

function Block({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="cs-section" aria-label={title}>
      <h2><span className="n">{String(n).padStart(2, '0')}</span>{title}</h2>
      <Reveal>{children}</Reveal>
    </section>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const p = getProject(slug)
  useTitle(p ? `${p.name} — Case study · Tanishq Tewari` : '404 — Tanishq Tewari', p?.description)
  if (!p) return <NotFound />

  const s = p.study
  const idx = projects.indexOf(p)
  const next = projects[(idx + 1) % projects.length]
  const isPartial = !s.howItWorks && !s.results && !s.gallery

  // Build sections in the fixed narrative order; skip what has no real content.
  const blocks: { title: string; node: ReactNode }[] = []
  if (s.problem) blocks.push({ title: 'Problem', node: <div className="cs-prose">{s.problem.map((t) => <p key={t}>{t}</p>)}</div> })
  if (s.solution) blocks.push({ title: 'Solution', node: <div className="cs-prose">{s.solution.map((t) => <p key={t}>{t}</p>)}</div> })
  if (s.howItWorks)
    blocks.push({
      title: 'How it works',
      node: (
        <div className="cs-cards">
          {s.howItWorks.map((h, i) => (
            <div className="cs-card" key={h.title}>
              <span className="mono">{String(i + 1).padStart(2, '0')}</span>
              <h3>{h.title}</h3>
              <p>{h.body}</p>
            </div>
          ))}
        </div>
      ),
    })
  if (s.architecture) blocks.push({ title: 'Architecture', node: <Diagram label="System architecture" {...s.architecture} /> })
  if (s.pipeline) blocks.push({ title: 'AI/ML pipeline', node: <Diagram label="AI/ML pipeline" {...s.pipeline} /> })
  if (s.gallery)
    blocks.push({
      title: 'Gallery',
      node: (
        <div className="cs-gallery">
          {s.gallery.map((g) => (
            <figure key={g.src} className={g.wide ? 'wide' : ''}>
              <div className="cs-shot">
                <motion.img
                  src={`${import.meta.env.BASE_URL}${g.src}`}
                  alt={g.caption}
                  loading="lazy"
                  initial={{ scale: 1.12 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: EASE }}
                />
              </div>
              <figcaption>{g.caption}</figcaption>
            </figure>
          ))}
        </div>
      ),
    })
  if (s.stack)
    blocks.push({
      title: 'Technology stack',
      node: (
        <div className="cs-stack">
          {s.stack.map((g) => (
            <div className="cs-stack-row" key={g.group}>
              <span className="mono">{g.group}</span>
              <div className="tags">{g.items.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
            </div>
          ))}
        </div>
      ),
    })
  if (s.challenges) blocks.push({ title: 'Challenges', node: <ul className="cs-list">{s.challenges.map((t) => <li key={t}>{t}</li>)}</ul> })
  if (s.learned) blocks.push({ title: 'What I learned', node: <ul className="cs-list">{s.learned.map((t) => <li key={t}>{t}</li>)}</ul> })
  if (s.results)
    blocks.push({
      title: 'Results',
      node: (
        <>
          <div className="cs-metrics">
            {s.results.map((m) => (
              <div className="cs-metric" key={m.label}>
                <CountUp value={m.value} className="v" />
                <span className="l">{m.label}</span>
                {m.how && <span className="mono" style={{ textTransform: 'none' }}>{m.how}</span>}
              </div>
            ))}
          </div>
          {s.resultsNote && <p className="mono" style={{ marginTop: '1rem', textTransform: 'none' }}>{s.resultsNote}</p>}
        </>
      ),
    })

  return (
    <article>
      <header className="cs-hero theme-dark">
        <div className="container">
          <Link to="/#work" className="cs-back text-link"><ArrowLeft /> All work</Link>
          <motion.p className="mono" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            Case study · Project {p.index}
          </motion.p>
          <h1 style={{ overflow: 'hidden', paddingBottom: '0.05em' }}>
            <motion.span style={{ display: 'inline-block' }} initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease: EASE }}>
              {p.name}<span className="accent">.</span>
            </motion.span>
          </h1>
          <motion.p className="tagline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}>
            {p.tagline}
          </motion.p>
          {p.highlight && <p className="badge" style={{ marginTop: '1.5rem' }}>{p.highlight}</p>}

          <motion.dl className="cs-meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            {p.role && <div><dt className="mono">Role</dt><dd>{p.role}</dd></div>}
            <div><dt className="mono">Year</dt><dd>{p.year ?? '—'}</dd></div>
            {p.event && <div><dt className="mono">Built at</dt><dd>{p.event}</dd></div>}
            <div><dt className="mono">Focus</dt><dd>{p.tech.slice(0, 3).join(', ')}</dd></div>
            <div><dt className="mono">Status</dt><dd>{p.live ? 'Live' : p.archive ? 'Write-up in progress' : 'Source on GitHub'}</dd></div>
          </motion.dl>

          <div className="cs-actions">
            {p.github && <Magnetic><Ext href={p.github} className="btn btn-primary">GitHub <ArrowUpRight /></Ext></Magnetic>}
            {p.live && <Magnetic><Ext href={p.live} className="btn">Live demo <ArrowUpRight /></Ext></Magnetic>}
          </div>
          {p.image && (
            <motion.div
              className="cs-cover"
              initial={{ opacity: 0, y: 80, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1, ease: EASE, delay: 0.35 }}
            >
              <span className="ft-chrome" aria-hidden="true"><i /><i /><i /><span>{p.name.toLowerCase()}</span></span>
              <img src={`${import.meta.env.BASE_URL}${p.image}`} alt={`${p.name} screenshot`} width={1400} height={875} />
            </motion.div>
          )}
        </div>
      </header>

      <div className="container">
        <section className="cs-section" aria-label="Overview">
          <h2><span className="n">00</span>Overview</h2>
          <Reveal className="cs-prose">
            <p>{p.description}</p>
            {p.long && <p>{p.long}</p>}
          </Reveal>
        </section>

        {blocks.map((b, i) => (
          <Block key={b.title} n={i + 1} title={b.title}>{b.node}</Block>
        ))}

        {isPartial && (
          <section className="cs-section" aria-label="More coming">
            <h2><span className="n">··</span>More soon</h2>
            <Reveal className="cs-placeholder">
              <span className="badge">In progress</span>
              <span>The full case study — architecture, challenges and results — is being written up.</span>
              <a href={`mailto:${links.email}?subject=${encodeURIComponent(p.name)}`} className="text-link">Ask me about it →</a>
            </Reveal>
          </section>
        )}
      </div>

      <Link to={`/work/${next.slug}`} className="cs-next">
        <div className="container">
          <span className="mono">Next project · {next.index}</span>
          <div className="t">{next.name} →</div>
        </div>
      </Link>
    </article>
  )
}
