import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Morphing cursor (fine pointers only, off for reduced motion).
 *  - free:   a ring that trails the pointer and stretches along its velocity
 *  - snap:   wraps interactive controls, matching their shape, with a slight pull toward the pointer
 *  - label:  grows into a filled disc that says what a click will do
 *  - lens:   over the giant display type it becomes a colour-inverting lens
 * Everything runs in one rAF loop writing transforms directly — no React re-renders per frame.
 */
const SNAP = [
  '.btn', '.bar-links a', '.bar-right a', '.bar-avail', '.avail', '.hero-award', '.text-link', '.arch-node',
  '.menu-toggle', '.term-btn', '.to-top', '.copy-btn', '.lb-btn', '.ig-btn', '.ig-nav', '.rs-toggle button',
  '.monogram', '.bar-id', '.mobile-menu nav a', '.tl-toggle', '.skill-chips li', '.tag',
].join(',')

const LABELS: [string, string][] = [
  ['.pj-shot', 'View'],
  ['.g-tile', 'Open'],
  ['.ig-media', 'Drag'],
  ['.hl-inner', 'Look'],
  ['.ft-title a, .pj-title a', 'Read'],
  ['.tl-button', 'Expand'],
]

const LENS = '.giant, .contact h2, .section-head h2, .ft-title'

type Mode = 'free' | 'snap' | 'label' | 'lens'

export default function Cursor() {
  const reduce = useReducedMotion()
  const ring = useRef<HTMLDivElement>(null)
  const dot = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState('')

  useEffect(() => {
    setEnabled(!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  }, [reduce])

  useEffect(() => {
    if (!enabled) return
    const root = document.documentElement
    root.classList.add('has-cursor')

    const p = { x: -100, y: -100, px: -100, py: -100 }
    const s = { x: -100, y: -100, w: 34, h: 34, r: 17, sx: 1, sy: 1, rot: 0 }
    let mode: Mode = 'free'
    let target: Element | null = null
    let currentLabel = ''
    let down = false
    let visible = false
    let raf = 0

    const resolve = (el: Element | null) => {
      let next: Mode = 'free'
      let t: Element | null = null
      let lbl = ''
      if (el instanceof Element) {
        if (el.closest('input, textarea, select')) next = 'free'
        else {
          const hit = LABELS.find(([sel]) => el.closest(sel))
          if (hit) { next = 'label'; lbl = hit[1]; t = el.closest(hit[0]) }
          else if ((t = el.closest(SNAP))) next = 'snap'
          else if (el.closest(LENS)) next = 'lens'
        }
      }
      mode = next
      target = t
      if (lbl !== currentLabel) { currentLabel = lbl; setLabel(lbl) }
      if (ring.current) ring.current.dataset.mode = mode
    }

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      p.x = e.clientX
      p.y = e.clientY
      if (!visible) {
        visible = true
        s.x = p.x; s.y = p.y; p.px = p.x; p.py = p.y
        ring.current?.classList.add('on')
        dot.current?.classList.add('on')
      }
      resolve(e.target as Element)
    }
    const onOver = (e: PointerEvent) => resolve(e.target as Element)
    const onDown = () => {
      down = true
      const r = document.createElement('span')
      r.className = 'cursor-ripple'
      r.style.left = `${p.x}px`
      r.style.top = `${p.y}px`
      document.body.appendChild(r)
      r.addEventListener('animationend', () => r.remove())
    }
    const onUp = () => { down = false }
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget) return
      visible = false
      ring.current?.classList.remove('on')
      dot.current?.classList.remove('on')
    }

    const lerp = (a: number, b: number, k: number) => a + (b - a) * k
    const lerpAngle = (a: number, b: number, k: number) => {
      const d = ((b - a + 540) % 360) - 180
      return a + d * k
    }

    const tick = () => {
      let tx = p.x, ty = p.y, tw = 34, th = 34, tr = 17
      if (mode === 'snap' && target && target.isConnected) {
        const rect = target.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        tx = cx + (p.x - cx) * 0.12 // gentle pull toward the pointer
        ty = cy + (p.y - cy) * 0.12
        tw = rect.width + 12
        th = rect.height + 10
        const br = parseFloat(getComputedStyle(target).borderTopLeftRadius) || 8
        tr = Math.min(br + 5, th / 2)
      } else if (mode === 'label') {
        tw = th = 86; tr = 43
      } else if (mode === 'lens') {
        tw = th = 150; tr = 75
      }

      const k = mode === 'snap' ? 0.3 : 0.2
      s.x = lerp(s.x, tx, k)
      s.y = lerp(s.y, ty, k)
      s.w = lerp(s.w, tw, 0.22)
      s.h = lerp(s.h, th, 0.22)
      s.r = lerp(s.r, tr, 0.22)

      // Squash & stretch along the direction of travel (free mode only).
      const vx = p.x - p.px, vy = p.y - p.py
      p.px = p.x; p.py = p.y
      const speed = Math.hypot(vx, vy)
      if (mode === 'free' && speed > 0.5) {
        const st = Math.min(speed / 28, 0.55)
        s.sx = lerp(s.sx, 1 + st, 0.25)
        s.sy = lerp(s.sy, 1 - st * 0.45, 0.25)
        s.rot = lerpAngle(s.rot, (Math.atan2(vy, vx) * 180) / Math.PI, 0.3)
      } else {
        s.sx = lerp(s.sx, 1, 0.2)
        s.sy = lerp(s.sy, 1, 0.2)
        s.rot = lerpAngle(s.rot, 0, mode === 'free' ? 0.05 : 0.3)
      }

      const press = down ? 0.86 : 1
      if (ring.current) {
        ring.current.style.width = `${s.w}px`
        ring.current.style.height = `${s.h}px`
        ring.current.style.borderRadius = `${s.r}px`
        ring.current.style.transform =
          `translate3d(${s.x - s.w / 2}px, ${s.y - s.h / 2}px, 0) rotate(${s.rot}deg) scale(${s.sx * press}, ${s.sy * press})`
      }
      if (dot.current) dot.current.style.transform = `translate3d(${p.x - 3}px, ${p.y - 3}px, 0)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.addEventListener('mouseout', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseout', onLeave)
      root.classList.remove('has-cursor')
    }
  }, [enabled])

  if (!enabled) return null
  return (
    <>
      <div ref={ring} className="cursor-ring" data-mode="free" aria-hidden="true">
        <span className="cursor-label">{label}</span>
      </div>
      <div ref={dot} className="cursor-dot" aria-hidden="true" />
    </>
  )
}
