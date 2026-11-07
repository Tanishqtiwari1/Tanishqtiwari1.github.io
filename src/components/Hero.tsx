import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { links, profile } from '../data/site'
import { ArrowUpRight, EASE, Ext, FitText, Magnetic } from './ui'

const fade = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: EASE, delay },
})

export default function Hero() {
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
            src={`${import.meta.env.BASE_URL}img/tanishq-cutout.webp`}
            alt="Portrait of Tanishq Tewari in a white polo shirt, arms crossed, smiling"
            width={990}
            height={1100}
            fetchPriority="high"
            style={{ scale: imgScale }}
          />
        </motion.figure>

        <motion.div className="hero-side" {...fade(0.6)}>
          <span className="hero-roles">{profile.roles}</span>
          <span className="mono" style={{ color: 'var(--fg)' }}>
            B.Tech CSE · Manipal University Jaipur
          </span>
          <a href={profile.achievement.href} className="hero-award">
            <span aria-hidden="true">🏆</span> {profile.achievement.text}
          </a>
        </motion.div>

        <motion.div className="hero-aside" {...fade(0.75)}>
          <a href="#hire" className="avail">
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
              <a href="#work" className="btn btn-primary">View projects <ArrowUpRight /></a>
            </Magnetic>
            <Magnetic>
              <a href={links.resume} className="btn" download>Download resume ↓</a>
            </Magnetic>
          </div>
          <div className="hero-links">
            <Ext href={links.github} className="text-link">GitHub</Ext>
            <Ext href={links.linkedin} className="text-link">LinkedIn</Ext>
          </div>
        </motion.div>

        <FitText text={last} className="hero-name-2" delay={0.15} maxVh={17} />
      </div>
    </section>
  )
}
