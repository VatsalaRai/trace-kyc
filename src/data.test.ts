import { describe, it, expect } from 'vitest'
import { EVIDENCE, PROPOSALS, JOURNEYS, MATRIX } from './data'
const ids = new Set(EVIDENCE.map(e => e.id))
describe('research data', () => {
  it('every entry has date, type and https url or is marked pending', () => {
    for (const e of EVIDENCE) { expect(e.accessed).toBe('2026-10-30'); expect(e.evidenceType).toBe('Official public documentation'); if (e.url) expect(e.url.startsWith('https://')).toBe(true); else expect(e.urlStatus).toBe('pending') }
  })
  it('every proposal, journey stage and matrix cell cites existing evidence', () => {
    for (const p of PROPOSALS) { expect(p.evidence.length).toBeGreaterThan(0); p.evidence.forEach(i => expect(ids.has(i)).toBe(true)) }
    JOURNEYS.forEach(j => j.stages.forEach(s => s.evidence.forEach(i => expect(ids.has(i)).toBe(true))))
    MATRIX.forEach(r => r.cells.forEach(c => c.ids.forEach(i => expect(ids.has(i)).toBe(true))))
  })
  it('every entry records whether the page supports the claim', () => { EVIDENCE.forEach(e => expect(e.supportCheck.length).toBeGreaterThan(5)) })
  it('never states improved outcomes', () => { PROPOSALS.forEach(p => expect(p.effect).toMatch(/Hypothesised/)) })
})
