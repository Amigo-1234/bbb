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

export const fees = {
  registration: 40000,
  programmes: [
    {
      id: 'science',
      name: 'Science',
      blurb: 'Intensive tutorials, tests and academic monitoring.',
      school: 437000,
      tutorial: 250000,
      total: 687000,
    },
    {
      id: 'non-science',
      name: 'Non-Science',
      sub: 'Art & Commercial',
      blurb: 'Full academic support for Art and Commercial students.',
      school: 421000,
      tutorial: 250000,
      total: 671000,
    },
  ],
  plan: [
    { amount: 200000, label: 'Initial deposit + registration' },
    { amount: 200000, label: 'Upon resumption' },
    { amount: null, label: 'Balance', when: 'Paid in January' },
  ],
  planNote:
    'Students who do not meet the initial payment must pay ₦400,000 before resumption.',
};

export const calendar: CalendarItem[] = [
  { label: 'Registration', start: '2026-04-27', end: '2026-06-12' },
  { label: 'Online resumption', start: '2026-05-04' },
  { label: 'Entrance assessment', start: '2026-08-29' },
  { label: 'Special tutorials', start: '2026-08-31', unconfirmed: true },
  { label: 'Physical resumption', start: '2026-11-02' },
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
    a: 'Yes. Candidates awaiting WAEC, NECO or NABTEB results can register, but your O-Level requirements must be complete before final JUPEB registration closes. Bring a recent passport photograph, a valid ID if available, and your O-Level result or evidence of registration.',
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
    a: 'Yes. You can pay in full or follow the instalment plan: ₦200,000 with registration, ₦200,000 on resumption, and the balance in January.',
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
