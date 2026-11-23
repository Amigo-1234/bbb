/**
 * Official BIA JUPEB timetables, transcribed exactly from the images
 * supplied by BIA JUPEB (October 2026). Days, times, subject codes and
 * venues are kept as published; nothing is inferred.
 *
 *  - `firstSemester`: "BIA Private JUPEB Students and some selected UNILAG
 *    School of Foundation Students (Physical Class) Timetable — BIA JUPEB
 *    First Semester Timetable" (updated image).
 *  - `preResumption`: "BIA JUPEB Free Online Tutorial & Paid Physical
 *    Tutorial, 2026/2027 Academic Session" (page 6 of the payment advices).
 */

export type SessionKind = 'self-study' | 'lectures' | 'class' | 'private' | 'marathon' | 'test' | 'online' | 'physical';

export type Session = {
  /** As printed, e.g. "8am – 1pm". Omitted when the source gives no time. */
  time?: string;
  /** 24h "HH:MM" bounds for "today/now" highlighting; omitted with `time`. */
  start?: string;
  end?: string;
  /** Printed label; omitted where the image shows only subjects. */
  title?: string;
  /** Subject codes exactly as printed. */
  subjects?: string[];
  kind: SessionKind;
  paid?: boolean;
  venue?: string;
};

export type Day = {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  name: string;
  sessions: Session[];
  /** Side note printed beside the day, e.g. the self-study venue. */
  note?: { label: string; text: string };
};

export type Timetable = {
  id: string;
  title: string;
  heading: string;
  audience: string;
  intro?: string;
  /** ISO date the timetable applies from (when printed). */
  from?: string;
  days: Day[];
  footnotes: string[];
};

const MTN = { label: 'Self study', text: 'Inside MTN Library, UNILAG' };
const PRIVATE: Session = { time: '5pm – 7pm', start: '17:00', end: '19:00', title: 'Special Private Class', kind: 'private' };
const CLASS_BLOCK: Session[] = [
  { time: '8am – 1pm', start: '08:00', end: '13:00', title: 'Self Study', kind: 'self-study' },
  { time: '2pm – 3pm', start: '14:00', end: '15:00', subjects: ['PHY', 'GOV', 'BUS'], kind: 'class' },
  { time: '3pm – 4pm', start: '15:00', end: '16:00', subjects: ['CHM', 'ECO', 'CRS'], kind: 'class' },
  { time: '4pm – 5pm', start: '16:00', end: '17:00', subjects: ['BIO', 'ACC', 'LIT', 'F/MTH'], kind: 'class' },
  PRIVATE,
];

const footnotes = [
  'Every third week: night classes are held as intensive preparation for the Monthly Mock Examination.',
  'Every fourth week: the Monthly Mock Examination takes place at the end of the week.',
];

export const firstSemester: Timetable = {
  id: 'first-semester',
  title: 'First semester',
  heading: 'BIA JUPEB First Semester Timetable (Physical Class)',
  audience: 'BIA private JUPEB students and some selected UNILAG School of Foundation students.',
  days: [
    {
      day: 'Mon',
      name: 'Monday',
      sessions: [{ time: '8:00 AM – 7:00 PM', start: '08:00', end: '19:00', title: 'Self Study & Lectures', kind: 'lectures' }],
      note: MTN,
    },
    { day: 'Tue', name: 'Tuesday', sessions: CLASS_BLOCK },
    {
      day: 'Wed',
      name: 'Wednesday',
      sessions: [{ time: '8:00 AM – 7:00 PM', start: '08:00', end: '19:00', title: 'Self Study & Lectures', kind: 'lectures' }],
      note: MTN,
    },
    { day: 'Thu', name: 'Thursday', sessions: CLASS_BLOCK },
    {
      day: 'Fri',
      name: 'Friday',
      sessions: [
        { time: '8am – 1pm', start: '08:00', end: '13:00', title: 'Self Study', kind: 'self-study' },
        { time: '2:30 PM – 7:30 PM', start: '14:30', end: '19:30', title: 'Marathon 001 for SFS Students', kind: 'marathon' },
      ],
      note: MTN,
    },
    {
      day: 'Sat',
      name: 'Saturday',
      sessions: [{ time: '10:00 AM – 4:00 PM', start: '10:00', end: '16:00', title: '001 & 002 Tests', kind: 'test' }],
    },
    {
      day: 'Sun',
      name: 'Sunday',
      sessions: [{ time: '2:00 PM – 7:00 PM', start: '14:00', end: '19:00', title: 'Marathon 002 for SFS Students', kind: 'marathon' }],
      note: { label: 'Venue', text: 'Faculty of Management Science, UNILAG' },
    },
  ],
  footnotes,
};

