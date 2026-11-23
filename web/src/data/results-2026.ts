/**
 * BIA JUPEB results announcement — 2025/2026 session.
 *
 * Sources (BIA's own, November 2026):
 *  - TikTok post on @bomaacademylimited (link below) and its caption: the 60
 *    students with points and admitted course.
 *  - "Go Beyond Expectations" results flyer: the cut-off wording and courses
 *    (used for Sodolamu Comfort's course, which the caption omits).
 *  - "JUPEB Top 50 Scholars 2026" poster: grade letters; session.
 * Session 2025/2026 confirmed by the site owner on BIA's behalf (23 Nov 2026).
 *
 * Spellings: where a student is already on the site, the site's verified spelling
 * is used (Kuteyi, Ikejiaku, Rhodiat). Sodolamu Comfort is 15 points: the caption
 * says 16, but BIA's Hall of Excellence post, the flyer and the poster all say
 * 15 / AAB. Published results elsewhere on the site are unchanged.
 */
export const results2026 = {
  session: '2025/2026',
  metCutoff: 154,
  total: 157,
  /** BIA's own wording (flyer). */
  claim: 'met the cut-off for 200 Level admission consideration, subject to university requirements',
  post: 'https://www.tiktok.com/@bomaacademylimited/photo/7710724799684709652',
};

export const cutoffPercent = Math.round((results2026.metCutoff / results2026.total) * 100);

type Row = [name: string, course: string];

/** The 60 students BIA listed, grouped by points (out of 16), in BIA's order. */
export const resultGroups: { points: number; students: Row[] }[] = [
  {
    points: 16,
    students: [
      ['Onasanya Darasimi', 'Medicine and Surgery (MBBS)'],
      ['Amodu Rofiat', 'Law'],
      ['Nwokwe Onyedikachi Dominique', 'Creative Arts'],
      ['Nwolisa Peter', 'Law'],
      ['O. S. Yusuf Jomiloju', 'Medicine and Surgery (MBBS)'],
      ['Masha David', 'Bachelor of Dental Surgery'],
      ['Ayeni Tenioluwa', 'Medicine and Surgery (MBBS)'],
      ['Nkuma Daniel', 'Medicine and Surgery (MBBS)'],
      ['James Princegolden', 'Law'],
      ['Eka Emmanuel', 'Medicine and Surgery (MBBS)'],
    ],
  },
  {
    points: 15,
    students: [
      ['Vincent Aimuamwenosa', 'Nursing'],
      ['Chibuike Godslove', 'Medical Laboratory Science'],
      ['Akpovifene Larson', 'Dentistry'],
      ['Aborode Feyisara', 'Law'],
      ['Otugalu Oluwaseun', 'Law'],
      ['Adielechi Victor', 'Business Administration'],
      ['Sodolamu Comfort', 'Dentistry'],
      ['Omotubi Moyinoluwa', 'Dentistry'],
      ['Ipaye Rhodiat', 'Nursing'],
    ],
  },
  {
    points: 14,
    students: [
      ['Duruji Sharon', 'Physiotherapy'],
      ['Nwodomba Jephthah', 'Political Science'],
      ['Ighofimoni Gabriel', 'Creative Arts'],
      ['Okosa Omotivie', 'Political Science'],
      ['Obiajulu Peace', 'Psychology'],
      ['Udeh Chinonso', 'Doctor of Pharmacy'],
      ['Daniel John', 'Political Science'],
      ['Imana Nurudeen', 'Doctor of Pharmacy'],
    ],
  },
  {
    points: 13,
    students: [
      ['Ikejiaku Donald', 'Theatre Arts'],
      ['Igbokwe Divine', 'Employment Relations and Human Resources Management'],
      ['Kuteyi Michael', 'Medical Laboratory Science'],
      ['Paul Rebecca', 'Taxation'],
      ['Achief Halimat', 'Political Science'],
      ['Ruth Wemimo', 'Medical Laboratory Science'],
    ],
  },
  {
    points: 12,
    students: [
      ['Muokeme Kosiso', 'Pharmacology'],
      ['Chuma Chinecherem', 'Anatomy'],
      ['Akinsade Destiny', 'Architecture'],
      ['Daniel Dawodu', 'Data Science'],
      ['Arubi Divine', 'Economics'],
      ['Yusuf Khalid', 'Political Science'],
      ['Ekennia Chijindum', 'Biochemistry'],
      ['Onipede Isaac', 'Anatomy'],
      ['Chinonso Osigwe', 'Pharmacology'],
      ['Duruju Benita', 'Physiology'],
    ],
  },
  {
    points: 11,
    students: [
      ['Ojediran Amotul', 'Medicine and Surgery (MBBS)'],
      ['Chiamaka Aimee', 'Creative Arts'],
      ['Adeshina Farouk', 'Biochemistry'],
      ['Abba Dominion', 'Philosophy'],
      ['Adielechi Vania', 'Physiology'],
      ['Adeyemo Victoria', 'Economics'],
      ['Ayansola Boluwatife', 'Biochemistry'],
    ],
  },
  {
    points: 10,
    students: [
      ['Edun Samuel', 'Materials and Metallurgical Engineering'],
      ['Wodi Chiburuibu', 'Philosophy'],
      ['Obinna Joy Omalicha', 'Health Education'],
      ['Enogieru Eseosa', 'Biochemistry'],
      ['Adetunji Khalid', 'Philosophy'],
      ['Olayode Racheal', 'Biochemistry'],
      ['Olaoye Inioluwa', 'Biochemistry'],
      ['Ibine Abiodun', 'Biochemistry'],
      ['Ojo Aishat', 'Microbiology'],
      ['Robinson Esther', 'Theatre Arts'],
    ],
  },
];

export const listedCount = resultGroups.reduce((n, g) => n + g.students.length, 0);
