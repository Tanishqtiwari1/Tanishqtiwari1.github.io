import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { mainProjects, type Project } from '../data/projects'
import { links } from '../data/site'
import { CountUp, Scramble, Tilt } from './Effects'
import { ArrowUpRight, EASE, Ext, Magnetic, Reveal, SectionHead } from './ui'

const asset = (p: string) => `${import.meta.env.BASE_URL}${p}`

/* ---------------- Highlight project (Black Box) ---------------- */
function PipelineTicker({ steps }: { steps: string[] }) {
  const [i, setI] = useState(0)
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setI((v) => (v + 1) % steps.length), 1100)
    return () => clearInterval(id)
  }, [reduce, steps.length])
  return (
    <ol className="ticker" aria-label={steps.join(' → ')}>
      {steps.map((s, k) => (
        <Fragment key={s}>
          {k > 0 && <span className="ticker-sep" aria-hidden="true">→</span>}
          <li className={k === i ? 'on' : k < i ? 'done' : ''}>{s}</li>
        </Fragment>
      ))}
    </ol>
  )
}

export function Featured() {
  const p = mainProjects.find((x) => x.featured)!
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [4, 0, -2])

  return (
    <section id="work" className="section theme-dark featured" aria-labelledby="work-title">
      <div className="container">
        <SectionHead id="work-title" kicker="03 — Selected work" title="Work" sub="the highlight reel" aside={`${String(mainProjects.length).padStart(2, '0')} shipped projects · AI/ML · Full stack`} />

        <div className="ft-grid" ref={ref}>
          <div className="ft-copy">
            <Reveal className="ft-badges">
              <span className="badge badge-accent">{p.highlight}</span>
              {p.event && <span className="mono">{p.event}</span>}
            </Reveal>
            <h3 className="ft-title">
              <Link to={`/work/${p.slug}`} data-cursor="Read">
                <Scramble text={p.name} trigger="both" />
              </Link>
            </h3>
            <Reveal delay={0.05}><p className="ft-tag">{p.tagline}</p></Reveal>
            <Reveal delay={0.1}><p className="ft-long">{p.long}</p></Reveal>
            <Reveal delay={0.15}>
              <PipelineTicker steps={['Detect', 'Explain', 'Replay', 'Repair', 'Verify']} />
            </Reveal>
            <Reveal delay={0.2} className="tags">{p.tech.map((t) => <span className="tag" key={t}>{t}</span>)}</Reveal>
            <Reveal delay={0.25} className="ft-actions">
              <Magnetic><Link to={`/work/${p.slug}`} className="btn btn-accent">Read the case study <ArrowUpRight /></Link></Magnetic>
              {p.github && <Magnetic><Ext href={p.github} className="btn">GitHub <ArrowUpRight /></Ext></Magnetic>}
              {p.live && <Magnetic><Ext href={p.live} className="btn">Live demo <ArrowUpRight /></Ext></Magnetic>}
            </Reveal>
          </div>

          <motion.div className="ft-visual" style={{ y, rotate }}>
            <Tilt className="ft-frame-wrap" max={6}>
              <Link to={`/work/${p.slug}`} className="ft-frame" data-cursor="View">
                <span className="ft-chrome" aria-hidden="true"><i /><i /><i /><span>blackbox · flight recorder</span></span>
                <img src={asset(p.image!)} alt={`${p.name} — landing page showing a failed agent run and its root cause`} loading="lazy" width={1400} height={875} />
              </Link>
            </Tilt>
            <span className="ft-sticker" aria-hidden="true">GNN<br />93.1%</span>
          </motion.div>
        </div>

        {p.stats && (
          <ul className="ft-stats">
            {p.stats.map((s, i) => (
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

/* ---------------- Showcase: the other projects, scroll-driven ---------------- */
const TILT = [-3, 2.5, -1.5, 3, -2.5, 1.5]

function ShowcaseCard({ p }: { p: Project }) {
  return (
    <Link to={`/work/${p.slug}`} className="sc-card" aria-label={`${p.name} — open case study`} data-cursor="Open">
      {p.image ? (
        <img src={asset(p.image)} alt={`Screenshot of ${p.name}`} loading="lazy" width={1280} height={860} />
      ) : (
        <div className="sc-type">
          <span className="big">{p.index}</span>
          <div>
            <div className="nm">{p.name}</div>
            <div className="tg">{p.tech.join(' · ')}</div>
          </div>
        </div>
      )}
      <span className="chip"><i>{p.index}</i>{p.name}</span>
      <span className="corner">{p.year ?? 'Archive'}</span>
    </Link>
  )
}

export function Showcase() {
  const list = mainProjects.filter((p) => !p.featured)
  const track = useRef<HTMLDivElement>(null)
  const [i, setI] = useState(0)
  const n = list.length
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setI(Math.min(n - 1, Math.max(0, Math.floor(v * n)))))
  const p = list[i]

  return (
    <section id="projects" className="showcase theme-dark" aria-labelledby="projects-title">
      <div ref={track} className="showcase-track" style={{ height: `${n * 80 + 100}svh` }}>
        <div className="showcase-sticky">
          <div className="sc-left">
            <h2 id="projects-title" className="sc-label">
              <span className="sq accent-bg" aria-hidden="true" /> More projects <sup>({String(n).padStart(2, '0')})</sup>
            </h2>
            <ol className="sc-index" aria-label="Projects">
              {list.map((x, k) => (
                <li key={x.slug}>
                  <Link to={`/work/${x.slug}`} className={k === i ? 'on' : ''}>
                    <span className="n">{x.index}</span>{x.name}
                  </Link>
                </li>
              ))}
            </ol>
            <span className="mono" aria-hidden="true">({String(i + 1).padStart(2, '0')}—{String(n).padStart(2, '0')}) scroll ↓</span>
          </div>

          <div className="sc-stage">
            <AnimatePresence initial={false}>
              <motion.div
                key={p.slug}
                style={{ position: 'absolute', inset: 0 }}
                initial={{ opacity: 0, y: 120, rotate: TILT[i % TILT.length] * 3, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, rotate: TILT[i % TILT.length], scale: 1 }}
                exit={{ opacity: 0, y: -120, rotate: -TILT[i % TILT.length] * 3, scale: 0.9 }}
                transition={{ duration: 0.7, ease: EASE }}
              >
                <Tilt className="sc-tilt" max={7}><ShowcaseCard p={p} /></Tilt>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="sc-right">
            <Ext href={links.github} className="text-link">All repositories ↗</Ext>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={p.slug}
                className="sc-info"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.3, ease: EASE }}
                aria-live="polite"
              >
                <span className="mono">Project {p.index}{p.year ? ` · ${p.year}` : ''}</span>
                <h3>{p.name}</h3>
                <p className="tagline">{p.tagline}</p>
                {p.highlight && <span className="badge badge-accent">{p.highlight}</span>}
                <p className="sc-desc">{p.description}</p>
                {p.stats && (
                  <div className="sc-stats">
                    {p.stats.map((s) => <span key={s.label}><b>{s.value}</b>{s.label}</span>)}
                  </div>
                )}
                <div className="actions">
                  <Link to={`/work/${p.slug}`} className="btn btn-sm btn-accent">Case study <ArrowUpRight /></Link>
                  {p.github && <Ext href={p.github} className="btn btn-sm" label={`${p.name} on GitHub`}>GitHub</Ext>}
                  {p.live && <Ext href={p.live} className="btn btn-sm" label={`${p.name} live demo`}>Live</Ext>}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="sc-progress" aria-hidden="true">
              {list.map((x, k) => <i key={x.slug} className={k === i ? 'on' : ''} />)}
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}
