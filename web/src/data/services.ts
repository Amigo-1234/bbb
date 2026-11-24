/**
 * BIA's other services, from BIA's own flyers (November 2026):
 *  - "Meet some of our JAMB high scorers" (2026/27 flyer): names and UTME scores.
 *  - "BIA JUPEB Past Questions 2026/27": subjects.
 *  - "Secure an apartment via BIA": areas and contact numbers.
 *  - JAMB class and International Registration (SAT USA) listed as services by the site owner on BIA's behalf (23 Nov 2026).
 *  - Cambridge IGCSE & A-Level Programmes: BIA's own description (WhatsApp, 23 Nov 2026).
 *  - BIA Study Abroad (BSA): BSA logo and flyers (@bia.study.abroad). Marketing headlines are not
 *    repeated; only what the flyers state as the offer, with their own caveat on entry requirements.
 * Nothing here adds prices, dates or claims BIA has not published.
 */
import { contacts, staff } from './site';

/** JAMB scores as announced by BIA. Spellings as on the flyer, except where the student is
 * already on this site (Nkuma Daniel, Duruji Sharon), which use the site's verified spelling. */
export const jambScorers: [name: string, score: number][] = [
  ['Masha David', 356],
  ['Adedeji Osamagbe', 356],
  ['Eka Emmanuel', 343],
  ['Nkuma Daniel', 340],
  ['Sodolamu Comfort', 334],
  ['Ayeni Oluwateniola', 327],
  ['Nnaji Anita Ozioma', 325],
  ['Imana Nurudeen', 321],
  ['Omotubi Moyinoluwa', 318],
  ['Wifunke Baahir', 318],
  ['Okosa Mitchell', 299],
  ['Orji-Mark Jubilee', 296],
  ['Ireka Desmond', 296],
  ['Brave Eden Micheal', 292],
  ['Sanyaolu Hassan', 289],
  ['Albert Sewa', 288],
  ['Duruji Sharon', 280],
  ['Otugalu Victoria', 277],
];

export const pastQuestionSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Government', 'CRS', 'Literature'];

const holly = contacts.find((c) => c.name === 'Sir Holly')!;
const gloria = staff.find((s) => s.name === 'Miss Gloria')!;

export const accommodation = {
  offCampus: ['Elkanemi', 'Gbajabiamila', 'Abule Oja', 'Pako', 'Ilaje Bariga', 'Onike/Yaba'],
  onCampus: 'Women Society Hostel (for females only)',
  /** Numbers printed on BIA's accommodation flyer. */
  contacts: [
    { name: holly.name!, phone: holly.phone, display: holly.display },
    { name: gloria.name!, phone: gloria.phones[0].phone, display: gloria.phones[0].display },
  ],
};

export const igcse = {
  title: 'Cambridge IGCSE & A-Level Programmes',
  /** BIA's own wording. */
  text: 'Prepare for your next academic step with BIA’s personalised teaching, focused examination preparation and admission guidance.',
};

/** BIA Study Abroad (BSA), from its flyers. */
export const bsa = {
  name: 'BIA Study Abroad (BSA)',
  tagline: 'Dream. Plan. Go global.',
  offers: [
    'Level 3 Foundation — a bridge to UK study for students who did not get the A-Level results they needed, without traditional re-sits',
    'UK Bachelor’s degree pathways',
    'Level 4 & 5 Diploma in Human Resource Management',
    'UK Level 5 & Level 7 diplomas — including a UK IT & Computing Diploma, Level 7 Strategic Sales and a Level 7 HR Management qualification',
    'Postgraduate diploma (PGD) routes towards a UK Master’s',
    'MBA progression opportunities',
    '100% online and flexible, with a British curriculum — study while you work or run your business',
  ],
  progression:
    'With BSA you can complete a Level 7 diploma and progress to selected UK Master’s top-up programmes, or earn a recognised diploma and progress to a UK Bachelor’s or Master’s top-up degree — subject to university entry requirements.',
  bonus: 'A free Employability & Workplace Skills Course when you enrol.',
  handle: '@bia.study.abroad',
  email: 'biastudyabroad@gmail.com',
};

