# Maintenance

## Add a project

1. Collect inspectable evidence: repository, results artifact, tests, CI, commit and known limitations.
2. Add one typed record to `src/data/projects.ts`; use categories as tags instead of duplicating the record.
3. Write both English and Spanish values for every substantive field.
4. Use a conservative status: `CI validated`, `Locally tested`, `Implemented · runtime blocked`, `Academic prototype` or `In development`.
5. Add the repository and evidence boundary to `PROJECT_EVIDENCE.md`.
6. If the project adds a professional or academic claim, update `CONTENT_SOURCES.md`.
7. Run lint, type checking, unit tests, production build and E2E tests.

## Evidence rules

- A passing workflow proves only what that workflow exercised.
- Synthetic data must remain labelled synthetic.
- A benchmark must state device, scope, cache/runtime limitations and data size.
- “Implemented” is not equivalent to “deployed”, and “deployed” is not equivalent to “validated under load”.
- Academic prototypes are not production, clinical or institutional systems unless separate evidence proves that claim.
- Owner-provided professional context is not commit-level authorship; keep `PROFESSIONAL_EVIDENCE_PUBLIC.md` synchronized with the site.
- Do not add a metric from memory; link it to a committed artifact.

## Routine update

```bash
npm ci
npm audit --audit-level=high
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
node scripts/capture.mjs
python scripts/validate_resume_artifacts.py
```

Review outbound links, both public resume PDFs, both portrait variants, dependency updates, focus/Escape behavior, reduced-motion behavior, the required 320–1920 px responsive matrix, the compact 900 px header, 200% zoom-equivalent layout and both interface languages before each release. `scripts/capture.mjs` also records the focused V2 before/after evidence and navigation-transition video. Regenerate editable sources only inside ignored `tmp/resume-build/`, re-export the PDFs, inspect every page and rerun the artifact validator before publishing.
