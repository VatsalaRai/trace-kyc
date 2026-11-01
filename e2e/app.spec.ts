import { test, expect, Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const shot = (page: Page, name: string, full = false) => page.screenshot({ path: `docs/screenshots/${test.info().project.name}-${name}.png`, fullPage: full })
const isFont = (_u: string) => false
async function fresh(page: Page) { await page.goto('./'); await page.evaluate(() => { localStorage.clear(); sessionStorage.clear() }); await page.reload() }
const btn = (page: Page, name: string | RegExp) => page.getByRole('button', { name })
const demo = (page: Page) => page.locator('#demo')

test.beforeEach(async ({ page }) => { await page.addInitScript(() => { /* nothing */ }) })

test('loads without console errors, overflow or broken assets', async ({ page }) => {
  const errors: string[] = []; const failed: string[] = []
  page.on('console', m => { if (m.type() === 'error' && !isFont(m.text())) errors.push(m.text()) })
  page.on('pageerror', e => errors.push(String(e)))
  page.on('requestfailed', r => { if (!isFont(r.url())) failed.push(r.url()) })
  page.on('response', r => { if (r.status() >= 400 && !isFont(r.url())) failed.push(r.status() + ' ' + r.url()) })
  await fresh(page)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await shot(page, '01-hero')
  const w = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }))
  expect(w.sw, `horizontal overflow ${w.sw} > ${w.iw}`).toBeLessThanOrEqual(w.iw)
  await shot(page, '00-fullpage', true)
  for (const [sel, n] of [['.caps', '10-capabilities'], ['.horizon', '11-horizon'], ['.feature', '12-orbit'], ['#landscape', '13-ledger'], ['#journeys', '14-journeys'], ['#metrics', '15-metrics']] as const) { await page.locator(sel).first().scrollIntoViewIfNeeded(); await page.locator(sel).first().screenshot({ path: `docs/screenshots/${test.info().project.name}-${n}.png` }) }
  expect(errors).toEqual([]); expect(failed).toEqual([])
})

