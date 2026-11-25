# Hosting on cPanel (Afees Host)

The site is fully static (Astro `output: 'static'`). Any Apache or LiteSpeed host can serve it.
`public/.htaccess` is copied into `dist/` at build time and does what `vercel.json` does on Vercel:

| Rule | Example |
| --- | --- |
| www → apex, http → https (one 301) | `http://www.biajupeb.com.ng/fees` → `https://biajupeb.com.ng/fees` |
| Trailing slash removed (query string kept) | `/fees/?x=1` → `/fees?x=1` |
| Clean URLs | `/fees` serves `fees/index.html` |
| 20 legacy `.html` pages redirected | `/result.html` → `/success-stories` |
| Custom 404 | `404.html` |
| Caching | HTML `no-cache`; `_astro/*` assets cached for 1 year |
| Security headers | HSTS, nosniff, Referrer-Policy, X-Frame-Options |

`tests/hosting.test.ts` fails if the legacy redirects in `vercel.json` and `.htaccess` drift apart.
If you add a redirect, add it to both `vercel.json` files and to `public/.htaccess`.

## Build and upload

```bash
cd web
npm ci
npm run package:cpanel      # builds and writes web/biajupeb-site.zip (~145 MB)
```

1. cPanel → File Manager → `public_html`. Delete the host's placeholder `index.html` or `default.html`.
   Turn on **Settings → Show Hidden Files** so you can see `.htaccess`.
2. Upload `biajupeb-site.zip` into `public_html`, then use **Extract**. `index.html`, `.htaccess`, `ads.txt`,
   `sitemap.xml`, `_astro/`, `media/` and the page folders must sit directly in `public_html`, not in a subfolder.
3. Delete the zip after extracting.

To update the site later, rebuild, upload the new zip, and extract it over the old files. Astro
gives built assets new hashed names, so old `_astro` files can be deleted from time to time.

## DNS records to keep

The domain currently uses Vercel nameservers. These records must exist on whichever DNS ends up serving the domain:

| Type | Name | Value |
| --- | --- | --- |
| A | `@` | Afees Host server IP (from the cPanel sidebar, "Shared IP Address") |
| A or CNAME | `www` | same IP, or CNAME to `biajupeb.com.ng` |
| TXT | `@` | `google-site-verification=5hIvrRTQhG32k_78pNc_pUTvpZnJzzRmiYVbDuJ2Vaw` (Search Console) |
| CAA (optional) | `@` | `0 issue "letsencrypt.org"`, `0 issue "sectigo.com"`, `0 issue "pki.goog"` |

There are no MX records, so the domain has no email to move. The site's email addresses are Gmail addresses.

## SSL

cPanel → **SSL/TLS Status** → **Run AutoSSL**. AutoSSL can only issue a certificate after DNS points at the server.
The `.htaccess` sends visitors to https, so test over https once the certificate is issued.

## Checks after cutover

```bash
curl -sI https://biajupeb.com.ng/            # 200
curl -sI http://www.biajupeb.com.ng/fees     # 301 -> https://biajupeb.com.ng/fees
curl -sI https://biajupeb.com.ng/fees/       # 301 -> /fees
curl -sI https://biajupeb.com.ng/result.html # 301 -> /success-stories
curl -s  https://biajupeb.com.ng/ads.txt     # google.com, pub-5330784001821858, DIRECT, f08c47fec0942fa0
curl -sI https://biajupeb.com.ng/nope        # 404
```

Then, in Search Console, check that the property is still verified and resubmit `sitemap.xml`.

## Automatic deploys (GitHub Actions)

`.github/workflows/deploy-afees.yml` runs on every push to `main` that touches `web/`. It runs the unit tests,
builds the site, and uploads only the changed files to Afees over FTPS (2–3 minutes). It can also be run by hand
from GitHub → Actions → "Deploy to Afees Host" → Run workflow.

Repository secrets it needs (GitHub → Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | `advanced1n.afeeshost.com` |
| `FTP_USERNAME` | an FTP account created in cPanel → FTP Accounts with **Directory** set to `biajupeb.com.ng` |
| `FTP_PASSWORD` | that account's password |

The FTP account must be limited to the `biajupeb.com.ng` folder so a deploy can never touch `public_html`.
The action keeps a `.ftp-deploy-sync-state.json` file on the server to know what changed; don't delete it
(if it is deleted, the next run just re-uploads everything).
