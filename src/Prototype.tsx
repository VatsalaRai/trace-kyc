import { useEffect, useRef, useState } from 'react'
import { Status, Ev, next, can, LABEL, ISSUES, Issue, validPan } from './machine'

type J = 'A' | 'B' | 'C'
const KEY = 'trace-kyc-demo-v1' // stores only journey, step and status: never names or IDs
const okStatus = (s: unknown): Status => (typeof s === 'string' && s in LABEL ? (s as Status) : 'not_started')
function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} } }
const DEMO = { name: 'Demo Person', pan: 'ABCDE1234F', address: '12 Sample Street, Demo City' }
const NEXT: Record<Status, string> = {
  not_started: 'Nothing has been started yet.', draft: 'Your draft is saved. Submit when ready.',
  submitted: 'Your request is queued. No turnaround time is guaranteed.', under_review: 'A reviewer is checking it. Nothing is needed from you right now.',
  action_required: 'Action needed from you: see the reason below.', rejected: 'This submission was not accepted. You can correct the affected item and resubmit.',
  resubmitted: 'Resubmission received. It goes back to review.', verified: 'Simulated verified state. A real outcome depends on the regulated process.',
}
const WHO: Record<Status, string> = { not_started: '', draft: 'Waiting for you', submitted: 'With the platform', under_review: 'Under review (may involve external parties)', action_required: 'Waiting for you', rejected: 'Waiting for you', resubmitted: 'With the platform', verified: 'Done' }

function Steps({ labels, at }: { labels: string[]; at: number }) {
  return (<ol className="steps" aria-label="Progress">{labels.map((l, i) => <li key={l} aria-current={i === at ? 'step' : undefined} className={i < at ? 'done' : i === at ? 'now' : ''}><span>{i < at ? '✓' : i + 1}</span>{l}</li>)}</ol>)
}

function Tracker({ status, setStatus, issue, setIssue, ref0, noun, onEmpty }: { status: Status; setStatus: (s: Status) => void; issue: Issue | null; setIssue: (i: Issue | null) => void; ref0: string; noun: string; onEmpty?: () => void }) {
  const [hist, setHist] = useState<Status[]>([status])
  useEffect(() => { setHist(h => (status === 'not_started' ? [status] : h[h.length - 1] === status ? h : h.length === 1 && h[0] === 'not_started' ? [status] : [...h, status])) }, [status])
  const [fix, setFix] = useState(0); const [name, setName] = useState('Demo Person'); const [picked, setPicked] = useState(false)
  const go = (e: Ev, i?: Issue) => { if (!can(status, e)) return; setStatus(next(status, e)); setIssue(i ?? null); setFix(0); setPicked(false) }
  if (status === 'not_started') return (
    <div><h3>No {noun.toLowerCase()} yet</h3><p>Start one and its status will appear here with what to do next.</p>
      {onEmpty && <button className="btn p" onClick={onEmpty}>Start a new KYC</button>}
      <details><summary>Or jump straight to a scenario (simulation control)</summary><p className="small">Start a KYC in journey A first, so the scenario has something to act on.</p></details></div>)
  const btns: [string, Ev, Issue?][] = [['Review begins', 'REVIEW'], ['Mark verified', 'VERIFY'], ['Blurry document', 'REQUEST_INFO', 'blurry'], ['Wrong type', 'REJECT', 'wrong_type'], ['Incomplete', 'REQUEST_INFO', 'incomplete'], ['Name mismatch', 'REJECT', 'mismatch']]
  const fixable = status === 'action_required' || status === 'rejected'
  const nameOk = name.trim().length > 1
  return (
    <div>
      <p>{noun} ID <b>{ref0}</b> <small>(demo identifier)</small></p>
      <p aria-live="polite"><span className="pill">{LABEL[status]}</span> {WHO[status] && <span className="small">· {WHO[status]}</span>}</p>
      <p><b>What happens next:</b> {NEXT[status]}</p>
      {issue && <div className="note"><b>Why:</b> {ISSUES[issue].reason}<br/><b>What to do:</b> {ISSUES[issue].action}</div>}
      {fixable && fix === 0 && <button className="btn p" onClick={() => setFix(1)}>Correct the affected item</button>}
      {fixable && fix === 1 && (<div className="card"><p className="tag">Step 1 of 2 · fix only what was flagged</p>
        {issue === 'mismatch' ? <><label htmlFor="fx">Name (fictional)</label><input id="fx" value={name} onChange={e => setName(e.target.value)}/><div className="err">{nameOk ? '' : 'Enter a name.'}</div></>
          : <button className="btn" aria-pressed={picked} onClick={() => setPicked(true)}>{picked ? '✓ Clear sample document selected' : 'Use the clear sample document'}</button>}
        <div className="row"><button className="btn" onClick={() => setFix(0)}>Cancel</button><button className="btn p" disabled={issue === 'mismatch' ? !nameOk : !picked} onClick={() => setFix(2)}>Review</button></div></div>)}
      {fixable && fix === 2 && (<div className="card"><p className="tag">Step 2 of 2 · review</p><p><b>Changing:</b> {issue === 'mismatch' ? `name → ${name}` : 'the flagged document'}<br/><b>Kept as is:</b> all your other details.</p>
        <div className="row"><button className="btn" onClick={() => setFix(1)}>Back</button><button className="btn p" onClick={() => go('RESUBMIT')}>Resubmit</button></div></div>)}
      <h4>Status history</h4>
      <ol className="tl" aria-label="Status history">{hist.map((h, i) => <li key={i}>{LABEL[h]}</li>)}</ol>
      <details><summary>Scenario explorer (simulation control)</summary>
        <div className="row">{btns.map(([l, e, i]) => <button key={l} className="btn" disabled={!can(status, e)} onClick={() => go(e, i)}>{l}</button>)}</div>
        <p className="small">Buttons turn off when the move is not allowed from the current state.</p></details>
      <p className="note">Delayed? No turnaround is promised. If you contact support, have your {noun.toLowerCase()} ID, submission date and current status ready.</p>
    </div>
  )
}

