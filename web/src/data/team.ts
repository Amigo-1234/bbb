/**
 * Staff directory — content/team/team.json, generated from BIA's official role documents.
 * Departments group the page only; they do not describe reporting lines.
 */
import { z } from 'astro/zod';
import raw from '../../content/team/team.json';

export const departments = [
  { id: 'management', label: 'Management' },
  { id: 'administration', label: 'Administration & Front Office' },
  { id: 'academics', label: 'Academics & Tutoring' },
  { id: 'student-affairs', label: 'Student Affairs' },
  { id: 'brand', label: 'Brand, Content & Partnerships' },
] as const;

const Person = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string(),
  title: z.string(),
  summary: z.string().default(''),
  department: z.enum(['management', 'administration', 'academics', 'student-affairs', 'brand']),
  /** Empty until BIA provides documented responsibilities; never filled in by guesswork. */
  sections: z.array(z.object({ heading: z.string(), items: z.array(z.string()).min(1) })).default([]),
  source: z.string(),
});
export type TeamMember = z.infer<typeof Person>;

const parsed = z.object({ people: z.array(Person) }).safeParse(raw);
if (!parsed.success) throw new Error(`content/team/team.json is invalid:\n${parsed.error.message}`);

/**
 * Staff portraits: src/assets/team/<profile id>.jpg (square, EXIF stripped).
 * A photo must match an existing profile id; people without one keep their initials.
 */
const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/team/*.{jpg,jpeg,png,webp}', { eager: true });
const photoById = new Map(Object.entries(photos).map(([path, m]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), m.default]));
const ids = new Set(parsed.data.people.map((p) => p.id));
const orphans = [...photoById.keys()].filter((id) => !ids.has(id));
if (orphans.length) throw new Error(`Staff photos without a matching profile in team.json: ${orphans.join(', ')}`);

export const team = parsed.data.people.map((p) => ({ ...p, photo: photoById.get(p.id) }));

/** Two initials from the name, ignoring bracketed nicknames and initials like "O.S". */
export const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]{2,}/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
