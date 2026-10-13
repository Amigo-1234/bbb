/**
 * Homepage photography and video, slot by slot.
 *
 * Phase 6 media from BIA's own collection (docs/media-selection-phase6.md).
 * Publication approved by Boma; BIA confirmed permission from the students and
 * tutors featured (October 2026). Files are re-saved without metadata and
 * capped at 2000px; Astro serves responsive AVIF/WebP. No photograph is used
 * twice on the homepage.
 *
 * Captions describe what is visible — no names, grades or claims.
 */
import type { ImageMetadata } from 'astro';
import p031 from '../assets/photos/phase6/p031.jpg';
import p041 from '../assets/photos/phase6/p041.jpg';
import p047 from '../assets/photos/phase6/p047.jpg';
import p053 from '../assets/photos/phase6/p053.jpg';
import p054 from '../assets/photos/phase6/p054.jpg';
import p059 from '../assets/photos/phase6/p059.jpg';
import p060 from '../assets/photos/phase6/p060.jpg';
import p064 from '../assets/photos/phase6/p064.jpg';
import p080 from '../assets/photos/phase6/p080.jpg';
import p086 from '../assets/photos/phase6/p086.jpg';
import p096 from '../assets/photos/phase6/p096.jpg';
import p106 from '../assets/photos/phase6/p106.jpg';
import p112 from '../assets/photos/phase6/p112.jpg';
import p123 from '../assets/photos/phase6/p123.jpg';
import p124 from '../assets/photos/phase6/p124.jpg';
import v010poster from '../assets/photos/phase6/v010-poster.jpg';
import v011poster from '../assets/photos/phase6/v011-poster.jpg';
import v012poster from '../assets/photos/phase6/v012-poster.jpg';

export type Photo = {
  id: string;
  src: ImageMetadata;
  alt: string;
  caption: string;
  position?: string;
};

const ph = (id: string, src: ImageMetadata, alt: string, caption: string, position?: string): Photo => ({ id, src, alt, caption, position });

export const heroPhotos: Photo[] = [
  ph('P086', p086, 'A large BIA JUPEB class at work in a sunlit classroom', 'A full class in session'),
  ph('P123', p123, 'Students writing at their desks during a BIA JUPEB class', 'Classwork, desk by desk', 'center 60%'),
  ph('P031', p031, 'Students seated at long desks during a lesson', 'Long days of focused study'),
  ph('P041', p041, 'Rows of students working through a lesson', 'Every seat taken'),
];

/** Full-width photograph between "How JUPEB works" and the fees. */
export const bandPhoto: Photo = ph('P124', p124, 'Students listening closely in a BIA JUPEB classroom', 'Front row to back row, every lesson counts.', 'center 40%');

/** Photographs for the three ways to study. */
export const modePhotos: Record<'physical' | 'online' | 'tutorials', Photo | null> = {
  physical: ph('P054', p054, 'A BIA tutor teaching at the whiteboard while students follow', 'Physical classes'),
  online: ph('P080', p080, 'A lesson being recorded on a phone mounted on a tripod', 'Lessons on camera', 'center 45%'),
  tutorials: ph('P106', p106, 'A tutor standing beside a full classroom', 'Physical tutorials'),
};

/** "Life at BIA" gallery. */
export const lifePhotos: Photo[] = [
  ph('P059', p059, 'View from the back of a class as a tutor writes on the whiteboard', 'From the back row'),
  ph('P047', p047, 'Students working at their desks, notes open', 'Heads down, pens moving'),
  ph('P053', p053, 'A tutor teaching in front of a phone on a tripod', 'Teaching for the camera'),
  ph('P096', p096, 'Students writing during a class', 'Practice questions'),
  ph('P112', p112, 'Students working at a long desk in afternoon light', 'Afternoon session'),
  ph('P064', p064, 'A packed classroom during a lesson', 'A full house'),
];

/** A tutor at work (name not yet supplied by BIA). */
export const tutorPhoto: Photo | null = ph('P060', p060, 'A BIA tutor explaining working on the whiteboard', 'A BIA tutor at the whiteboard', 'center 30%');

/** Short lesson videos — titles from BIA's own on-screen captions. Web encodes: H.264/AAC, 432px wide, faststart. */
export const lessonVideos = [
  { id: 'V012', title: 'Physics tutorial — entrance exam preparation', note: 'BIA private JUPEB physical tutorial, 2026/2027 (on-screen caption)', src: '/media/lessons/v012.mp4', poster: v012poster, width: 432, height: 768, duration: 120, bytes: 7038965 },
  { id: 'V011', title: 'Accounting class', note: 'BIA JUPEB 2025/2026 (on-screen caption)', src: '/media/lessons/v011.mp4', poster: v011poster, width: 432, height: 768, duration: 28, bytes: 1928449 },
  { id: 'V010', title: 'At the whiteboard', note: 'A lesson recorded on a tripod', src: '/media/lessons/v010.mp4', poster: v010poster, width: 432, height: 768, duration: 13, bytes: 858274 },
];
