/**
 * /gallery — every approved BIA photograph and video, by category.
 *
 * Sources (all authentic BIA media, published with permission):
 *  - Phase 6 selection (src/data/media.ts): 15 photos, 3 lesson videos
 *  - V1 site photographs already published (classes, Boma at an event)
 *  - BIA's directions video
 *  - Gallery batch 1 (Oct 2026): 17 photos — Boma approved, BIA confirmed permission.
 *    Five near-duplicates in the batch were not published (P005, P006, P029, P050, P128).
 *
 * Captions describe only what is visible. Categories without approved media
 * stay empty until BIA supplies the originals listed in
 * docs/gallery-media-request.md (and confirms permission).
 */
import type { ImageMetadata } from 'astro';
import { bandPhoto, heroPhotos, lessonVideos, lifePhotos, modePhotos, tutorPhoto } from './media';
import classroom from '../assets/photos/classroom.png';
import class010 from '../assets/photos/class-010.png';
import class011 from '../assets/photos/class-011.png';
import class012 from '../assets/photos/class-012.png';
import class013 from '../assets/photos/class-013.png';
import class014 from '../assets/photos/class-014.png';
import class015 from '../assets/photos/class-015.png';
import class016 from '../assets/photos/class-016.png';
import founderTeaching from '../assets/photos/founder-teaching.jpg';
import directionsPoster from '../assets/official/directions-poster.jpg';
import p001 from '../assets/photos/gallery/p001.jpg';
import p007 from '../assets/photos/gallery/p007.jpg';
import p013 from '../assets/photos/gallery/p013.jpg';
import p015 from '../assets/photos/gallery/p015.jpg';
import p020 from '../assets/photos/gallery/p020.jpg';
import p023 from '../assets/photos/gallery/p023.jpg';
import p024 from '../assets/photos/gallery/p024.jpg';
import p027 from '../assets/photos/gallery/p027.jpg';
import p035 from '../assets/photos/gallery/p035.jpg';
import p046 from '../assets/photos/gallery/p046.jpg';
import p056 from '../assets/photos/gallery/p056.jpg';
import p075 from '../assets/photos/gallery/p075.jpg';
import p077 from '../assets/photos/gallery/p077.jpg';
import p082 from '../assets/photos/gallery/p082.jpg';
import p088 from '../assets/photos/gallery/p088.jpg';
import p103 from '../assets/photos/gallery/p103.jpg';
import p111 from '../assets/photos/gallery/p111.jpg';

export const categories = [
  { id: 'classrooms', label: 'Classrooms & Tutorials' },
  { id: 'student-life', label: 'Student Life' },
  { id: 'events', label: 'Events' },
  { id: 'celebrations', label: 'Academic Celebrations' },
  { id: 'videos', label: 'Videos' },
] as const;
export type CategoryId = (typeof categories)[number]['id'];

export type GalleryItem = {
  id: string;
  kind: 'photo' | 'video';
  category: CategoryId;
  image: ImageMetadata;
  alt: string;
  /** Short label on the tile. */
  title: string;
  /** Full caption in the viewer. */
  caption: string;
  position?: string;
  video?: { src: string; width: number; height: number; duration: number; bytes: number; track?: string };
};

const photo = (p: { id: string; src: ImageMetadata; alt: string; caption: string; position?: string }, category: CategoryId = 'classrooms'): GalleryItem => ({
  id: p.id,
  kind: 'photo',
  category,
  image: p.src,
  alt: p.alt,
  title: p.caption,
  caption: p.caption,
  position: p.position,
});

const v1 = (id: string, src: ImageMetadata, alt: string, caption: string, category: CategoryId = 'classrooms', position?: string) =>
  photo({ id, src, alt, caption, position }, category);

const phase6 = [
  ...heroPhotos,
  bandPhoto,
  ...Object.values(modePhotos).filter((p): p is NonNullable<typeof p> => !!p),
  ...lifePhotos,
  ...(tutorPhoto ? [tutorPhoto] : []),
].map((p) => photo(p));

