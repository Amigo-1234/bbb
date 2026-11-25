#!/usr/bin/env bash
# Builds the site and zips web/dist (including .htaccess) for upload to cPanel public_html.
# Usage: npm run package:cpanel   ->  web/biajupeb-site.zip
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build
test -f dist/.htaccess || { echo "dist/.htaccess missing"; exit 1; }
rm -f biajupeb-site.zip
(cd dist && zip -qr -X ../biajupeb-site.zip . -x '.DS_Store' '*/.DS_Store')
echo "Created $(pwd)/biajupeb-site.zip ($(du -h biajupeb-site.zip | cut -f1))"
