/**
 * Public default: NO private review media.
 *
 * Phase 6 photos/videos of identifiable students and tutors live only in the
 * gitignored `private-media/` folder until BIA confirms publication consent.
 * A local review build (`BIA_PRIVATE_REVIEW=1 npm run build`) aliases this
 * module to `private-media/index.ts`; every other build — including Vercel —
 * uses these empty values, so the public site falls back to approved photos.
 */
import type { ImageMetadata } from 'astro';

export type ReviewVideo = {
  src: string;
  poster: ImageMetadata;
  width: number;
  height: number;
  duration: number;
  bytes: number;
};

export const photos: Record<string, ImageMetadata> = {};
export const videos: Record<string, ReviewVideo> = {};
export const isReview = false;
