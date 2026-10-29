# Architecture

## System boundary

This is a static client-side application. It has no backend, database, analytics, runtime GitHub API calls or browser-side secrets.

```text
versioned content (projects.ts)
          │
          ▼
React views + hash routing ──► Vite production bundle ──► GitHub Pages
          │
          ├── local language and theme preferences
          └── outbound links to evidence repositories
```

## Decisions

- **Hash routing:** supports direct navigation on GitHub Pages without a server rewrite rule or a 404 fallback script.
- **Typed local content:** claims can be reviewed in pull requests, do not depend on a live API, and cannot leak a GitHub token.
- **Bounded professional evidence:** owner-provided experience is explicitly separated from repository-level authorship evidence. Private code, infrastructure and user data are excluded.
- **Direction-aware performance evidence:** the case-study panel distinguishes improvements from regressions, preserves the supplied local measurements and links calculations to a reproducible public lab.
- **No React Router:** the routing surface is small, so a dependency-free hash parser is easier to audit.
- **CSS architecture:** Tailwind provides compilation and utilities; `src/styles.css` defines the visual tokens and component classes used by the editorial design.
- **Bilingual data:** every substantive project field stores an English and Spanish value. Technology and repository names remain unchanged.
- **No unverified downloads:** resume options render as unavailable until their PDF exists and has been checked.

## Main modules

- `src/App.tsx`: navigation, views, localization, filters, project-detail composition and the professional case study.
- `src/data/projects.ts`: typed project catalogue and evidence boundaries.
- `src/styles.css`: responsive themes, focus states and reduced-motion behavior.
- `src/App.test.tsx`: component and state tests.
- `tests/e2e/site.spec.ts`: browser, keyboard, mobile and persistence tests.
- `.github/workflows/deploy.yml`: reproducible validation and GitHub Pages deployment.

## Accessibility

Semantic landmarks, visible keyboard focus, a skip link, labelled controls, native buttons/links, high-contrast themes and `prefers-reduced-motion` support are built into the implementation. Automated checks complement, but do not replace, manual assistive-technology review.
