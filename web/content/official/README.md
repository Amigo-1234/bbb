# Official BIA materials — archive and public derivatives

This repository is **public**. Nothing containing bank account details is committed.

## Archived originals (`originals/`, never published by the site)

| File | Source | Notes |
|---|---|---|
| `BIA_PAYMENT_ADVICE_SCIENCE_1.pdf` | Boma, Oct 2026 | 6 pages; p1–2 text, p3–6 images. No bank details. |
| `BIA_PAYMENT_ADVICE_NON-SCIENCE_2.pdf` | Boma, Oct 2026 | Same structure; p3–6 identical to the Science PDF. |

The directions video is published as `public/media/bia-directions.mp4`: a **lossless
remux** (stream copy, no re-encoding) of Boma's original `.mov`
(sha256 `906740807c46071aa379e3653d60ec9a719b0ed536d94ef452f914ebf7377ccc`, 82.9 s,
464×832, H.264 Baseline + AAC). Captions in `src/data/identity.ts` are transcribed from
the text burned into the video.

## Kept by BIA only (contain bank account numbers — not committed)

- Physical Tutorial Services Package flyer (2061×2576 JPEG) — account 10277…868
- Updated first-semester timetable (1889×2576 JPEG) — account 10227…868

## Public derivatives (`src/assets/official/`)

| File | From | Change |
|---|---|---|
| `advice-science-p1/p2.jpg`, `advice-non-science-p1/p2.jpg` | PDF pages 1–2 | rendered at 110 dpi, resized to 1400px |
| `payment-plan-2026.jpg` | PDF page 3 image | none |
| `entrance-exam-2026.jpg` | PDF page 4 image | none |
| `timetable-pre-resumption-2026.jpg` | PDF page 6 image | resized |
| `timetable-first-semester-2026.jpg` | timetable image | **account box covered** ("Payment details: ask the admissions office"); all amounts untouched |
| `tutorial-package-2026.jpg` | package flyer | **account block covered**; all amounts untouched |
| `directions-poster.jpg` | video frame at 0.6 s | — |

PDF page 5 (first-semester timetable without the ₦25,000 box) is superseded by the updated
timetable image and not shown. The legacy `new-image/` flyers in `BOMA JUPEB PROJECT/` are
outdated (₦40,000 registration) and show an account number; they are not used by V2.

## Brand assets (`src/assets/brand/`)

`bia-lockup.svg` (symbol + BIA wordmark) and `bia-symbol.svg` were traced from the
896×896 transparent logo embedded in the payment-advice PDFs. Brand red `#D80000` is
sampled from that logo. The JUPEB crest on BIA's documents is the examination board's own
seal and is not used as BIA branding.