const legacy = [
  v1('classroom', classroom, 'A full classroom of BIA JUPEB students working at their desks', 'A full class in session'),
  v1('class-010', class010, 'Students seated in rows in a lecture hall, writing', 'Lecture hall session'),
  v1('class-011', class011, 'Students seated at long desks during class', 'Students in class'),
  v1('class-012', class012, 'A tutor moving between desks in a busy classroom', 'Guidance at every desk'),
  v1('class-013', class013, 'Students concentrating on written work', 'Focused classwork'),
  v1('class-014', class014, 'Students writing while a tutor looks on', 'Classwork with tutor support'),
  v1('class-015', class015, 'A student at a lectern in front of a whiteboard', 'At the front of the class'),
  v1('class-016', class016, 'A tutor standing beside students as they work', 'Tutor-led classwork', 'classrooms', 'center 35%'),
  v1('founder-teaching', founderTeaching, 'Boma speaking to students with a microphone', 'Boma speaking to students', 'events', 'center 25%'),
];

// Gallery batch 1 — neutral visual descriptions; no event names or results (none supplied).
const batch1 = [
  v1('P013', p013, 'Students working through their notes at a crowded desk', 'Working through notes'),
  v1('P020', p020, 'A BIA tutor pointing to working on the whiteboard', 'Explaining at the whiteboard', 'classrooms', 'center 30%'),
  v1('P075', p075, 'Three students sitting together on a coach', 'On the coach', 'student-life'),
  v1('P001', p001, 'Students in white lab coats standing on a campus lawn', 'Gathering on campus', 'events'),
  v1('P023', p023, 'Students writing in a full classroom', 'Classwork in progress'),
  v1('P015', p015, 'Four students in white lab coats standing outdoors', 'In lab coats', 'student-life'),
  v1('P027', p027, 'A sheet of paper held up in front of students at their desks', 'Reviewing a paper together'),
  v1('P024', p024, 'A large group of students in white lab coats outside campus buildings', 'Group photograph', 'events'),
  v1('P077', p077, 'A student smiling on a coach', 'On the road', 'student-life'),
  v1('P056', p056, 'Students seated in a classroom, some looking towards the camera', 'Between lessons'),
  v1('P035', p035, 'Three students smiling outdoors on campus', 'Friends on campus', 'student-life'),
  v1('P007', p007, 'A group of students in white lab coats outside a campus building', 'Group in lab coats', 'events'),
  v1('P082', p082, 'Students working at their desks in a well-lit classroom', 'Group work at the desks'),
  v1('P103', p103, 'Students seated together on a coach', 'Travelling together', 'student-life'),
  v1('P088', p088, 'A student writing notes at a desk', 'Taking notes'),
  v1('P046', p046, 'A student in a white lab coat seated outdoors', 'A pause outdoors', 'student-life'),
  v1('P111', p111, 'Students in white lab coats lined up outside a building', 'Lining up outside', 'events'),
];

const videos: GalleryItem[] = [
  ...lessonVideos.map((v) => ({
    id: v.id,
    kind: 'video' as const,
    category: 'videos' as const,
    image: v.poster,
    alt: `Video: ${v.title}`,
    title: v.title,
    caption: `${v.title} — ${v.note}`,
    video: { src: v.src, width: v.width, height: v.height, duration: v.duration, bytes: v.bytes },
  })),
  {
    id: 'directions',
    kind: 'video',
    category: 'videos',
    image: directionsPoster,
    alt: 'Video: directions from UNILAG and Yaba to the BIA centre',
    title: 'Directions to the centre',
    caption: 'Directions from UNILAG and Yaba to 12 Ameen Street — filmed by BIA',
    video: { src: '/media/bia-directions.mp4', width: 464, height: 832, duration: 83, bytes: 7547931, track: '/media/bia-directions.en.vtt' },
  },
];

/** Photographs first (Phase 6, then V1), with videos interleaved for rhythm. */
// Phase 6 and batch 1 alternate so every category appears in the first batch.
const photos = [...phase6.flatMap((p, i) => (batch1[i] ? [p, batch1[i]] : [p])), ...batch1.slice(phase6.length), ...legacy];
export const gallery: GalleryItem[] = photos.flatMap((p, i) => (i % 6 === 5 && videos[Math.floor(i / 6)] ? [p, videos[Math.floor(i / 6)]] : [p]));
for (const v of videos) if (!gallery.includes(v)) gallery.push(v);

export const counts = Object.fromEntries(categories.map((c) => [c.id, gallery.filter((g) => g.category === c.id).length])) as Record<CategoryId, number>;
