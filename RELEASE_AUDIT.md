# Release audit

Audit date: 2026-10-30. Scope: the project itself (app, research, docs, tests). GitHub publishing and portfolio use were out of scope for this pass.

Status key: PASS (evidence recorded), FAIL, UNVERIFIED (not tested), N/A.

## Commands run and results

| Command | Result |
|---|---|
| `npm install` | OK |
| `npx tsc --noEmit` | OK, no errors |
| `npm test` (vitest) | 3 files, 13 tests passed |
| `npm run build` | OK |
| `npm audit` | 0 vulnerabilities (after upgrading vite, vitest, plugin-react; before: 6, all dev tooling; `--omit=dev` was already 0) |
| `./scripts/e2e.sh` (Playwright, real Chromium 153) | 40 passed, 0 failed, 4 viewports |
| grep for keys, secrets, tokens, `console.*` in `src` and `index.html` | no matches |
| grep for `localStorage` / `sessionStorage` | one key, written in `Prototype.tsx` only |

Browser: Chromium from the `@sparticuz/chromium` npm package, because Playwright's own download was blocked in this environment. Install your own with `npx playwright install chromium`.

## Phase 1-2: repository and functional QA

| Requirement | Status | Evidence |
|---|---|---|
| Journey A start to finish | PASS | e2e "journey A to B", all 4 viewports |
| Journey B tracking, rejection, correction, resubmission, verified | PASS | same test; history asserted as Submitted, Under review, Rejected, Resubmitted |
| Journey C modification and tracking | PASS | e2e "journey C"; separate ID MOD-DEMO-0001 |
| Invalid input and disabled buttons | PASS | bad PAN, empty name, short address, blurry and wrong document all disable Continue |
| Back keeps input | PASS | e2e and jsdom test |
| Refresh persistence | PASS | journey C tracking and journey A step survive reload |
| Reset with confirmation | PASS | e2e (dialog accepted, returns to step 1) |
| Switching journeys keeps state | PASS | panels stay mounted |
| Impossible transitions blocked | PASS | unit tests; "Mark verified" disabled from Submitted in e2e |
| Correction review shows changed and kept values | PASS | name-mismatch path shows "name → new value" and "Kept as is". Document paths say "the flagged document" without values |
| Persistence holds no personal data | PASS | e2e checks storage for name, PAN and address strings; only journey, step and status are stored |
| Defects found and fixed in this audit | PASS | status history showed a stray "Not started"; hero CSS conflict enlarged the badge and cut the glow; primary button contrast; scrollable tables not keyboard reachable; first-Tab test race (test-side) |

## Phase 3: real-browser QA

| Requirement | Status | Evidence |
|---|---|---|
| E2E at 1440x900, 768x1024, 390x844, 360x800 | PASS | 10 tests each, all passed |
| Horizontal overflow | PASS | asserted per viewport |
| Console and page errors, failed requests | PASS | asserted empty (fonts are self-hosted) |
| Sticky header, mobile menu, anchor links | PASS | e2e |
| Keyboard focus | PASS | skip link first, visible outline, form tab order |
| Screenshots from the real app | PASS | 63 files in `docs/screenshots/`; hero, horizon, orbit and a mobile correction screen were inspected by eye |
| Firefox, Safari | UNVERIFIED | Chromium only |
| Real phones and touch | UNVERIFIED | emulated viewports only |

## Phase 4: visual audit

| Requirement | Status | Evidence |
|---|---|---|
| Near-black, blue horizon ribbon, light type, thin borders | PASS | screenshots |
| Reference match | PARTIAL | hero ribbon, circular badge, highlighted 01-04 cards, horizon number, orbit card are close approximations. Photographic globe and portrait elements are not reproduced |
| Reduced motion | PASS (badge) | e2e checks the badge animation is off; ribbon drift is off by the same media rule but not asserted |

## Phase 5: accessibility

| Requirement | Status | Evidence |
|---|---|---|
| axe-core, WCAG 2.0 to 2.2 A/AA tags | PASS | no violations at any viewport (after fixes) |
| Keyboard-only use | PASS | e2e |
| Labels and error text | PASS | form fields labelled; errors shown as text |
| Screen reader testing | UNVERIFIED | not done |
| Contrast for hover, focus and text over glow | UNVERIFIED | axe checks static states only |
| Touch target size on real devices | UNVERIFIED | axe WCAG 2.2 rule passed; not tested by hand |

## Phase 6: research integrity

