# Validation Record

Local validation date: 2026-10-29.

| Check | Command | Status |
|---|---|---|
| ESLint | `npm run lint` | Passed |
| TypeScript project build | `npm run typecheck` | Passed |
| Component/unit tests | `npm test` | 4 passed |
| Production build | `npm run build` | Passed; 1711 modules transformed |
| Dependency audit | `npm audit --audit-level=high` | 0 vulnerabilities |
| Browser E2E | `npm run e2e` | 11 passed across desktop/mobile; 1 mobile-only case skipped on desktop as designed |
| Desktop/mobile visual capture | `node scripts/capture.mjs` | Passed; two real PNG captures in `docs/screenshots/` |
| Lighthouse | Lighthouse 12.8.2, production preview | Performance 100, Accessibility 100, Best Practices 100, SEO 100 |
| Resume PDFs | File search and UI test | 0 of 4 present; links disabled |

Lighthouse mobile lab metrics included 1.4 s FCP, 1.4 s LCP, 30 ms TBT and 0 CLS. These are local synthetic lab measurements, not production real-user monitoring. The concise machine-readable record is `reports/lighthouse-summary.json`.
