import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { about, beyond, featuredPost, hackathons, highlights, links, now, profile, stack, timeline } from '../data/site'
import { CountUp, ScrollWords, SpinBadge, Tilt } from './Effects'
import { ArrowUpRight, EASE, Ext, FitText, Magnetic, Plus, Reveal, SectionHead, SplitText } from './ui'

/* ---------------- About ---------------- */
export function About() {
  const [lead, ...rest] = about.paragraphs
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container">
        <SectionHead id="about-title" kicker="01 — About" title="About me" sub="who I am" />
        <div className="about-grid">
          <div>
            <Reveal as="div">
              <ScrollWords className="about-lead" text={lead} />
            </Reveal>
            <div className="about-body">
              {rest.map((p, i) => (
                <Reveal key={i} delay={0.1 + i * 0.08}>
                  <p>{p}</p>
                </Reveal>
              ))}
            </div>
            <Reveal className="flow" delay={0.2} aria-label="How I work: problem to deployment">
              {about.pipeline.map((s, i) => (
                <Fragment key={s}>
                  {i > 0 && <span className="sep" aria-hidden="true">→</span>}
                  <span className="step">{s}</span>
                </Fragment>
              ))}
            </Reveal>
          </div>

          <Reveal className="panel spot" delay={0.15}>
            <div className="panel-head">
              <span className="mono">~/currently</span>
              <span className="lights" aria-hidden="true"><i /><i /><i /></span>
            </div>
            {about.currently.map((r) => (
              <div className="panel-row" key={r.label}>
                <span className="mono">{r.label}</span>
                <div>
                  <div className="v">{r.value}</div>
                  {r.sub && <div className="s">{r.sub}</div>}
                </div>
              </div>
            ))}
            <div className="panel-row">
              <span className="mono">Based</span>
              <div className="v">{profile.location}</div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Experience / chronology ---------------- */
function HoverPreview({ src, alt, x, y }: { src: string | null; alt: string; x: MotionValue<number>; y: MotionValue<number> }) {
  const sx = useSpring(x, { stiffness: 260, damping: 26 })
  const sy = useSpring(y, { stiffness: 260, damping: 26 })
  return (
    <AnimatePresence>
      {src && (
        <motion.div
          key={src}
          className="tl-preview"
          style={{ x: sx, y: sy }}
          initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: -3 }}
          exit={{ opacity: 0, scale: 0.6, rotate: 6 }}
          transition={{ duration: 0.35, ease: EASE }}
          aria-hidden="true"
        >
          <img src={`${import.meta.env.BASE_URL}${src}`} alt={alt} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Experience() {
  const firstWithPhoto = timeline.findIndex((t) => t.image)
  const [open, setOpen] = useState<number | null>(firstWithPhoto >= 0 ? firstWithPhoto : 0)
  const [hover, setHover] = useState<number | null>(null)
  const today = new Date()
  const listRef = useRef<HTMLOListElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const fine = typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const onMove = (e: React.PointerEvent) => {
    const r = listRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set(e.clientX - r.left + 60)
    my.set(e.clientY - r.top - 150)
  }
  const preview = hover != null && hover !== open && fine ? timeline[hover].image : undefined

  return (
    <section id="experience" className="section" aria-labelledby="exp-title">
      <div className="container">
        <SectionHead id="exp-title" kicker="03 — Experience" title="Experience" sub="the timeline" aside="Hover for photos · click to expand" />
        <ol className="timeline" ref={listRef} onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          <HoverPreview src={preview?.src ?? null} alt="" x={mx} y={my} />
          {timeline.map((t, i) => {
            const isOpen = open === i
            const upcoming = t.start && new Date(t.start) > today
            const panelId = `tl-panel-${i}`
            return (
              <Reveal as="li" className={`tl-item ${isOpen ? 'is-open' : ''}`} key={t.org + t.role} delay={i * 0.05}>
                <button
                  className="tl-button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onPointerEnter={() => setHover(i)}
                >
                  <span className="tl-date mono">{t.period}</span>
                  <span>
                    <span className="tl-org" style={{ display: 'block' }}>
                      <span className="tl-org-text">{t.org}</span>
                      {t.image && <span className="tl-cam" aria-label="has photo">●</span>}
                    </span>
                    <span className="tl-role">
                      {t.role}
                      {upcoming && <span className="badge">Upcoming</span>}
                      {t.meta && <span className="mono" style={{ textTransform: 'none' }}>· {t.meta}</span>}
                    </span>
                  </span>
                  <span className="tl-kind mono">{t.kind}</span>
                  <span className="tl-toggle" aria-hidden="true"><Plus /></span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      className="tl-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                    >
                      <div className={`tl-panel-inner ${t.image ? 'has-photo' : ''}`}>
                        <span />
                        <div>
                          <ul>
                            {t.details.map((d, k) => (
                              <motion.li key={d} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + k * 0.07, ease: EASE }}>{d}</motion.li>
                            ))}
                          </ul>
                          <div className="tags" style={{ marginTop: '1.25rem' }}>
                            {t.tags.map((x, k) => (
                              <motion.span className="tag" key={x} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + k * 0.05 }}>{x}</motion.span>
                            ))}
                          </div>
                        </div>
                        {t.image && (
                          <motion.figure
                            className="tl-photo"
                            initial={{ clipPath: 'inset(0 0 100% 0)', rotate: 2 }}
                            animate={{ clipPath: 'inset(0 0 0% 0)', rotate: 0 }}
                            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
                          >
                            <motion.img
                              src={`${import.meta.env.BASE_URL}${t.image.src}`}
                              alt={t.image.alt}
                              loading="lazy"
                              initial={{ scale: 1.25 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 1.2, ease: EASE }}
                            />
                          </motion.figure>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/* ---------------- Skills: every category visible at once ---------------- */
export function Stack() {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="container">
        <SectionHead id="stack-title" kicker="04 — Skills" title="Skills" sub="what I build with" aside="Only what I've used in shipped work" />
        <ul className="skills">
          {stack.map((g, gi) => (
            <Reveal as="li" key={g.group} className="skill-card spot" delay={gi * 0.06}>
              <div className="skill-head">
                <span className="mono">{String(gi + 1).padStart(2, '0')}</span>
                <h3>{g.group}</h3>
                <span className="skill-count mono">{g.items.length}</span>
              </div>
              <p className="skill-note">{g.note}</p>
              <ul className="skill-chips" aria-label={`${g.group} skills`}>
                {g.items.map((it) => <li key={it}>{it}</li>)}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Instagram feature (local recreation, no external links) ---------------- */
const IgIcon = {
  heart: (filled: boolean) => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.6 2.6.2.3.6.3.8 0 1-1.5 2.5-2.6 4.6-2.6 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill={filled ? '#ff3040' : 'none'} stroke={filled ? '#ff3040' : 'currentColor'} strokeWidth="1.8" />
    </svg>
  ),
  comment: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M20.7 16.5A9 9 0 1 0 17 20.3L21.5 21.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M22 3L9.2 10.1M22 3l-6.8 18-3.4-7.7L4 9.8z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
  ),
  save: (filled: boolean) => (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true"><path d="M19 21l-7-5.5L5 21V3h14z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" /></svg>
  ),
}

function InstaFeature() {
  const p = featuredPost
  const n = p.slides.length
  const [idx, setIdx] = useState(p.mySlide - 1)
  const [dir, setDir] = useState(1)
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [burst, setBurst] = useState(0)
  const [copied, setCopied] = useState(false)

  const go = (to: number) => {
    const next = Math.max(0, Math.min(n - 1, to))
    if (next === idx) return
    setDir(next > idx ? 1 : -1)
    setIdx(next)
  }
  const like = () => { setLiked(true); setBurst((b) => b + 1) }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(idx + 1) }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(idx - 1) }
  }
  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.origin + '/#achievements') } catch { /* ignore */ }
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="ig">
      <Reveal className="ig-copy">
        <span className="ig-chip"><span className="ig-logo" aria-hidden="true" />Featured on Instagram</span>
        <h4 className="ig-title">{p.title}</h4>
        <blockquote className="ig-quote">“{p.quote}”<cite>— @{p.account}</cite></blockquote>
        <p className="ig-note">{p.note}</p>
        <div className="ig-actions">
          <Magnetic>
            <button className="btn btn-accent" onClick={() => go(p.mySlide - 1)}>
              Show my slide <span aria-hidden="true">→</span>
            </button>
          </Magnetic>
          <span className="mono ig-hint">Swipe · ← → keys · double-tap to like</span>
        </div>
      </Reveal>

      <motion.div
        className="ig-phone"
        initial={{ opacity: 0, y: 80, rotate: 6 }}
        whileInView={{ opacity: 1, y: 0, rotate: 2 }}
        whileHover={{ rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <article className="ig-post" aria-label={`Instagram post by @${p.account}, slide ${idx + 1} of ${n}`}>
          <header className="ig-head">
            <span className="ig-avatar"><img src={`${import.meta.env.BASE_URL}${p.avatar}`} alt="" width={32} height={32} /></span>
            <span className="ig-user">
              <b>{p.account}</b>
              <small>{p.followers}</small>
            </span>
            <span className="ig-follow" aria-hidden="true">View profile</span>
          </header>

          <div className="ig-media" tabIndex={0} onKeyDown={onKey} onDoubleClick={like} role="group" aria-roledescription="carousel" aria-label="Post photos">
            <AnimatePresence initial={false} custom={dir}>
              <motion.img
                key={idx}
                src={`${import.meta.env.BASE_URL}${p.slides[idx]}`}
                alt={idx === p.mySlide - 1 ? 'Team Codestorm receiving the OFFGRID 2nd Position award on stage at TechIdeate 2026' : `TechIdeate 2026 award ceremony, photo ${idx + 1}`}
                custom={dir}
                variants={{
                  enter: (d: number) => ({ x: `${d * 100}%`, opacity: 0.4 }),
                  center: { x: 0, opacity: 1 },
                  exit: (d: number) => ({ x: `${d * -100}%`, opacity: 0.4 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.45, ease: EASE }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) go(idx + 1)
                  else if (info.offset.x > 60 || info.velocity.x > 400) go(idx - 1)
                }}
                draggable={false}
              />
            </AnimatePresence>
            <span className="ig-count">{idx + 1}/{n}</span>
            {idx === p.mySlide - 1 && (
              <motion.span className="ig-me" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 18 }}>
                That’s me 👋
              </motion.span>
            )}
            {idx > 0 && <button className="ig-nav prev" onClick={() => go(idx - 1)} aria-label="Previous photo">‹</button>}
            {idx < n - 1 && <button className="ig-nav next" onClick={() => go(idx + 1)} aria-label="Next photo">›</button>}
            <AnimatePresence>
              {burst > 0 && (
                <motion.span
                  key={burst}
                  className="ig-burst"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.25, 1], opacity: [0, 1, 1, 0] }}
                  transition={{ duration: 0.9, times: [0, 0.3, 0.6, 1] }}
                  onAnimationComplete={() => setBurst(0)}
                  aria-hidden="true"
                >
                  {IgIcon.heart(true)}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="ig-bar">
            <motion.button whileTap={{ scale: 0.75 }} className={`ig-btn ${liked ? 'liked' : ''}`} onClick={() => (liked ? setLiked(false) : like())} aria-pressed={liked} aria-label={liked ? 'Unlike' : 'Like'}>
              <motion.span key={String(liked)} initial={{ scale: liked ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 12 }} style={{ display: 'inline-flex' }}>
                {IgIcon.heart(liked)}
              </motion.span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.8 }} className="ig-btn" aria-label="Comment (preview only)">{IgIcon.comment}</motion.button>
            <motion.button whileTap={{ scale: 0.8 }} className="ig-btn" onClick={share} aria-label="Copy link to this section">{IgIcon.share}</motion.button>
            <span className="ig-dots" aria-hidden="true">
              {p.slides.map((_, k) => <i key={k} className={k === idx ? 'on' : ''} />)}
            </span>
            <motion.button whileTap={{ scale: 0.8 }} className="ig-btn save" onClick={() => setSaved((v) => !v)} aria-pressed={saved} aria-label={saved ? 'Remove from saved' : 'Save'}>
              {IgIcon.save(saved)}
            </motion.button>
          </div>
          <div className="ig-meta">
            <AnimatePresence mode="wait">
              <motion.b key={liked ? 'l' : 'u'} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.2 }}>
                {(p.likes + (liked ? 1 : 0)).toLocaleString()} likes
              </motion.b>
            </AnimatePresence>
            <p><b>{p.account}</b> {p.quote} A proud moment at TECH IDEATE 🚀</p>
            <AnimatePresence>
              {copied && <motion.span className="ig-toast" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>Link copied</motion.span>}
            </AnimatePresence>
          </div>
        </article>
        <span className="ig-sticker" aria-hidden="true">Slide<br />0{p.mySlide}</span>
      </motion.div>
    </div>
  )
}

