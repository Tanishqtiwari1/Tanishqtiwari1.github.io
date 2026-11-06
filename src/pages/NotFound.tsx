import { Link } from 'react-router-dom'
import { useTitle } from '../hooks/useTitle'

export default function NotFound() {
  useTitle('404 — Tanishq Tewari')
  return (
    <section className="notfound">
      <div>
        <p className="mono">Error // route not found</p>
        <h1>4<span className="serif accent">0</span>4</h1>
        <p style={{ color: 'var(--fg-2)', margin: '1rem 0 2rem' }}>This page doesn't exist — yet.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </section>
  )
}
