/**
 * Official BIA graphics approved for the website (public derivatives).
 *
 * Originals are archived in content/official/originals/ (PDFs) or kept by BIA
 * (images containing bank details). Any image that showed bank account details
 * has been redacted — only the account box is covered; no amount is altered.
 * See content/official/README.md.
 *
 * Pending verification (not shipped): the Non-Science fee page and the payment-plan
 * flyer print disputed totals; they are kept in content/official/pending/ until Boma
 * confirms the figures (see verified in fees.ts).
 */
import type { ImageMetadata } from 'astro';
import sciP1 from '../assets/official/advice-science-p1.jpg';
import sciP2 from '../assets/official/advice-science-p2.jpg';
import nonP1 from '../assets/official/advice-non-science-p1.jpg';
import exam from '../assets/official/entrance-exam-2026.jpg';
import pkg from '../assets/official/tutorial-package-2026.jpg';
import ttFirst from '../assets/official/timetable-first-semester-2026.jpg';
import ttPre from '../assets/official/timetable-pre-resumption-2026.jpg';

export type OfficialDoc = {
  id: string;
  title: string;
  source: string;
  image: ImageMetadata;
  alt: string;
  redacted?: boolean;
};

const d = (doc: OfficialDoc) => doc;

export const docs = {
  scienceRequirements: d({
    id: 'science-requirements',
    title: 'Payment advice · Science · requirements & registration',
    source: 'BIA Payment Advice 2026/27 (Science), page 1',
    image: sciP1,
    alt: 'BIA JUPEB requirements and ₦45,000 registration fee, Science payment advice 2026/27',
  }),
  scienceFees: d({
    id: 'science-fees',
    title: 'Payment advice · Science · programme fees',
    source: 'BIA Payment Advice 2026/27 (Science), page 2',
    image: sciP2,
    alt: 'Science programme fee table, grand total ₦686,700',
  }),
  nonScienceRequirements: d({
    id: 'non-science-requirements',
    title: 'Payment advice · Non-Science · requirements & registration',
    source: 'BIA Payment Advice 2026/27 (Non-Science), page 1',
    image: nonP1,
    alt: 'BIA JUPEB requirements and ₦45,000 registration fee, Non-Science payment advice 2026/27',
  }),
  entranceExam: d({
    id: 'entrance-exam',
    title: 'Entrance exam & free Special Marathon Class',
    source: 'BIA Payment Advice 2026/27, page 4',
    image: exam,
    alt: 'BIA JUPEB Entrance Exam and free Special Marathon Class, 5–31 October 2026',
  }),
  tutorialPackage: d({
    id: 'tutorial-package',
    title: 'Physical Tutorial Services Package',
    source: 'BIA tutorial package flyer, 2026/27',
    image: pkg,
    alt: 'Physical Tutorial Services Package: ₦150,000 one-time or ₦25,000 per month',
    redacted: true,
  }),
  timetableFirst: d({
    id: 'timetable-first-semester',
    title: 'First semester physical class timetable',
    source: 'BIA JUPEB First Semester Timetable, 2026/27',
    image: ttFirst,
    alt: 'Official BIA JUPEB first semester physical class timetable',
    redacted: true,
  }),
  timetablePre: d({
    id: 'timetable-pre-resumption',
    title: 'Free online & paid physical tutorial timetable',
    source: 'BIA Payment Advice 2026/27, page 6',
    image: ttPre,
    alt: 'Official BIA JUPEB free online and paid physical tutorial timetable from 5 October 2026',
  }),
};
