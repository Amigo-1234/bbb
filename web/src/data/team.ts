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
  summary: z.string(),
  department: z.enum(['management', 'administration', 'academics', 'student-affairs', 'brand']),
  sections: z.array(z.object({ heading: z.string(), items: z.array(z.string()).min(1) })).min(1),
  source: z.string(),
});
export type TeamMember = z.infer<typeof Person>;

const parsed = z.object({ people: z.array(Person) }).safeParse(raw);
if (!parsed.success) throw new Error(`content/team/team.json is invalid:\n${parsed.error.message}`);
export const team = parsed.data.people;

/** Two initials from the name, ignoring bracketed nicknames and initials like "O.S". */
export const initials = (name: string) =>
  name
    .replace(/\(.*?\)/g, '')
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]{2,}/.test(w))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
