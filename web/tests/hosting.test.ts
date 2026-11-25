/**
 * The site runs on Vercel (vercel.json) or on cPanel/Apache hosting (public/.htaccess).
 * Both must send the same legacy URLs to the same places, and the two vercel.json copies
 * must keep the same redirects and headers (their build commands differ).
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const root = new URL('../../', import.meta.url);
const vercel = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8'));
const htaccess = readFileSync(new URL('public/.htaccess', new URL('../', import.meta.url)), 'utf8');

test('both vercel.json copies have the same redirects and headers', () => {
  const copy = JSON.parse(readFileSync(new URL('BOMA JUPEB PROJECT/vercel.json', root), 'utf8'));
  assert.deepEqual(copy.redirects, vercel.redirects);
  assert.deepEqual(copy.headers, vercel.headers);
});

test('every legacy .html redirect in vercel.json is in .htaccess with the same target', () => {
  const legacy = vercel.redirects.filter((r: { source: string }) => r.source.endsWith('.html'));
  assert.ok(legacy.length >= 20);
  const lines = htaccess.split('\n');
  for (const { source, destination } of legacy) {
    const escaped = source.replace(/[.\-]/g, (c: string) => '\\' + c);
    const i = lines.findIndex((l) => l.includes(`\\s${escaped}[\\s?]`));
    assert.ok(i >= 0, `${source} missing from .htaccess`);
    assert.equal(lines[i + 1].trim(), `RewriteRule ^ https://%{HTTP_HOST}${destination} [R=301,L,NE]`, source);
  }
});

test('.htaccess forces https, drops www and trailing slashes, and serves the 404 page', () => {
  assert.match(htaccess, /RewriteCond %\{HTTP_HOST\} \^www\\\.\(\.\+\)\$/);
  assert.match(htaccess, /RewriteCond %\{HTTPS\} !=on/);
  assert.match(htaccess, /DirectorySlash Off/);
  assert.match(htaccess, /ErrorDocument 404 \/404\.html/);
});
