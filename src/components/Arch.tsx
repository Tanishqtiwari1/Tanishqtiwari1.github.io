import { AnimatePresence, motion } from 'framer-motion'
import { Fragment, useId, useRef, useState } from 'react'
import type { FlowNode } from '../data/projects'
import { EASE } from './ui'

/**
 * Interactive architecture diagram: a row of components joined by animated edges.
 * Select a component by click, hover (fine pointers) or arrow keys to read what it does.
 * Built as an ARIA tablist so it works with keyboard and screen readers.
 */
export function ArchDiagram({ nodes, caption, label }: { nodes: FlowNode[]; caption: string; label: string }) {
  const [active, setActive] = useState(0)
  const id = useId()
  const refs = useRef<(HTMLButtonElement | null)[]>([])
  const node = nodes[active]

  const onKey = (e: React.KeyboardEvent) => {
    const d = ['ArrowRight', 'ArrowDown'].includes(e.key) ? 1 : ['ArrowLeft', 'ArrowUp'].includes(e.key) ? -1 : 0
    if (!d) return
    e.preventDefault()
    const next = (active + d + nodes.length) % nodes.length
    setActive(next)
    refs.current[next]?.focus()
  }

  return (
    <figure className="arch" aria-label={label}>
      <div className="arch-flow" role="tablist" aria-label={`${label} — components`}>
        {nodes.map((n, i) => (
          <Fragment key={n.label}>
            {i > 0 && <span className={`arch-edge ${i <= active ? 'lit' : ''}`} aria-hidden="true" />}
            <button
              ref={(el) => { refs.current[i] = el }}
              role="tab"
              id={`${id}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${id}-panel`}
              tabIndex={i === active ? 0 : -1}
              className={`arch-node ${i === active ? 'on' : ''}`}
              onClick={() => setActive(i)}
              onKeyDown={onKey}
              onMouseEnter={() => window.matchMedia('(hover: hover)').matches && setActive(i)}
            >
              <span className="n">{String(i + 1).padStart(2, '0')}</span>
              <span className="l">{n.label}</span>
              {n.sub && <span className="s">{n.sub}</span>}
            </button>
          </Fragment>
        ))}
      </div>
      <div className="arch-panel" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22, ease: EASE }}>
            <span className="mono">{String(active + 1).padStart(2, '0')} / {String(nodes.length).padStart(2, '0')} · {node.label}</span>
            <p>{node.detail ?? node.sub}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <figcaption>{caption} <span className="mono arch-hint">Select a component · ← → keys</span></figcaption>
    </figure>
  )
}
