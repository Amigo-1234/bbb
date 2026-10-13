# Official 2026/27 content — audit of BIA's documents (October 2026)

Source files supplied by Boma (BIA JUPEB owner):

1. `BIA_PAYMENT_ADVICE_SCIENCE_1.pdf` (6 pages)
2. `BIA_PAYMENT_ADVICE_NON-SCIENCE_2.pdf` (6 pages; pages 3–6 are identical images to the Science PDF)
3. Physical Tutorial Services Package image
4. Updated first-semester physical class timetable image

The website data lives in `src/data/fees.ts` and `src/data/timetable.ts`;
`tests/fees.test.ts` checks the data against an independent transcription.
**Bank account numbers in the documents are deliberately not published**, and the
build test fails if one appears.

## Fees as published

| | Science | Non-Science |
|---|---:|---:|
| **Registration (compulsory) — application form** | **₦45,000** | **₦45,000** |
| JUPEB admission letter | ₦2,500 | ₦2,500 |
| Foundation tuition fee (incl. TISHIP) | ₦235,000 | ₦219,000 |
| JUPEB examination fee | ₦95,000 | ₦95,000 |
| JUPEB syllabus & SFS student's handbook | ₦4,200 | ₦4,200 |
| JUPEB Lecture Banks (materials inclusive) & academic support | ₦150,000 | ₦150,000 |
| Physical tutorial payment | ₦200,000 | ₦200,000 |
| **Grand Total Programme fee (as printed)** | **₦686,700** | **₦671,000** |

Payment structure (both PDFs): ₦200,000 upon registration (closes before the
Entrance Examination) → ₦200,000 upon resumption (by January / before the First
Semester Examination / before final JUPEB biometrics) → ₦287,000 on or before
4 May 2027 (before Second Semester resumption). Anyone missing the first
₦200,000 must complete ₦400,000 before February 2027.

Requirements: full registration fee, O'Level result (awaiting accepted), NIN,
birth certificate. All payments are final and non-refundable. Online learners
must enrol in the Lecture Banks.

Physical Tutorial Services Package (for students joining physical tutorials
only, including students from other institutions — per Boma): ₦150,000 one-time
until the exam, **or** ₦25,000 per month, **or** ₦100,000 first semester +
₦100,000 second semester. Covers: tutorial classes ₦70,000; admission assistance
& guidance ₦30,000; "performance tackling", exam fee & packaging ₦30,000;
mentorship, academic support & ID card ₦20,000. Plus ₦5,000 tutorial
registration form (paid separately).

## Needs confirmation from BIA before going live

1. **Non-Science total.** Items add to **₦670,700**, but the printed total is **₦671,000** (₦300 more).
2. **Instalment total.** ₦200,000 + ₦200,000 + ₦287,000 = **₦687,000**. That is ₦300 more than the Science total and ₦16,000 more than Non-Science. The same plan is printed on both PDFs, so the Non-Science final instalment is unclear. (If the handbook were ₦4,500 rather than ₦4,200, both ₦300 gaps would disappear.)
3. **Physical tutorials inside the programme fee.** The PDFs include them at ₦200,000 (matching the ₦100k + ₦100k semester option), while the package sells them at ₦150,000 one-time. Can full-programme students pay ₦150,000 one-time?
4. **Physical tutorials for online-only students.** The ₦200,000 physical tutorial line is in everyone's total. Is it optional for students who learn online through the Lecture Banks?
5. **"Before August".** The notice says "fail to pay the initial ₦200,000 upon resumption before August", but the first instalment is due "upon registration". The site omits "before August".
6. **"Exam fee"** in the ₦30,000 tutorial line: is this a BIA internal exam? It cannot be the ₦95,000 JUPEB exam fee.
7. **"Performance tackling".** Probably "tracking"? It is shown as printed.
8. **Bank account numbers differ** between the package image and the timetable image (not published; flagged for BIA's own materials).
9. **Address.** The timetables give **12 Ameen Street, Abule Oja, Akoka**, while the website footer still shows 56 Igi Olugbin St., Bariga. A second WhatsApp number, 0816 432 9204, appears on the flyers. The contact details were not changed pending confirmation.
10. **Physical resumption date (2 November 2026)** is not stated in the new documents. The free marathon runs 5–31 Oct "before the main physical resumption", which is consistent.
11. **"F/MTH"** is shown as printed, not expanded.
12. **Timetable audience.** The first-semester timetable is headed "BIA private JUPEB students and some selected UNILAG School of Foundation students". Should external tutorial-only students follow the same timetable?
13. **Entrance Examination date** is not given in the documents. The calendar keeps the earlier 29 Aug 2026 entry.