/* ---------------- Achievements + Hackathons ---------------- */
export function Achievements() {
  return (
    <section id="achievements" className="section" aria-labelledby="ach-title">
      <div className="container">
        <SectionHead id="ach-title" kicker="05 — Achievements" title="Achievements" sub="so far" aside="No inflated numbers. Just the record." />
        <ul className="highlights">
          {highlights.map((h, i) => {
            const body = (
              <>
                {h.img && (
                  <span className="hl-img" aria-hidden="true">
                    <img src={`${import.meta.env.BASE_URL}${h.img}`} alt="" loading="lazy" />
                  </span>
                )}
                <span className="hl-top">
                  <span className="mono">0{i + 1}</span>
                  <span className="hl-arrow" aria-hidden="true"><ArrowUpRight size={16} /></span>
                </span>
                <span className="big">
                  <CountUp value={h.big} />
                  {h.unit && <span className="unit">{h.unit}</span>}
                </span>
                <span className="t">{h.title}</span>
                <span className="mono hl-meta" style={{ textTransform: 'none' }}>{h.meta}</span>
              </>
            )
            return (
              <Reveal as="li" className={`hl ${h.img ? 'has-img' : ''}`} key={h.title} delay={i * 0.08}>
                <Tilt className="hl-tilt" max={6}>
                  {h.href ? (
                    <Link to={h.href} className="hl-inner">{body}</Link>
                  ) : (
                    <div className="hl-inner">{body}</div>
                  )}
                </Tilt>
              </Reveal>
            )
          })}
        </ul>

        <div className="hack">
          <div className="hack-head">
            <h3>
              <SplitText text="Hackathons" /> <span className="slash">//</span>{' '}
              <span className="serif" style={{ color: 'var(--fg-2)' }}><SplitText text="build under pressure" delay={0.1} /></span>
            </h3>
          </div>
          <div className="hack-grid">
            <Reveal className="hack-photo">
              <figure>
                <motion.img
                  src={`${import.meta.env.BASE_URL}img/offgrid-award.webp`}
                  alt="Tanishq Tewari and his team receiving the OFFGRID Hackathon 2nd Position award on stage at TechIdeate 2026, Manipal University Jaipur"
                  loading="lazy"
                  width={1800}
                  height={1003}
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.4, ease: EASE }}
                />
                <span className="hack-flag">🥈 2nd Position · ₹15,000</span>
                <figcaption className="mono">OFFGRID · TechIdeate 2026 · Manipal University Jaipur — photo: Aperture, Digital Arts Society</figcaption>
              </figure>
            </Reveal>
            <div className="hack-cards">
              {hackathons.map((h, i) => (
                <Reveal className={`hack-card spot ${i === 0 ? 'win' : ''}`} key={h.name + h.edition} delay={i * 0.08}>
                  <div className="mono">{h.edition} · {h.host}</div>
                  <div className="result">{h.result}</div>
                  <div className="name">{h.name}</div>
                  <dl>
                    {h.team && (<><dt className="mono">Team</dt><dd>{h.team.join(' · ')}</dd></>)}
                    <dt className="mono">Project</dt>
                    <dd>{h.projectSlug ? <Link to={`/work/${h.projectSlug}`}>{h.project} →</Link> : h.project}</dd>
                  </dl>
                </Reveal>
              ))}
              <Reveal className="hack-next" delay={0.1}>
                <span className="plus" aria-hidden="true">+</span>
                <span className="mono">Next entry</span>
                <span>Reserved for the next one.</span>
              </Reveal>
            </div>
          </div>
          <InstaFeature />
        </div>
      </div>
    </section>
  )
}

