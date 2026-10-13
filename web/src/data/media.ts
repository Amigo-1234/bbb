/**
 * Homepage photography and video, slot by slot.
 *
 * Every slot has an APPROVED photograph (published since V1) and, where BIA's
 * Phase 6 media offers a better image, a REVIEW candidate (see
 * docs/media-selection-phase6.md). Review candidates show identifiable students
 * and tutors, so they are used only in a local private-review build; the public
 * site always renders the approved set. No photograph is used twice.
 *
 * Captions describe what is visible — no names, grades or claims.
 */
import type { ImageMetadata } from 'astro';
import { isReview, photos as review, videos as reviewVideos } from './review-media';
import classroom from '../assets/photos/classroom.png';
import class010 from '../assets/photos/class-010.png';
import class011 from '../assets/photos/class-011.png';
import class012 from '../assets/photos/class-012.png';
import class013 from '../assets/photos/class-013.png';
import class014 from '../assets/photos/class-014.png';
import class015 from '../assets/photos/class-015.png';
import class016 from '../assets/photos/class-016.png';

export type Photo = {
  id: string;
  src: ImageMetadata;
  alt: string;
  caption: string;
  position?: string;
  /** true when this is Phase 6 media awaiting consent (review build only). */
  review?: boolean;
};

const r = (id: string, alt: string, caption: string, position?: string): Photo | null =>
  isReview && review[id] ? { id, src: review[id], alt, caption, position, review: true } : null;
const a = (id: string, src: ImageMetadata, alt: string, caption: string, position?: string): Photo => ({ id, src, alt, caption, position });
const pick = (candidate: Photo | null, approved: Photo) => candidate ?? approved;

export { isReview };

export const heroPhotos: Photo[] = isReview
  ? [
      r('P086', 'A large BIA JUPEB class at work in a bright classroom', 'A full class in session')!,
      r('P123', 'Students writing at their desks during a BIA JUPEB class', 'Classwork, desk by desk', 'center 60%')!,
      r('P031', 'Students seated at long desks during a lesson', 'Long days of focused study')!,
      r('P041', 'Rows of students working through a lesson', 'Every seat taken')!,
    ]
  : [
      a('classroom', classroom, 'A full classroom of BIA JUPEB students working at their desks', 'A full class in session'),
      a('class-010', class010, 'Students seated in rows in a lecture hall, writing', 'Lecture hall session'),
      a('class-016', class016, 'A tutor standing beside students as they work', 'Tutor-led classwork', 'center 35%'),
    ];

/** Full-width photograph between "How JUPEB works" and the fees. */
export const bandPhoto: Photo = pick(
  r('P124', 'Students listening closely in a BIA JUPEB classroom', 'Front row to back row, every lesson counts.', 'center 40%'),
  a('class-012', class012, 'A tutor moving between desks in a busy classroom', 'Guidance at every desk — in class, week after week.'),
);

/** Photographs for the three ways to study (review build only). */
export const modePhotos: Record<'physical' | 'online' | 'tutorials', Photo | null> = {
  physical: r('P054', 'A BIA tutor teaching at the whiteboard while students follow', 'Physical classes'),
  online: r('P080', 'A lesson being recorded on a phone mounted on a tripod', 'Lessons on camera', 'center 45%'),
  tutorials: r('P106', 'A tutor standing beside a full classroom', 'Physical tutorials'),
};

/** "Life at BIA" gallery. */
export const lifePhotos: Photo[] = isReview
  ? [
      r('P059', 'View from the back of a class as a tutor writes on the whiteboard', 'From the back row'),
      r('P047', 'Students working at their desks, notes open', 'Heads down, pens moving'),
      r('P053', 'A tutor teaching in front of a phone on a tripod', 'Teaching for the camera'),
      r('P096', 'Students writing during a class', 'Practice questions'),
      r('P112', 'Students working at a long desk in afternoon light', 'Afternoon session'),
      r('P064', 'A packed classroom during a lesson', 'A full house'),
    ].filter((p): p is Photo => !!p)
  : [
      a('class-013', class013, 'Students concentrating on written work', 'Focused classwork'),
      a('class-011', class011, 'Students seated at long desks during class', 'Students in class'),
      a('class-015', class015, 'A student at a lectern in front of a whiteboard', 'At the front of the class'),
      a('class-014', class014, 'Students writing while a tutor looks on', 'Classwork with tutor support'),
    ];

/** Tutor at work (review build only — tutor's name and consent not yet confirmed). */
export const tutorPhoto: Photo | null = r('P060', 'A BIA tutor explaining working on the whiteboard', 'A BIA tutor at the whiteboard', 'center 30%');

/** Short lesson videos (review build only). Titles are taken from BIA's own on-screen captions. */
export const lessonVideos = isReview
  ? [
      { id: 'V012', title: 'Physics tutorial — entrance exam preparation', note: 'BIA private JUPEB physical tutorial, 2026/2027 (on-screen caption)', ...reviewVideos.V012 },
      { id: 'V011', title: 'Accounting class', note: 'BIA JUPEB 2025/2026 (on-screen caption)', ...reviewVideos.V011 },
      { id: 'V010', title: 'At the whiteboard', note: 'A lesson recorded on a tripod', ...reviewVideos.V010 },
    ].filter((v) => v.src)
  : [];
