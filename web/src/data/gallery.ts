/**
 * /gallery — every approved BIA photograph and video, by category.
 *
 * Sources (all authentic BIA media, published with permission):
 *  - Phase 6 selection (src/data/media.ts): 15 photos, 3 lesson videos
 *  - V1 site photographs already published (classes, Boma at an event)
 *  - BIA's directions video
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
const photos = [...phase6, ...legacy];
export const gallery: GalleryItem[] = photos.flatMap((p, i) => (i % 6 === 5 && videos[Math.floor(i / 6)] ? [p, videos[Math.floor(i / 6)]] : [p]));
for (const v of videos) if (!gallery.includes(v)) gallery.push(v);

export const counts = Object.fromEntries(categories.map((c) => [c.id, gallery.filter((g) => g.category === c.id).length])) as Record<CategoryId, number>;
