/**
 * Student achievements — single source of truth.
 *
 * Records live in content/achievements/records.json (see docs/content-updates.md).
 * They are validated at build time, so a malformed record fails the build
 * instead of shipping.
 *
 * PRIVACY: a record's name and image may be published ONLY when
 * consent.status === 'granted'. Everything else is shown anonymously
 * (grade, course, university, level) — never names or photographs.
 * The archive in content/achievements/originals/ is never imported by the
 * site; consented images are copied to src/assets/achievements/published/.
 */
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import raw from '../../content/achievements/records.json';

export type OutcomeCategory = 'medicine' | 'law' | 'science' | 'business' | 'arts';

export const outcomeCategories: { id: OutcomeCategory; label: string }[] = [
  { id: 'medicine', label: 'Medicine & Health' },
  { id: 'law', label: 'Law' },
  { id: 'science', label: 'Sciences & Technology' },
  { id: 'business', label: 'Business & Finance' },
  { id: 'arts', label: 'Arts, Education & Social Sciences' },
];

/** Parts of a record a student may agree to publish. */
export const ConsentPart = z.enum(['name', 'photo', 'result', 'quote']);
export type ConsentPart = z.infer<typeof ConsentPart>;

export const Consent = z.object({
  status: z.enum(['pending', 'granted', 'declined']),
  confirmedBy: z.string().nullable(),
  date: z.string().nullable(),
  /** What the student agreed to, in words, e.g. "name, photo and grade on website". */
  scope: z.string().nullable(),
  /** The same, as a list the site enforces. Omitted on a granted record = name, photo and result. */
  allow: z.array(ConsentPart).optional(),
});

/** Academic session as BIA writes it, e.g. "2025/2026". */
export const Session = z.string().regex(/^20\d\d\/20\d\d$/, 'session must look like "2025/2026"');

/** True when a granted consent covers this part of the record. */
export const allows = (c: z.infer<typeof Consent>, part: ConsentPart) =>
  c.status === 'granted' && (c.allow ?? ['name', 'photo', 'result']).includes(part);

/** Layout placeholders render on Vercel preview builds (or when PUBLIC_SHOW_PLACEHOLDERS=true),
 * never in production — so a placeholder can never be mistaken for a real student. */
const env = (globalThis as { process?: { env: Record<string, string | undefined> } }).process?.env ?? {};
export const showPlaceholders = env.VERCEL_ENV === 'preview' || env.PUBLIC_SHOW_PLACEHOLDERS === 'true';

const Record = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(['student-portrait', 'group-portrait', 'award-ceremony-photo', 'congratulations-graphic']),
    name: z.string().nullable(),
    names: z.array(z.string()).nullable(),
    grade: z.string().regex(/^[A-E]{3}$/).nullable(),
    course: z.string().nullable(),
    university: z.string().nullable(),
    level: z.string().nullable(),
    year: z.number().int().min(2015).max(2100).nullable(),
    /** Academic session confirmed by Boma, e.g. "2025/2026". Required for the Hall of Excellence. */
    session: Session.nullable().optional().default(null),
    /** Points total only when BIA has confirmed how it was counted. */
    points: z.number().int().min(1).max(20).nullable().optional().default(null),
    category: z.enum(['medicine', 'law', 'science', 'business', 'arts']).nullable(),
    featured: z.boolean(),
    image: z.string(),
    sourceAsset: z.string().nullable(),
    sourceSha256: z.string().nullable(),
    sourceText: z.string().nullable(),
    consent: Consent,
    /** File name inside src/assets/achievements/published/ (consented records only). */
    publishedImage: z.string().nullable(),
    review: z.string().nullable(),
  })
  .refine((r) => r.publishedImage === null || r.consent.status === 'granted', {
    message: 'publishedImage is only allowed when consent.status is "granted"',
  });

export type AchievementRecord = z.infer<typeof Record>;

const parsed = z.object({ records: z.array(Record) }).safeParse(raw);
if (!parsed.success) {
  throw new Error(`content/achievements/records.json is invalid:\n${parsed.error.message}`);
}
export const records = parsed.data.records;

