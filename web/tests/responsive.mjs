/**
 * Responsive + carousel accessibility checks against a running preview.
 *   npm run build && npm run preview -- --port 4321 &
 *   CHROMIUM_PATH=/path/to/chrome npm test
 */
import { chromium } from 'playwright-core';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321/';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
let failures = 0;
const check = (ok, msg) => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${msg}`);
  if (!ok) failures++;
};

// 1. No horizontal overflow at common widths
for (const width of [320, 360, 390, 768, 1024, 1440]) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  const { sw, vw, offenders } = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const offenders = [...document.querySelectorAll('body *')]
      // decorative art inside overflow:hidden sections is clipped by design
      .filter((e) => !e.closest('[data-track], [data-clip]') && e.getBoundingClientRect().right > vw + 1)
      .slice(0, 3)
      .map((e) => `${e.tagName.toLowerCase()}.${e.getAttribute('class')} (${Math.round(e.getBoundingClientRect().right)}px)`);
    return { sw: document.documentElement.scrollWidth, vw, offenders };
  });
  check(sw <= vw && offenders.length === 0, `${width}px: no horizontal overflow ${offenders.join(' ')}`);
  // Tap targets: buttons and nav controls at least 44px
  if (width === 390) {
    const small = await page.evaluate(() =>
      [...document.querySelectorAll('button, .btn, .carousel__btn')]
        .filter((e) => e.offsetParent && e.getBoundingClientRect().height < 43.5)
        .map((e) => e.className),
    );
    check(small.length === 0, `390px: controls are at least 44px tall ${small.join(', ')}`);
  }
  await page.close();
}

// 2. Carousels: keyboard, buttons, autoplay pause
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto(BASE, { waitUntil: 'networkidle' });
await page.waitForTimeout(2600); // let the hero entrance finish
const carousels = page.locator('[data-carousel]');
const count = await carousels.count();
check(count === 3, `found ${count} carousels`);
for (let i = 0; i < count; i++) {
  const c = carousels.nth(i);
  const label = await c.getAttribute('aria-label');
  await c.scrollIntoViewIfNeeded();
  const pause = c.locator('[data-toggle]');
  if (await pause.isVisible()) await pause.click(); // stop autoplay so it cannot interfere
  const current = () => c.locator('[data-current]').textContent();
  await c.locator('[data-next]').click();
  await page.waitForTimeout(700);
  check((await current()) === '02', `${label}: next button advances`);
  await c.locator('[data-track]').focus();
  await page.keyboard.press('ArrowLeft');
  await page.waitForTimeout(700);
  check((await current()) === '01', `${label}: ArrowLeft goes back`);
  await page.keyboard.press('End');
  await page.waitForTimeout(900);
  const total = await c.locator('[data-total]').textContent();
  check((await current()) === total, `${label}: End jumps to last slide`);
}
const hero = carousels.first();
check((await hero.getAttribute('data-autoplay')) === 'true', 'hero carousel autoplays');
check((await hero.locator('[data-toggle]').getAttribute('aria-pressed')) === 'true', 'hero pause button reports paused state');
await page.close();

// 3. Reduced motion: no autoplay, pause control hidden
const rm = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await rm.goto(BASE, { waitUntil: 'networkidle' });
await rm.waitForTimeout(7500);
check((await rm.locator('[data-carousel] [data-current]').first().textContent()) === '01', 'reduced motion: hero does not auto-advance');
check(!(await rm.locator('[data-carousel] [data-toggle]').first().isVisible()), 'reduced motion: pause control hidden');
await rm.close();

// 4. Mobile menu opens and closes with Escape
const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await m.goto(BASE, { waitUntil: 'networkidle' });
await m.click('[data-menu-btn]');
check(await m.locator('#mobile-menu').isVisible(), 'mobile menu opens');
await m.waitForTimeout(500);
check(await m.locator('.sheet__list li').first().evaluate((el) => getComputedStyle(el).opacity === '1'), 'mobile menu items animate in');
await m.keyboard.press('Escape');
await m.waitForTimeout(450);
check(!(await m.locator('#mobile-menu').isVisible()), 'mobile menu closes with Escape');
await m.close();

// 5. Motion layer (GSAP + ScrollTrigger)
const opacity = (page, sel) => page.locator(sel).first().evaluate((el) => Number(getComputedStyle(el).opacity));
const scrollThrough = async (page) => {
  await page.evaluate(async () => {
    const step = Math.round(innerHeight * 0.6);
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await page.waitForTimeout(2200);
};
const hiddenContent = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll('main h1, main h2, main h3, main p, main li, main img, main dd, footer p')]
      .filter((el) => {
        let n = el;
        while (n && n !== document.body) {
          const cs = getComputedStyle(n);
          if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.99) {
            // inactive hero captions and dimmed (not-yet-reached) steps are intentional
            if (n.matches('figcaption, .is-past, .is-past *')) return false;
            return true;
          }
          n = n.parentElement;
        }
        return false;
      })
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${el.getAttribute('class') ?? ''} "${el.textContent.trim().slice(0, 30)}"`),
  );

