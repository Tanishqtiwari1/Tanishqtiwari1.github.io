import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { BackToTop, ScrollProgress, Spotlight } from './components/Effects'
import Cursor from './components/Cursor'
import Nav from './components/Nav'
import Terminal from './components/Terminal'
import { Footer } from './components/Sections'
import { EASE } from './components/ui'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

const CaseStudy = lazy(() => import('./pages/CaseStudy'))
const ResumePage = lazy(() => import('./pages/ResumePage'))

function Page({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay: 0.35 } }}
        exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      >
        {children}
      </motion.div>
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={{ scaleY: 1, originY: 0 }}
        animate={{ scaleY: 0, originY: 0, transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.1 } }}
        exit={{ scaleY: 1, originY: 1, transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] } }}
      >
        <span>Tanishq<i>.</i></span>
      </motion.div>
    </>
  )
}

export default function App() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [location.pathname, location.hash])

  return (
    <MotionConfig reducedMotion="user">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollProgress />
      <Spotlight />
      <BackToTop />
      <Terminal />
      <Cursor />
      <Nav />
      <main id="main">
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/resume" element={<Page><Suspense fallback={<div style={{ minHeight: '100svh' }} />}><ResumePage /></Suspense></Page>} />
            <Route path="/work/:slug" element={<Page><Suspense fallback={<div style={{ minHeight: '100svh' }} />}><CaseStudy /></Suspense></Page>} />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </MotionConfig>
  )
}
