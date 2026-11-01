import { useState } from 'react'
import { EVIDENCE } from './data'
import { LABEL } from './machine'

export function Hero() {
  return (
    <div className="hero" id="top">
      <svg className="ribbon" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <linearGradient id="rib" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#0a1a8a" stopOpacity="0"/><stop offset=".4" stopColor="#1f3fe0"/><stop offset=".8" stopColor="#5f9bff"/><stop offset="1" stopColor="#fff"/></linearGradient>
          <filter id="bl" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="42"/></filter>
        </defs>
        <g className="glow"><path d="M-120 700C260 640 640 600 960 430S1380 170 1580 90L1580 420C1300 470 960 700 560 800C280 870 20 860 -120 820Z" fill="url(#rib)" filter="url(#bl)"/></g>
      </svg>
      <div className="hero-copy"><p className="tag">Independent Product Case Study / 2026</p>
        <h1>Identity verification is necessary. Uncertainty shouldn’t be.</h1>
        <p className="tagline">One place to see where your KYC stands, what happens next, and exactly how to fix a problem.</p>
        <p className="lead">How it could be better: clearer status, explicit next actions, recovery guidance and change prerequisites. That is a hypothesis being tested, not a proven result.</p>
        <div className="row"><a className="btn p" href="#demo">Explore the Experience</a><a className="btn" href="#landscape">View Research</a></div></div>
      <svg className="badge" viewBox="0 0 100 100" aria-hidden><defs><path id="c" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0"/></defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeOpacity=".5"/><text fontSize="9.5" fill="#fff"><textPath href="#c">trace · trace · trace · trace · trace ·</textPath></text>
        <path d="M50 35 L53.5 46.5 L65 50 L53.5 53.5 L50 65 L46.5 53.5 L35 50 L46.5 46.5Z" fill="#fff"/></svg>
      <span className="scroll-ind" aria-hidden>scroll</span>
    </div>
  )
}

export function Capabilities() {
  const [on, setOn] = useState(1)
  const items = [[`${EVIDENCE.length}`, 'Evidence', 'Entries from official public documentation across four platforms, each with a source, date and confidence.'], ['3', 'Journeys', 'New KYC, tracking and recovery, and modification, all on demo data.'], [`${Object.keys(LABEL).length}`, 'Status states', 'A typed state machine that blocks impossible transitions.'], ['12', 'Events', 'Instrumentation names for funnel and operations analysis.']]
  return (<div className="caps">{items.map((it, i) => (
    <button key={i} className={'cap' + (on === i ? ' on' : '')} onClick={() => setOn(i)} aria-pressed={on === i}>
      <span className="cn">{String(i + 1).padStart(2, '0')}</span><b>{it[1]}</b><span className="cd">{it[0]} — {it[2]}</span><span className="spark" aria-hidden>✦</span></button>))}</div>)
}

export function Horizon({ n, label, caption }: { n: number | string; label: string; caption: string }) {
  return (<div className="horizon"><p className="hl">{label}</p><div className="hn" aria-label={String(n)}>{n}</div><div className="arc" aria-hidden/><div className="hc"><i/><p>{caption}</p></div></div>)
}

const NODES = [
  { k: 'PAN', x: 92, y: 150, t: 'Listed as an onboarding input for Zerodha (Z01).' },
  { k: 'DigiLocker', x: 306, y: 112, t: 'Aadhaar/DigiLocker appears in Zerodha onboarding (Z01); Angel One’s address change fetches Aadhaar through DigiLocker and ends in e-sign (A05).' },
  { k: 'KRA', x: 338, y: 236, t: 'Zerodha says KRA verification may delay activation (Z02); Groww reverification relates to KRA confirmation (G02, G05).' },
  { k: 'IPV', x: 250, y: 330, t: 'In-person verification is listed for Zerodha online onboarding in the research report (Z01). The cited page excerpt did not show it directly.' },
  { k: 'e-sign', x: 108, y: 282, t: 'E-sign appears in Zerodha onboarding (Z01). The report also lists it for Groww and Upstox (G01, U01), but those sources are still pending.' },
  { k: 'Bank', x: 200, y: 58, t: 'Bank details validation is one of six Angel One issue categories (A02).' },
]
export function Orbit() {
  const [k, setK] = useState(NODES[2])
  return (
    <div className="feature">
      <div className="fcopy"><span className="fpill">FEATURE</span><h3>Verification dependencies</h3><hr/>
        <p>The globe maps steps and parties that the documentation says a KYC journey can depend on. Select a node.</p>
        <p className="sel"><b>{k.k}</b> — {k.t}</p></div>
      <svg viewBox="0 0 400 400" role="group" aria-label="Dependency orbit diagram">
        <defs><radialGradient id="sph" cx=".38" cy=".3" r=".9"><stop offset="0" stopColor="#8fd0ff"/><stop offset=".45" stopColor="#2a62e8"/><stop offset="1" stopColor="#06103a"/></radialGradient>
          <filter id="g2"><feGaussianBlur stdDeviation="3"/></filter></defs>
        <circle cx="200" cy="200" r="150" fill="url(#sph)"/>
        {[-90, -45, 0, 45, 90].map(y => <ellipse key={y} cx="200" cy={200 + y} rx={Math.sqrt(150 ** 2 - y ** 2)} ry="14" fill="none" stroke="#bfe0ff" strokeOpacity=".18"/>)}
        <g className="spin">{[0, 60, 120].map(r => <ellipse key={r} cx="200" cy="200" rx="185" ry="70" fill="none" stroke="#bfe0ff" strokeOpacity=".7" transform={`rotate(${r} 200 200)`}/>)}</g>
        {NODES.map(n => (<g key={n.k} tabIndex={0} role="button" aria-label={n.k} onClick={() => setK(n)} onKeyDown={e => e.key === 'Enter' && setK(n)} style={{ cursor: 'pointer' }}>
          <circle cx={n.x} cy={n.y} r="10" fill="#9fd8ff" filter="url(#g2)"/><circle cx={n.x} cy={n.y} r={k.k === n.k ? 6 : 4} fill="#fff"/>
          <text x={n.x} y={n.y - 14} fontSize="11" fill="#fff" textAnchor="middle">{n.k}</text></g>))}
      </svg>
    </div>
  )
}
