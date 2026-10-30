# Validation Record

Local validation date: 2026-10-30.

| Check | Command | Status |
|---|---|---|
| ESLint | `npm run lint` | Passed |
| TypeScript project build | `npm run typecheck` | Passed |
| Component/unit tests | `npm test` | 9 passed |
| Production build | `npm run build` | Passed; 1711 modules transformed |
| Dependency audit | `npm audit --audit-level=high` | 0 vulnerabilities |
| Browser E2E | `npm run e2e` | 38 passed across desktop/mobile; 6 cross-profile cases skipped as designed; includes all 19 project routes, responsive matrix, 900 px compact navigation, 200% zoom-equivalent layout, observable route phases, component-specific reveals, metric-bar motion, active-nav indicator, section focus/history, mobile-panel dimensions, console errors, portrait alpha/size, clipboard and reduced motion |
| Desktop/mobile visual capture | `node scripts/capture.mjs` | Passed; 39 current PNG captures plus one WebM navigation-transition recording; covers 320–1920 px, 844×390 and 932×430 landscape, dark/light themes, compact and mobile navigation, About, featured projects, catalogue, detail, resume and contact. Three reported defects are retained in `docs/screenshots/v2-before/` |
| Motion V3 evidence | `node scripts/capture_motion_v3.mjs before|after` | Paired desktop 1440 px and mobile 390 px WebM recordings plus five intermediate route frames and computed-style manifests for each variant |
| Lighthouse | Lighthouse 12.8.2, local production preview; median of 5 consecutive mobile runs | Performance 97, Accessibility 100, Best Practices 100, SEO 100; FCP 1.37 s, LCP 1.98 s, TBT 161 ms, CLS 0.0087, Speed Index 1.48 s |
| Resume PDFs | `python scripts/validate_resume_artifacts.py` plus PDF visual inspection | English and Spanish PDF present; selectable text, required content, professional metadata and clickable links validated; English 1 page, Spanish 2 pages; editable sources are not public |
| Portrait | Unit/E2E load and alpha tests plus multi-background visual inspection | Transparent desktop WebP (277 KB) and responsive mobile WebP (94 KB); transparent top corners confirmed; inspected on white, black, gray and the site gradient |

The Motion V3 five-run comparison uses the pre-change commit as its baseline. Median Performance stayed at 97; FCP improved from 1.40 s to 1.37 s, LCP from 2.15 s to 1.98 s and Speed Index from 1.89 s to 1.48 s. TBT was effectively flat at 160→161 ms, CLS remained 0.0087 and transfer increased 1.5 kB (0.72%). These are local synthetic lab measurements, not production real-user monitoring. The machine-readable comparison is `reports/motion-v3/lighthouse-summary.json`.