| Requirement | Status | Evidence |
|---|---|---|
| Every verified entry has URL, date, type, confidence | PASS for 18 of 21 | G01, U01, U04 have no URL and are shown as pending or Not verified |
| URL actually supports the claim | PARTIAL | each entry has a support check; several are "partial". Checks used search excerpts, not full-page reads |
| Five missing sources | RESOLVED for Z04, A04, A05 | G01, U01 remain unresolved; U04 stays Not verified |
| Angel One discrepancy | DOCUMENTED | the sources describe one in-app channel for individual accounts (Aadhaar via DigiLocker, then e-sign). They do not conflict with the ledger; the report's matrix cell was incomplete. Offline route and non-individual accounts not verified |
| Evidence types separated | PASS | every entry is Official public documentation; no observed-behavior entries exist |
| No invented interviews, drop-off figures, improvements | PASS | test blocks "improved outcome" wording; dashboard labelled simulated |
| Website claims match ledger | PASS after fix | orbit node text no longer cites G01 and U01 for e-sign, and notes the IPV excerpt gap |
| Angel One "up to 3 working days" | UNVERIFIED | not seen in excerpts; shown with a caveat |

## Phase 7: product review

| Requirement | Status | Evidence |
|---|---|---|
| Evidence to problem to decision to effect to metric | PASS | five proposals, each linked to evidence IDs |
| Alternatives and trade-offs | PASS | per proposal |
| Acceptance criteria and edge cases for all three journeys | PASS after fix | added per-journey lists to the PRD |
| Metrics with numerator, denominator, caveats | PASS | observation windows are named as "to be defined" because there is no data |
| Personas | PARTIAL | three target-user groups, no personas, because no user research exists |
| Prioritisation | PASS | MoSCoW, labelled as judgement |

## Phase 8: security and privacy

| Requirement | Status | Evidence |
|---|---|---|
| Fictional data only, no real identity input | PASS | prefilled demo values; disclaimers on page and footer |
| No provider integration, OTP, uploads | PASS | none exist; document check uses buttons, no file input |
| Storage, URL and console | PASS | one storage key with no personal data; hash-only URLs; no logging |
| Sample documents contain no real data | N/A | no document files are bundled |
| Dependency and secret checks | PASS | npm audit 0; grep clean |
| Production-grade security or compliance | NOT CLAIMED | |

## Phase 9-10: documentation, build, deployment

| Requirement | Status | Evidence |
|---|---|---|
| README updated with real screenshots, tests, gaps | PASS | |
| Docs regenerated from the data file | PASS | `scripts/gen.py` |
| TypeScript, unit, e2e, build | PASS | see commands |
| Lint | NOT CONFIGURED | no ESLint config in the project (LOW) |
| Base path and subpath | PASS | build served under `/trace-kyc/` in e2e |
| Static routing and refresh | PASS | anchor navigation; reload tested |
| GitHub Actions workflow | PRESENT, UNVERIFIED | never run; it does not run the e2e suite |
| Real repository owner and name | UNVERIFIED | not provided; deferred by request |
| Deployed and live URL verified | NOT DONE | nothing was published |

## Remaining issues

| Severity | Issue |
|---|---|
| BLOCKER | none |
| HIGH | none |
| MEDIUM | G01, U01, U04 have no source. Support checks rely on search excerpts. A01's 3-day figure unconfirmed |
| MEDIUM | No Firefox, Safari, real-device or screen-reader testing |
| LOW | No lint config. CI does not run e2e. Reference match is approximate. Document-fix review shows no old and new values. Observation windows undefined |

## Recommendation

**GO for the project as a case study and prototype.** It meets the release criteria: no open blocker, all three journeys work in a real browser at four sizes, no axe violations, clean build, and no unsupported high-impact research claim.

**NOT YET DEPLOYED.** Before publishing, follow `DEPLOYMENT_CHECKLIST.md` and close the MEDIUM items you care about.

Files changed in this audit: `src/Prototype.tsx`, `src/App.tsx`, `src/Visuals.tsx`, `src/Research.tsx`, `src/Product.tsx`, `src/data.ts`, `src/main.tsx`, `src/styles.css`, `src/flow.test.tsx`, `src/data.test.ts`, `scripts/gen.py`, `scripts/e2e.sh`, `vite.config.ts`, `playwright.config.ts`, `e2e/app.spec.ts`, `index.html`, `package.json`, `.gitignore`, `README.md`, `docs/*`.
