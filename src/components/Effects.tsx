import {
  AnimatePresence,
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { EASE } from './ui'

/* ---------------- Preloader: once per session ---------------- */
export function Preloader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => !reduce && typeof sessionStorage !== 'undefined' && !sessionStorage.getItem('tt-loaded'))
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!show) return
    document.body.style.overflow = 'hidden'
    const ctrl = animate(0, 100, { duration: 1.5, ease: [0.65, 0, 0.35, 1], onUpdate: (v) => setN(Math.round(v)) })
    const t = setTimeout(() => {
      sessionStorage.setItem('tt-loaded', '1')
      setShow(false)
      document.body.style.overflow = ''
    }, 1750)
    return () => { ctrl.stop(); clearTimeout(t); document.body.style.overflow = '' }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="preloader" aria-hidden="true" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}>
          <div className="pl-top mono"><span className="sq accent-bg" /> Tanishq Tewari — Portfolio ’26</div>
          <div className="pl-name">
            {['TANISHQ', 'TEWARI'].map((w, wi) => (
              <span key={w} className="pl-word">
                {w.split('').map((c, i) => (
                  <span key={i} className="pl-ch">
                    <motion.span initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.05 + (wi * 7 + i) * 0.03 }}>
                      {c}
                    </motion.span>
                  </span>
                ))}
              </span>
            ))}
          </div>
          <div className="pl-bottom">
            <span className="mono">AI/ML Engineer · Software Developer</span>
            <span className="pl-count">{String(n).padStart(3, '0')}</span>
          </div>
          <motion.div className="pl-bar" style={{ scaleX: n / 100 }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------------- Scroll progress ---------------- */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 })
  return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
}

/* ---------------- Custom cursor (fine pointers only) ---------------- */
export function Cursor() {
  const reduce = useReducedMotion()
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<{ hover: boolean; label: string; down: boolean }>({ hover: false, label: '', down: false })
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 500, damping: 40, mass: 0.6 })

  useEffect(() => {
    if (reduce || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    setEnabled(true)
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = (e.target as HTMLElement | null)?.closest<HTMLElement>('a, button, [data-cursor], [role="tab"]')
      const label = t?.dataset.cursor ?? ''
      setState((s) => (s.hover === !!t && s.label === label ? s : { ...s, hover: !!t, label }))
    }
    const down = () => setState((s) => ({ ...s, down: true }))
    const up = () => setState((s) => ({ ...s, down: false }))
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.documentElement.classList.add('has-cursor')
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [reduce, x, y])

  if (!enabled) return null
  const size = state.label ? 92 : state.hover ? 54 : 30
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden="true" />
      <motion.div
        className={`cursor-ring ${state.label ? 'labelled' : ''}`}
        style={{ x: rx, y: ry }}
        animate={{ width: size, height: size, scale: state.down ? 0.85 : 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        aria-hidden="true"
      >
        <AnimatePresence>
          {state.label && (
            <motion.span initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

/* ---------------- Velocity marquee ---------------- */
export function Marquee({ items, speed = 3, className = '', reverse = false }: { items: string[]; speed?: number; className?: string; reverse?: boolean }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-1500, 0, 1500], [-4, 0, 4], { clamp: false })
  const skew = useTransform(vel, [-2500, 0, 2500], [8, 0, -8])
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)
  const dir = useRef(reverse ? -1 : 1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * speed * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = reverse ? 1 : -1
    else if (f > 0) dir.current = reverse ? -1 : 1
    move += dir.current * move * Math.abs(f)
    base.set(base.get() - move)
  })

  const row = (
    <span className="mq-row">
      {items.map((t, i) => (
        <span key={i} className="mq-item">
          {t}
          <span className="mq-star" aria-hidden="true">✦</span>
        </span>
      ))}
    </span>
  )
  return (
    <div className={`marquee ${className}`} aria-hidden="true">
      <motion.div className="mq-track" style={{ x, skewX: reduce ? 0 : skew }}>
        {row}
        {row}
      </motion.div>
    </div>
  )
}

/* ---------------- Text scramble ---------------- */
const GLYPHS = '!<>-_\\/[]{}—=+*^?#01ABCDEFXYZ'
export function Scramble({ text, className, trigger = 'view' }: { text: string; className?: string; trigger?: 'view' | 'hover' | 'both' }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const reduce = useReducedMotion()
  const [out, setOut] = useState(text)
  const raf = useRef(0)

  const run = () => {
    if (reduce) return
    cancelAnimationFrame(raf.current)
    let frame = 0
    const total = 18
    const tick = () => {
      frame++
      const p = frame / total
      setOut(
        text
          .split('')
          .map((c, i) => (c === ' ' || i / text.length < p ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      )
      if (frame < total) raf.current = requestAnimationFrame(tick)
      else setOut(text)
    }
    tick()
  }

  useEffect(() => {
    if (inView && trigger !== 'hover') run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])
  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <span ref={ref} className={className} onMouseEnter={trigger !== 'view' ? run : undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </span>
  )
}

/* ---------------- Count-up numbers: animates the numeric part of "93.1%", "~15 ms", "0.915" ---------------- */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduce = useReducedMotion()
  const m = value.match(/^(\D*)([\d.,]+)(.*)$/)
  const [shown, setShown] = useState(m && !reduce ? `${m[1]}0${m[3]}` : value)

  useEffect(() => {
    if (!m || reduce || !inView) { if (inView) setShown(value); return }
    const target = parseFloat(m[2].replace(/,/g, ''))
    const decimals = (m[2].split('.')[1] || '').length
    const ctrl = animate(0, target, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setShown(`${m[1]}${v.toFixed(decimals)}${m[3]}`),
    })
    return () => ctrl.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}

/* ---------------- Rotating circular badge ---------------- */
export function SpinBadge({ text, className = '', children }: { text: string; className?: string; children?: ReactNode }) {
  const id = useRef(`c${Math.random().toString(36).slice(2, 8)}`).current
  return (
    <div className={`spin-badge ${className}`} aria-hidden="true">
      <svg viewBox="0 0 200 200">
        <defs>
          <path id={id} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#${id}`} startOffset="0">{text}</textPath>
        </text>
      </svg>
      <div className="spin-core">{children}</div>
    </div>
  )
}

/* ---------------- 3D tilt on pointer ---------------- */
export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const rx = useSpring(0, { stiffness: 200, damping: 20 })
  const ry = useSpring(0, { stiffness: 200, damping: 20 })
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2)
  }
  return (
    <motion.div
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onPointerMove={onMove}
      onPointerLeave={() => { rx.set(0); ry.set(0) }}
    >
      {children}
    </motion.div>
  )
}

