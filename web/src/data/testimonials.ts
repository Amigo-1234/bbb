/**
 * Student testimonials — content/testimonials/testimonials.json.
 * Validated at build time; only consented quotes are exported.
 */
import { z } from 'astro/zod';
import type { ImageMetadata } from 'astro';
import raw from '../../content/testimonials/testimonials.json';
import { Consent, Session, allows } from './achievements';

const Testimonial = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  quote: z.string().min(10).max(600),
  name: z.string().nullable(),
  session: Session.nullable(),
  course: z.string().nullable(),
  university: z.string().nullable(),
  grade: z.string().regex(/^[A-E]{3}$/).nullable(),
  /** File name inside src/assets/testimonials/ (consented photos only). */
  photo: z.string().nullable(),
  /** Where the words came from, e.g. "WhatsApp message to Boma, Oct 2026 (scroll/012)". */
  source: z.string(),
  featured: z.boolean().default(false),
  /** True for words transcribed from the V1 archive (e.g. scroll/ WhatsApp screenshots). */
  archive: z.boolean().default(false),
  consent: Consent,
});

const parsed = z.object({ records: z.array(Testimonial) }).safeParse(raw);
if (!parsed.success) throw new Error(`content/testimonials/testimonials.json is invalid:\n${parsed.error.message}`);

const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/testimonials/*.{png,jpg,jpeg,webp}', { eager: true });

export type PublicTestimonial = {
  id: string;
  quote: string;
  name?: string;
  session: string | null;
  course: string | null;
  university: string | null;
  grade: string | null;
  photo?: ImageMetadata;
  featured: boolean;
  archive: boolean;
};

export const testimonials: PublicTestimonial[] = parsed.data.records
  .filter((t) => allows(t.consent, 'quote'))
  .map((t) => {
    const key = t.photo ? `../assets/testimonials/${t.photo}` : null;
    const photo = key && allows(t.consent, 'photo') ? photos[key]?.default : undefined;
    if (key && allows(t.consent, 'photo') && !photo) throw new Error(`Testimonial photo not found for ${t.id}: ${t.photo}`);
    return {
      id: t.id,
      quote: t.quote,
      name: allows(t.consent, 'name') ? (t.name ?? undefined) : undefined,
      session: t.session,
      course: t.course,
      university: t.university,
      grade: t.grade,
      photo,
      featured: t.featured,
      archive: t.archive,
    };
  })
  .sort((a, b) => Number(b.featured) - Number(a.featured));
