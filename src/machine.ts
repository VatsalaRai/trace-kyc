export type Status = 'not_started'|'draft'|'submitted'|'under_review'|'action_required'|'rejected'|'resubmitted'|'verified'
export type Ev = 'SAVE'|'SUBMIT'|'REVIEW'|'REQUEST_INFO'|'REJECT'|'RESUBMIT'|'VERIFY'
const T: Record<Status, Partial<Record<Ev, Status>>> = {
  not_started: { SAVE: 'draft' },
  draft: { SUBMIT: 'submitted' },
  submitted: { REVIEW: 'under_review' },
  under_review: { REQUEST_INFO: 'action_required', REJECT: 'rejected', VERIFY: 'verified' },
  action_required: { RESUBMIT: 'resubmitted' },
  rejected: { RESUBMIT: 'resubmitted' },
  resubmitted: { REVIEW: 'under_review' },
  verified: {},
}
export const can = (s: Status, e: Ev) => e in T[s]
export const next = (s: Status, e: Ev): Status => T[s][e] ?? s // impossible transitions are no-ops
export const LABEL: Record<Status, string> = {
  not_started: 'Not started', draft: 'Draft', submitted: 'Submitted', under_review: 'Under review',
  action_required: 'Additional information required', rejected: 'Rejected', resubmitted: 'Resubmitted', verified: 'Verified',
}
export const ISSUES = {
  blurry: { reason: 'The document photo was too blurry to read the document number.', action: 'Re-upload a sharper sample image of the same document.' },
  wrong_type: { reason: 'The document submitted is not in the list of accepted types for this method.', action: 'Choose an accepted document type and upload it again.' },
  incomplete: { reason: 'The address line on the document is cut off.', action: 'Upload an image showing the full document, edge to edge.' },
  mismatch: { reason: 'The name on the document differs from the name in your details (fictional data).', action: 'Correct the name field only; other details are kept.' },
} as const
export type Issue = keyof typeof ISSUES
export const validPan = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v) // format check only, demo