for (const [label, opts] of [
  ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
]) {
  const page = await browser.newPage(opts);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => msg.type() === 'warning' && msg.text().includes('[motion]') && errors.push(msg.text()));
  await page.goto(BASE, { waitUntil: 'networkidle' });
  check((await page.evaluate(() => document.documentElement.dataset.motion)) === 'running', `${label}: GSAP motion layer initialised`);
  await page.waitForTimeout(2600);
  check((await opacity(page, '.hero__title')) === 1 && (await opacity(page, '.hero__media')) === 1, `${label}: hero entrance completes visible`);
  check(!(await page.evaluate(() => document.documentElement.classList.contains('js-motion'))), `${label}: pre-hide class released`);
  await scrollThrough(page);
  const stuck = await hiddenContent(page);
  check(stuck.length === 0, `${label}: all content visible after scrolling ${stuck.join(' | ')}`);
  check(await page.locator('.route__end').evaluate((el) => el.classList.contains('is-active')), `${label}: journey reaches the 200 Level destination`);
  const { sw, vw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
  check(sw <= vw, `${label}: no horizontal overflow after animations`);
  check(errors.length === 0, `${label}: no script errors ${errors.join(' | ')}`);
  await page.close();
}

// Reduced motion: no motion layer, nothing hidden, no split markup
const rmm = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
await rmm.goto(BASE, { waitUntil: 'networkidle' });
check((await rmm.evaluate(() => document.documentElement.dataset.motion)) === 'reduced', 'reduced motion: motion layer stands down');
check((await hiddenContent(rmm)).length === 0, 'reduced motion: all content visible without scrolling');
check((await rmm.locator('.hero__title [aria-hidden]').count()) === 0, 'reduced motion: headline is not split');
await rmm.close();

// JavaScript disabled: content fully visible, journey readable
const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
const nojs = await ctx.newPage();
await nojs.goto(BASE, { waitUntil: 'networkidle' });
check((await hiddenContent(nojs)).length === 0, 'no JavaScript: all content visible');
check((await nojs.locator('.route > li').count()) === 4 && (await opacity(nojs, '.route__end h3')) === 1, 'no JavaScript: journey steps readable');
await ctx.close();

// 6. Success-stories page, accessibility and privacy
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const axeSource = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const STORIES = new URL('success-stories', BASE).href;