/** Consented images only. The archive of originals is deliberately not globbed. */
const publishedImages = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/achievements/published/*.{png,jpg,jpeg,webp}',
  { eager: true },
);

/** Records cleared for identifiable publication, with their optimised image. */
export const publishedAchievements = records
  .filter((r) => r.consent.status === 'granted')
  .map((r) => {
    const key = r.publishedImage ? `../assets/achievements/published/${r.publishedImage}` : null;
    const image = key ? publishedImages[key]?.default : undefined;
    if (key && !image) throw new Error(`Published image not found for ${r.id}: ${r.publishedImage}`);
    return { ...r, image };
  });

/** Anonymous outcome shown on the site (identifiable fields only when consented). */
export type Outcome = {
  id: string;
  grade: string; // '' when V1 recorded no grade letters
  course: string;
  institution?: string;
  level?: string;
  year?: number;
  category: OutcomeCategory;
  featured: boolean;
  consentVerified: boolean;
  name?: string;
};

const gradeRank = (g: string) => (g ? g : 'ZZZ');

export const outcomes: Outcome[] = records
  .filter((r) => r.kind === 'student-portrait' && r.course && r.category)
  .map((r) => ({
    id: r.id,
    grade: r.grade ?? '',
    course: r.course!,
    institution: r.university ?? undefined,
    level: r.level ?? undefined,
    year: r.year ?? undefined,
    category: r.category!,
    featured: r.featured,
    consentVerified: r.consent.status === 'granted',
    name: allows(r.consent, 'name') ? (r.name ?? undefined) : undefined,
  }))
  .sort((a, b) => Number(b.featured) - Number(a.featured) || gradeRank(a.grade).localeCompare(gradeRank(b.grade)));

/** Universities named in the recorded outcomes, with the courses recorded for each. */
export const admissionsByInstitution = Object.entries(
  outcomes.reduce<Record<string, string[]>>((acc, o) => {
    if (o.institution && !(acc[o.institution] ??= []).includes(o.course)) acc[o.institution].push(o.course);
    return acc;
  }, {}),
).map(([institution, courses]) => ({ institution, courses }));

/** Records still waiting for a consent decision (for the content checklist). */
export const pendingConsent = records.filter((r) => r.consent.status === 'pending');

/* ---------- BIA JUPEB Hall of Excellence — 16 Points (AAA) achievers ---------- */

export type Achiever = {
  id: string;
  session: string | null;
  grade: string;
  points: number | null;
  course: string | null;
  university: string | null;
  level: string | null;
  /** Present only when the student's consent covers it. */
  name?: string;
  photo?: ImageMetadata;
};

const toAchiever = (r: AchievementRecord): Achiever => {
  const published = publishedAchievements.find((p) => p.id === r.id);
  return {
    id: r.id,
    session: r.session,
    grade: r.grade!,
    points: r.points,
    course: r.course,
    university: r.university,
    level: r.level,
    name: allows(r.consent, 'name') ? (r.name ?? undefined) : undefined,
    photo: allows(r.consent, 'photo') ? published?.image : undefined,
  };
};

/** Every individual AAA record (one student per record). */
export const achievers: Achiever[] = records
  .filter((r) => r.grade === 'AAA' && r.kind === 'student-portrait')
  .map(toAchiever)
  // Students who agreed to be named come first.
  .sort((a, b) => Number(!!b.name) - Number(!!a.name) || Number(!!b.photo) - Number(!!a.photo));

/** Achievers grouped by session, newest session first. Records without a confirmed
 * session are collected under `null` and shown last. */
export const hallSessions: { session: string | null; achievers: Achiever[] }[] = [
  ...[...new Set(achievers.map((a) => a.session).filter((x): x is string => !!x))]
    .sort()
    .reverse()
    .map((session) => ({ session, achievers: achievers.filter((a) => a.session === session) })),
  ...(achievers.some((a) => !a.session) ? [{ session: null, achievers: achievers.filter((a) => !a.session) }] : []),
];
