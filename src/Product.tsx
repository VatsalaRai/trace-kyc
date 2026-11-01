import { useState } from 'react'
import { PRD } from './data'

export function Prd() {
  const [t, setT] = useState('Requirements')
  const tabs: Record<string, JSX.Element> = {
    Requirements: <div className="scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table><thead><tr><th>ID</th><th>Requirement</th><th>Priority</th><th>Decision</th></tr></thead><tbody>{PRD.fr.map(r => <tr key={r[0]}><td>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>)}</tbody></table><p className="note">{PRD.prio}</p></div>,
    Scope: <div className="grid"><div className="card"><span className="tag">Target users</span><ul>{PRD.users.map(x => <li key={x}>{x}</li>)}</ul></div><div className="card"><span className="tag">In scope</span><ul>{PRD.inScope.map(x => <li key={x}>{x}</li>)}</ul></div><div className="card"><span className="tag">Out of scope</span><ul>{PRD.outScope.map(x => <li key={x}>{x}</li>)}</ul></div></div>,
    Quality: <div className="grid"><div className="card"><span className="tag">Non-functional</span><ul>{PRD.nfr.map(x => <li key={x}>{x}</li>)}</ul></div><div className="card"><span className="tag">Acceptance criteria</span><ul>{PRD.ac.map(x => <li key={x}>{x}</li>)}</ul></div>{Object.keys(PRD.journeyAC).map(k => <div className="card" key={k}><span className="tag">Journey {k}: acceptance</span><ul>{PRD.journeyAC[k].map(x => <li key={x}>{x}</li>)}</ul><span className="tag">Edge cases</span><ul>{PRD.journeyEdge[k].map(x => <li key={x}>{x}</li>)}</ul></div>)}</div>,
    Risks: <div className="grid"><div className="card"><span className="tag">Dependencies</span><ul>{PRD.deps.map(x => <li key={x}>{x}</li>)}</ul></div><div className="card"><span className="tag">Risks</span><ul>{PRD.risks.map(x => <li key={x}>{x}</li>)}</ul></div><div className="card"><span className="tag">Edge cases</span><ul>{PRD.edge.map(x => <li key={x}>{x}</li>)}</ul></div></div>,
  }
  return (<section id="prd"><p className="tag">06 — Product requirements</p><h2>Compact PRD</h2><p className="lead">{PRD.objective}</p>
    <div className="tabs" role="group">{Object.keys(tabs).map(k => <button key={k} className="btn" aria-pressed={t === k} onClick={() => setT(k)}>{k}</button>)}</div>{tabs[t]}</section>)
}

const DEFS = [['KYC completion rate', 'Verified eligible users', 'Eligible users who started KYC', 'Within a defined observation window'], ['Document rejection rate', 'Rejected document submissions', 'Evaluated document submissions', 'Excludes submissions not yet evaluated'], ['Recovery success rate', 'Users who completed the required correction in the period', 'Users who entered a recoverable error state', 'Period must be defined'], ['Modification completion rate', 'Completed eligible modification requests', 'Initiated eligible modification requests', 'Within a defined window'], ['Verification turnaround', 'Time from defined submission event to final decision', 'n/a (distribution, not a ratio)', 'Report median and percentiles'], ['Support contact rate', 'Users contacting support about KYC', 'Relevant KYC user cohort', 'Cohort definition affects the result']]
const FEEDS: Record<string, string> = { kyc_started: 'Completion denominator', kyc_step_viewed: 'Funnel drop-off', kyc_step_completed: 'Funnel drop-off', kyc_submitted: 'Turnaround start', kyc_status_viewed: 'Status clarity', kyc_issue_displayed: 'Rejection rate; recovery denominator', kyc_correction_started: 'Recovery', kyc_resubmitted: 'Recovery numerator', kyc_verified: 'Completion numerator; turnaround end', modification_started: 'Modification denominator', modification_submitted: 'Modification funnel', modification_completed: 'Modification numerator' }
const LANES = [['Onboarding', ['kyc_started', 'kyc_step_viewed', 'kyc_step_completed', 'kyc_submitted', 'kyc_verified']], ['Tracking and recovery', ['kyc_status_viewed', 'kyc_issue_displayed', 'kyc_correction_started', 'kyc_resubmitted']], ['Modification', ['modification_started', 'modification_submitted', 'modification_completed']]] as const
const FUNNEL: [string, number][] = [['Started', 1000], ['Basic details', 860], ['Method chosen', 790], ['Documents passed', 640], ['Submitted', 590], ['Verified', 480]]
const REASONS: [string, number][] = [['Blurry document', 38], ['Name mismatch', 24], ['Incomplete information', 19], ['Wrong document type', 11], ['Unreadable image', 8]]
const TURN = [3.2, 2.9, 3.4, 2.7, 2.5, 2.8]

