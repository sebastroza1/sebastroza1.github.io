# Validation Record

Local validation date: 2026-10-29.

| Check | Command | Status |
|---|---|---|
| ESLint | `npm run lint` | Passed |
| TypeScript project build | `npm run typecheck` | Passed |
| Component/unit tests | `npm test` | 8 passed |
| Production build | `npm run build` | Passed; 1711 modules transformed |
| Dependency audit | `npm audit --audit-level=high` | 0 vulnerabilities |
| Browser E2E | `npm run e2e` | 13 passed across desktop/mobile; 1 mobile-only case skipped on desktop as designed |
| Desktop/mobile visual capture | `node scripts/capture.mjs` | Passed; eight real PNG captures in `docs/screenshots/`, including isolated hero views, resume and the AutismoConecta case study |
| Lighthouse | Lighthouse 12.8.2, production preview | Performance 98, Accessibility 100, Best Practices 100, SEO 100 |
| Resume artifacts | `python scripts/validate_resume_artifacts.py` plus Word/PDF visual inspection | English and Spanish DOCX/PDF present; selectable text, required content, professional metadata and clickable links validated; English 1 page, Spanish 2 pages |
| DOCX accessibility | Bundled `a11y_audit.py` | 0 high, medium or low findings in both editions |
| Portrait | Unit/E2E load test plus desktop/mobile visual inspection | 900×1059 WebP, 105 KB, no EXIF; original source excluded from Git and no external editing service used |

Lighthouse mobile lab metrics included 1.4 s FCP, 2.2 s LCP, 100 ms TBT and 0 CLS. These are local synthetic lab measurements, not production real-user monitoring. The concise machine-readable record is `reports/lighthouse-summary.json`.
