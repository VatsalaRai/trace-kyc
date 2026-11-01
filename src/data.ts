import raw from './data/research.json'
export interface Evidence { id: string; platform: string; dimension: string; finding: string; confidence: string; evidenceType: string; source: string; url: string | null; urlStatus: string; accessed: string; note?: string; supplementary?: boolean; supportCheck: string; alsoSee?: string }
export interface Proposal { id: string; title: string; observation: string; hypothesis: string; decision: string; effect: string; metric: string; evidence: string[]; alternatives: string; tradeoff: string; validation: string }
export interface Stage { stage: string; goal: string; action: string; system: string; friction: string; opportunity: string; dependency: string; evidence: string[] }
export const EVIDENCE = raw.evidence as unknown as Evidence[]
export const PLATFORMS = raw.platforms as string[]
export const MATRIX = raw.matrix as { dimension: string; cells: { text: string; ids: string[] }[] }[]
export const PROPOSALS = raw.proposals as unknown as Proposal[]
export const JOURNEYS = raw.journeys as unknown as { id: string; title: string; stages: Stage[] }[]
export const PRD = raw.prd as unknown as { objective: string; users: string[]; inScope: string[]; outScope: string[]; fr: string[][]; nfr: string[]; ac: string[]; deps: string[]; risks: string[]; edge: string[]; prio: string; journeyAC: Record<string, string[]>; journeyEdge: Record<string, string[]> }
