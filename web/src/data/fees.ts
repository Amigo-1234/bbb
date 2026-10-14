/**
 * Official 2026/27 fees, payment structure and tutorial package.
 *
 * Source documents supplied by BIA JUPEB (Boma), October 2026:
 *  - "BIA PAYMENT ADVICE (SCIENCE)" PDF          → `src: 'advice'`
 *  - "BIA PAYMENT ADVICE (NON-SCIENCE)" PDF      → `src: 'advice'`
 *  - "BIA JUPEB Physical Tutorial Services Package" image → `src: 'package'`
 *  - First-semester physical class timetable image (see timetable.ts)
 *
 * Every figure is transcribed as published. Items marked `confirm` contain a
 * discrepancy in the source documents that BIA must resolve before launch
 * (see docs/official-content-2026.md). Bank account details from the
 * documents are deliberately NOT included anywhere on the website.
 */

export type FeeItem = { label: string; amount: number; note?: string };

export type Programme = {
  id: 'science' | 'non-science';
  name: string;
  sub?: string;
  blurb: string;
  items: FeeItem[];
  /** "Grand Total Programme fee" exactly as printed on the payment advice. */
  total: number;
  /** confirm: printed total differs from the sum of the printed items. */
  confirm?: string;
};

/** Registration (compulsory) — identical on both payment advices. */
export const registration = {
  label: 'Application form',
  amount: 45000,
  /** Documents required to register (payment advice, "BIA JUPEB Requirements"). */
  requirements: [
    'Full registration fee payment',
    "O'Level result (awaiting results are acceptable)",
    'National Identification Number (NIN)',
    'Birth certificate',
  ],
};

const common = {
  admissionLetter: { label: 'JUPEB admission letter', amount: 2500 },
  exam: { label: 'JUPEB examination fee', amount: 95000 },
  syllabus: { label: "JUPEB syllabus & SFS student's handbook", amount: 4200 },
  lectureBanks: { label: 'JUPEB Lecture Banks (materials inclusive) and academic support services', amount: 150000 },
  physical: { label: 'Physical tutorial payment', amount: 200000 },
} satisfies Record<string, FeeItem>;

export const programmes: Programme[] = [
  {
    id: 'science',
    name: 'Science',
    blurb: 'Intensive tutorials, tests and academic monitoring.',
    items: [
      common.admissionLetter,
      { label: 'Foundation tuition fee (incl. TISHIP)', amount: 235000 },
      common.exam,
      common.syllabus,
      common.lectureBanks,
      common.physical,
    ],
    total: 686700,
  },
  {
    id: 'non-science',
    name: 'Non-Science',
    sub: 'Arts & Commercial',
    blurb: 'Full academic support for Art and Commercial students.',
    items: [
      common.admissionLetter,
      { label: 'Foundation tuition fee (incl. TISHIP)', amount: 219000 },
      common.exam,
      common.syllabus,
      common.lectureBanks,
      common.physical,
    ],
    total: 671000,
    confirm: 'Printed items add up to ₦670,700; printed total is ₦671,000.',
  },
];

/**
 * "Flexible payment structure for 2026/27 session" (page 3 of both advices).
 * confirm: the three instalments add up to ₦687,000, which matches neither
 * programme total exactly (Science ₦686,700, Non-Science ₦671,000).
 */
/**
 * Display gates — flip to true once Boma verifies the disputed figures
 * (see docs/official-content-2026.md). While false, the site shows the
 * instalment stages and dates without amounts, hides the Non-Science total
 * and the documents that print the disputed figures.
 */
export const verified = {
  nonScienceTotal: false,
  instalmentAmounts: false,
};

export const instalments = [
  {
    label: 'First instalment',
    amount: 200000,
    when: 'Upon registration',
    detail: 'Payment closes before the BIA Entrance Examination.',
  },
  {
    label: 'Second instalment',
    amount: 200000,
    when: 'Upon resumption',
    detail: 'Complete by January, before the First Semester Examination or the final JUPEB biometrics.',
  },
  {
    label: 'Final instalment',
    amount: 287000,
    when: 'On or before 4 May 2027',
    detail: 'The balance, paid before Second Semester resumption.',
  },
];

export const instalmentNote =
  'Students who miss the first ₦200,000 must complete ₦400,000 before February 2027 (before the final JUPEB thumbprint and biometrics exercise), with the balance before Second Semester resumption.';

/** Terms printed on both payment advices. */
export const terms = [
  'All payments are final and non-refundable once successfully processed.',
  'Please review carefully and be certain before making any payment.',
  'Keep your payment receipt safe for record and verification purposes.',
];

export const lectureBanksNotice =
  'Students who cannot attend physical classes, or who prefer online learning, must enrol in the Lecture Banks — they contain the essential teaching, materials and guidance needed to succeed.';

/**
 * Physical Tutorial Services Package — for students who want to join BIA's
 * physical tutorials only, including students from other institutions.
 * This is separate from the full JUPEB admission programme above.
 */
export const tutorialPackage = {
  name: 'Physical Tutorial Services Package',
  audience: "For students who want to join BIA's physical tutorials only — including students from other institutions.",
  oneTime: {
    amount: 150000,
    label: 'Full tutorial package',
    points: ['Covers the entire programme, from now until the exam', 'All services listed are included', 'No further tutorial payment required'],
  },
  monthly: {
    amount: 25000,
    label: 'Monthly subscription',
    points: ['Same tutorial services and benefits as the ₦150,000 package', 'Total depends on the number of months', 'A flexible, more affordable option'],
  },
  /** "Payment on installment can be ₦100,000 during the 1st semester and ₦100,000 during 2nd semester". */
  semesterInstalments: [
    { label: 'First semester', amount: 100000 },
    { label: 'Second semester', amount: 100000 },
  ],
  includes: [
    { label: 'Comprehensive tutorial classes', amount: 70000 },
    { label: 'Admission assistance and academic guidance', amount: 30000 },
    // confirm: printed as "Performance tackling" — transcribed as published.
    { label: 'Performance tackling, exam fee & packaging', amount: 30000 },
    { label: 'JUPEB mentorship, academic support and ID card', amount: 20000 },
  ] satisfies FeeItem[],
  registrationForm: { label: 'Tutorial registration form fee (paid separately)', amount: 5000 },
};

/** BIA Entrance Examination & free Special Marathon Class (page 4 of both advices). */
export const entranceExam = {
  purpose:
    "The Entrance Examination is not meant to deny any student admission. It assesses each student's academic strength and identifies areas to improve before the JUPEB programme starts. Students who do not perform well are still admitted, but may be advised or required to take additional academic support.",
  marathon: {
    label: 'Free Special Marathon Class',
    start: '2026-10-05',
    end: '2026-10-31',
    detail: 'A free academic support class before the main physical resumption, to strengthen foundations and prepare properly for JUPEB.',
  },
};

export const naira = (n: number) => '₦' + n.toLocaleString('en-NG');
export const sum = (items: FeeItem[]) => items.reduce((t, i) => t + i.amount, 0);