const ONLINE_BLOCK = (group: '001' | '002'): Session[] => [
  { time: '5pm – 6pm', start: '17:00', end: '18:00', title: `${group} Online & Free`, subjects: ['PHY', 'GOV', 'BUS'], kind: 'online' },
  { time: '6pm – 7pm', start: '18:00', end: '19:00', title: `${group} Online & Free`, subjects: ['CHM', 'ECO', 'CRS'], kind: 'online' },
  { time: '8:30pm – 9:30pm', start: '20:30', end: '21:30', title: `${group} Online & Free`, subjects: ['BIO', 'ACC', 'LIT', 'F/MTH'], kind: 'online' },
];

export const preResumption: Timetable = {
  id: 'pre-resumption',
  title: 'Before resumption',
  heading: 'BIA JUPEB Free Online Tutorial & Paid Physical Tutorial',
  audience: '2026/2027 academic session.',
  intro: 'Online free tutorial starting Monday 5 October 2026.',
  from: '2026-10-05',
  days: [
    { day: 'Mon', name: 'Monday', sessions: ONLINE_BLOCK('001') },
    { day: 'Tue', name: 'Tuesday', sessions: [{ title: 'Physical Tutorial 001', kind: 'physical', paid: true }] },
    { day: 'Wed', name: 'Wednesday', sessions: ONLINE_BLOCK('002') },
    { day: 'Thu', name: 'Thursday', sessions: [{ title: 'Physical Tutorial 002', kind: 'physical', paid: true }] },
    {
      day: 'Fri',
      name: 'Friday',
      sessions: [{ title: 'Physical Tutorial 001', kind: 'physical', paid: true, venue: '12 Ameen Street, Abule Oja, Akoka' }],
    },
    {
      day: 'Sat',
      name: 'Saturday',
      sessions: [
        { title: 'Test (for BIA students)', kind: 'test' },
        { title: 'Self Study', kind: 'self-study' },
        { title: 'SFS Practical', kind: 'class', paid: true },
      ],
    },
    {
      day: 'Sun',
      name: 'Sunday',
      sessions: [{ title: 'Physical Tutorial 002', kind: 'physical', paid: true, venue: 'Faculty of Management Science, UNILAG' }],
    },
  ],
  footnotes,
};

/**
 * "Weekend Learning and Assessment Schedule" flyer (BIA, November 2026), transcribed
 * as printed. Friday and Saturday activities rotate over a four-week cycle.
 */