const A_STEPS = ['Prepare', 'Details', 'Method', 'Document', 'Review']
function JourneyA({ step, setStep, goTrack }: { step: number; setStep: (n: number) => void; goTrack: () => void }) {
  const [p, setP] = useState(DEMO); const [doc, setDoc] = useState(''); const [m, setM] = useState('digilocker')
  const errs = { name: p.name.trim() ? '' : 'Enter a name.', pan: validPan(p.pan) ? '' : 'Format: 5 letters, 4 digits, 1 letter, for example ABCDE1234F.' }
  const ok = [true, !errs.name && !errs.pan, true, doc === 'sharp', true][step]
  const warn: Record<string, string> = { blurry: 'Quality check: the image is too blurry. Pick the clear sample to continue.', wrong: 'This is not an accepted document type for this method. Pick the clear sample to continue.' }
  return (
    <div>
      <Steps labels={A_STEPS} at={step}/>
      {step === 0 && <><h3>Before you start</h3><p>KYC is a regulatory identity check. Typically you need an identity document, an address document and a bank link. This demo uses fictional data, collects nothing real and sends nothing anywhere.</p><ul><li>Have a PAN-format ID ready (a fictional one is filled in)</li><li>Know which verification method you would use</li><li>Expect a review step after you submit</li></ul></>}
      {step === 1 && <><h3>Basic details (demo)</h3><label htmlFor="n">Full name (fictional)</label><input id="n" value={p.name} onChange={e => setP({ ...p, name: e.target.value })} aria-invalid={!!errs.name}/><div className="err">{errs.name}</div>
        <label htmlFor="pan">PAN-format ID (fictional)</label><input id="pan" value={p.pan} onChange={e => setP({ ...p, pan: e.target.value.toUpperCase() })} aria-invalid={!!errs.pan} maxLength={10}/><div className="err">{errs.pan}</div></>}
      {step === 2 && <><h3>Verification method (simulated)</h3><label htmlFor="m">Real availability depends on the platform and regulation.</label>
        <select id="m" value={m} onChange={e => setM(e.target.value)}><option value="digilocker">DigiLocker-style verification (simulated)</option><option value="alt">Alternative document (simulated)</option></select></>}
      {step === 3 && <><h3>Document check (simulated)</h3><p>Pick a bundled sample. Nothing is uploaded. Try the other two to see the warnings.</p>
        <div className="row">{[['sharp', 'Clear image'], ['blurry', 'Blurry image'], ['wrong', 'Wrong document']].map(([k, l]) => <button key={k} aria-pressed={doc === k} className="btn" onClick={() => setDoc(k)}>{l}</button>)}</div>
        {doc && <p className={doc === 'sharp' ? 'okmsg' : 'err'} role="status">{doc === 'sharp' ? '✓ Quality check passed.' : warn[doc]}</p>}</>}
      {step === 4 && <><h3>Review before submitting</h3>{[['Name', p.name, 1], ['ID', p.pan, 1], ['Method', m === 'digilocker' ? 'DigiLocker-style (simulated)' : 'Alternative document (simulated)', 2], ['Document', 'Clear sample', 3]].map(([l, v, s]) => <p key={String(l)}>{l}: <b>{v}</b> <button className="btn sm" onClick={() => setStep(s as number)}>Edit</button></p>)}<p className="small">Submitting does not guarantee successful KYC.</p></>}
      <div className="row">{step > 0 && <button className="btn" onClick={() => setStep(step - 1)}>Back</button>}
        {step < 4 ? <button className="btn p" disabled={!ok} onClick={() => setStep(step + 1)}>Continue</button> : <button className="btn p" onClick={goTrack}>Submit and track status</button>}</div>
      {!ok && step === 3 && <p className="small">Select the clear image to continue.</p>}
    </div>
  )
}

