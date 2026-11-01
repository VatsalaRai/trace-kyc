# Deployment checklist

Nothing has been pushed or published. Do these when you are ready.

1. [ ] Decide the repository owner and name. Nothing in the code depends on them (`base` is `./`), so no edit is needed for the subpath.
2. [ ] Run `npm ci && npm test && npm run build && npm run e2e` locally. All should pass.
3. [ ] Optional: add `npm run e2e` to `.github/workflows/deploy.yml` (it needs `npx playwright install --with-deps chromium`).
4. [ ] Push to `main`. In repository Settings, Pages, set Source to GitHub Actions.
5. [ ] When the workflow finishes, open the live URL and check: hero loads, header and mobile menu work, all three journeys complete, refresh keeps state, no console errors.
6. [ ] Only then update the README live-demo line.
7. [ ] Keep the disclaimer visible. Do not describe the project as a real KYC service.

Optional before publishing: close G01, U01 and U04; re-read cited pages in full; test in Firefox and Safari and on a real phone; try a screen reader.
