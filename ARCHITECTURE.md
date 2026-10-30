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
- **Progressive route transitions:** the native View Transitions API enhances supported browsers; a short CSS fallback preserves compatibility and `prefers-reduced-motion` removes non-essential movement.
- **Typed local content:** claims can be reviewed in pull requests, do not depend on a live API, and cannot leak a GitHub token.
- **Bounded professional evidence:** owner-provided experience is explicitly separated from repository-level authorship evidence. Private code, infrastructure and user data are excluded.
- **Direction-aware performance evidence:** the case-study panel distinguishes improvements from regressions, preserves the supplied local measurements and links calculations to a reproducible public lab.
- **No React Router:** the routing surface is small, so a dependency-free hash parser is easier to audit.
- **CSS architecture:** Tailwind provides the build pipeline; `src/styles.css` defines reusable color, spacing, radius and elevation tokens plus component-scoped editorial layouts. No animation library is shipped.
- **Responsive media:** `<picture>` selects a 94 KB mobile portrait while desktop retains the higher-resolution transparent source. Intrinsic dimensions reserve layout space and avoid CLS.
- **Rendering budget:** off-screen home sections use `content-visibility: auto` with an intrinsic fallback size, reducing initial style/layout work without removing content from the document.
- **Mobile navigation:** a focus-managed menu supports Escape, focus containment, active section state, scroll restoration and 44 px or larger touch targets.
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

Semantic landmarks, visible keyboard focus, a skip link, labelled controls, native buttons/links, high-contrast light/dark themes and `prefers-reduced-motion` support are built into the implementation. The route and section navigation remains operable by keyboard and browser history. Automated checks complement, but do not replace, manual screen-reader testing.
