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

export type Outcome = {
  grade: string;
  /** Points exactly as recorded on the legacy site. Several conflict with the
   * A=5…E=1 scale (e.g. "16 points – AAA"), so they are not rendered yet. */
  recordedPoints?: number;
  course: string;
  institution?: string;
  level?: string;
  /** Identifiable details (name, photo) render only when this is true. */
  consentVerified: boolean;
  name?: string;
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

export type OutcomeCategory = 'medicine' | 'law' | 'science' | 'business' | 'arts';

export const outcomeCategories: { id: OutcomeCategory; label: string }[] = [
  { id: 'medicine', label: 'Medicine & Health' },
  { id: 'law', label: 'Law' },
  { id: 'science', label: 'Sciences & Technology' },
  { id: 'business', label: 'Business & Finance' },
  { id: 'arts', label: 'Arts, Education & Social Sciences' },
];

/**
 * Anonymised outcomes transcribed from the testimonials published on the
 * legacy homepage (index.html, "Testimonials 2026"). Only grade, course,
 * institution and level are used; names, photos and recorded points stay in
 * the untouched legacy files until publication consent is verified.
 * `grade` is omitted where the legacy record gave none.
 */
export const outcomes: (Outcome & { category: OutcomeCategory; featured?: boolean })[] = [
  { grade: 'AAA', recordedPoints: 16, course: 'Law', institution: 'University of Lagos', level: '200 Level', category: 'law', featured: true, consentVerified: false },
  { grade: 'AAA', recordedPoints: 16, course: 'Medicine & Surgery (MBBS)', institution: 'University of Lagos', category: 'medicine', featured: true, consentVerified: false },
  { grade: 'AAA', recordedPoints: 16, course: 'Medicine & Surgery', institution: 'Federal University Oye-Ekiti', level: '200 Level', category: 'medicine', featured: true, consentVerified: false },
  { grade: 'AAA', recordedPoints: 15, course: 'Dentistry (BDS)', level: '200 Level', category: 'medicine', consentVerified: false },
  { grade: 'AAA', recordedPoints: 16, course: 'Medicine & Surgery (MBBS)', level: '200 Level', category: 'medicine', consentVerified: false },
  { grade: 'AAA', recordedPoints: 16, course: 'Medicine & Surgery (MBBS)', category: 'medicine', consentVerified: false },
  { grade: 'AAB', recordedPoints: 15, course: 'Philosophy', category: 'arts', consentVerified: false },
  { grade: 'AAC', recordedPoints: 14, course: 'Political Science', category: 'arts', consentVerified: false },
  { grade: 'AAC', recordedPoints: 14, course: 'Political Science', category: 'arts', consentVerified: false },
  { grade: 'BBB', recordedPoints: 13, course: 'Data Science', level: '200 Level', category: 'science', consentVerified: false },
  { grade: 'ABC', recordedPoints: 13, course: 'Accounting', institution: 'University of Lagos', level: '200 Level', category: 'business', consentVerified: false },
  { grade: 'ABC', recordedPoints: 12, course: 'Doctor of Pharmacy', level: '200 Level', category: 'medicine', consentVerified: false },
  { grade: 'ADB', recordedPoints: 12, course: 'Business Administration', category: 'business', consentVerified: false },
  { grade: 'CBC', recordedPoints: 11, course: 'Social Work', category: 'arts', consentVerified: false },
  { grade: 'DBC', recordedPoints: 10, course: 'Business Administration', category: 'business', consentVerified: false },
  { grade: 'CCD', recordedPoints: 9, course: 'Banking & Finance', institution: 'University of Lagos', level: '200 Level', category: 'business', consentVerified: false },
  { grade: 'CCE', recordedPoints: 8, course: 'Insurance', category: 'business', consentVerified: false },
  { grade: 'CCE', recordedPoints: 8, course: 'Educational Administration', category: 'arts', consentVerified: false },
  { grade: '', recordedPoints: 10, course: 'Pharmacology', institution: 'Osun State University', level: '200 Level', category: 'medicine', consentVerified: false },
  { grade: '', recordedPoints: 13, course: 'Nursing', category: 'medicine', consentVerified: false },
  { grade: '', course: 'European Studies', institution: 'University of Lagos', category: 'arts', consentVerified: false },
  { grade: '', course: 'Health Education', institution: 'University of Lagos', level: '200 Level', category: 'medicine', consentVerified: false },
  { grade: '', course: 'Christian Religious Studies', institution: 'University of Lagos', level: '200 Level', category: 'arts', consentVerified: false },
];

/** Universities named in the recorded outcomes, with the courses recorded for each. */
export const admissionsByInstitution = Object.entries(
  outcomes.reduce<Record<string, string[]>>((acc, o) => {
    if (o.institution && !(acc[o.institution] ??= []).includes(o.course)) acc[o.institution].push(o.course);
    return acc;
  }, {}),
).map(([institution, courses]) => ({ institution, courses }));

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

/** Existing guide URLs are kept as-is to preserve search rankings. */
export const guides = [
  { title: 'JUPEB Guide 2026: registration, fees and admissions', href: '/jupeb-guide.html' },
  { title: 'How to gain admission into UNILAG via JUPEB', href: '/jupeb-unilag-admission.html' },
  { title: 'JUPEB vs IJMB: which is easier?', href: '/jupeb-vs-ijmb.html' },
  { title: 'Can I use an awaiting result for JUPEB?', href: '/awaiting-result-jupeb-2026.html' },
  { title: 'JUPEB past questions and answers', href: '/jupeb-past-questions.html' },
];

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');
