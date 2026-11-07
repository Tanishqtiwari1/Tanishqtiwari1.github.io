import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { resume } from '../data/resume'
import { links, profile } from '../data/site'
import { ArrowUpRight, EASE, Ext, Magnetic, Reveal, SectionHead } from './ui'

type View = 'web' | 'pdf'

export default function Resume() {
  const [view, setView] = useState<View>('web')

  return (
    <section id="resume" className="section theme-dark" aria-labelledby="resume-title">
      <div className="container">
        <SectionHead id="resume-title" kicker="09 — Resume" title="Resume" sub="the one-pager, right here" aside={`Updated · ${resume.updated}`} />

        <div className="rs-bar">
          <div className="rs-toggle" role="tablist" aria-label="Resume view">
            {(['web', 'pdf'] as View[]).map((v) => (
              <button key={v} role="tab" aria-selected={view === v} aria-controls="rs-panel" onClick={() => setView(v)} className={view === v ? 'on' : ''}>
                {view === v && <motion.span layoutId="rs-pill" className="rs-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{v === 'web' ? 'Web view' : 'PDF view'}</span>
              </button>
            ))}
          </div>
          <div className="rs-actions">
            <Magnetic><a href={links.resume} download className="btn btn-accent">Download PDF ↓</a></Magnetic>
            <Magnetic><Ext href={links.resume} className="btn">Open in new tab <ArrowUpRight /></Ext></Magnetic>
          </div>
        </div>

        <div id="rs-panel" role="tabpanel">
          <AnimatePresence mode="wait" initial={false}>
            {view === 'web' ? (
              <motion.article
                key="web"
                className="paper"
                initial={{ opacity: 0, y: 40, rotate: -0.6 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                <header className="paper-head">
                  <div>
                    <h3>{profile.name}</h3>
                    <p>{profile.title} · {profile.location}</p>
                  </div>
                  <div className="paper-links">
                    <a href={`mailto:${links.email}`}>{links.email}</a>
                    <Ext href={links.linkedin}>linkedin.com/in/tanishqtiwari-aiml</Ext>
                    <Ext href={links.github}>github.com/{links.githubUser}</Ext>
                  </div>
                </header>

                <div className="paper-body">
                  <div className="paper-main">
                    <Reveal className="paper-sec">
                      <h4>Summary</h4>
                      <p>{resume.summary}</p>
                    </Reveal>

                    <Reveal className="paper-sec">
                      <h4>Projects</h4>
                      {resume.projects.map((pr) => (
                        <div className="paper-item" key={pr.name}>
                          <div className="row">
                            <Link to={`/work/${pr.slug}`} className="t">{pr.name} ↗</Link>
                            <span className="m">{pr.meta}</span>
                          </div>
                          <p className="tech">{pr.tech}</p>
                          <ul>{pr.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
                        </div>
                      ))}
                    </Reveal>
                  </div>

                  <aside className="paper-side">
                    <Reveal className="paper-sec">
                      <h4>Education</h4>
                      {resume.education.map((e) => (
                        <div className="paper-item" key={e.school}>
                          <p className="t">{e.school}</p>
                          <p>{e.degree}</p>
                          <p className="m">{e.period}</p>
                          <p className="small">{e.note}</p>
                        </div>
                      ))}
                    </Reveal>
                    <Reveal className="paper-sec">
                      <h4>Achievements</h4>
                      <ul>{resume.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
                    </Reveal>
                    <Reveal className="paper-sec">
                      <h4>Skills</h4>
                      <dl className="paper-skills">
                        {resume.skills.map((s) => (
                          <div key={s.k}><dt>{s.k}</dt><dd>{s.v}</dd></div>
                        ))}
                      </dl>
                    </Reveal>
                  </aside>
                </div>
              </motion.article>
            ) : (
              <motion.div
                key="pdf"
                className="pdf-wrap"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <object data={`${links.resume}#view=FitH`} type="application/pdf" aria-label="Resume PDF" className="pdf-obj">
                  <div className="pdf-fallback">
                    <p>Your browser can’t show the PDF inline.</p>
                    <Ext href={links.resume} className="btn btn-accent">Open the PDF <ArrowUpRight /></Ext>
                  </div>
                </object>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
