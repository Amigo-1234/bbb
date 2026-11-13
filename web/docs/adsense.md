# Google AdSense — readiness and switch-on plan

Status: **prepared, switched off.** No ad code, verification tag or `ads.txt`
is published while `client` in `src/data/ads.ts` is empty. The test suite
fails if any ad code appears in the build while ads are off.

## Before applying

Done (November 2026):

- Policy pages approved by BIA. Operator: **Boma's Intellectual Academy**.
- Official email **bomasintellectualacademy@gmail.com** published (footer,
  contact page, structured data, policy pages).
- The five guides rewritten from BIA's own material (430–990 words each,
  no duplicated tables) — see `docs/guides-verification.md`.

Still open:

1. ~~Tutor approval of the study-advice sections~~ — approved by BIA (relayed
   13 Nov 2026).
2. ~~The 16-point question~~ — resolved from BIA's records (total = grade points
   + 1) and UNILAG's statement that 16 is the highest attainable. The *reason*
   for the extra point is still unexplained on the site.
3. **Who owns the AdSense account.** It must be BIA's (the payee), held by an
   adult with a Nigerian bank account and BIA's details — not the developer's.
4. **Deploy and let Google recrawl** the new pages before applying; apply once
   the guides have been live and indexed for a short while.
5. **O'Level registration route** (guides-verification B4): UNILAG's foundation
   school does not accept awaiting results, BIA does. BIA should say how its
   students are registered for JUPEB.

## Switching on

1. In AdSense, add the site `biajupeb.com.ng` (no `www`).
2. Put the publisher ID in `src/data/ads.ts` → `client: 'ca-pub-…'`. This adds
   the verification meta tag and AdSense script (indexable pages only, never the
   404) and generates `/ads.txt`. The Privacy, Cookie and Terms pages switch to
   present-tense advertising wording automatically. Update their "Last updated"
   dates.
3. Deploy, then request review in AdSense.
4. **Privacy & messaging → European regulations message:** create and publish
   Google's consent message (required for EEA/UK/Swiss visitors). It is served by
   the AdSense script; no code change.
5. After approval: **Ads → By ad unit → Display ads**, one unit per placement,
   and paste the unit IDs into `slots` in `src/data/ads.ts`.

## Recommended AdSense settings

- **Auto ads: off**, or on with only in-page formats. Turn **off** anchor ads,
  vignette (full-screen) ads and side rails — on phones they would cover the
  sticky "Call admissions / Enquire" bar and the menu.
- **Blocking controls:** block competitors (other JUPEB/IJMB/A-Level tutorial
  centres) by advertiser URL, and sensitive categories (gambling, dating, loans,
  "get admission fast" services). Without this, ads on BIA's own pages could
  advertise rival academies.

## Placements

| Page | Placement | Slot |
| --- | --- | --- |
| Guide articles | after the article and sidebar, before "Practise for JUPEB" | `guideEnd` |
| Guides index | below the list of guides | `guidesIndex` |

**No ads** on: home, fees, timetable, contact, Hall of Excellence, success
stories, team, gallery, CBT practice, About and the policy pages, or the 404.
These are BIA's admissions pages, carry students' photos and results, or sit
next to phone numbers, fee tables and enquiry buttons, where an ad would invite
accidental clicks or be mistaken for BIA's own content.

`AdSlot.astro` labels every unit "Advertisement", reserves 300px so the page
does not jump, and collapses unfilled units. Never add an ad inside the header,
menu, footer, next to a call/enquire button or the sticky action bar.

## Never

- Click your own ads, ask anyone to click them, or point paid/bot traffic at the
  site. Invalid clicks get the account closed and earnings withheld.
- Add pages written only to host ads, or copy content from other sites.
