import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { links, nav, profile } from '../data/site'
import { useActiveSection } from '../hooks/useActiveSection'
import { Scramble } from './Effects'
import { ArrowUpRight, EASE, Ext, Monogram } from './ui'

/** Every section on the home page, in order — drives the top-left "(03—10) Work" indicator. */
const ALL_SECTIONS = [
  { id: 'top', label: 'Index' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'work', label: 'Highlight' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'resume', label: 'Resume' },
  { id: 'now', label: 'Now' },
  { id: 'beyond', label: 'Beyond code' },
  { id: 'github', label: 'GitHub' },
  { id: 'hire', label: 'Internships' },
  { id: 'contact', label: 'Contact' },
]

const pad = (n: number) => String(n).padStart(2, '0')

export default function Nav() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const onHome = pathname === '/'
  const active = useActiveSection(onHome ? ALL_SECTIONS.map((s) => s.id) : [])
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const rotate = useTransform(scrollY, [0, 4000], [0, reduce ? 0 : 360])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`)
  const isActive = (id: string) => active === id || (id === 'work' && active === 'projects')
  const activeIdx = ALL_SECTIONS.findIndex((s) => s.id === active)
  const cornerText = onHome
    ? `(${pad(Math.max(activeIdx, 0) + 1)}—${pad(ALL_SECTIONS.length)}) ${ALL_SECTIONS[Math.max(activeIdx, 0)].label}`
    : '(Case study)'

  return (
    <>
      <div className="corner-label" aria-hidden="true">
        <span className="sq" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={cornerText} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.2 }}>
            {cornerText}
          </motion.span>
        </AnimatePresence>
      </div>

      <Link to="/" className="monogram" aria-label="Tanishq Tewari — home">
        <motion.span style={{ rotate, display: 'block', width: '100%', height: '100%' }}>
          <Monogram />
        </motion.span>
      </Link>

      <header className="bar">
        <div className="bar-inner">
          <div className="bar-left">
            <Link to="/" className="bar-id">
              <span className="sq accent-bg" aria-hidden="true" />
              {profile.name}
            </Link>
            <a href={href('hire')} className="bar-avail" data-cursor="Hire">
              <span className="avail-dot" aria-hidden="true" />
              <span>{profile.availability.headline}</span>
            </a>
          </div>

          <nav aria-label="Primary">
            <ul className="bar-links">
              {nav.filter((n) => n.id !== 'contact').map((n) => (
                <li key={n.id}>
                  <a href={href(n.id)} className={isActive(n.id) ? 'active' : ''} aria-current={isActive(n.id) ? 'location' : undefined}>
                    {isActive(n.id) && <motion.span layoutId="bar-sq" className="sq" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                    <Scramble text={n.label} trigger="hover" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bar-right">
            <a href={href('contact')} className={active === 'contact' ? 'active' : ''}>Contact</a>
            <Ext href={links.resume} className="btn btn-sm btn-primary">Resume <ArrowUpRight /></Ext>
          </div>

          <button className="menu-toggle" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            <span className="sq" aria-hidden="true" />
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            exit={{ clipPath: 'inset(100% 0 0 0)' }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <nav aria-label="Mobile">
              {nav.map((n, i) => (
                <motion.a
                  key={n.id}
                  href={href(n.id)}
                  onClick={() => setOpen(false)}
                  className={active === n.id ? 'active' : ''}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE, delay: 0.08 + i * 0.04 }}
                >
                  <span className="t">{n.label}</span>
                  <span className="mono">{pad(i + 1)}</span>
                </motion.a>
              ))}
            </nav>
            <div className="foot">
              <Ext href={links.resume} className="btn btn-primary">Resume <ArrowUpRight /></Ext>
              <Ext href={links.github} className="text-link">GitHub</Ext>
              <Ext href={links.linkedin} className="text-link">LinkedIn</Ext>
              <a href={`mailto:${links.email}`} className="text-link">Email</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