for (const [label, opts] of [
  ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
  ['desktop', { viewport: { width: 1440, height: 900 } }],
]) {
  const page = await browser.newPage(opts);
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (msg) => msg.type() === 'warning' && msg.text().includes('[motion]') && errors.push(msg.text()));
  await page.goto(STORIES, { waitUntil: 'networkidle' });
  check((await page.evaluate(() => document.documentElement.dataset.motion)) === 'running', `stories ${label}: motion layer initialised`);
  await page.waitForTimeout(2800);
  check((await opacity(page, '.sh__title')) === 1, `stories ${label}: hero visible after entrance`);
  check((await page.locator('.plate').count()) === 3, `stories ${label}: three featured achievements`);
  await scrollThrough(page);
  const stuck = await hiddenContent(page);
  check(stuck.length === 0, `stories ${label}: all content visible after scrolling ${stuck.join(' | ')}`);
  const { sw, vw } = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth }));
  check(sw <= vw, `stories ${label}: no horizontal overflow`);

  // Filters
  const total = await page.locator('.ledger__row').count();
  await page.locator('[data-filter="law"]').click();
  await page.waitForTimeout(900);
  const visibleLaw = await page.locator('.ledger__row:visible').count();
  const lawRows = await page.locator('.ledger__row[data-category="law"]').count();
  check(visibleLaw === lawRows && lawRows > 0 && lawRows < total, `stories ${label}: Law filter shows only law results (${visibleLaw}/${total})`);
  check((await page.locator('[data-filter="law"]').getAttribute('aria-pressed')) === 'true', `stories ${label}: active filter announced via aria-pressed`);
  await page.locator('[data-filter="all"]').click();
  await page.waitForTimeout(900);
  check((await page.locator('.ledger__row:visible').count()) === total, `stories ${label}: All restores every result`);
  check(errors.length === 0, `stories ${label}: no script errors ${errors.join(' | ')}`);
  await page.close();
}

// Accessibility (axe-core): no serious or critical violations on either page
for (const [name, url] of [['home', BASE], ['stories', STORIES]]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const violations = await page.evaluate(async () => {
    const r = await window.axe.run(document, { resultTypes: ['violations'] });
    return r.violations.filter((v) => ['serious', 'critical'].includes(v.impact)).map((v) => `${v.id} (${v.nodes.length})`);
  });
  check(violations.length === 0, `${name}: no serious/critical accessibility violations ${violations.join(', ')}`);
  await page.close();
}

// No-JS and reduced motion on the stories page
{
  const ctx2 = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await ctx2.newPage();
  await p.goto(STORIES, { waitUntil: 'networkidle' });
  check((await hiddenContent(p)).length === 0, 'stories no JavaScript: all content visible');
  check(!(await p.locator('[data-filters]').isVisible()), 'stories no JavaScript: filter bar hidden, full list shown');
  await ctx2.close();
  const rm2 = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await rm2.goto(STORIES, { waitUntil: 'networkidle' });
  await rm2.locator('[data-filter="medicine"]').click();
  check(
    (await rm2.locator('.ledger__row:visible').count()) === (await rm2.locator('.ledger__row[data-category="medicine"]').count()),
    'stories reduced motion: filters still work',
  );
  check((await hiddenContent(rm2)).length === 0, 'stories reduced motion: content visible');
  await rm2.close();
}

// Privacy: no student name from the legacy testimonials appears anywhere in V2
{
  const legacy = readFileSync(new URL('../../BOMA JUPEB PROJECT/index.html', import.meta.url), 'utf8')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
  const names = [...legacy.matchAll(/Congratulations to you!\s*(.+?)\s*BIA JUPEB Alumn/g)]
    .map((m) => m[1].trim())
    .filter((n) => n.length > 3);
  const page = await browser.newPage();
  let leaked = [];
  for (const url of [BASE, STORIES]) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const html = (await page.content()).toLowerCase();
    leaked.push(...names.filter((n) => html.includes(n.toLowerCase())));
  }
  check(names.length > 10 && leaked.length === 0, `privacy: none of ${names.length} legacy student names published ${leaked.join(', ')}`);
  await page.close();
}

