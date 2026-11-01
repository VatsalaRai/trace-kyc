import { useState } from 'react'
import { EVIDENCE, MATRIX, PLATFORMS, PROPOSALS, JOURNEYS, Evidence } from './data'

const byId = (id: string) => EVIDENCE.find(e => e.id === id) as Evidence
const Chip = ({ id }: { id: string }) => <a className="chip" href={'#ev-' + id} title={byId(id).finding}>{id}</a>

export function Landscape() {
  const [p, setP] = useState('All')
  const cols = p === 'All' ? PLATFORMS : [p]
  const rows = EVIDENCE.filter(e => p === 'All' || e.platform === p)
  return (
    <section id="landscape">
      <p className="tag">02 — Competitive landscape</p><h2>What the documentation says</h2>
      <div className="note"><b>Research limitations.</b> This is a documentation review dated 2026-10-30, not usability testing. It cannot say which app has the best experience or completion rate. “Not verified” means evidence was insufficient, not that a feature is missing. Processing windows are platform-specific guidance, not comparable performance. No usability scores are given because no evaluation method has been applied.</div>
      <div className="tabs" role="group" aria-label="Platform filter">{['All', ...PLATFORMS].map(x => <button key={x} className="btn" aria-pressed={p === x} onClick={() => setP(x)}>{x}</button>)}</div>
      <div className="scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table><caption className="sr">Benchmark matrix: evidence type Official public documentation</caption>
        <thead><tr><th>Dimension</th>{cols.map(c => <th key={c}>{c}</th>)}</tr></thead>
        <tbody>{MATRIX.map(r => <tr key={r.dimension}><th scope="row">{r.dimension}</th>{PLATFORMS.map((pl, i) => cols.includes(pl) && (
          <td key={pl} className={r.cells[i].text.startsWith('Not verified') ? 'nv' : ''}>{r.cells[i].text}<div>{r.cells[i].ids.map(id => <Chip key={id} id={id}/>)}</div></td>))}</tr>)}</tbody></table></div>
      <h3 style={{ marginTop: 48 }}>Evidence ledger</h3>
      <div className="scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table><thead><tr><th>ID</th><th>Platform</th><th>Finding</th><th>Source</th><th>Accessed</th><th>Evidence type</th><th>Confidence</th></tr></thead>
        <tbody>{rows.map(e => <tr key={e.id} id={'ev-' + e.id}><td><b>{e.id}</b></td><td>{e.platform}</td>
          <td>{e.finding}{e.note && <div className="small">{e.note}</div>}{e.supplementary && <div className="small">Supplementary entry</div>}</td>
          <td>{e.url ? <a href={e.url} target="_blank" rel="noopener noreferrer">{e.source} ↗</a> : <span>{e.source}<div className="small">URL not yet confirmed</div></span>}{e.urlStatus === 'category-page' && <div className="small">Category page</div>}{e.alsoSee && <div className="small"><a href={e.alsoSee} target="_blank" rel="noopener noreferrer">Related page ↗</a></div>}<div className="small">Support check: {e.supportCheck}</div></td>
          <td>{e.accessed}</td><td>{e.evidenceType}</td><td className={e.confidence.startsWith('Not') ? 'nv' : ''}>{e.confidence}</td></tr>)}</tbody></table></div>
    </section>
  )
}

export function Reasoning() {
  const [o, setO] = useState('P1')
  const p = PROPOSALS.find(x => x.id === o)!
  const chain: [string, string][] = [['Observation (documented)', p.observation], ['Hypothesis', p.hypothesis], ['Design decision (proposed)', p.decision], ['Expected effect', p.effect], ['Success metric', p.metric]]
  return (
    <section id="reasoning">
      <p className="tag">04 — Research and reasoning</p><h2>Evidence → decision</h2>
      <p className="lead">Competitors’ verified capabilities are on the left of each chain. Everything from the hypothesis onward is a TRACE proposal that has not been tested.</p>
      <div className="tabs" role="group">{PROPOSALS.map(x => <button key={x.id} className="btn" aria-pressed={o === x.id} onClick={() => setO(x.id)}>{x.id} {x.title}</button>)}</div>
      <div className="chain">{chain.map(([h, t], i) => <div key={h} className={'link' + (i === 0 ? ' fact' : '')}><span className="tag">{h}</span><p>{t}</p></div>)}</div>
      <p>Evidence: {p.evidence.map(id => <Chip key={id} id={id}/>)}</p>
      <div className="grid"><div className="card"><span className="tag">Alternatives considered</span><p>{p.alternatives}</p></div><div className="card"><span className="tag">Trade-off</span><p>{p.tradeoff}</p></div><div className="card"><span className="tag">Validation needed</span><p>{p.validation}</p></div></div>
    </section>
  )
}

export function Journeys() {
  const [j, setJ] = useState('A'); const [s, setS] = useState(0)
  const jr = JOURNEYS.find(x => x.id === j)!; const st = jr.stages[s]
  return (
    <section id="journeys">
      <p className="tag">03 — Journey analysis</p><h2>Where uncertainty might build</h2>
      <div className="tabs" role="group" aria-label="Journey">{JOURNEYS.map(x => <button key={x.id} className="btn" aria-pressed={j === x.id} onClick={() => { setJ(x.id); setS(0) }}>{x.id}. {x.title}</button>)}</div>
      <div className="stages">{jr.stages.map((x, i) => <button key={x.stage} className={'stage' + (i === s ? ' on' : '')} onClick={() => setS(i)} aria-pressed={i === s}><span className="cn">{String(i + 1).padStart(2, '0')}</span>{x.stage}</button>)}</div>
      <div className="app"><div className="grid">
        {[['Goal', st.goal], ['Action', st.action], ['System response', st.system], ['Dependency', st.dependency], ['Opportunity', st.opportunity]].map(([h, t]) => <div key={h}><span className="tag">{h}</span><p>{t}</p></div>)}
        <div className="fr"><span className="tag">Friction — untested hypothesis</span><p>{st.friction}</p><p>Informed by: {st.evidence.map(id => <Chip key={id} id={id}/>)}</p></div></div>
        <p className="note">Emotional uncertainty is a hypothesis here. No interviews or surveys were conducted.</p></div>
    </section>
  )
}
