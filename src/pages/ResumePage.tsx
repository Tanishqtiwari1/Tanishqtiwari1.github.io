import { Link } from 'react-router-dom'
import { ResumePaper } from '../components/Resume'
import { ArrowLeft, ArrowUpRight, Ext } from '../components/ui'
import { resume } from '../data/resume'
import { links } from '../data/site'
import { useTitle } from '../hooks/useTitle'

/** Standalone, printable browser resume at /resume — mirrors public/Tanishq_Tewari_Resume.pdf. */
export default function ResumePage() {
  useTitle('Resume — Tanishq Tewari', 'Resume of Tanishq Tewari: B.Tech CSE (AI & ML), Manipal University Jaipur. Projects, achievements and skills.')
  return (
    <section className="resume-page theme-dark" aria-labelledby="resume-page-title">
      <div className="container">
        <div className="rp-bar no-print">
          <Link to="/" className="text-link"><ArrowLeft /> Back to portfolio</Link>
          <div className="rp-actions">
            <a href={links.resume} download className="btn btn-accent">Download PDF ↓</a>
            <button type="button" className="btn" onClick={() => window.print()}>Print</button>
            <Ext href={links.linkedin} className="btn">LinkedIn <ArrowUpRight /></Ext>
          </div>
        </div>
        <h1 id="resume-page-title" className="sr-only">Resume — Tanishq Tewari</h1>
        <p className="mono rp-note no-print">Web version of the PDF · updated {resume.updated}</p>
        <ResumePaper />
      </div>
    </section>
  )
}
