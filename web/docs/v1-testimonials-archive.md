# V1 testimonial archive (testii, slider, scroll)

The old website showed four "Testimonials" blocks on its homepage. Their 91 image files are
**preserved byte-for-byte in Git history** at tag `v1-final-before-v2-launch` and catalogued in
[`content/v1-archive/catalogue.json`](../content/v1-archive/catalogue.json) (folder, file, SHA-256,
size, type, V1 section, and — for `testii` — the matching record in
`content/achievements/records.json`). They are not in the current tree: they were removed in
commit `130890f` because the repository was public and none has publication consent.

| Folder | Files | What it is | How it can be used |
|---|---|---|---|
| `testii/` | 43 | Achievement graphics: congratulation cards, award-ceremony photos and student portraits with name, grades and course | Each file is already transcribed as a record in `records.json` (ids `v1-001` … `v1-043`). Publish only after consent — see below. |
| `scroll/` | 32 | WhatsApp chat screenshots: students thanking Boma, reporting results and admission offers | **Never publish the screenshots** (they show names, phone numbers, other people's chats and admission letters). With the student's consent, transcribe a short quote into `content/testimonials/testimonials.json`. |
| `slider/` | 16 | Not testimonials: a promotional T-shirt graphic, timetable flyers (2025/26, 2026) and class photos | Timetables are superseded by the official 2026/27 documents. Photos need consent like any other identifiable student media. |

## Restoring a file (private use only)

```sh
git show "v1-final-before-v2-launch:BOMA JUPEB PROJECT/assets/images/testii/019.png" > ~/private/testii-019.png
sha256sum ~/private/testii-019.png   # compare with catalogue.json
```

Keep restored files outside the repository (or in the git-ignored `web/private-media/` or
`web/content/achievements/originals/`). Do not commit them while the repository is public.

## Publishing an archived achievement or testimonial

1. Boma confirms the student, the session, the grades and the course/university.
2. The student gives written consent and says what may be shown (name, photo, quote, result).
3. Update the record in `records.json` (`session`, `consent.status: "granted"`, `consent.scope`, `publishedImage`)
   and copy the cleared image into `src/assets/achievements/published/`.
4. Run `npm test`. The record then appears automatically on the homepage, `/hall-of-excellence`
   (AAA results) and `/success-stories` (archive section).

See [`content-updates.md`](content-updates.md) for the field-by-field guide.
