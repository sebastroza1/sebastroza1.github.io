# Deployment

## GitHub Pages

The repository name must be `sebastroza1.github.io` under the `sebastroza1` account. The included workflow validates every pull request and deploys the production `dist/` artifact on pushes to `main`.

Repository settings:

1. Open **Settings → Pages**.
2. Select **GitHub Actions** as the source if it is not selected automatically.
3. Keep the default custom-domain field empty.
4. Confirm the environment URL is `https://sebastroza1.github.io/` and HTTPS is active.

## First publication

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run e2e
git push -u origin main
```

Never force-push for deployment. The workflow is the deployment mechanism; `dist/` is not committed.

## Resume PDFs

The site publishes only two verified PDF files under `public/cv/`:

- `Sebastian_Astroza_Software_Engineer_General_2026.pdf`
- `Sebastian_Astroza_CV_General_2026_ES.pdf`

Editable sources are generated only in the ignored `tmp/resume-build/` directory and must not be committed or linked. Before deployment, run `python scripts/validate_resume_artifacts.py`, confirm each PDF URL returns a non-empty file and visually inspect every page. Do not host institutional certificates without explicit authorization.

## Rollback

Revert the faulty commit on `main` and push the revert. GitHub Actions will publish the previous state as a new auditable deployment.