/* ---------------- Now ---------------- */
export function Now() {
  return (
    <section id="now" className="section" aria-labelledby="now-title">
      <div className="container">
        <SectionHead id="now-title" kicker="07 — Now" title="Now" sub="what I'm working on" aside={`Last updated · ${now.updated}`} />
        <ul className="now-list">
          {now.items.map((n, i) => (
            <Reveal as="li" className="now-item spot" key={n.title} delay={i * 0.05}>
              <span className="i">
                <span className="now-num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <span className="now-live"><span className="dot" aria-hidden="true" style={{ animationDelay: `${i * 0.3}s` }} />Active</span>
              </span>
              <span>
                <span className="t" style={{ display: 'block' }}>{n.title}</span>
                <span className="n">{n.note}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Beyond code ---------------- */
export function Beyond() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const x1 = useTransform(scrollYProgress, [0, 1], ['10%', '-35%'])
  const x2 = useTransform(scrollYProgress, [0, 1], ['-35%', '5%'])
  const [active, setActive] = useState<number | null>(null)
  return (
    <section ref={ref} id="beyond" className="section theme-dark beyond-sec" aria-labelledby="beyond-title">
      <div className="beyond-bg" aria-hidden="true">
        <motion.span style={{ x: x1 }}>Camera · Code · Craft ·</motion.span>
        <motion.span style={{ x: x2 }} className="outline">Off the keyboard ·</motion.span>
      </div>
      <div className="container beyond">
        <div className="beyond-left">
          <Reveal className="mono" style={{ marginBottom: '1.25rem' }}>08 — Off the keyboard</Reveal>
          <h2 id="beyond-title">
            <SplitText text="Beyond" /> <span className="serif" style={{ color: 'var(--fg-2)' }}><SplitText text="code" delay={0.1} /></span>
          </h2>
          <Reveal delay={0.1}>
            <p className="lede">The same eye that frames a shot frames an interface. Outside engineering, I spend time behind a camera, with Aperture — MUJ’s Digital Arts Society — and around people who make things.</p>
          </Reveal>
          <motion.div className="beyond-badge" initial={{ opacity: 0, scale: 0.5, rotate: -60 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: EASE }}>
            <SpinBadge text="CAMERA ✦ CODE ✦ CRAFT ✦ CAMERA ✦ CODE ✦ CRAFT ✦ ">
              <AnimatePresence mode="wait">
                <motion.span key={active ?? 'x'} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0, rotate: 90 }} transition={{ duration: 0.25 }}>
                  {active != null ? beyond[active].icon : '✦'}
                </motion.span>
              </AnimatePresence>
            </SpinBadge>
          </motion.div>
        </div>
        <ul className="beyond-list" onMouseLeave={() => setActive(null)}>
          {beyond.map((b, i) => (
            <Reveal as="li" key={b.title} delay={i * 0.06}>
              <div className={`bl-row ${active === i ? 'on' : ''}`} onMouseEnter={() => setActive(i)}>
                <span className="mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="bl-icon" aria-hidden="true">{b.icon}</span>
                <span className="t">{b.title}</span>
                <span className="n">{b.note}</span>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ---------------- Open to internships ---------------- */
const HIRE_ROLES = [
  {
    role: 'Software Engineering',
    icon: '</>',
    brings: 'Full-stack products end to end — React, TypeScript, FastAPI, REST APIs, auth, Docker and CI/CD.',
    proof: '4 deployed projects, live on the web',
  },
  {
    role: 'AI / ML',
    icon: '∇',
    brings: 'Models that ship — PyTorch, graph neural networks, NLP, XGBoost, honest evaluation and deployment.',
    proof: '93.1% root-cause accuracy GNN · 80.6% multilingual classifier',
  },
]

export function Hire() {
  const a = profile.availability
  return (
    <section id="hire" className="section theme-dark hire-sec" aria-labelledby="hire-title">
      <div className="hire-glow" aria-hidden="true" />
      <div className="container">
        <Reveal className="hire-top">
          <span className="hire-status"><span className="avail-dot" aria-hidden="true" />Available now</span>
          <span className="mono">10 — Hiring?</span>
        </Reveal>
        <h2 id="hire-title" className="hire-title">
          <FitText text="Open to" className="hire-l1" hover />
          <FitText text="Internships" className="hire-l2" delay={0.12} hover />
        </h2>
        <div className="hire-grid">
          <Reveal className="hire-left">
            <p className="hire-pitch">{a.pitch}</p>
            <div className="hire-ctas">
              <Magnetic><a href={`mailto:${links.email}?subject=${encodeURIComponent('Internship opportunity')}`} className="btn btn-accent hire-btn">Email me about a role <ArrowUpRight /></a></Magnetic>
              <Magnetic><a href={links.resume} download className="btn hire-btn">Download resume ↓</a></Magnetic>
              <Magnetic><Ext href={links.linkedin} className="btn hire-btn">LinkedIn <ArrowUpRight /></Ext></Magnetic>
            </div>
          </Reveal>
          <ul className="hire-cards" aria-label="Internship roles I'm looking for">
            {HIRE_ROLES.map((r, i) => (
              <Reveal as="li" key={r.role} delay={0.1 + i * 0.1}>
                <Tilt className="hire-card spot" max={7}>
                  <span className="hire-icon" aria-hidden="true">{r.icon}</span>
                  <span className="mono">Role 0{i + 1}</span>
                  <h3>{r.role}<br /><span>Internship</span></h3>
                  <p>{r.brings}</p>
                  <span className="hire-proof">✓ {r.proof}</span>
                </Tilt>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

/* ---------------- Contact + footer ---------------- */
function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(links.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${links.email}`
    }
  }
  return (
    <div className="copy-email">
      <a href={`mailto:${links.email}`} className="mail-big">{links.email}</a>
      <button type="button" className="copy-btn" onClick={copy} aria-live="polite">
        {copied ? 'Copied ✓' : 'Copy email'}
      </button>
    </div>
  )
}

export function Contact() {
  return (
    <section id="contact" className="section contact theme-accent" aria-labelledby="contact-title">
      <div className="container">
        <Reveal className="mono" style={{ marginBottom: '2rem' }}>11 — Contact</Reveal>
        <h2 id="contact-title">
          <SplitText text="Let's build" />
          <br />
          <span className="serif"><SplitText text="something meaningful." delay={0.15} /></span>
        </h2>
        <div className="contact-grid">
          <Reveal className="q">
            <span>Interested in collaborating, hiring, or discussing an idea?</span>
            <CopyEmail />
          </Reveal>
          <Reveal className="actions" delay={0.1}>
            <Magnetic><a href={`mailto:${links.email}`} className="btn btn-primary">Email <ArrowUpRight /></a></Magnetic>
            <Magnetic><Ext href={links.linkedin} className="btn">LinkedIn <ArrowUpRight /></Ext></Magnetic>
            <Magnetic><Ext href={links.github} className="btn">GitHub <ArrowUpRight /></Ext></Magnetic>
            <Magnetic><Ext href={links.resume} className="btn">View resume <ArrowUpRight /></Ext></Magnetic>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="logo">{profile.name}</div>
          <div className="mono" style={{ marginTop: '0.4rem' }}>AI/ML Engineer • Software Developer</div>
        </div>
        <nav className="links" aria-label="Footer">
          <Ext href={links.github} className="text-link">GitHub</Ext>
          <Ext href={links.linkedin} className="text-link">LinkedIn</Ext>
          <Ext href={links.resume} className="text-link">Resume</Ext>
        </nav>
        <div className="mono">© {new Date().getFullYear()} {profile.name}</div>
      </div>
    </footer>
  )
}
