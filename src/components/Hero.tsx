import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { links, profile } from '../data/site'
import { SpinBadge } from './Effects'
import { ArrowUpRight, EASE, Ext, FitText, Magnetic } from './ui'

function useClock(tz: string) {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date())
  const [t, setT] = useState(fmt)
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 15000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tz])
  return t
}

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
})

export default function Hero() {
  const time = useClock(profile.timezone)
  const [first, last] = profile.name.split(' ')
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '10%'])
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.06])

  return (
    <section id="top" ref={ref} className="hero" aria-labelledby="hero-title">
      <div className="container">
        <h1 id="hero-title" className="sr-only">{profile.name} — {profile.title}</h1>
        <FitText text={first} className="hero-name-1" maxVh={17} />

        <motion.span className="hero-glow" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.4, delay: 0.3 }} />

        <motion.figure
          className="hero-figure"
          style={{ y: imgY }}
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
        >
          <motion.img
            src={`${import.meta.env.BASE_URL}img/tanishq-cutout.png`}
            alt="Portrait of Tanishq Tewari in a white polo shirt, arms crossed, smiling"
            width={990}
            height={1100}
            fetchPriority="high"
            style={{ scale: imgScale }}
          />
        </motion.figure>

        <motion.div className="hero-badge" initial={{ opacity: 0, scale: 0.6, rotate: -40 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, ease: EASE, delay: 0.9 }}>
          <a href="#work" aria-label="See the highlight project" data-cursor="Work">
            <SpinBadge text="AI/ML ✦ SOFTWARE ✦ OPEN TO INTERNSHIPS ✦ ">
              <span className="spin-arrow">↓</span>
            </SpinBadge>
          </a>
        </motion.div>

        <motion.div className="hero-side" {...fade(0.6)}>
          <span className="mono"><span className="sq" aria-hidden="true" /> {profile.title}</span>
          <span className="mono" style={{ color: 'var(--muted)' }}>
            B.Tech CSE · Manipal University Jaipur
          </span>
          <span className="mono" style={{ color: 'var(--muted)' }}>
            {profile.location} · {time} IST
          </span>
        </motion.div>

        <motion.div className="hero-aside" {...fade(0.75)}>
          <a href="#contact" className="avail" data-cursor="Hire">
            <span className="avail-dot" aria-hidden="true" />
            <span className="avail-text">
              <b>{profile.availability.headline}</b>
              <small>{profile.availability.roles.join(' · ')}</small>
            </span>
            <span className="avail-arrow" aria-hidden="true">→</span>
          </a>
          <p className="hero-tagline">{profile.tagline}</p>
          <div className="hero-actions">
            <Magnetic>
              <a href="#work" className="btn btn-primary">View my work <ArrowUpRight /></a>
            </Magnetic>
            <Magnetic>
              <a href={links.resume} className="btn" download>Resume ↓</a>
            </Magnetic>
          </div>
          <div className="hero-links">
            <Ext href={links.github} className="text-link">GitHub</Ext>
            <Ext href={links.linkedin} className="text-link">LinkedIn</Ext>
            <a href={`mailto:${links.email}`} className="text-link">Email</a>
          </div>
        </motion.div>

        <FitText text={last} className="hero-name-2" delay={0.15} maxVh={17} />
      </div>
    </section>
  )
}