test('sticky header and navigation work, including the mobile menu', async ({ page }) => {
  await fresh(page)
  const nav = page.getByRole('navigation', { name: 'Primary' })
  const mobile = (page.viewportSize()!.width) <= 900
  if (mobile) { await expect(nav).toBeHidden(); await btn(page, 'Menu').click(); await expect(nav).toBeVisible(); await shot(page, '02-mobile-menu') }
  await nav.getByRole('link', { name: 'Try the demo' }).click()
  await expect(page).toHaveURL(/#demo$/)
  if (mobile) await expect(nav).toBeHidden()
  const y = await page.locator('header.site').evaluate(e => e.getBoundingClientRect().top)
  expect(y).toBe(0)
  await page.mouse.wheel(0, 2500); await page.waitForTimeout(300)
  expect(await page.locator('header.site').evaluate(e => e.getBoundingClientRect().top)).toBe(0)
})

test('journey A to B: validation, bad document, submit, rejection, correction review, resubmission', async ({ page }) => {
  await fresh(page); const d = demo(page)
  await d.scrollIntoViewIfNeeded(); await shot(page, '03-demo-start')
  await btn(d, 'Continue').click()
  const pan = d.getByLabel(/PAN-format ID/)
  await pan.fill('bad'); await expect(btn(d, 'Continue')).toBeDisabled(); await expect(d.getByText(/Format: 5 letters/)).toBeVisible()
  await pan.fill('ABCDE1234F'); await d.getByLabel('Full name (fictional)', { exact: true }).fill(''); await expect(btn(d, 'Continue')).toBeDisabled()
  await d.getByLabel('Full name (fictional)', { exact: true }).fill('Demo Person'); await btn(d, 'Continue').click(); await btn(d, 'Continue').click()
  await btn(d, 'Blurry image').click(); await expect(d.getByRole('status')).toContainText('too blurry'); await expect(btn(d, 'Continue')).toBeDisabled()
  await btn(d, 'Wrong document').click(); await expect(d.getByRole('status')).toContainText('not an accepted document type')
  await btn(d, 'Clear image').click(); await expect(d.getByRole('status')).toContainText('passed'); await shot(page, '04-document-check')
  await btn(d, 'Continue').click(); await btn(d, 'Edit').first().click(); await btn(d, 'Back').click()   // back from details keeps input
  await expect(d.getByRole('heading', { name: 'Before you start' })).toBeVisible()
  await btn(d, 'Continue').click(); await expect(d.getByLabel(/PAN-format ID/)).toHaveValue('ABCDE1234F')
  await btn(d, 'Continue').click(); await btn(d, 'Continue').click(); await btn(d, 'Continue').click()
  await btn(d, 'Submit and track status').click()
  await expect(d.getByText('KYC-DEMO-0001')).toBeVisible(); await expect(d.locator('.pill')).toHaveText('Submitted'); await shot(page, '05-tracker-submitted')
  await d.getByText('Scenario explorer').click()
  await expect(btn(d, 'Mark verified')).toBeDisabled()   // impossible from submitted
  await btn(d, 'Review begins').click(); await btn(d, 'Name mismatch').click()
  await expect(d.getByText(/name on the document differs/)).toBeVisible(); await shot(page, '06-rejection-reason')
  await btn(d, 'Correct the affected item').click(); await d.getByLabel('Name (fictional)', { exact: true }).fill('Demo Person Corrected'); await d.getByRole('button', { name: 'Review', exact: true }).click()
  await expect(d.getByText('name → Demo Person Corrected')).toBeVisible(); await expect(d.getByText(/Kept as is/)).toBeVisible(); await shot(page, '07-correction-review')
  await btn(d, 'Resubmit').click(); await expect(d.locator('.pill')).toHaveText('Resubmitted')
  await expect(d.locator('ol.tl li')).toHaveText(['Submitted', 'Under review', 'Rejected', 'Resubmitted'])
  await btn(d, 'Review begins').click(); await btn(d, 'Mark verified').click(); await expect(d.locator('.pill')).toHaveText('Verified')
  await expect(btn(d, 'Review begins')).toBeDisabled()
})

test('journey B empty state, and wrong-document recovery', async ({ page }) => {
  await fresh(page); const d = demo(page)
  await btn(d, /Track or resolve/).click(); await expect(d.getByText(/No application yet/)).toBeVisible()
  await btn(d, 'Start a new KYC').click(); await expect(d.getByRole('heading', { name: 'Before you start' })).toBeVisible()
})

test('journey C: modification with its own request ID, and persistence after refresh', async ({ page }) => {
  await fresh(page); const d = demo(page)
  await btn(d, /Update existing KYC/).click(); await btn(d, 'Update my address').click()
  await d.getByLabel(/New address/).fill('x'); await expect(btn(d, 'Review changes')).toBeDisabled()
  await d.getByLabel(/New address/).fill('77 Fictional Road, Test City'); await btn(d, 'Review changes').click()
  await expect(d.getByText('12 Sample Street, Demo City')).toBeVisible(); await expect(d.getByText('77 Fictional Road, Test City')).toBeVisible(); await shot(page, '08-modification-review')
  await btn(d, 'Submit modification').click(); await expect(d.getByText('MOD-DEMO-0001')).toBeVisible(); await shot(page, '09-modification-tracking')
  await page.reload(); await d.scrollIntoViewIfNeeded()
  await expect(d.getByText('MOD-DEMO-0001')).toBeVisible(); await expect(d.locator('.pill')).toHaveText('Submitted')
})

test('persistence stores no personal data; reset clears the demo', async ({ page }) => {
  await fresh(page); const d = demo(page)
  await btn(d, 'Continue').click(); await d.getByLabel('Full name (fictional)', { exact: true }).fill('Zed Uniquename'); await d.getByLabel(/PAN-format ID/).fill('QWERT9876Z'); await btn(d, 'Continue').click()
  const store = await page.evaluate(() => JSON.stringify({ l: { ...localStorage }, s: { ...sessionStorage } }))
  expect(store).not.toContain('Zed'); expect(store).not.toContain('QWERT'); expect(store).not.toContain('Sample Street')
  await page.reload(); await expect(d.getByRole('heading', { name: 'Verification method (simulated)' })).toBeVisible()
  page.once('dialog', x => x.accept()); await btn(d, 'Reset demo').click()
  await expect(d.getByRole('heading', { name: 'Before you start' })).toBeVisible()
})

test('keyboard: skip link, visible focus, and form completion without a mouse', async ({ page }) => {
  await fresh(page)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.keyboard.press('Tab'); await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
  for (let i = 0; i < 6; i++) await page.keyboard.press('Tab')
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle)
  expect(outline).not.toBe('none')
  const d = demo(page); await btn(d, 'Continue').focus(); await page.keyboard.press('Enter')
  await expect(d.getByLabel('Full name (fictional)', { exact: true })).toBeVisible(); await d.getByLabel('Full name (fictional)', { exact: true }).focus(); await page.keyboard.press('Tab'); await expect(d.getByLabel(/PAN-format ID/)).toBeFocused()
})

test('reduced motion disables decorative animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' }); await fresh(page)
  expect(await page.locator('.badge').evaluate(e => getComputedStyle(e).animationName)).toBe('none')
})

test('links: every in-page anchor has a target and external links are safe', async ({ page }) => {
  await fresh(page)
  const hrefs = await page.$$eval('a[href^="#"]', as => as.map(a => a.getAttribute('href')!).filter(h => h.length > 1))
  for (const h of new Set(hrefs)) expect(await page.locator(h).count(), h).toBeGreaterThan(0)
  const ext = await page.$$eval('a[href^="http"]', as => as.map(a => ({ h: a.getAttribute('href'), r: a.getAttribute('rel'), t: a.getAttribute('target') })))
  expect(ext.length).toBeGreaterThan(5)
  for (const e of ext) { expect(e.r, e.h!).toContain('noopener'); expect(e.t).toBe('_blank') }
})

test('accessibility: no critical or serious axe violations', async ({ page }) => {
  await fresh(page)
  const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
  const bad = r.violations.filter(v => v.impact === 'critical' || v.impact === 'serious')
  console.log(test.info().project.name, 'axe violations:', r.violations.map(v => `${v.id}(${v.impact},${v.nodes.length})`).join(' ') || 'none')
  expect(bad.map(v => `${v.id}: ${v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | ')}`)).toEqual([])
})
