import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion'
import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

/** Fade-and-rise when scrolled into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  as = 'div',
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; as?: 'div' | 'li' | 'article' | 'section'; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/** Splits a heading into masked words that slide up. */
export function SplitText({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const words = text.split(' ')
  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <span key={i} aria-hidden="true" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.08em' }}>
          <motion.span
            style={{ display: 'inline-block' }}
            initial={{ y: '105%' }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

export function SectionHead({
  kicker,
  title,
  sub,
  aside,
  id,
}: {
  kicker: string
  title: string
  sub?: string
  aside?: ReactNode
  id: string
}) {
  return (
    <header className="section-head">
      <div>
        <Reveal className="kicker mono">{kicker}</Reveal>
        <h2 id={id}>
          <SplitText text={title} />
          {sub && (
            <>
              {' '}
              <span className="slash">//</span>{' '}
              <span className="serif">
                <SplitText text={sub} delay={0.15} />
              </span>
            </>
          )}
        </h2>
      </div>
      {aside && <Reveal className="aside mono" delay={0.2}>{aside}</Reveal>}
    </header>
  )
}

/** Pulls its child gently toward the pointer. Disabled for touch + reduced motion. */
export function Magnetic({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null)
  const reduce = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })
  const y = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  return (
    <motion.span ref={ref} style={{ x, y, display: 'inline-flex' }} onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}

export const ArrowUpRight = ({ size = 14 }: { size?: number }) => (
  <svg className="arrow" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4.5 11.5L11.5 4.5M11.5 4.5H5.5M11.5 4.5V10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
)

export const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M13 8H3M3 8L7.5 3.5M3 8L7.5 12.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

export const Plus = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

/** External link that opens in a new tab safely. */
export function Ext({ href, children, className, label }: { href: string; children: ReactNode; className?: string; label?: string }) {
  const external = /^https?:/.test(href)
  return (
    <a
      href={href}
      className={className}
      aria-label={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
    </a>
  )
}

/**
 * Giant display text that scales to exactly fill its container's width (like the reference's
 * edge-to-edge wordmark). Letters rise in on mount. `ratio` < 1 leaves room on the side.
 */
export function FitText({ text, className, ratio = 1, delay = 0, maxVh, hover = true, as: Tag = 'span' }: { text: string; className?: string; ratio?: number; delay?: number; /** cap letter height to this % of viewport height */ maxVh?: number; /** letters jump on hover */ hover?: boolean; as?: 'span' | 'h1' | 'div' }) {
  const box = useRef<HTMLElement>(null)
  const inner = useRef<HTMLSpanElement>(null)
  const [size, setSize] = useState<number | null>(null)

  useLayoutEffect(() => {
    const el = box.current, span = inner.current
    if (!el || !span) return
    const fit = () => {
      const fs = parseFloat(getComputedStyle(span).fontSize)
      const w = span.getBoundingClientRect().width
      if (!w || !fs) return
      let next = (fs * el.clientWidth * ratio) / w
      if (maxVh && window.innerWidth > 960) next = Math.min(next, (window.innerHeight * maxVh) / 100 / 0.74)
      setSize(next)
    }
    fit()
    document.fonts?.ready.then(fit)
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    window.addEventListener('resize', fit)
    return () => { ro.disconnect(); window.removeEventListener('resize', fit) }
  }, [text, ratio, maxVh])

  const T = Tag as 'span'
  return (
    <T ref={box as React.Ref<HTMLSpanElement>} className={className} style={{ display: 'block' }}>
      <span className="sr-only">{text}</span>
      <span ref={inner} aria-hidden="true" className="giant" style={{ display: 'inline-block', fontSize: size ? `${size}px` : '12vw' }}>
        {text.split('').map((c, i) => (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', paddingBottom: '0.04em' }}>
            <motion.span
              className="ch"
              initial={{ y: '102%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              whileHover={hover ? { y: '-14%', color: 'var(--accent)', transition: { type: 'spring', stiffness: 500, damping: 12 } } : undefined}
              transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.035 }}
            >
              {c === ' ' ? ' ' : c}
            </motion.span>
          </span>
        ))}
      </span>
    </T>
  )
}

/** "TT" monogram mark — chunky, built from blocks. */
export const Monogram = () => (
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <path fill="#0c0c0c" d="M20 2h24l18 18v24L44 62H20L2 44V20z" />
    <g fill="#b4b4b1">
      <rect x="12" y="17" width="18" height="7" />
      <rect x="17.5" y="17" width="7" height="30" />
      <rect x="34" y="17" width="18" height="7" />
      <rect x="39.5" y="17" width="7" height="30" />
    </g>
    <rect x="28" y="50" width="8" height="4" fill="#ff4f00" />
  </svg>
)