// 7. Launch readiness: indexing, guides, redirects, build contents, contacts
{
  const { existsSync, readdirSync, statSync } = await import('node:fs');
  const { join } = await import('node:path');
  const dist = new URL('../dist/', import.meta.url).pathname;
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const guideSlugs = ['jupeb-guide', 'jupeb-unilag-admission', 'jupeb-vs-ijmb', 'awaiting-result-jupeb-2026', 'jupeb-past-questions'];
  for (const path of ['', 'success-stories', 'fees', 'timetable', 'guides', ...guideSlugs.map((g) => `guides/${g}`)]) {
    const res = await page.goto(new URL(path, BASE).href, { waitUntil: 'networkidle' });
    const robots = await page.locator('meta[name="robots"]').count();
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    const h1 = await page.locator('h1').count();
    check(res.status() === 200 && robots === 0 && canonical?.startsWith('https://biajupeb.com.ng/') && h1 === 1, `/${path}: 200, indexable, canonical, one h1`);
    check((await page.locator('.preview-banner').count()) === 0 && !(await page.content()).includes('Design preview'), `/${path}: no preview markers`);
  }
  // Accessibility on a guide page
  await page.goto(new URL('guides/jupeb-guide', BASE).href, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: axeSource });
  const v = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.filter((x) => ['serious', 'critical'].includes(x.impact)).map((x) => x.id));
  check(v.length === 0, `guide: no serious/critical accessibility violations ${v.join(', ')}`);
  // 404 page exists and is noindex
  const html404 = readFileSync(join(dist, '404.html'), 'utf8');
  check(html404.includes('noindex'), '404 page exists and is noindex');
  // robots + sitemap
  const robotsTxt = readFileSync(join(dist, 'robots.txt'), 'utf8');
  check(/Allow: \//.test(robotsTxt) && !/Disallow: \/\s*$/m.test(robotsTxt) && robotsTxt.includes('sitemap.xml'), 'robots.txt allows indexing and lists the sitemap');
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  const locs = [...sitemap.matchAll(/<loc>https:\/\/biajupeb\.com\.ng(\/[^<]*)<\/loc>/g)].map((m) => m[1]);
  check(locs.length >= 8 && locs.every((l) => existsSync(join(dist, l === '/' ? 'index.html' : `${l}/index.html`))), `sitemap lists ${locs.length} URLs that all exist`);
  // Redirect destinations (and #anchors) exist in the build; both vercel.json files agree
  const cfgA = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'));
  const cfgB = JSON.parse(readFileSync(new URL('../../BOMA JUPEB PROJECT/vercel.json', import.meta.url), 'utf8'));
  check(JSON.stringify(cfgA.redirects) === JSON.stringify(cfgB.redirects), 'both vercel.json files define identical redirects');
  check(!JSON.stringify(cfgA).includes('noindex') && !JSON.stringify(cfgB).includes('noindex'), 'vercel.json files carry no noindex headers');
  const bad = cfgA.redirects.filter(({ destination }) => {
    const [path, hash] = destination.split('#');
    const file = join(dist, path === '/' ? 'index.html' : `${path}/index.html`);
    if (!existsSync(file)) return true;
    return hash ? !readFileSync(file, 'utf8').includes(`id="${hash}"`) : false;
  });
  check(cfgA.redirects.length === 20 && bad.length === 0, `all ${cfgA.redirects.length} legacy redirects resolve ${bad.map((b) => b.source).join(', ')}`);
  // No legacy V1 / sensitive files in the build output
  const files = [];
  const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : files.push(join(d, f).slice(dist.length))));
  walk(dist);
  const sensitive = files.filter((f) => /admin|firebase|profile|private|signin|signup|keep|text\.html|assets\/images\/(testii|scroll)|\.env/i.test(f));
  check(sensitive.length === 0, `build output contains no legacy or sensitive files ${sensitive.slice(0, 5).join(', ')}`);
  const builtText = files.filter((f) => /\.(html|js|css|json|xml|txt)$/.test(f)).map((f) => readFileSync(join(dist, f), 'utf8')).join('\n');
  check(!/AIzaSy|firebaseapp|apiKey/.test(builtText), 'build output contains no Firebase keys or config');
  // Contacts on V2 all appear on the published V1 homepage
  const v1 = readFileSync(new URL('../../BOMA JUPEB PROJECT/index.html', import.meta.url), 'utf8').replace(/[^\d]/g, '');
  const phones = [...new Set([...builtText.matchAll(/tel:\+234(\d{10})/g)].map((m) => m[1]))];
  const missing = phones.filter((p) => !v1.includes('0' + p) && !v1.includes('234' + p));
  check(phones.length >= 4 && missing.length === 0, `all ${phones.length} V2 phone numbers are published on V1 ${missing.join(', ')}`);
  await page.close();
}

