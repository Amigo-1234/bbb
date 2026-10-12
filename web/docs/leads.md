# Admissions lead tracking — planned, not live

Status: **not implemented.** The site only links to the admissions phone line
and the Bariga centre. No enquiry is stored or tracked, and the site must not
say otherwise until a backend exists.

Groundwork in place (`src/lib/leads.ts`):

- Reference format `BIA-WEB-000001` (`formatLeadRef` / `parseLeadRef`).
- Every call-to-action carries a `data-cta` source id (`CTA_SOURCES`).
- `LeadDraft` describes the future record.

When a backend is added:

1. Issue sequence numbers server-side in a transaction (never client-side).
2. Store source, channel, programme interest, timestamp and consent.
3. Show the reference to the applicant only after it is stored.
4. Capture explicit consent and a privacy notice (Nigeria Data Protection Act 2023).
