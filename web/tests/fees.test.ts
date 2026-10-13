/**
 * Official 2026/27 content — the data files must match BIA JUPEB's documents.
 * Expected values are transcribed independently from the payment advices,
 * the tutorial package image and the timetable images (October 2026).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  instalments,
  programmes,
  registration,
  sum,
  tutorialPackage,
} from '../src/data/fees.ts';
import { firstSemester, preResumption } from '../src/data/timetable.ts';

test('registration fee is ₦45,000 with the four official requirements', () => {
  assert.equal(registration.amount, 45000);
  assert.equal(registration.requirements.length, 4);
  assert.match(registration.requirements.join(' '), /NIN/);
  assert.match(registration.requirements.join(' '), /Birth certificate/);
});

test('Science and Non-Science programme fees are separate and as published', () => {
  const sci = programmes.find((p) => p.id === 'science')!;
  const non = programmes.find((p) => p.id === 'non-science')!;
  assert.equal(sci.total, 686700);
  assert.equal(non.total, 671000);
  // Science items add up to the printed total (registration is separate).
  assert.equal(sum(sci.items), 686700);
  // Only the foundation tuition differs between the streams.
  const tuition = (p: typeof sci) => p.items.find((i) => i.label.startsWith('Foundation tuition'))!.amount;
  assert.equal(tuition(sci), 235000);
  assert.equal(tuition(non), 219000);
  const rest = (p: typeof sci) => p.items.filter((i) => !i.label.startsWith('Foundation tuition'));
  assert.deepEqual(rest(sci), rest(non));
  assert.deepEqual(
    rest(sci).map((i) => i.amount),
    [2500, 95000, 4200, 150000, 200000],
  );
  // The known discrepancy stays flagged until BIA confirms it.
  assert.equal(sum(non.items), 670700);
  assert.ok(non.confirm);
});

test('instalment plan is ₦200,000 + ₦200,000 + ₦287,000, final due 4 May 2027', () => {
  assert.deepEqual(
    instalments.map((i) => i.amount),
    [200000, 200000, 287000],
  );
  assert.match(instalments[2].when, /4 May 2027/);
});

test('physical tutorial package: ₦150,000 once or ₦25,000 monthly, ₦5,000 form', () => {
  assert.equal(tutorialPackage.oneTime.amount, 150000);
  assert.equal(tutorialPackage.monthly.amount, 25000);
  assert.equal(tutorialPackage.registrationForm.amount, 5000);
  assert.equal(sum(tutorialPackage.includes), 150000);
  assert.deepEqual(
    tutorialPackage.semesterInstalments.map((s) => s.amount),
    [100000, 100000],
  );
});

test('no bank account details anywhere in the data', async () => {
  const { readFileSync } = await import('node:fs');
  for (const f of ['../src/data/fees.ts', '../src/data/timetable.ts', '../src/data/site.ts']) {
    const src = readFileSync(new URL(f, import.meta.url), 'utf8');
    assert.doesNotMatch(src, /10[27]{2}749868|\bUBA\b|account number/i, f);
  }
});

// Independent transcription of the first-semester timetable image.
const FIRST_SEMESTER = {
  Mon: ['8:00 AM – 7:00 PM Self Study & Lectures'],
  Tue: ['8am – 1pm Self Study', '2pm – 3pm PHY GOV BUS', '3pm – 4pm CHM ECO CRS', '4pm – 5pm BIO ACC LIT F/MTH', '5pm – 7pm Special Private Class'],
  Wed: ['8:00 AM – 7:00 PM Self Study & Lectures'],
  Thu: ['8am – 1pm Self Study', '2pm – 3pm PHY GOV BUS', '3pm – 4pm CHM ECO CRS', '4pm – 5pm BIO ACC LIT F/MTH', '5pm – 7pm Special Private Class'],
  Fri: ['8am – 1pm Self Study', '2:30 PM – 7:30 PM Marathon 001 for SFS Students'],
  Sat: ['10:00 AM – 4:00 PM 001 & 002 Tests'],
  Sun: ['2:00 PM – 7:00 PM Marathon 002 for SFS Students'],
};

export const flatten = (tt: typeof firstSemester) =>
  Object.fromEntries(
    tt.days.map((d) => [
      d.day,
      d.sessions.map((s) => [s.time, s.title, ...(s.subjects ?? [])].filter(Boolean).join(' ')),
    ]),
  );

test('first-semester timetable matches the official image exactly', () => {
  assert.deepEqual(flatten(firstSemester), FIRST_SEMESTER);
  const notes = Object.fromEntries(firstSemester.days.filter((d) => d.note).map((d) => [d.day, d.note!.text]));
  assert.deepEqual(notes, {
    Mon: 'Inside MTN Library, UNILAG',
    Wed: 'Inside MTN Library, UNILAG',
    Fri: 'Inside MTN Library, UNILAG',
    Sun: 'Faculty of Management Science, UNILAG',
  });
});

test('pre-resumption timetable matches the official image', () => {
  assert.equal(preResumption.from, '2026-10-05');
  assert.deepEqual(flatten(preResumption), {
    Mon: ['5pm – 6pm 001 Online & Free PHY GOV BUS', '6pm – 7pm 001 Online & Free CHM ECO CRS', '8:30pm – 9:30pm 001 Online & Free BIO ACC LIT F/MTH'],
    Tue: ['Physical Tutorial 001'],
    Wed: ['5pm – 6pm 002 Online & Free PHY GOV BUS', '6pm – 7pm 002 Online & Free CHM ECO CRS', '8:30pm – 9:30pm 002 Online & Free BIO ACC LIT F/MTH'],
    Thu: ['Physical Tutorial 002'],
    Fri: ['Physical Tutorial 001'],
    Sat: ['Test (for BIA students)', 'Self Study', 'SFS Practical'],
    Sun: ['Physical Tutorial 002'],
  });
  const paid = preResumption.days.flatMap((d) => d.sessions.filter((s) => s.paid).map((s) => `${d.day} ${s.title}`));
  assert.deepEqual(paid, ['Tue Physical Tutorial 001', 'Thu Physical Tutorial 002', 'Fri Physical Tutorial 001', 'Sat SFS Practical', 'Sun Physical Tutorial 002']);
});
