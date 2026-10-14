# Adding student achievements (photos, flyers, results)

Everything about student achievements lives in **one data file** and **two
folders**. No admin dashboard is needed — a developer (or anyone comfortable
editing a file on GitHub) can do this in a few minutes.

```
web/content/achievements/records.json      ← one entry per photo / flyer / result
web/content/achievements/originals/        ← archive of original files (local only: gitignored, keep a private backup)
web/src/assets/achievements/published/     ← copies cleared for the website (consent granted)
```

## The privacy rule

A student's **name, photograph or congratulations flyer appears on the website
only when their record says `"status": "granted"`** under `consent`.
Until then the site shows the achievement anonymously (grade, course,
university). Appearing on the old V1 website does **not** count as consent.
The build refuses a `publishedImage` on any record that is not `granted`, and
the automated tests fail if any unconsented name reaches the website.

## 1. Add a new photo or flyer (from Grace)

1. Save the original file, unchanged, into `content/achievements/originals/`.
   Name it clearly, e.g. `2026-unilag-law-firstname-lastname.jpg`.
2. Add an entry to `records` in `records.json` (copy the template below).
   Fill in only what you know — leave anything unknown as `null`.
   Never invent grades, universities or years.
3. Leave `"status": "pending"` until written consent is received.

```json
{
  "id": "2026-unilag-law-firstname-lastname",
  "kind": "student-portrait",
  "name": "Firstname Lastname",
  "names": null,
  "grade": "AAA",
  "course": "Law",
  "university": "University of Lagos",
  "level": "200 Level",
  "year": 2026,
  "category": "law",
  "featured": false,
  "image": "originals/2026-unilag-law-firstname-lastname.jpg",
  "sourceAsset": "Provided by Grace, October 2026",
  "sourceSha256": null,
  "sourceText": null,
  "consent": { "status": "pending", "confirmedBy": null, "date": null, "scope": null },
  "publishedImage": null,
  "review": null
}
```

Field notes:

- `kind`: `student-portrait`, `group-portrait`, `award-ceremony-photo` or
  `congratulations-graphic` (a designed flyer — shown whole, never cropped).
- `grade`: three letters only (e.g. `AAB`). Do **not** record points totals
  unless BIA has verified them against the A=5 … E=1 scale.
- `category`: `medicine`, `law`, `science`, `business` or `arts` (drives the
  filters on /success-stories).
- `featured: true` puts the result in the featured panels.

## 2. When consent is received

1. Keep the signed consent (form, email or message) in BIA's records.
2. In the record set:
   ```json
   "consent": { "status": "granted", "confirmedBy": "Grace", "date": "2026-10-20",
                "scope": "name, photo and grade on the website" }
   ```
3. Copy the image from `originals/` into
   `src/assets/achievements/published/` and set
   `"publishedImage": "<that file name>"`. The site resizes and compresses
   the published copy automatically; the original stays untouched.

If a student declines, set `"status": "declined"` — the record stays anonymous.
To withdraw consent later, set the status back to `"declined"` and delete the
file from `published/`.

## 3. Check and publish

```bash
cd web
npm run check     # validates records.json against the schema
npm run build
npm test          # includes the privacy checks
```

Push to the `redesign/homepage-prototype` branch, review the Vercel preview,
then merge to `main` to publish.

## Records needing a decision

`records.json` was seeded with the 43 images from the V1 testimonials
(`assets/images/testii`). All are `pending`. Entries with a `review` note need
a human check before consent is requested (possible duplicates, captions that
do not match the photo, or group photos).

## Fees and timetables

Official fees live in `src/data/fees.ts`; timetables in `src/data/timetable.ts`.
Change the figures there (never in page files) and update the expected values
in `tests/fees.test.ts` to the new official document, so the tests prove the
site matches it. Do not add bank account numbers to the website. To replace the
"view the official timetable" image, crop out any bank details first and save
it in `src/assets/official/`. Open questions on the 2026/27 documents are listed
in `docs/official-content-2026.md`.