// 8. Phase 4: achievements privacy, image performance, hero layout, action bar
{
  const { readdirSync, statSync } = await import('node:fs');
  const { join } = await import('node:path');
  const dist = new URL('../dist/', import.meta.url).pathname;
  const recordsFile = JSON.parse(readFileSync(new URL('../content/achievements/records.json', import.meta.url), 'utf8'));
  const recs = recordsFile.records;
  const pendingNames = recs
    .filter((r) => r.consent.status !== 'granted')
    .flatMap((r) => [r.name, ...(r.names ?? [])])
    .filter(Boolean)
    .flatMap((n) => [n, ...n.split(/\s+/).filter((w) => w.length > 5 && /^[A-Z]/.test(w) && !/^(Medicine|Surgery|Science|Business|University)$/i.test(w))]);
  const all = [];
  const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : all.push(join(d, f))));
  walk(dist);
  const text = all.filter((f) => /\.(html|js|css|json|xml|txt)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n').toLowerCase();
  const leaked = [...new Set(pendingNames.filter((n) => text.includes(n.toLowerCase())))];
  check(recs.length === 43 && leaked.length === 0, `privacy: no unconsented student name (${pendingNames.length} name tokens) appears anywhere in the build ${leaked.slice(0, 5).join(', ')}`);
  check(!all.some((f) => /testii|originals|achievements/i.test(f)), 'privacy: no archived achievement image is emitted into the build');
  const publishedDir = new URL('../src/assets/achievements/published/', import.meta.url).pathname;
  const publishedFiles = readdirSync(publishedDir).filter((f) => !f.startsWith('.'));
  const granted = recs.filter((r) => r.consent.status === 'granted' && r.publishedImage).map((r) => r.publishedImage);
  check(publishedFiles.length === granted.length && publishedFiles.every((f) => granted.includes(f)), `consent: published images (${publishedFiles.length}) match consent-granted records (${granted.length})`);
  check(recs.every((r) => !('points' in r) && !('recordedPoints' in r)), 'records carry no unverified V1 point totals');

  // Image performance on first load (mobile)
  for (const path of ['', 'success-stories']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    let imgBytes = 0;
    let largest = 0;
    page.on('response', async (r) => {
      if (r.request().resourceType() === 'image') {
        const len = Number(r.headers()['content-length'] ?? (await r.body().catch(() => Buffer.alloc(0))).length);
        imgBytes += len;
        largest = Math.max(largest, len);
      }
    });
    await page.goto(new URL(path, BASE).href, { waitUntil: 'networkidle' });
    const imgs = await page.evaluate(() =>
      [...document.images].map((i) => ({
        dims: i.hasAttribute('width') && i.hasAttribute('height'),
        lazy: i.loading === 'lazy',
        top: i.getBoundingClientRect().top,
        prio: i.getAttribute('fetchpriority'),
        modern: (i.closest('picture')?.querySelector('source[type="image/avif"]')) !== null,
      })),
    );
    check(imgs.every((i) => i.dims), `/${path}: every image has width/height (no layout shift)`);
    check(imgs.filter((i) => i.top > 1200).every((i) => i.lazy), `/${path}: images below the first screen load lazily`);
    check(imgs.some((i) => i.prio === 'high' && !i.lazy), `/${path}: hero image is eager with high fetch priority`);
    check(imgs.every((i) => i.modern), `/${path}: every photograph offers AVIF/WebP`);
    check(imgBytes < 1_400_000 && largest < 450_000, `/${path}: first-load images ${(imgBytes / 1024).toFixed(0)} KB, largest ${(largest / 1024).toFixed(0)} KB at 2x`);
    await page.close();
  }

  // Hero layout on iPhone-sized screen: photo and headline both in the first screen
  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await m.goto(BASE, { waitUntil: 'networkidle' });
  await m.waitForTimeout(2800);
  const hero = await m.evaluate(() => {
    const img = document.querySelector('.hero__media .carousel__track').getBoundingClientRect();
    const h1 = document.querySelector('.hero__title').getBoundingClientRect();
    const copy = document.querySelector('.hero__copy').getBoundingClientRect();
    return { imgTop: img.top, imgH: img.height, imgW: img.width, copyTop: copy.top, h1Bottom: h1.bottom, vw: innerWidth };
  });
  check(hero.imgTop < 160 && hero.imgH > 220 && Math.round(hero.imgW) === hero.vw, `mobile hero: full-bleed photograph at the top (${Math.round(hero.imgH)}px tall)`);
  check(hero.copyTop < hero.imgTop + hero.imgH && hero.h1Bottom < 844, 'mobile hero: copy sheet overlaps the photo edge; headline in the first screen');
  // Action bar: hidden while hero CTAs are visible, shown mid-page, hidden at the enquiry section
  const barHidden = () => m.locator('[data-actionbar]').evaluate((el) => el.hasAttribute('data-hidden'));
  await m.evaluate(() => document.querySelector('.hero__ctas').scrollIntoView({ block: 'center', behavior: 'instant' }));
  await m.waitForTimeout(600);
  check(await barHidden(), 'action bar hides while the hero admissions buttons are on screen');
  await m.evaluate(() => document.getElementById('programme').scrollIntoView({ behavior: 'instant' }));
  await m.waitForTimeout(600);
  check(!(await barHidden()), 'action bar appears once the hero buttons scroll away');
  await m.evaluate(() => document.getElementById('apply').scrollIntoView({ behavior: 'instant' }));
  await m.waitForTimeout(600);
  check(await barHidden(), 'action bar hides again at the enquiry section');
  await m.close();

  // Desktop hero: photo bleeds to the right edge with the inset photograph
  const d = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await d.goto(BASE, { waitUntil: 'networkidle' });
  await d.waitForTimeout(2800);
  const dh = await d.evaluate(() => {
    const t = document.querySelector('.hero__media .carousel__track').getBoundingClientRect();
    const inset = document.querySelector('.hero__inset');
    return { right: t.right, vw: document.documentElement.clientWidth, inset: inset && getComputedStyle(inset).display !== 'none' && Number(getComputedStyle(inset).opacity) === 1 };
  });
  check(Math.abs(dh.right - dh.vw) <= 1 && dh.inset, 'desktop hero: photograph bleeds to the right edge with the inset photo');
  await d.close();
}