export function Metrics() {
  const [ev, setEv] = useState('kyc_issue_displayed')
  const W = 360, H = 120, pts = TURN.map((v, i) => `${20 + i * 64},${H - 15 - (v - 2) * 30}`).join(' ')
  return (
    <section id="metrics"><p className="tag">07 — Measurement and validation</p><h2>Definitions, then a simulated dashboard</h2>
      <div className="scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table><thead><tr><th>Metric</th><th>Numerator</th><th>Denominator</th><th>Limitation</th></tr></thead><tbody>{DEFS.map(d => <tr key={d[0]}>{d.map((c, i) => i ? <td key={i}>{c}</td> : <th scope="row" key={i}>{c}</th>)}</tr>)}</tbody></table></div>
      <h3 style={{ marginTop: 48 }}>Event instrumentation</h3>
      <p className="small">No personal data in events: no PAN, name, address or document content.</p>
      {LANES.map(([l, es]) => <div key={l} className="lane"><span className="tag">{l}</span><div>{es.map((e, i) => <span key={e}><button className="pillb" aria-pressed={ev === e} onClick={() => setEv(e)}>{e}</button>{i < es.length - 1 && <i className="arr">→</i>}</span>)}</div></div>)}
      <p className="note"><b>{ev}</b> feeds: {FEEDS[ev]}</p>
      <div className="sim">SIMULATED DEMO DATA. These numbers are made up to show the dashboard. They are not real customer data, a benchmark, or a measured result.</div>
      <div className="grid dash">
        <div className="card"><span className="tag">Funnel (simulated, of 1,000 starts)</span>{FUNNEL.map(([l, v]) => <div key={l} className="bar"><span>{l}</span><div><i style={{ width: v / 10 + '%' }}/></div><b>{v}</b></div>)}</div>
        <div className="card"><span className="tag">Rejection reasons (simulated, % of rejections)</span>{REASONS.map(([l, v]) => <div key={l} className="bar"><span>{l}</span><div><i style={{ width: v * 2.4 + '%' }}/></div><b>{v}%</b></div>)}</div>
        <div className="card"><span className="tag">Median turnaround, days (simulated, 6 weeks)</span>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Simulated line chart"><line x1="14" y1={H - 15} x2={W - 8} y2={H - 15} stroke="#26314D"/><polyline points={pts} fill="none" stroke="#82D8FF" strokeWidth="2"/>
            {TURN.map((v, i) => <g key={i}><circle cx={20 + i * 64} cy={H - 15 - (v - 2) * 30} r="3.5" fill="#477BFF"/><text x={20 + i * 64} y={H - 2} fontSize="9" fill="#9AA7BE" textAnchor="middle">W{i + 1}</text></g>)}</svg></div>
      </div>
      <p className="small">Funnel and recovery inputs here are fixtures. Validation plan: moderated usability tasks (find the correction, name the next step, start a modification), then an experiment comparing prerequisites-first with form-first once real instrumentation exists.</p>
    </section>
  )
}
