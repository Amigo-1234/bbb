/**
 * Who BIA is, its founder, and how to find the centre.
 *
 * Sources (nothing here is invented):
 *  - V1 site about.html / index.html (BIA's own published text)
 *  - BIA's 2026/27 payment advices and flyers (descriptor, programme options)
 *  - Boma's confirmation of the centre address and contacts (October 2026)
 *  - BIA's directions video (@bomaacademylimited), captions transcribed below
 */

/** "What We Offer", V1 about page — "Bariga centre" replaced by the confirmed Akoka centre. */
export const offers = [
  'Complete JUPEB preparation for Science and Non-Science',
  'Online classes with recorded and live lessons (Lecture Banks)',
  'Physical classes and tutorials in Lagos',
  'Continuous assessments and exam practice — weekly tests and monthly mock examinations',
  'Admission guidance into universities',
];

/** Who the programme is for — each line backed by an official document. */
export const audiences = [
  {
    title: "O'Level holders aiming for 200 Level",
    text: "Register with your O'Level result — awaiting results are accepted — and prepare for JUPEB and Direct Entry.",
  },
  {
    title: 'Students who learn online',
    text: 'If you cannot attend physical classes, the Lecture Banks carry the teaching, materials and guidance you need.',
  },
  {
    title: 'Students from other institutions',
    text: "Join BIA's physical tutorials only, with the Physical Tutorial Services Package.",
  },
];

/** V1 "Our Mission" (BIA's own words). The V1 "vision" is not used: it promises "guaranteed" success. */
export const mission =
  'To help every student gain admission into their dream university through structured learning, discipline, and modern teaching methods.';

export const founder = {
  // "Hon. Boma" is used on /contact, as in Boma's own staff list (Oct 2026). "Dr." from V1 stays omitted.
  name: 'Boma',
  fullName: 'Busari Muideen Oyebamiji',
  /** As published on V1 and consistent with BIA's documents. */
  role: "Founder of Boma Academy Limited (BAL), Boma's Intellectual Academy (BIA) and BIA JUPEB",
};

/** Captions burned into BIA's directions video, transcribed (seconds). */
export const directionsCaptions: [number, number, string][] = [
  [0, 5.4, 'If you are coming from the University of Lagos or Yaba to BOMA Academy Limited,'],
  [5.4, 6.2, 'Here is a direction guide.'],
  [6.2, 9.8, 'If you are coming from the University of Lagos, walk straight down till you get to BOKU'],
  [9.8, 14, 'junction and turn into the streets by your right…'],
  [14, 20, "But if you're coming from Yaba, alight at Boku Bustop, and cross onto the other side of the road."],
  [20, 24, 'Turn into the streets and walk straight down.'],
  [24, 35, 'You are going to see some major buildings like the new restaurant food, affordafood, something like that.'],
  [35, 44, 'You are also going to see Minimart, Aisha and Aisha Arena, right now, beside Minimart.'],
  [44, 51, 'Keep to the straight road, no left or right turning until you get to a junction.'],
  [51, 54, 'Continue walking in a forward direction'],
  [54, 57, 'no left and right turning by T junction.'],
  [57, 60, 'Just a progression of that road downward'],
  [60, 66, 'Alright, keep walking downward.'],
  [66, 69, "Compare what you see here to what's on your screen."],
  [69, 72, 'As you get to the end of the road,'],
  [72, 75, 'chalah, you finally get to where you are going.'],
  [75, 78, "You'd see this school."],
  [78, 81, "It's called Seventh Day Adventist Primary and Secondary School."],
  [81, 82.9, 'Welcome.'],
];

/** On-screen route caption shown throughout the video. */
export const routeCaption =
  'UNILAG/Yaba → FCMB or Bokku Mart → Abdul Street → Walk straight down → BIA JUPEB Tutorial Center (12 Ameen Street Abule Oja Akoka; Seventh Day School)';

/** Written summary — only what the video shows or says. */
export const directions = {
  fromUnilag: [
    'From the University of Lagos, walk straight down to the Bokku junction (FCMB / Bokku Mart).',
    'Turn right into the streets.',
  ],
  fromYaba: ['From Yaba, alight at the Bokku bus stop.', 'Cross to the other side of the road and turn into the streets.'],
  then: [
    'Walk straight down — Abdul Street on the video’s route caption.',
    'You will pass a new restaurant, then Minimart, with Aisha & Aisha Arena beside it.',
    'Keep to the straight road. The video says to make no left or right turns, continuing forward through the junction.',
    'At the end of the road you will see the Seventh Day Adventist Primary and Secondary School: you have arrived at 12 Ameen Street.',
  ],
};