// 9. Official 2026/27 fees, tutorials and timetable
{
  const { readdirSync, statSync } = await import('node:fs');
  const { join } = await import('node:path');
  const dist = new URL('../dist/', import.meta.url).pathname;
  const FEES = new URL('fees', BASE).href;
  const TT = new URL('timetable', BASE).href;
  const files = [];
  const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : files.push(join(d, f))));
  walk(dist);
  const text = files.filter((f) => /\.(html|js|css|json|xml|txt)$/.test(f)).map((f) => readFileSync(f, 'utf8')).join('\n');

  // Outdated figures are gone; bank details never published
  check(!/₦40,000|₦437,000|₦421,000|₦250,000|₦687,000/.test(text), 'no outdated fees (₦40,000 registration, old school/tutorial split) remain');
  check(!/1027749868|1022749868|\bUBA\b/.test(text), 'no bank account details are published');
  check(!/pay online|pay now|checkout|card payment/i.test(text) && !/<form[^>]+action=/i.test(text), 'no online payment claims or payment forms');

  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  for (const url of [BASE, FEES]) {
    await page.goto(url, { waitUntil: 'networkidle' });
    const where = url === BASE ? 'home' : '/fees';
    const reg = await page.locator('[data-registration]').first().textContent();
    check(reg === '₦45,000', `${where}: registration fee shows ₦45,000`);
    const sci = await page.locator('[data-stream="science"]').first().innerText();
    const non = await page.locator('[data-stream="non-science"]').first().innerText();
    check(
      sci.includes('₦235,000') && sci.includes('₦686,700') && !sci.includes('₦219,000') && !sci.includes('₦671,000') &&
        non.includes('₦219,000') && non.includes('₦671,000') && !non.includes('₦235,000') && !non.includes('₦686,700'),
      `${where}: Science and Non-Science fees are separate and correct`,
    );
    const tut = page.locator('[data-fees="tutorials"]').first();
    check(
      (await tut.locator('[data-tutorial-one-time]').textContent()) === '₦150,000' &&
        (await tut.locator('[data-tutorial-monthly]').textContent()).startsWith('₦25,000') &&
        (await tut.locator('[data-tutorial-form]').textContent()).includes('₦5,000'),
      `${where}: tutorial package shows ₦150,000, ₦25,000/month and the ₦5,000 form`,
    );
    const tutText = await tut.innerText();
    check(
      (await page.locator('[data-fees="programme"] [data-fees="tutorials"], [data-fees="tutorials"] [data-fees="programme"]').count()) === 0 &&
        !/₦686,700|₦671,000|₦45,000/.test(tutText),
      `${where}: tutorials (B) are presented separately from the admission programme (A)`,
    );
    const plan = await page.locator('[data-fees="instalments"]').innerText();
    check(plan.includes('₦200,000') && plan.includes('₦287,000') && plan.includes('4 May 2027'), `${where}: three-instalment plan with the 4 May 2027 deadline`);
  }
  // Fees reachable from the header on every page
  check((await page.locator('header a[href="/fees"], #mobile-menu a[href="/fees"]').count()) >= 1 && (await page.locator('a[href="/timetable"]').count()) >= 1, 'fees and timetable are linked from the navigation');
  await page.close();

  // Timetable: rendered rows match the official image
  const expected = {
    Mon: ['8:00 AM – 7:00 PM|Self Study & Lectures'],
    Tue: ['8am – 1pm|Self Study', '2pm – 3pm|PHY GOV BUS', '3pm – 4pm|CHM ECO CRS', '4pm – 5pm|BIO ACC LIT F/MTH', '5pm – 7pm|Special Private Class'],
    Wed: ['8:00 AM – 7:00 PM|Self Study & Lectures'],
    Thu: ['8am – 1pm|Self Study', '2pm – 3pm|PHY GOV BUS', '3pm – 4pm|CHM ECO CRS', '4pm – 5pm|BIO ACC LIT F/MTH', '5pm – 7pm|Special Private Class'],
    Fri: ['8am – 1pm|Self Study', '2:30 PM – 7:30 PM|Marathon 001 for SFS Students'],
    Sat: ['10:00 AM – 4:00 PM|001 & 002 Tests'],
    Sun: ['2:00 PM – 7:00 PM|Marathon 002 for SFS Students'],
  };
  for (const [label, opts] of [
    ['mobile', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }],
    ['320px', { viewport: { width: 320, height: 640 }, isMobile: true, hasTouch: true }],
    ['desktop', { viewport: { width: 1440, height: 900 } }],
  ]) {
    const p = await browser.newPage(opts);
    const errors = [];
    p.on('pageerror', (e) => errors.push(e.message));
    await p.goto(TT, { waitUntil: 'networkidle' });
    const rendered = await p.evaluate(() =>
      Object.fromEntries(
        [...document.querySelectorAll('[data-timetable="first-semester"] .tt__day')].map((d) => [
          d.dataset.day,
          [...d.querySelectorAll('.tt__s')].map((s) => {
            const time = s.querySelector('.tt__time')?.textContent.trim();
            const what = s.querySelector('.tt__title')?.textContent.trim() ?? [...s.querySelectorAll('.tt__subjects abbr, .tt__subjects .tt__code')].map((a) => a.textContent).join(' ');
            return `${time}|${what}`;
          }),
        ]),
      ),
    );
    check(JSON.stringify(rendered) === JSON.stringify(expected), `timetable ${label}: first semester matches the official timetable`);
    const read = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const cards = [...document.querySelectorAll('.tt__s')].filter((e) => e.offsetParent);
      const tiny = [...document.querySelectorAll('.tt__s *')].filter((e) => e.offsetParent && e.childNodes.length && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12);
      return {
        overflow: document.documentElement.scrollWidth > vw,
        narrow: cards.filter((c) => c.getBoundingClientRect().width < 120).length,
        tiny: tiny.length,
        img: document.querySelectorAll('.tt img').length,
      };
    });
    check(!read.overflow && read.narrow === 0 && read.tiny === 0 && read.img === 0, `timetable ${label}: readable without zooming (text ≥ 12px, cards ≥ 120px, no image-only timetable)`);
    check(errors.length === 0, `timetable ${label}: no script errors ${errors.join(' | ')}`);
    if (label === 'mobile') {
      const chips = await p.evaluate(() => [...document.querySelectorAll('.tt__jump a')].filter((a) => a.offsetParent).map((a) => a.getBoundingClientRect().height));
      check(chips.length >= 7 && chips.every((h) => h >= 44), 'timetable mobile: day shortcuts are at least 44px tall');
      // Tabs: keyboard switches between timetables
      const tab1 = p.locator('[role="tab"]').first();
      await tab1.focus();
      await p.keyboard.press('ArrowRight');
      check(
        (await p.locator('#panel-pre-resumption').isVisible()) && !(await p.locator('#panel-first-semester').isVisible()) &&
          (await p.locator('[role="tab"]').nth(1).getAttribute('aria-selected')) === 'true',
        'timetable tabs: ArrowRight shows the pre-resumption timetable',
      );
      const original = await p.locator('#panel-pre-resumption .tt__original a').getAttribute('href');
      const res = await p.request.get(new URL(original, TT).href);
      check(res.ok() && (res.headers()['content-type'] ?? '').startsWith('image/'), 'timetable: official image is available as an optional full view');
    }
    await p.close();
  }
  // No JavaScript: both timetables shown in full
  {
    const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const p = await ctx.newPage();
    await p.goto(TT, { waitUntil: 'networkidle' });
    check((await p.locator('#panel-first-semester').isVisible()) && (await p.locator('#panel-pre-resumption').isVisible()), 'timetable no JavaScript: both timetables visible');
    await ctx.close();
  }
  // Accessibility
  for (const url of [FEES, TT]) {
    const p = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await p.goto(url, { waitUntil: 'networkidle' });
    await p.addScriptTag({ content: axeSource });
    const v = await p.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.filter((x) => ['serious', 'critical'].includes(x.impact)).map((x) => `${x.id} (${x.nodes.length})`));
    check(v.length === 0, `${new URL(url).pathname}: no serious/critical accessibility violations ${v.join(', ')}`);
    await p.close();
  }
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
