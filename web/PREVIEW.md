# Preview deployment (redesign branch only)

`/vercel.json` and `/BOMA JUPEB PROJECT/vercel.json` exist **only on the
`redesign/homepage-prototype` branch**. They make Vercel's automatic branch
previews build the Astro app in `web/` instead of the legacy static site,
without changing any project settings. Vercel reads whichever file sits in the
project's configured Root Directory.

**Remove both files before merging into `main`** (or replace them with the
agreed production configuration at cutover) — on `main` they would change what
biajupeb.com.ng serves.
