#!/usr/bin/env bash
# Builds the PRIVATE review collection (gitignored) from BIA's Phase 6 ZIPs.
#   scripts/prepare-review-media.sh <photos.zip> <videos.zip>
# Nothing produced here may be committed: the repository is public and
# publication consent for these students/tutors is not yet confirmed.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=private-media
TMP=$(mktemp -d)
rm -rf "$OUT" && mkdir -p "$OUT/photos" "$OUT/videos" "$OUT/posters"
unzip -q -o "$1" -d "$TMP/p" && unzip -q -o "$2" -d "$TMP/v"
cp "$TMP"/p/photos/*.jpg "$OUT/photos/"
# Verify checksums against BIA's manifest
tail -n +2 "$TMP/p/manifest.csv" | while IFS=, read -r id packed _ _ sha _; do
  for base in "$TMP/p" "$TMP/v"; do
    [ -f "$base/$packed" ] && echo "$sha  $base/$packed" | sha256sum -c --quiet -
  done
done
# Web versions of the videos: H.264 + AAC, faststart, sized for mobile networks
ffmpeg -v error -y -i "$TMP/v/videos/V012.mp4" -vf scale=432:-2 -c:v libx264 -profile:v main -crf 30 -maxrate 420k -bufsize 840k -preset slow -pix_fmt yuv420p -c:a aac -b:a 64k -ac 1 -movflags +faststart "$OUT/videos/V012.mp4"
ffmpeg -v error -y -i "$TMP/v/videos/V011.mov" -vf scale=432:-2 -c:v libx264 -profile:v main -crf 30 -maxrate 500k -bufsize 1000k -preset slow -pix_fmt yuv420p -c:a aac -b:a 64k -ac 1 -movflags +faststart "$OUT/videos/V011.mp4"
ffmpeg -v error -y -i "$TMP/v/videos/V010.mp4" -vf scale=432:-2 -c:v libx264 -profile:v main -crf 29 -maxrate 600k -bufsize 1200k -preset slow -pix_fmt yuv420p -c:a aac -b:a 64k -ac 1 -movflags +faststart "$OUT/videos/V010.mp4"
for v in V012:4 V011:3 V010:4; do
  id=${v%%:*}; t=${v##*:}
  ffmpeg -v error -y -ss "$t" -i "$OUT/videos/$id.mp4" -frames:v 1 -q:v 3 "$OUT/posters/$id.jpg"
done
node scripts/write-review-index.mjs
rm -rf "$TMP"
echo "Private review media ready in $OUT (gitignored)."