/** "BIA UTME 2026/2027 Paid Online Tutorial" flyer (BIA). Prices as printed. */
export const utmeTutorial = {
  title: 'BIA UTME 2026/2027 Paid Online Tutorial',
  start: 'December 2026',
  schedule: 'Live online classes, Monday – Friday, 8:15am – 1:15pm',
  description: 'Focused teaching, regular practice and guided corrections, aiming for 300+ in the UTME.',
  prices: [
    { label: 'Access until the UTME 2027 examination', amount: 50000 },
    { label: 'Monthly subscription (per month)', amount: 20000 },
    { label: 'Online tutorial registration form', amount: 5000 },
  ],
};

/** "Free BIA UTME 2026/2027 Preparatory Timetable" flyer (BIA): two weeks, free. */
export const utmeFreePrep = {
  title: 'Free BIA UTME 2026/2027 Preparatory Timetable',
  length: '2 weeks',
  days: [
    ['Monday', 'English Language', '8:00 – 10:00pm'],
    ['Tuesday', 'Physics · Government', '8:00 – 10:00pm'],
    ['Wednesday', 'Chemistry · Economics · CRS', '8:00 – 10:00pm'],
    ['Thursday', 'Mathematics · Biology · Financial Accounting · Literature', '8:00 – 10:00pm'],
    ['Friday', 'Subject combination quizzes on the BIA CBT platform', '10:00am – 5:00pm'],
    ['Saturday', 'Quiz corrections and explanations', '8:00 – 10:00pm'],
  ] as [string, string, string][],
  quizRules: [
    'Only one attempt is allowed per quiz.',
    'Attempt the quizzes for your four UTME subjects. English Language is compulsory for everyone.',
  ],
};

/** "BIA JUPEB Service Support — Lecture Banks + Online Academic Package 2026/2027" (BIA, corrected edition). */
export const lectureBanks = {
  title: 'BIA JUPEB Lecture Banks + Online Academic Package',
  price: 150000,
  covers: 'Complete two-semester package: First Semester (001 & 002) and Second Semester (003 & 004)',
  includes: [
    'Recorded JUPEB lecture banks for both semesters (001, 002, 003 and 004)',
    'Online classes and guided question-solving support',
    'Daily JUPEB CBT mock practice',
    'Weekly physical test every Friday, 3:00 – 6:00pm',
    'Structured revision, practice questions and academic assessment support',
  ],
  why: [
    'Study any time, anywhere — recorded lessons are not tied to a live-class time.',
    'Replay difficult explanations, calculations and worked examples until you understand them.',
    'Spend your revision time on the topics you find hardest.',
  ],
  subjects: {
    science: 'Physics, Chemistry, Mathematics and Biology',
    artsCommercial: 'Government, Literature, Economics, CRS, Business Studies and Accounting',
  },
  /** BIA's own caveat, printed on the document. */
  note: 'The ₦150,000 fee covers the lecture-bank and online academic support package for both semesters. It is not JUPEB registration, examination or residential tuition.',
};

/** "BIA Special Private Classes 2026/27" flyer (BIA). The timetable is BIA's demonstration timetable. */
export const privateClasses = {
  title: 'BIA Special Private Classes 2026/27',
  text: 'Personalised academic support through special private classes, tailored to each student’s learning pace, academic needs and goals.',
  demo: [
    ['Monday', 'Online', 'To be agreed'],
    ['Tuesday', 'Physical', '11:00am – 2:00pm'],
    ['Wednesday', 'Online', 'To be agreed'],
    ['Thursday', 'Physical', '11:00am – 2:00pm'],
    ['Friday', 'Online', 'To be agreed'],
    ['Saturday', 'Physical, then online', '5:00 – 6:00pm'],
  ] as [string, string, string][],
  demoNote: 'This is a demonstration timetable. Actual schedules and lesson arrangements are agreed with individual students and tutors.',
  includes: [
    'One-on-one teaching',
    'Personalised learning plans',
    'Regular assessments and assignments',
    'Continuous progress monitoring',
    'Targeted academic support',
    'Class note explanations',
  ],
};
