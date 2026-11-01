import { useEffect, useState } from 'react'
import { Hero, Capabilities, Horizon, Orbit } from './Visuals'
import { Landscape, Reasoning, Journeys } from './Research'
import { Prd, Metrics } from './Product'
import { Demo } from './Prototype'
import { EVIDENCE } from './data'

const NAV = [['about', 'About'], ['demo', 'Try the demo'], ['landscape', 'Research'], ['journeys', 'Journeys'], ['reasoning', 'Reasoning'], ['prd', 'PRD'], ['metrics', 'Metrics'], ['build', 'Build']]

function Header() {
  const [open, setOpen] = useState(false); const [active, setActive] = useState('')
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-40% 0px -55% 0px' })
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <header className="site">
      <a className="logo" href="#top">trace<sup>*</sup> / KYC</a>
      <button className="menu" aria-expanded={open} aria-controls="nav" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      <nav id="nav" aria-label="Primary" className={open ? 'open' : ''}>{NAV.map(([id, l]) => <a key={id} href={'#' + id} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{l}</a>)}</nav>
    </header>
  )
}

function About() {
  return (
    <section id="about"><p className="tag">About this project</p><h2>What TRACE / KYC is</h2>
      <p className="lead">TRACE / KYC is an independent product case study and a working prototype. It looks at the identity check (KYC) that Indian brokers require, and asks whether people would get through it more easily if one place showed where they stand, what happens next, and how to fix a problem. Everything in it uses fictional data.</p>
      <div className="grid">
        <div className="card"><span className="tag">How to use it</span><ol><li>Choose a journey in the demo.</li><li>Follow the steps. Back keeps what you entered.</li><li>Open the scenario explorer to see a delay, a rejection and a fix.</li></ol><a className="btn p" href="#demo">Try the demo</a></div>
        <div className="card"><span className="tag">How it could be better (untested)</span><ul><li>The reason for a problem and the fix sit on the same screen.</li><li>You can see whether it is waiting on you or on someone else.</li><li>Requirements are shown before you start a change.</li></ul></div>
        <div className="card"><span className="tag">What is real, what is not</span><ul><li>Real: the research, from official public documentation.</li><li>Simulated: all verification, documents, IDs and dashboard numbers.</li><li>No usability testing has been done.</li></ul></div>
      </div></section>
  )
}

export default function App() {
  return (<>
    <a className="skip" href="#main">Skip to content</a>
    <Header/>
    <main id="main">
      <Hero/><About/><Demo/>
      <section id="problem"><p className="tag">The problem</p><h2>Core capabilities of this case study</h2>
        <p className="lead">KYC is a regulatory requirement. This study asks whether unclear requirements, hidden status, hard error recovery and confusing modification flows add avoidable uncertainty on top of it. That is a hypothesis, not an established finding. Out of scope: real verification, real documents and regulatory advice.</p>
        <Capabilities/></section>
      <Horizon n={EVIDENCE.length} label="RECORDED" caption="Observations from official public documentation, each with a source, access date and confidence level."/>
      <Landscape/><section><Orbit/></section>
      <Journeys/><Reasoning/><Prd/><Metrics/>
      <section id="build"><p className="tag">Behind the build</p><h2>What is real and what is simulated</h2>
        <p className="lead">Real: documentation-based research with dated sources, and a typed status state machine with tests. Simulated: all verification, documents, identifiers and dashboard numbers. Limits: URLs for several entries are still pending, live app screens were not tested, and no user research was run.</p></section>
    </main>
    <footer>Independent conceptual prototype. Not an official product of any broker or KYC provider. Demo data only; no regulatory approval implied.</footer>
  </>)
}
