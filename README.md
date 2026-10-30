# Sebastián Astroza — Engineering Portfolio

Evidence-led, bilingual portfolio for software engineering, full-stack, infrastructure, data, automation, applied machine learning and research-oriented roles.

The site is intentionally explicit about evidence boundaries: synthetic datasets are labelled, CPU-only benchmarks are not presented as GPU results, academic prototypes are not presented as production deployments, and no CERN affiliation is implied.

## Preview

![Premium desktop home page](docs/screenshots/home-desktop-1440.png)

The premium redesign is captured at [320 px](docs/screenshots/home-320.png), [390 px](docs/screenshots/home-390.png), [768 px](docs/screenshots/home-tablet-768.png), [1024 px](docs/screenshots/home-desktop-1024.png), [1440 px](docs/screenshots/home-desktop-1440.png) and [1920 px](docs/screenshots/home-desktop-1920.png), plus [mobile dark mode](docs/screenshots/home-mobile-dark.png). Route and section evidence includes the [project catalogue](docs/screenshots/projects-mobile.png), [portfolio case study](docs/screenshots/project-detail-mobile.png), [experience](docs/screenshots/experience-mobile.png), [skills](docs/screenshots/skills-mobile.png), [resume](docs/screenshots/resume-mobile.png) and [contact](docs/screenshots/contact-mobile.png).

Earlier captures remain under [`docs/screenshots/before/`](docs/screenshots/before/) for direct before/after comparison. The transparent portrait is also inspected on [white, black, gray and production-gradient backgrounds](docs/screenshots/portrait-background-check.png).

## Stack

- React 19, TypeScript and Vite
- Tailwind CSS 4 build pipeline plus a tokenized editorial CSS design system
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

The resume page publishes general English and Spanish CVs as PDF-only downloads. Editable DOCX files are intermediate local build artifacts under the ignored `tmp/` directory and are never published. The PDFs are visually inspected, checked for selectable text and clickable links, and validated by `scripts/validate_resume_artifacts.py`. The public portrait uses transparent desktop and mobile WebP variants; the original source image remains excluded from Git.

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
