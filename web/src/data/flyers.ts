/**
 * BIA's own flyers for the homepage slider (supplied by the site owner on BIA's behalf, Nov 2026).
 * Each links to the page that carries the same information as text. Alt text summarises
 * the flyer so the content is readable by screen readers and search engines.
 */
import type { ImageMetadata } from 'astro';
import results from '../assets/flyers/results-16-points.jpg';
import jamb from '../assets/flyers/jamb-high-scorers.jpg';
import weekend from '../assets/flyers/weekend-schedule.jpg';
import online from '../assets/flyers/online-timetable.jpg';
import privateClasses from '../assets/flyers/special-classes.jpg';
import pq from '../assets/flyers/past-questions.jpg';
import accommodation from '../assets/flyers/accommodation.jpg';
import bsa from '../assets/flyers/bsa-british-curriculum.jpg';

export type Flyer = { image: ImageMetadata; kicker: string; title: string; alt: string; href: string };

export const flyers: Flyer[] = [
  {
    image: results,
    kicker: 'Results 2025/2026',
    title: 'JUPEB Top 2026 Scholars — 16 points (AAA)',
    alt: 'BIA poster: JUPEB Top 2026 Scholars who made 16 points (AAA) — Emmanuel, Darasimi, Peter, Dominique, Rofiat, Yusuf, David, Tenioluwa, Daniel and Prince.',
    href: '/hall-of-excellence#results-2025-2026',
  },
  {
    image: jamb,
    kicker: 'JAMB',
    title: 'Our JAMB high scorers — up to 356',
    alt: 'BIA poster: Meet some of our JAMB high scorers — Masha David and Adedeji Osamagbe 356, Eka Emmanuel 343, Nkuma Daniel 340, Sodolamu Comfort 334 and more.',
    href: '/services#jamb',
  },
  {
    image: weekend,
    kicker: 'Timetable',
    title: 'Weekend learning & assessment schedule',
    alt: 'BIA Weekend Learning and Assessment Schedule: Fridays 9:30am–5:30pm and Saturdays 10am–4pm on a four-week rotation; First Semester Mock Examination on Sunday 13 December 2026 at the Faculty of Management Science, UNILAG.',
    href: '/timetable#panel-weekend',
  },
  {
    image: privateClasses,
    kicker: 'Private classes',
    title: 'BIA Special Private Classes 2026/27',
    alt: 'BIA Special Private Classes 2026/27: personalised one-on-one teaching, physical on Tuesdays and Thursdays 11am–2pm, online sessions at agreed times, with personalised learning plans, regular assessments and progress monitoring.',
    href: '/services#private-classes',
  },
  {
    image: online,
    kicker: 'Online',
    title: 'JUPEB online timetable 2026/27',
    alt: 'BIA JUPEB Online Timetable 2026/27: Physics, Government and Business Studies on Mondays; Chemistry, Economics and CRS on Wednesdays; Biology, Maths, Accounting and Literature on Fridays; weekly tests on Saturdays.',
    href: '/timetable#panel-online',
  },
  {
    image: pq,
    kicker: 'Past questions',
    title: 'BIA JUPEB past questions 2026/27',
    alt: 'BIA JUPEB Past Questions 2026/27 for Mathematics, Physics, Chemistry, Biology, Economics, Government, CRS and Literature.',
    href: '/services#past-questions',
  },
  {
    image: accommodation,
    kicker: 'Accommodation',
    title: 'Secure an apartment via BIA',
    alt: 'BIA accommodation: secure an apartment on or off UNILAG campus — Elkanemi, Gbajabiamila, Abule Oja, Pako, Ilaje Bariga, Onike/Yaba, and the Women Society Hostel for females.',
    href: '/services#accommodation',
  },
  {
    image: bsa,
    kicker: 'BIA Study Abroad',
    title: 'Study online with a British curriculum',
    alt: 'BIA Study Abroad (BSA): study online with a British curriculum — UK-accredited diplomas and top-up pathways to progress into international degrees.',
    href: '/services#study-abroad',
  },
];