const FIELDS = [['Name', 'Not available for self-service change'], ['ID number', 'Not available for self-service change'], ['Address', 'Editable; may need re-verification'], ['Contact details', 'Editable']]
function JourneyC({ status, setStatus, issue, setIssue }: { status: Status; setStatus: (s: Status) => void; issue: Issue | null; setIssue: (i: Issue | null) => void }) {
  const [step, setStep] = useState(status === 'not_started' ? 0 : 3); const [addr, setAddr] = useState('48 New Lane, Sample Town')
  const err = addr.trim().length < 8 ? 'Enter at least 8 characters.' : ''
  return (
    <div>
      <Steps labels={['Profile', 'Requirements', 'Review', 'Track']} at={step}/>
      {step === 0 && <><h3>Your verified profile (fictional)</h3><div className="scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table><tbody>{FIELDS.map(f => <tr key={f[0]}><th scope="row">{f[0]}</th><td>{f[1]}</td></tr>)}</tbody></table></div>
        <p className="note">Eligibility varies by platform and regulation. Some changes need a different regulated process.</p><button className="btn p" onClick={() => setStep(1)}>Update my address</button></>}
      {step === 1 && <><h3>Update address</h3><p>You would need: the new address and a supporting document (simulated). Re-verification may be required, and it may not be completable fully online.</p>
        <label htmlFor="a">New address (fictional)</label><input id="a" value={addr} onChange={e => setAddr(e.target.value)} aria-invalid={!!err}/><div className="err">{err}</div>
        <div className="row"><button className="btn" onClick={() => setStep(0)}>Back</button><button className="btn p" disabled={!!err} onClick={() => setStep(2)}>Review changes</button></div></>}
      {step === 2 && <><h3>Review changes</h3><div className="scroll" tabIndex={0} role="region" aria-label="Scrollable table"><table><thead><tr><th>Field</th><th>Old</th><th>New</th></tr></thead><tbody><tr><th scope="row">Address</th><td>{DEMO.address}</td><td><b>{addr}</b></td></tr></tbody></table></div>
        <div className="row"><button className="btn" onClick={() => setStep(1)}>Back</button><button className="btn p" onClick={() => { setStatus('submitted'); setStep(3) }}>Submit modification</button></div></>}
      {step === 3 && <><h3>Modification request</h3><Tracker status={status} setStatus={setStatus} issue={issue} setIssue={setIssue} ref0="MOD-DEMO-0001" noun="Modification request"/>
        {status === 'verified' && <button className="btn" onClick={() => { setStatus('not_started'); setIssue(null); setStep(0) }}>Make another change</button>}</>}
    </div>
  )
}

const CHOICES: [J, string, string][] = [['A', 'Start new KYC', 'Five guided steps, then track it'], ['B', 'Track or resolve', 'See status, understand a problem, fix it'], ['C', 'Update existing KYC', 'Change an address and track the request']]
export function Demo() {
  const saved = useRef(load()).current
  const [j, setJ] = useState<J>(saved.j === 'B' || saved.j === 'C' ? saved.j : 'A')
  const [a, setA] = useState<number>(typeof saved.a === 'number' && saved.a >= 0 && saved.a <= 4 ? saved.a : 0)
  const [sB, setSB] = useState<Status>(okStatus(saved.sB)); const [iB, setIB] = useState<Issue | null>(saved.iB in ISSUES ? saved.iB : null)
  const [sC, setSC] = useState<Status>(okStatus(saved.sC)); const [iC, setIC] = useState<Issue | null>(saved.iC in ISSUES ? saved.iC : null)
  const top = useRef<HTMLDivElement>(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ j, a, sB, iB, sC, iC })) } catch { /* storage unavailable */ } }, [j, a, sB, iB, sC, iC])
  const show = (k: J) => { setJ(k); top.current?.scrollIntoView?.({ block: 'nearest' }) }
  const reset = () => { if (window.confirm('Reset the whole demo? This clears all three journeys.')) { setA(0); setSB('not_started'); setIB(null); setSC('not_started'); setIC(null); setJ('A') } }
  return (
    <section id="demo">
      <p className="tag">Interactive experience</p><h2>Try the three journeys</h2>
      <p className="note">Demo only. Fictional data. Nothing is verified, uploaded or stored on a server. Your progress is saved in this browser so you can come back, and “Back” never loses what you entered.</p>
      <div className="app" ref={top}>
        <div className="choose" role="group" aria-label="Choose a journey">{CHOICES.map(([k, t, d]) => <button key={k} aria-pressed={j === k} onClick={() => show(k)}><b>{t}</b><span>{d}</span></button>)}</div>
        <div hidden={j !== 'A'}><JourneyA step={a} setStep={setA} goTrack={() => { setSB('submitted'); setIB(null); show('B') }}/></div>
        <div hidden={j !== 'B'}><Tracker status={sB} setStatus={setSB} issue={iB} setIssue={setIB} ref0="KYC-DEMO-0001" noun="Application" onEmpty={() => show('A')}/></div>
        <div hidden={j !== 'C'}><JourneyC status={sC} setStatus={setSC} issue={iC} setIssue={setIC}/></div>
        <p className="small"><button className="linkbtn" onClick={reset}>Reset demo</button></p>
      </div>
    </section>
  )
}
