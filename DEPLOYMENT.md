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

The downloads stay disabled until these exact files are copied into `public/cv/` and opened successfully:

- `Sebastian_Astroza_CERN_Machine_Learning_Engineer_2026.pdf`
- `Sebastian_Astroza_CERN_Distributed_Storage_Engineer_2026.pdf`
- `Sebastian_Astroza_CERN_Full_Stack_Software_Developer_2026.pdf`
- `Sebastian_Astroza_CERN_Junior_Automation_Controls_Engineer_2026.pdf`

After adding them, update the resume configuration in `src/App.tsx`, run the complete test suite, and verify all four URLs in the production deployment. Do not host institutional certificates without explicit authorization.

## Rollback

Revert the faulty commit on `main` and push the revert. GitHub Actions will publish the previous state as a new auditable deployment.
