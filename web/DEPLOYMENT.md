# Deployment (Vercel)

Production: project **bbb-hhba** (`biajupeb.com.ng`), production branch `main`.
`www.biajupeb.com.ng` is served by project **bbb-qb65** from the same repository.

## Why there are two `vercel.json` files

The project's Root Directory setting is not exposed through the API we used,
so both possible locations carry an equivalent config. Vercel reads only the
one inside the configured Root Directory:

- `/vercel.json` — used if Root Directory is the repository root.
- `/BOMA JUPEB PROJECT/vercel.json` — used if Root Directory is the legacy
  folder; it builds `../web` and copies the output into `.preview-dist`.

Both build the Astro site in `web/` and serve **only** `web/dist`. The legacy
V1 files stay in Git history (tag `v1-final-before-v2-launch`) but are never
served. Both files define the same permanent redirects from legacy URLs.

Keep the two files in sync. Once the Root Directory is confirmed in the
Vercel dashboard, the unused file can be deleted.

## Rollback

- Fastest: in Vercel → bbb-hhba → Deployments, promote the last V1
  production deployment (`dpl_9eb8yqYK4LM9sNetAqzkte7cvc4f`).
- Code: `git revert -m 1 <merge commit>` on `main`, or redeploy tag
  `v1-final-before-v2-launch`.
