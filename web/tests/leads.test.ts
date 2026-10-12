import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatLeadRef, parseLeadRef, CTA_SOURCES } from '../src/lib/leads.ts';

test('formats lead references', () => {
  assert.equal(formatLeadRef(1), 'BIA-WEB-000001');
  assert.equal(formatLeadRef(123456), 'BIA-WEB-123456');
});
test('rejects invalid sequences', () => {
  for (const n of [0, -1, 1.5, 1_000_000]) assert.throws(() => formatLeadRef(n), RangeError);
});
test('parses references round-trip', () => {
  assert.equal(parseLeadRef('BIA-WEB-000042'), 42);
  assert.equal(parseLeadRef(formatLeadRef(999999)), 999999);
  assert.equal(parseLeadRef('BIA-WEB-42'), null);
  assert.equal(parseLeadRef('XYZ-WEB-000001'), null);
});
test('CTA sources are unique', () => {
  assert.equal(new Set(CTA_SOURCES).size, CTA_SOURCES.length);
});