/* ---------------- Scroll-scrubbed text: words light up as you scroll ---------------- */
function ScrubWord({ word, range, progress }: { word: string; range: [number, number]; progress: import('framer-motion').MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const y = useTransform(progress, range, [6, 0])
  return (
    <motion.span style={{ opacity, y, display: 'inline-block' }}>
      {word}&nbsp;
    </motion.span>
  )
}
export function ScrollWords({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.9', 'end 0.45'] })
  if (reduce) return <p className={className}>{text}</p>
  const words = text.split(' ')
  return (
    <p ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <ScrubWord key={i} word={w} progress={scrollYProgress} range={[i / words.length, Math.min(1, (i + 2) / words.length)]} />
        ))}
      </span>
    </p>
  )
}

/* ---------------- Spotlight: radial glow that follows the pointer inside any .spot element ---------------- */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const move = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('.spot')
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--sx', `${e.clientX - r.left}px`)
      el.style.setProperty('--sy', `${e.clientY - r.top}px`)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return null
}

/* ---------------- Back to top with scroll-progress ring ---------------- */
export function BackToTop() {
  const { scrollY, scrollYProgress } = useScroll()
  const [show, setShow] = useState(false)
  useEffect(() => scrollY.on('change', (v) => setShow(v > 700)), [scrollY])
  const dash = useTransform(scrollYProgress, (v) => `${v * 125.6} 125.6`)
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          data-cursor="Top"
          initial={{ opacity: 0, scale: 0.4, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.4, y: 20 }}
          whileHover={{ scale: 1.1, rotate: -8 }}
          whileTap={{ scale: 0.9 }}
        >
          <svg viewBox="0 0 48 48" aria-hidden="true">
            <circle cx="24" cy="24" r="20" className="track" />
            <motion.circle cx="24" cy="24" r="20" className="bar" style={{ strokeDasharray: dash }} />
          </svg>
          <span aria-hidden="true">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