export const weekend: Timetable = {
  id: 'weekend',
  title: 'Weekends',
  heading: 'BIA JUPEB Weekend Learning and Assessment Schedule',
  audience: 'Fridays and Saturdays rotate over four weeks.',
  intro: 'First Semester Mock Examination / In-Course: Sunday 13 December 2026.',
  days: [
    {
      day: 'Fri',
      name: 'Friday',
      sessions: [
        { time: '9:30am – 5:30pm', start: '09:30', end: '17:30', title: 'Week 1: Online BIA CBT Test', kind: 'test' },
        { title: 'Week 2: Weekly Test', kind: 'test' },
        { title: 'Week 3: Marathon Physical Class', kind: 'marathon' },
        { title: 'Week 4: Online/Live Class', kind: 'class' },
      ],
      note: { label: 'Venue', text: 'BIA Tutorial Venue, 12 Ameen Street, Akoka' },
    },
    {
      day: 'Sat',
      name: 'Saturday',
      sessions: [
        { time: '10:00am – 4:00pm', start: '10:00', end: '16:00', title: 'Week 1: General JUPEB Marathon', kind: 'marathon' },
        { title: 'Week 2: Special Private Class 001', kind: 'private' },
        { title: 'Week 3: Special Private Class 002', kind: 'private' },
        { title: 'Week 4: Monthly Examination 001 & 002', kind: 'test' },
      ],
      note: { label: 'Venue', text: 'BIA Tutorial Venue, 12 Ameen Street, Akoka' },
    },
    {
      day: 'Sun',
      name: 'Sunday',
      sessions: [{ title: 'First Semester Mock Examination / In-Course — 13 December 2026', kind: 'test' }],
      note: { label: 'Venue', text: 'Faculty of Management Science, UNILAG' },
    },
  ],
  footnotes: ['Friday times apply to every Friday activity; Saturday times to every Saturday activity (as printed).'],
};

/** "JUPEB Online Timetable 2026/27" flyer (BIA), transcribed as printed. Part of the paid programme. */
export const online2627: Timetable = {
  id: 'online',
  title: 'Online',
  heading: 'BIA JUPEB Online Timetable 2026/27',
  audience: 'For students who learn online.',
  days: [
    { day: 'Mon', name: 'Monday', sessions: [{ time: '2:00pm – 6:00pm', start: '14:00', end: '18:00', title: 'Physics · Government · BUS', kind: 'class' }] },
    { day: 'Tue', name: 'Tuesday', sessions: [{ title: 'Self study · Group study (flexible)', kind: 'self-study' }] },
    { day: 'Wed', name: 'Wednesday', sessions: [{ time: '2:00pm – 6:00pm', start: '14:00', end: '18:00', title: 'Chemistry · Economics · CRS', kind: 'class' }] },
    { day: 'Thu', name: 'Thursday', sessions: [{ title: 'Self study · Group study (flexible)', kind: 'self-study' }] },
    { day: 'Fri', name: 'Friday', sessions: [{ time: '8:00pm – 10:00pm', start: '20:00', end: '22:00', title: 'Biology · Maths · Accounting · Literature', kind: 'class' }] },
    { day: 'Sat', name: 'Saturday', sessions: [{ time: '6:00pm – 10:00pm', start: '18:00', end: '22:00', title: 'Weekly tests / assessment', kind: 'test' }] },
    { day: 'Sun', name: 'Sunday', sessions: [{ title: 'Personal revision · Rest (flexible)', kind: 'self-study' }] },
  ],
  footnotes: [
    'WhatsApp brainstorming & practice: scheduled sessions for solving JUPEB questions, explaining methods and correcting misconceptions.',
    'Tuesdays and Thursdays are set aside for independent revision and collaborative study.',
    'Two-week intensive period: guided question-solving and detailed explanations with subject tutors.',
    'Assignment submission & oral defence: compulsory submission of practice assignments, followed by an oral defence of methods and calculations.',
    'Examinations: a compulsory written exam and oral assessment (dates to be announced by BIA Management).',
  ],
};

export const timetables = [firstSemester, preResumption, weekend, online2627];

/** Subject codes as printed, with the names we can state with certainty. */
export const subjectKey: Record<string, string | null> = {
  PHY: 'Physics',
  GOV: 'Government',
  BUS: 'Business Studies',
  CHM: 'Chemistry',
  ECO: 'Economics',
  CRS: 'Christian Religious Studies',
  BIO: 'Biology',
  ACC: 'Accounting',
  LIT: 'Literature-in-English',
  'F/MTH': null, // confirm: not expanded until BIA confirms the subject name
};
