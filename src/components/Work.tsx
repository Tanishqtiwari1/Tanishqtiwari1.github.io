import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { mainProjects, type Project } from '../data/projects'
import { links } from '../data/site'
import { CountUp, Tilt } from './Effects'
import { ArrowUpRight, Ext, Magnetic, Reveal, SectionHead } from './ui'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

/** Short "key features" list built from the case study's how-it-works titles + first clause. */
const features = (p: Project, n = 4) =>
  (p.study.howItWorks ?? []).slice(0, n).map((h) => ({ title: h.title, body: h.body.split(/[.;—]/)[0].trim() }))

function Shot({ p, priority = false }: { p: Project; priority?: boolean }) {
  return (
    <Link to={`/work/${p.slug}`} className="pj-shot" aria-label={`${p.name} case study`}>
      <span className="ft-chrome" aria-hidden="true"><i /><i /><i /><span>{p.name.toLowerCase().replace(/\s+/g, '')}</span></span>
      {p.image ? (
        <img src={asset(p.image)} alt={`${p.name} — product screenshot`} loading={priority ? 'eager' : 'lazy'} width={1400} height={875} />
      ) : (
        <span className="pj-placeholder">TODO: add a screenshot of {p.name}</span>
      )}
    </Link>
  )
}

function Links({ p, primary = false }: { p: Project; primary?: boolean }) {
  return (
    <div className="pj-actions">
      <Magnetic>
        <Link to={`/work/${p.slug}`} className={`btn ${primary ? 'btn-accent' : 'btn-primary'}`}>
          Case study <ArrowUpRight />
        </Link>
      </Magnetic>
      {p.github && <Ext href={p.github} className="btn" label={`${p.name} source code on GitHub`}>GitHub <ArrowUpRight /></Ext>}
      {p.live && <Ext href={p.live} className="btn" label={`${p.name} live demo`}>Live demo <ArrowUpRight /></Ext>}
    </div>
  )
}

/* ---------------- Hero project ---------------- */
export function Featured() {
  const p = mainProjects.find((x) => x.featured) ?? mainProjects[0]
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['6%', '-6%'])

  return (
    <section id="work" className="section theme-dark featured" aria-labelledby="work-title">
      <div className="container">
        <SectionHead
          id="work-title"
          kicker="02 — Projects"
          title="Projects"
          sub="built, shipped, measured"
          aside={`${String(mainProjects.length).padStart(2, '0')} deployed projects · every number is measured`}
        />

        <article className="ft-grid" ref={ref} aria-labelledby="ft-name">
          <div className="ft-copy">
            <Reveal className="ft-badges">
              {p.highlight && <span className="badge badge-accent">{p.highlight}</span>}
              <span className="mono">Featured · Project {p.index}</span>
            </Reveal>
            <h3 className="ft-title" id="ft-name">
              <Link to={`/work/${p.slug}`}>{p.name}</Link>
            </h3>
            <Reveal delay={0.05}><p className="ft-tag">{p.tagline}</p></Reveal>
            <Reveal delay={0.1}><p className="ft-long">{p.description}</p></Reveal>
            {p.event && <Reveal delay={0.12}><p className="mono ft-event">{p.event}{p.role ? ` · ${p.role}` : ''}</p></Reveal>}
            <Reveal delay={0.15} className="tags">{p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}</Reveal>
            <Reveal delay={0.2}><Links p={p} primary /></Reveal>
          </div>

          <motion.div className="ft-visual" style={{ y }}>
            <Tilt className="ft-frame-wrap" max={4}>
              <Shot p={p} priority />
            </Tilt>
          </motion.div>
        </article>

        <div className="ft-detail">
          {p.study.problem && (
            <Reveal className="ft-block">
              <span className="mono">Problem</span>
              <p>{p.study.problem[0]}</p>
            </Reveal>
          )}
          {p.study.solution && (
            <Reveal className="ft-block" delay={0.08}>
              <span className="mono">Solution</span>
              <p>{p.study.solution[0]}</p>
            </Reveal>
          )}
          <Reveal className="ft-block" delay={0.16}>
            <span className="mono">Key features</span>
            <ul className="pj-features">
              {features(p).map((f) => <li key={f.title}><b>{f.title}</b> — {f.body}</li>)}
            </ul>
          </Reveal>
        </div>

        {p.study.results && (
          <ul className="ft-stats" aria-label={`${p.name} results`}>
            {p.study.results.slice(0, 4).map((s, i) => (
              <Reveal as="li" key={s.label} delay={i * 0.07}>
                <CountUp value={s.value} className="v" />
                <span className="l">{s.label}</span>
                {s.how && <span className="mono">{s.how}</span>}
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

/* ---------------- Other projects: rich, scannable cards ---------------- */
export function Showcase() {
  const list = mainProjects.filter((p) => !p.featured)
  return (
    <section id="projects" className="section theme-dark pj-sec" aria-label="More projects">
      <div className="container">
        <div className="pj-head">
          <h3 className="pj-label"><span className="sq accent-bg" aria-hidden="true" /> More projects <sup>({String(list.length).padStart(2, '0')})</sup></h3>
          <Ext href={links.github} className="text-link">All repositories ↗</Ext>
        </div>
        <div className="pj-list">
          {list.map((p, i) => (
            <Reveal as="article" key={p.slug} className={`pj-card ${i % 2 ? 'flip' : ''}`} aria-labelledby={`pj-${p.slug}`}>
              <Tilt className="pj-media" max={4}>
                <Shot p={p} />
              </Tilt>
              <div className="pj-body">
                <div className="pj-meta">
                  <span className="pj-idx" aria-hidden="true">{p.index}</span>
                  <span className="mono">{[p.year, p.event].filter(Boolean).join(' · ')}</span>
                </div>
                <h3 id={`pj-${p.slug}`} className="pj-title"><Link to={`/work/${p.slug}`}>{p.name}</Link></h3>
                <p className="pj-tag">{p.tagline}</p>
                <p className="pj-desc">{p.description}</p>
                <ul className="pj-features">
                  {features(p, 3).map((f) => <li key={f.title}><b>{f.title}</b> — {f.body}</li>)}
                </ul>
                {p.stats && (
                  <dl className="pj-stats">
                    {p.stats.slice(0, 3).map((s) => (
                      <div key={s.label}><dt>{s.label}</dt><dd><CountUp value={s.value} /></dd></div>
                    ))}
                  </dl>
                )}
                <div className="tags">{p.tech.slice(0, 6).map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                <Links p={p} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
