/**
 * Admissions lead references — groundwork only.
 *
 * There is NO lead storage or tracking yet. These types and helpers fix the
 * reference format and the call-to-action identifiers so a future backend
 * (see docs/leads.md) can adopt them without touching the pages again.
 * Sequence numbers must be issued server-side, inside a database transaction;
 * never generate them in the browser.
 */

export const LEAD_REF_PREFIX = 'BIA-WEB-';
const DIGITS = 6;
const PATTERN = /^BIA-WEB-(\d{6})$/;

/** 1 → "BIA-WEB-000001". */
export function formatLeadRef(sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 10 ** DIGITS - 1) {
    throw new RangeError(`Lead sequence must be an integer between 1 and ${10 ** DIGITS - 1}`);
  }
  return LEAD_REF_PREFIX + String(sequence).padStart(DIGITS, '0');
}

/** "BIA-WEB-000001" → 1; anything else → null. */
export function parseLeadRef(ref: string): number | null {
  const m = PATTERN.exec(ref.trim().toUpperCase());
  return m ? Number(m[1]) : null;
}

/**
 * Where an enquiry started. Every call-to-action on the site carries one of
 * these as `data-cta`, so attribution can be added later without markup changes.
 */
export const CTA_SOURCES = [
  'header-apply',
  'header-call',
  'menu-apply',
  'menu-call',
  'home-hero-enquire',
  'home-hero-call',
  'home-success-stories',
  'home-success-enquire',
  'home-apply-call',
  'home-apply-directions',
  'stories-hero-enquire',
  'stories-hero-programmes',
  'stories-alumni-call',
  'stories-cta-enquire',
  'stories-cta-programmes',
  'actionbar-call',
  'actionbar-apply',
] as const;
export type CtaSource = (typeof CTA_SOURCES)[number];

/** How the prospective student will contact admissions. */
export type LeadChannel = 'phone' | 'visit' | 'web-form';

/** Shape of a future enquiry record (not persisted anywhere yet). */
export interface LeadDraft {
  source: CtaSource;
  channel: LeadChannel;
  programme?: 'science' | 'non-science' | 'undecided';
  /** Assigned by the server when the record is stored. */
  reference?: string;
}
