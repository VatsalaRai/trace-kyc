// @vitest-environment jsdom
import { describe, it, expect, afterEach, beforeEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import App from './App'
import { Demo } from './Prototype'

beforeEach(() => localStorage.clear())
afterEach(cleanup)
const click = (name: RegExp | string) => fireEvent.click(screen.getByRole('button', { name }))

describe('page', () => {
  it('has a header with navigation, a tagline and an about section', () => {
    render(<App/>)
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeTruthy()
    expect(screen.getByText(/One place to see where your KYC stands/)).toBeTruthy()
    expect(screen.getByText('What TRACE / KYC is')).toBeTruthy()
  })
})
describe('journey A to B', () => {
  it('blocks a bad document, then submits and tracks, and recovers from a rejection', () => {
    render(<Demo/>)
    click('Continue'); click('Continue'); click('Continue')
    expect((screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement).disabled).toBe(true)
    click('Blurry image'); expect(screen.getByRole('status').textContent).toMatch(/too blurry/)
    expect((screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement).disabled).toBe(true)
    click('Clear image'); click('Continue'); click('Submit and track status')
    expect(screen.getAllByText('Submitted').length).toBeGreaterThan(0)
    click('Review begins'); click('Name mismatch')
    expect(screen.getByText(/name on the document differs/)).toBeTruthy()
    click('Correct the affected item'); click('Review'); click('Resubmit')
    expect(screen.getAllByText('Resubmitted').length).toBeGreaterThan(0)
  })
  it('validates the PAN format and keeps input when going back', () => {
    render(<Demo/>)
    click('Continue')
    const pan = screen.getByLabelText(/PAN-format ID/) as HTMLInputElement
    fireEvent.change(pan, { target: { value: 'bad' } })
    expect((screen.getByRole('button', { name: 'Continue' }) as HTMLButtonElement).disabled).toBe(true)
    fireEvent.change(pan, { target: { value: 'QWERT9876Z' } }); click('Continue'); click('Back')
    expect((screen.getByLabelText(/PAN-format ID/) as HTMLInputElement).value).toBe('QWERT9876Z')
  })
})
describe('journey B empty state and C', () => {
  it('shows an empty state with a way in', () => {
    render(<Demo/>); click(/Track or resolve/)
    expect(screen.getByText(/No application yet/)).toBeTruthy(); click('Start a new KYC')
    expect(screen.getByText('Before you start')).toBeTruthy()
  })
  it('completes the modification flow with its own request ID', () => {
    render(<Demo/>); click(/Update existing KYC/)
    click('Update my address'); click('Review changes'); click('Submit modification')
    expect(screen.getByText('MOD-DEMO-0001')).toBeTruthy()
    click('Review begins'); click('Mark verified'); expect(screen.getAllByText('Verified').length).toBeGreaterThan(0)
  })
})
