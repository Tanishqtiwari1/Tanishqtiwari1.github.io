import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { run, type Line } from '../lib/terminal'
import { EASE } from './ui'

const WELCOME: Line[] = [
  { text: 'tanishq@portfolio — optional terminal. Everything here is also on the page.', tone: 'muted' },
  { text: 'Type "help" to see commands. Esc closes.', tone: 'muted' },
]

/** Optional terminal: opened with the ›_ button or the ` key. Never required for navigation. */
export default function Terminal() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const log = useRef<HTMLDivElement>(null)
  const opener = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target
      const typing = t instanceof Element && t.closest('input, textarea, select, [contenteditable="true"]')
      if (e.key === '`' && !typing && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setOpen((o) => !o) }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => input.current?.focus(), 50)
    else opener.current?.focus({ preventScroll: true })
  }, [open])

  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }) }, [lines])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const out = run(value)
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30))
    setHIdx(-1)
    if (out === 'clear') setLines([])
    else if (out === 'exit') setOpen(false)
    else setLines((l) => [...l, { text: `› ${value}`, tone: 'accent' }, ...out])
    setValue('')
  }

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp' && history.length) {
      e.preventDefault()
      const i = Math.min(hIdx + 1, history.length - 1); setHIdx(i); setValue(history[i])
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const i = hIdx - 1; setHIdx(i); setValue(i < 0 ? '' : history[i])
    }
  }

  return (
    <>
      <button ref={opener} type="button" className="term-btn" onClick={() => setOpen(true)} aria-label="Open terminal (optional, shortcut: backtick key)" title="Terminal ( ` )">
        <span aria-hidden="true">›_</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div className="term-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              className="term"
              role="dialog"
              aria-modal="true"
              aria-label="Portfolio terminal"
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.28, ease: EASE }}
              onClick={(e) => { e.stopPropagation(); input.current?.focus() }}
            >
              <div className="term-top">
                <span className="term-dots" aria-hidden="true"><i /><i /><i /></span>
                <span className="mono">tanishq@portfolio: ~</span>
                <button type="button" className="term-x" onClick={() => setOpen(false)} aria-label="Close terminal">✕</button>
              </div>
              <div className="term-log" ref={log} aria-live="polite">
                {lines.map((l, i) => (
                  <div key={i} className={`term-line ${l.tone ?? ''}`}>
                    {l.href ? (
                      l.href.startsWith('/') ? <Link to={l.href} onClick={() => setOpen(false)}>{l.text}</Link> : <a href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{l.text}</a>
                    ) : l.text}
                  </div>
                ))}
              </div>
              <form className="term-in" onSubmit={submit}>
                <label htmlFor="term-input" className="accent">›</label>
                <input
                  id="term-input"
                  ref={input}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onInputKey}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  aria-label="Terminal command"
                  placeholder="type help"
                />
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
