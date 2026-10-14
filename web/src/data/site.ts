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
  /** BIA's own descriptor, printed on every official 2026/27 document. */
  descriptor: 'Educational Consultancy, A-Level Programmes & Admission Services',
  session: '2026/2027',
  programmeLength: '8–9 months',
  url: 'https://biajupeb.com.ng',
  facebook: 'https://www.facebook.com/profile.php?id=100064129927723',
  /** Handle shown on BIA's directions video. */
  tiktok: 'https://www.tiktok.com/@bomaacademylimited',
};

/** Main contacts, in Boma's order of priority (October 2026). Boma's line is always first;
 * it and the COO line appear beside the WhatsApp icon on BIA's 2026/27 flyers. */
export const contacts: Contact[] = [
  { role: 'Chief Executive', name: 'Hon. Boma', phone: '+2347012388184', display: '0701 238 8184' },
  { role: 'Chief Operating Officer', name: 'Sir Holly', phone: '+2348164329204', display: '0816 432 9204' },
  { role: 'Personal Assistant', name: 'Miss Damaris', phone: '+2349134190829', display: '0913 419 0829' },
];

export const primaryContact = contacts[0];
export const whatsapp = 'https://wa.me/2347012388184';

export type StaffMember = {
  role: string;
  name?: string;
  phones: { phone: string; display: string }[];
  /** Only numbers Boma identified as WhatsApp. */
  whatsapp?: { phone: string; display: string };
};

const tel = (local: string) => ({ phone: `+234${local.slice(1)}`, display: `${local.slice(0, 4)} ${local.slice(4, 7)} ${local.slice(7)}` });

/** Staff directory supplied by Boma (October 2026), shown on /contact.
 * Miss Esther is not listed until Boma confirms her new role; the former
 * receptionist's line was removed at Boma's request (October 2026). */
export const staff: StaffMember[] = [
  { role: 'Chief Executive', name: 'Hon. Boma', phones: [tel('07012388184')] },
  { role: 'Chief Operating Officer', name: 'Sir Holly', phones: [tel('08164329204')] },
  { role: 'Personal Assistant', name: 'Miss Damaris', phones: [tel('09134190829')] },
  { role: 'JUPEB Secretary', name: 'Miss Gloria', phones: [tel('08021047735')] },
  { role: 'Office Manager', name: 'Mr. Great', phones: [tel('08103113275'), tel('09045616337')] },
  { role: 'Office Receptionist', name: 'Miss Temiloluwa', phones: [tel('07049733518')], whatsapp: tel('07048065326') },
  { role: 'JUPEB Academic Officer', name: 'Mr. Victor', phones: [tel('09022684754'), tel('07073551210')] },
];

export const waLink = (phone: string) => `https://wa.me/${phone.replace(/^\+/, '')}`;

/** Official centre address confirmed by Boma (October 2026). The landmark is
 * the school named in BIA's directions video and shown on the gate sign. */
export const address = {
  name: 'BIA Physical Tutorial Centre',
  purpose: 'For JUPEB physical tutorials, academic activities and student learning.',
  street: '12 Ameen Street',
  locality: 'Abule-Oja, Akoka',
  region: 'Lagos',
  country: 'Nigeria',
  lines: ['12 Ameen Street', 'Abule-Oja, Akoka, near UNILAG', 'Lagos, Nigeria'],
  short: '12 Ameen Street, Abule-Oja, Akoka, near UNILAG, Lagos',
  landmark: 'Seventh Day Adventist Primary and Secondary School, Abule-Oja',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=12+Ameen+Street%2C+Abule-Oja%2C+Akoka%2C+Lagos%2C+Nigeria',
};

/** Administrative office confirmed by Boma (October 2026). No map link until the
 * map destination has been checked against the real office. */
export const office = {
  name: 'BIA Administrative Office',
  purpose: 'For official meetings, business enquiries, partnerships and consultations.',
  lines: ['56 Igi Olugbin Street', 'Shomolu/Bariga, Lagos'],
  short: '56 Igi Olugbin Street, Shomolu/Bariga, Lagos',
  landmark: 'Directly opposite AP Petrol Station',
};

// Official 2026/27 fees and tutorial package now live in fees.ts.
export { registration, programmes, instalments, instalmentNote, tutorialPackage } from './fees';

/** Only dates printed in BIA's 2026/27 documents. Earlier V1 dates (registration window,
 * online resumption, entrance assessment) and the unconfirmed 2 November physical
 * resumption were removed pending Boma's confirmation. */
export const calendar: CalendarItem[] = [
  { label: 'Free marathon class & online tutorials', start: '2026-10-05', end: '2026-10-31' },
  { label: 'Fee balance due — before Second Semester resumption', start: '2027-05-04' },
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
    a: 'Yes. The 2026/27 programme fee can be paid in three instalments: upon registration (before the BIA Entrance Examination), upon resumption (by January), and the balance on or before 4 May 2027, before Second Semester resumption. The admissions office confirms each amount. All payments are non-refundable.',
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
