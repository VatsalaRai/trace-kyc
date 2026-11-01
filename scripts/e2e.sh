#!/usr/bin/env bash
# Builds, serves dist under /trace-kyc/ (to verify subpath hosting), runs Playwright, stops the server.
set -e
npm run build >/dev/null
D=$(mktemp -d); ln -s "$PWD/dist" "$D/trace-kyc"
(cd "$D" && python3 -m http.server 4173 >/dev/null 2>&1) & P=$!
sleep 1; trap "kill $P" EXIT
npx playwright test "$@"
