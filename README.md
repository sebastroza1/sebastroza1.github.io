# Sebastián Astroza — Engineering Portfolio

Evidence-led, bilingual portfolio for software engineering, full-stack, infrastructure, data, automation, applied machine learning and research-oriented roles.

The site is intentionally explicit about evidence boundaries: synthetic datasets are labelled, CPU-only benchmarks are not presented as GPU results, academic prototypes are not presented as production deployments, and no CERN affiliation is implied.

## Preview

![Desktop home page](docs/screenshots/home-desktop.png)

The portrait-led hero is documented in [desktop](docs/screenshots/hero-desktop.png) and [mobile](docs/screenshots/hero-mobile.png) captures. The [resume page](docs/screenshots/resume-desktop.png), [mobile project catalogue](docs/screenshots/projects-mobile.png) and bounded AutismoConecta case study in [desktop](docs/screenshots/autismoconecta-case-study-desktop.png) and [mobile](docs/screenshots/autismoconecta-case-study-mobile.png) are also captured from the production build.

## Stack

- React 19, TypeScript and Vite
- Tailwind CSS 4 plus a small custom design system
- Lucide icons
- Vitest and React Testing Library
- Playwright
- GitHub Actions and GitHub Pages

## Local development

Requires Node.js 20 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:5173/`.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run e2e
```

## Content maintenance

Project content is typed and versioned in `src/data/projects.ts`. See [MAINTENANCE.md](MAINTENANCE.md) before adding or changing claims, [PROJECT_EVIDENCE.md](PROJECT_EVIDENCE.md) for the evidence map, and [PROFESSIONAL_EVIDENCE_PUBLIC.md](PROFESSIONAL_EVIDENCE_PUBLIC.md) for the public authorship boundary.

The resume page publishes a general English and Spanish CV in both PDF and editable DOCX. The files are generated from `scripts/generate_resumes.py`, converted locally with Microsoft Word, visually inspected, checked for selectable text and clickable links, and validated by `scripts/validate_resume_artifacts.py`. The public portrait is a locally processed WebP; the original source image remains excluded from Git.

## Documentation

- [Architecture](ARCHITECTURE.md)
- [Content sources](CONTENT_SOURCES.md)
- [Project evidence](PROJECT_EVIDENCE.md)
- [Professional evidence boundary](PROFESSIONAL_EVIDENCE_PUBLIC.md)
- [Deployment](DEPLOYMENT.md)
- [Maintenance](MAINTENANCE.md)
- [Privacy](PRIVACY.md)
- [Validation record](VALIDATION.md)

## License

No reuse license has been selected. Copyright remains with Sebastián Andrés Astroza Aguayo unless a license is added explicitly.
