import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Marquee } from '../components/Effects'
import GitHub from '../components/GitHub'
import Hero from '../components/Hero'
import Resume from '../components/Resume'
import { About, Achievements, Beyond, Contact, Experience, Hire, Now, Stack } from '../components/Sections'
import { Featured, Showcase } from '../components/Work'
import { useTitle } from '../hooks/useTitle'

export default function Home() {
  const { hash } = useLocation()
  useTitle('Tanishq Tewari — AI/ML Engineer & Software Developer')

  // Arriving from a case study via /#section: scroll once the page has mounted.
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 80)
    return () => clearTimeout(t)
  }, [hash])

  return (
    <>
      <Hero />
      <Marquee className="mq-accent" items={['AI/ML Engineer', 'Software Developer', 'Graph Neural Networks', 'NLP', 'Full Stack', 'Hackathon Builder', 'FastAPI', 'React', 'PyTorch']} />
      <About />
      <Experience />
      <Featured />
      <Showcase />
      <Stack />
      <Achievements />
      <Resume />
      <Now />
      <Beyond />
      <GitHub />
      <Hire />
      <Marquee className="mq-dark" reverse speed={2.5} items={["Let's build something", 'Software · AI/ML', 'AI · Software · Hackathons', 'Say hello']} />
      <Contact />
    </>
  )
}
