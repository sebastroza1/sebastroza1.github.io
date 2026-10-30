# Validation Record

Local validation date: 2026-10-30.

| Check | Command | Status |
|---|---|---|
| ESLint | `npm run lint` | Passed |
| TypeScript project build | `npm run typecheck` | Passed |
| Component/unit tests | `npm test` | 9 passed |
| Production build | `npm run build` | Passed; 1711 modules transformed |
| Dependency audit | `npm audit --audit-level=high` | 0 vulnerabilities |
| Browser E2E | `npm run e2e` | 32 passed across desktop/mobile; 6 cross-profile cases skipped as designed; includes all 19 project routes, the required responsive matrix, 900 px compact navigation, 200% zoom-equivalent layout, real View Transition activation, section focus/history, solid mobile-panel dimensions, console errors, portrait alpha/size, clipboard and reduced motion |
| Desktop/mobile visual capture | `node scripts/capture.mjs` | Passed; 39 current PNG captures plus one WebM navigation-transition recording; covers 320–1920 px, 844×390 and 932×430 landscape, dark/light themes, compact and mobile navigation, About, featured projects, catalogue, detail, resume and contact. Three reported defects are retained in `docs/screenshots/v2-before/` |
| Lighthouse | Lighthouse 12.8.2, local production preview; median of 5 consecutive mobile runs | Performance 96, Accessibility 100, Best Practices 100, SEO 100 |
| Resume PDFs | `python scripts/validate_resume_artifacts.py` plus PDF visual inspection | English and Spanish PDF present; selectable text, required content, professional metadata and clickable links validated; English 1 page, Spanish 2 pages; editable sources are not public |
| Portrait | Unit/E2E load and alpha tests plus multi-background visual inspection | Transparent desktop WebP (277 KB) and responsive mobile WebP (94 KB); transparent top corners confirmed; inspected on white, black, gray and the site gradient |

The V1 baseline scored 96 Performance with 1.4 s FCP, 2.2 s LCP, 180 ms TBT, 0 CLS, 2.1 s Speed Index and 205 KiB transferred. The V2 five-run median remains at 96 Performance with 1.4 s FCP, 2.2 s LCP, 192 ms TBT, 0 CLS, 2.0 s Speed Index and 206 KiB transferred. These are local synthetic lab measurements, not production real-user monitoring. The concise machine-readable record is `reports/lighthouse-summary.json`.
