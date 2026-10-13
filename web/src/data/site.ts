/**
 * Homepage content for the BIA JUPEB prototype.
 *
 * Every value here is taken from the current biajupeb.com.ng pages
 * (index, about, jupeb-info and the five guides). Nothing is invented.
 * Items marked `confirm` still need sign-off from BIA JUPEB before launch.
 */

export type Contact = {
  role: string;
  name?: string;
  phone: string; // E.164, used for tel: links
  display: string;
};

export type CalendarItem = {
  label: string;
  start: string; // ISO date
  end?: string;
  unconfirmed?: boolean;
};

export const site = {
  name: 'BIA JUPEB',
  parent: "Boma's Intellectual Academy",
  session: '2026/2027',
  programmeLength: '8–9 months',
  url: 'https://biajupeb.com.ng',
  facebook:
    'https://www.facebook.com/profile.php?id=100064129927723',
};

/** confirm: the legacy site lists 7+ different numbers; these are the ones
 * published with a named role on the current homepage. */
export const contacts: Contact[] = [
  { role: 'Chief Executive', name: 'Hon. Boma', phone: '+2347012388184', display: '0701 238 8184' },
  { role: 'Personal Assistant', name: 'Miss Esther', phone: '+2347039834168', display: '0703 983 4168' },
  { role: 'JUPEB Secretary', name: 'Miss Gloria', phone: '+2348021047735', display: '0802 104 7735' },
  { role: 'Reception', phone: '+2349167505810', display: '0916 750 5810' },
];

/** The number used in every legacy footer. */
export const primaryContact = contacts[0];

/** confirm: transcribed as published ("Lady Lag."). */
export const address = {
  lines: ['56 Igi Olugbin St.', 'Shomolu Pedro Road, Lady Lag.', 'Bariga, Lagos'],
  landmark: 'Directly opposite AP petrol station',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=56+Igi+Olugbin+Street+Bariga+Lagos',
};

// Official 2026/27 fees and tutorial package now live in fees.ts.
export { registration, programmes, instalments, instalmentNote, tutorialPackage } from './fees';

export const calendar: CalendarItem[] = [
  { label: 'Registration', start: '2026-04-27', end: '2026-06-12' },
  { label: 'Online resumption', start: '2026-05-04' },
  { label: 'Entrance assessment', start: '2026-08-29' },
  { label: 'Free marathon class & online tutorials', start: '2026-10-05', end: '2026-10-31' },
  { label: 'Physical resumption', start: '2026-11-02' },
  { label: 'Final instalment due (before Second Semester resumption)', start: '2027-05-04' },
];

// Student outcomes now come from content/achievements/records.json.
export { outcomeCategories, outcomes, admissionsByInstitution } from './achievements';
export type { Outcome, OutcomeCategory } from './achievements';

export const gradePoints = [
  ['A', 5],
  ['B', 4],
  ['C', 3],
  ['D', 2],
  ['E', 1],
] as const;

export const combinations = [
  { course: 'Medicine', subjects: ['Biology', 'Chemistry', 'Physics'] },
  { course: 'Law', subjects: ['Literature-in-English', 'Government', 'CRS'] },
  { course: 'Engineering', subjects: ['Mathematics', 'Physics', 'Chemistry'] },
];

export const faqs = [
  {
    q: 'Can I register with an awaiting result?',
    a: "Yes — awaiting results are acceptable. To register you need the full ₦45,000 registration fee, your O'Level result (or awaiting result), your National Identification Number (NIN) and your birth certificate.",
  },
  {
    q: 'How are JUPEB points calculated?',
    a: 'Each grade converts to points: A = 5, B = 4, C = 3, D = 2, E = 1. Competitive courses at universities such as UNILAG need high points, which is why we run weekly tests and mock examinations.',
  },
  {
    q: 'Which subject combination should I choose?',
    a: 'Your combination must match the course you intend to study. For example: Medicine — Biology, Chemistry, Physics; Law — Literature-in-English, Government, CRS; Engineering — Mathematics, Physics, Chemistry.',
  },
  {
    q: 'Should I choose JUPEB or IJMB?',
    a: 'Both are accepted by many Nigerian universities. JUPEB typically runs for 8 to 9 months, while IJMB can take 9 to 12 months depending on the study centre.',
  },
  {
    q: 'Which universities do you guide students into?',
    a: 'Our placement guidance currently focuses on the University of Lagos (UNILAG). After JUPEB, we guide you through the Direct Entry window, timelines and documentation.',
  },
  {
    q: 'Can I pay in instalments?',
    a: 'Yes. The 2026/27 plan has three instalments: ₦200,000 upon registration (before the BIA Entrance Examination), ₦200,000 upon resumption (by January), and the final ₦287,000 on or before 4 May 2027, before Second Semester resumption. All payments are non-refundable.',
  },
  {
    q: 'Can I join only the physical tutorials?',
    a: "Yes. The Physical Tutorial Services Package is for students who want to join BIA's physical tutorials only — including students from other institutions. It costs ₦150,000 from now until the exam, or ₦25,000 per month, plus a ₦5,000 tutorial registration form fee. It is separate from the full JUPEB admission programme, which already includes physical tutorials.",
  },
  {
    q: 'Do you provide past questions?',
    a: 'Yes — past questions are provided directly to registered students across Science, Arts and Commercial subjects.',
  },
];

/** Guide articles (ported from the legacy site; old .html URLs redirect here). */
export const guides = [
  { title: 'JUPEB Guide 2026: registration, fees and admissions', href: '/guides/jupeb-guide' },
  { title: 'How to gain admission into UNILAG via JUPEB', href: '/guides/jupeb-unilag-admission' },
  { title: 'JUPEB vs IJMB: which is easier?', href: '/guides/jupeb-vs-ijmb' },
  { title: 'Can I use an awaiting result for JUPEB?', href: '/guides/awaiting-result-jupeb-2026' },
  { title: 'JUPEB past questions and answers', href: '/guides/jupeb-past-questions' },
];

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');
