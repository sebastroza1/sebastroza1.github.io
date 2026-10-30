# Validation Record

Local validation date: 2026-10-29.

| Check | Command | Status |
|---|---|---|
| ESLint | `npm run lint` | Passed |
| TypeScript project build | `npm run typecheck` | Passed |
| Component/unit tests | `npm test` | 9 passed |
| Production build | `npm run build` | Passed; 1711 modules transformed |
| Dependency audit | `npm audit --audit-level=high` | 0 vulnerabilities |
| Browser E2E | `npm run e2e` | 17 passed across desktop/mobile; 1 mobile-only case skipped on desktop as designed; includes overflow, portrait sizing, route motion and scroll-reveal checks |
| Desktop/mobile visual capture | `node scripts/capture.mjs` | Passed; eleven real PNG captures in `docs/screenshots/`, including 360 px, 390 px dark mode, 900 px compact desktop, resume and the AutismoConecta case study |
| Lighthouse | Lighthouse 12.8.2, production preview | Performance 98, Accessibility 100, Best Practices 100, SEO 100 |
| Resume PDFs | `python scripts/validate_resume_artifacts.py` plus PDF visual inspection | English and Spanish PDF present; selectable text, required content, professional metadata and clickable links validated; English 1 page, Spanish 2 pages; editable sources are not public |
| Portrait | Unit/E2E load test plus desktop/mobile visual inspection | 900×1059 WebP, 105 KB, no EXIF; original source excluded from Git and no external editing service used |

Lighthouse mobile lab metrics included 1.4 s FCP, 2.2 s LCP, 110 ms TBT and 0 CLS. These are local synthetic lab measurements, not production real-user monitoring. The concise machine-readable record is `reports/lighthouse-summary.json`.
