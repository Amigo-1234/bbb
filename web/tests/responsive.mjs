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
check(count === 2, `found ${count} carousels (hero, results)`);
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
  for (const path of ['', 'success-stories', 'fees', 'timetable', 'gallery', 'guides', ...guideSlugs.map((g) => `guides/${g}`)]) {
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
  // Only the official contacts confirmed by Boma (October 2026) are published
  const official = ['7012388184', '8164329204'];
  const phones = [...new Set([...builtText.matchAll(/tel:\+234(\d{10})/g)].map((m) => m[1]))];
  check(phones.length === 2 && phones.every((p) => official.includes(p)), `only the two official phone numbers are published (${phones.join(', ')})`);
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
  check(!/₦40,000|₦437,000|₦421,000|₦250,000/.test(text), 'no outdated fees (₦40,000 registration, old school/tutorial split) remain');
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
        img: document.querySelectorAll('.tt__days img').length,
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
      const original = await p.locator('#panel-pre-resumption .tt__original [data-doc-open]').getAttribute('href');
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

// 10. Phase 5: brand identity, founder, location, directions video, official documents
{
  const { readdirSync, statSync, createReadStream } = await import('node:fs');
  const { join } = await import('node:path');
  const { createHash } = await import('node:crypto');
  const dist = new URL('../dist/', import.meta.url).pathname;
  const files = [];
  const walk = (d) => readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : files.push(join(d, f))));
  walk(dist);
  const textFiles = files.filter((f) => /\.(html|js|css|json|xml|txt|vtt)$/.test(f));
  const builtText = textFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

  // Location consistency
  check(!/Bariga|Igi Olugbin|Lady Lag|AP petrol/i.test(builtText), 'no outdated Bariga address remains anywhere in the build');
  const pages = ['', 'fees', 'timetable', 'success-stories', 'guides', 'guides/jupeb-guide'];
  const p = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  for (const path of pages) {
    await p.goto(new URL(path, BASE).href, { waitUntil: 'domcontentloaded' });
    const ld = await p.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]')?.textContent ?? 'null'));
    const footer = await p.locator('footer address').innerText();
    check(
      ld?.address?.streetAddress === '12 Ameen Street' && /Abule-Oja, Akoka/.test(ld.address.addressLocality) &&
        JSON.stringify(ld.telephone) === JSON.stringify(['+2347012388184', '+2348164329204']) &&
        footer.includes('12 Ameen Street') && footer.includes('Abule-Oja, Akoka'),
      `/${path}: structured data and footer carry the official Akoka address and contacts`,
    );
  }
  await p.goto(BASE, { waitUntil: 'domcontentloaded' });
  const maps = await p.locator('#location a[href*="google.com/maps"]').getAttribute('href');
  check(decodeURIComponent((maps ?? '').replace(/\+/g, ' ')).includes('12 Ameen Street, Abule-Oja, Akoka'), 'map link points to 12 Ameen Street, Abule-Oja, Akoka');
  check((await p.locator('a[href="https://wa.me/2347012388184"]').count()) >= 1, 'WhatsApp link uses the official number');

  // Homepage sections an applicant needs, in one page
  const ids = await p.evaluate(() => ['about', 'success', 'programme', 'tutorials', 'study-modes', 'calendar', 'founder', 'location', 'faq', 'apply'].filter((id) => !document.getElementById(id) && !document.querySelector(`[aria-labelledby="${id}"]`)));
  check(ids.length === 0, `homepage covers about, results, fees, tutorials, ways to study, timetable, founder, location, FAQ and enquiry ${ids.join(', ')}`);
  for (const href of ['/fees', '/timetable', '/#location', '/success-stories']) {
    check((await p.locator(`header a[href="${href}"], #mobile-menu a[href="${href}"]`).count()) >= 1, `navigation links to ${href}`);
  }

  // Directions video
  const v = await p.evaluate(() => {
    const el = document.querySelector('#location video');
    return el && {
      controls: el.controls, playsinline: el.playsInline, preload: el.getAttribute('preload'), poster: el.getAttribute('poster') ?? el.dataset.poster,
      src: el.querySelector('source')?.getAttribute('src'), track: el.querySelector('track[kind="captions"]')?.getAttribute('src'),
      transcript: document.querySelectorAll('.loc__transcript li').length,
    };
  });
  check(v && v.controls && v.playsinline && v.preload === 'none' && v.poster && v.transcript >= 15, 'directions video: native controls, plays inline, lazy (preload none), poster and transcript');
  const vid = await p.request.get(new URL(v.src, BASE).href);
  const vtt = await (await p.request.get(new URL(v.track, BASE).href)).text();
  const poster = await p.request.get(new URL(v.poster, BASE).href);
  check(vid.ok() && (await vid.body()).length > 5e6 && poster.ok(), 'directions video file and poster are served');
  check(vtt.startsWith('WEBVTT') && (vtt.match(/-->/g) ?? []).length >= 15 && vtt.includes('Seventh Day Adventist'), 'directions video has a WebVTT caption track');
  check(!/Igbobi|Main Gate|turn left/i.test(await p.locator('.routes').innerText()), 'written directions only use steps stated in the video');

  // Brand: official badge in header, hero, footer; BIA red sections
  const brand = await p.evaluate(() => ({
    headerLogo: !!document.querySelector('header .logo'),
    heroSeal: document.querySelector('.hero__seal [role="img"]')?.getAttribute('aria-label') ?? '',
    footerSeal: !!document.querySelector('footer .badge-seal'),
    aboutBg: getComputedStyle(document.querySelector('.about')).backgroundColor,
    noticeBg: getComputedStyle(document.querySelector('.notice')).backgroundColor,
  }));
  check(brand.headerLogo && /Boma’s Intellectual Academy/.test(brand.heroSeal) && brand.footerSeal, 'official BIA badge appears in header, hero and footer');
  check(brand.aboutBg === 'rgb(216, 0, 0)' && brand.noticeBg === 'rgb(216, 0, 0)', 'BIA red (#D80000, sampled from the official logo) used for brand sections');
  const icon = await p.request.get(new URL('favicon.svg', BASE).href);
  check(icon.ok() && (await icon.text()).includes('#d80000'), 'favicon uses the official badge');

  // Mobile hero: the seal never covers the headline
  for (const width of [320, 390]) {
    const m = await browser.newPage({ viewport: { width, height: 760 }, reducedMotion: 'reduce' });
    await m.goto(BASE, { waitUntil: 'domcontentloaded' });
    const hit = await m.evaluate(() => {
      const a = document.querySelector('.hero__seal').getBoundingClientRect();
      const blocks = [...document.querySelectorAll('.hero__copy > *')].map((e) => e.getBoundingClientRect());
      return blocks.some((b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
    });
    check(!hit, `${width}px: hero seal does not overlap the hero text`);
    await m.close();
  }

  // Photography: no photograph repeated on the homepage
  const photos = await p.evaluate(() =>
    [...document.querySelectorAll('main picture img')].map((i) => (i.getAttribute('src') ?? '').split('/').pop().split('.')[0]),
  );
  const dupes = photos.filter((x, i) => photos.indexOf(x) !== i);
  check(photos.length >= 10 && dupes.length === 0, `homepage uses ${photos.length} photographs/documents with none repeated ${dupes.join(', ')}`);
  await p.close();

  // Official documents: gallery opens accessibly; redacted derivatives only
  const f = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await f.goto(new URL('fees', BASE).href, { waitUntil: 'networkidle' });
  const thumbs = f.locator('#documents [data-doc-open]');
  check((await thumbs.count()) >= 6, `/fees: ${await thumbs.count()} official payment-advice pages in the document gallery`);
  await thumbs.first().click();
  const dlg = f.locator('#documents dialog');
  check(await dlg.isVisible(), '/fees: document opens in a dialog');
  const loaded = await f.locator('#documents dialog img').evaluate((img) => new Promise((r) => (img.complete && img.naturalWidth ? r(img.naturalWidth) : img.addEventListener('load', () => r(img.naturalWidth), { once: true }))));
  check(loaded >= 1000, `/fees: full-size document loads (${loaded}px wide)`);
  await f.keyboard.press('Escape');
  check(!(await dlg.isVisible()) && (await f.evaluate(() => document.activeElement?.hasAttribute('data-doc-open'))), '/fees: Escape closes the document and returns focus');
  await f.close();
  const md5 = (file) => new Promise((r) => { const h = createHash('md5'); createReadStream(file).on('data', (d) => h.update(d)).on('end', () => r(h.digest('hex'))); });
  const forbidden = ['f684959125b3ca1ca4458e6bf8e95fd3', '17df33fd1d5fe9b23a991c1379992057']; // unredacted package + timetable originals
  const hashes = await Promise.all(files.filter((x) => /\.(jpe?g|png|webp|avif)$/.test(x)).map(md5));
  check(!hashes.some((h) => forbidden.includes(h)), 'unredacted originals (with bank details) are not in the build');
  check(!files.some((x) => /\.(pdf|mov)$/i.test(x)), 'archived originals (PDF/MOV) are not published');
}

// 11. Phase 6: photography, ribbon, Life at BIA gallery, private media, Core Web Vitals
{
  const { readdirSync, statSync, existsSync, readFileSync: rf } = await import('node:fs');
  const { join } = await import('node:path');
  const { createHash } = await import('node:crypto');
  const { execSync } = await import('node:child_process');
  const dist = new URL('../dist/', import.meta.url).pathname;
  const priv = new URL('../private-media/', import.meta.url).pathname;
  const walk = (d, out = []) => (existsSync(d) ? readdirSync(d).forEach((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f), out) : out.push(join(d, f)))) : null, out);
  const sha = (f) => createHash('sha256').update(rf(f)).digest('hex');

  // Private review media never reaches the public build or git
  const privHashes = new Set(walk(priv).filter((f) => !/dist-review|\.ts$/.test(f)).map(sha));
  const distFiles = walk(dist);
  const leaked = distFiles.filter((f) => privHashes.has(sha(f)));
  const distText = distFiles.filter((f) => f.endsWith('.html')).map((f) => rf(f, 'utf8')).join('');
  check(leaked.length === 0 && !distText.includes('Private review'), `no private original or unpublished photo reaches the build (${privHashes.size} private files checked)`);
  const tracked = execSync('git ls-files', { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
  check(!/^private-media\//m.test(tracked) && rf(new URL('../.gitignore', import.meta.url), 'utf8').includes('private-media/'), 'private-media/ is gitignored and nothing in it is tracked');
  // Only the 15 approved Phase 6 photographs (plus 3 video posters) are published — no duplicates, screenshots or extras
  const approved = ['p031', 'p041', 'p047', 'p053', 'p054', 'p059', 'p060', 'p064', 'p080', 'p086', 'p096', 'p106', 'p112', 'p123', 'p124', 'v010-poster', 'v011-poster', 'v012-poster'];
  const p6 = readdirSync(new URL('../src/assets/photos/phase6/', import.meta.url)).map((f) => f.replace(/\.jpg$/, '')).sort();
  check(JSON.stringify(p6) === JSON.stringify(approved), `only the ${approved.length} approved Phase 6 images are in the site assets`);
  const exifFree = p6.every((f) => !rf(new URL(`../src/assets/photos/phase6/${f}.jpg`, import.meta.url)).includes(Buffer.from('Exif\0\0')));
  check(exifFree, 'published photographs carry no EXIF metadata (no GPS or device data)');

  const m = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const requested = [];
  m.on('request', (r) => requested.push(r.url()));
  await m.goto(BASE, { waitUntil: 'networkidle' });

  // Ribbon
  const rb = await m.evaluate(() => {
    const r = document.querySelector('.ribbon');
    return { items: r.querySelectorAll('ul:not([aria-hidden]) li').length, label: r.querySelector('ul').getAttribute('aria-label'), anim: getComputedStyle(r.querySelector('.ribbon__track')).animationName };
  });
  check(rb.items >= 6 && rb.label && rb.anim === 'none', `ribbon: ${rb.items} facts, labelled list, static under reduced motion`);
  const anim = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await anim.goto(BASE, { waitUntil: 'domcontentloaded' });
  check((await anim.evaluate(() => getComputedStyle(document.querySelector('.ribbon__track')).animationName)) !== 'none', 'ribbon: rolls when motion is allowed (CSS only)');
  await anim.close();

  // Gallery: lazy tiles, lightbox loads the large image only when opened
  const tiles = m.locator('[data-life-open]');
  const n = await tiles.count();
  const lazy = await m.evaluate(() => [...document.querySelectorAll('.life__grid img')].every((i) => i.loading === 'lazy' && i.width && i.height));
  const firstLarge = await tiles.first().getAttribute('href');
  check(n >= 4 && lazy && !requested.some((u) => u.endsWith(firstLarge)), `gallery: ${n} lazy tiles; full-size images not downloaded until opened`);
  await tiles.first().scrollIntoViewIfNeeded();
  await tiles.first().click();
  const dlg = m.locator('.life__dialog');
  await m.waitForTimeout(400);
  const w1 = await dlg.locator('img').evaluate((i) => new Promise((r) => (i.complete && i.naturalWidth ? r(i.naturalWidth) : i.addEventListener('load', () => r(i.naturalWidth), { once: true }))));
  check((await dlg.isVisible()) && w1 >= 800, `gallery: lightbox opens with a ${w1}px image`);
  await m.keyboard.press('ArrowRight');
  check((await dlg.locator('[data-life-count]').textContent()) === `2 / ${n}`, 'gallery: arrow keys move between photographs');
  await m.keyboard.press('Escape');
  check(!(await dlg.isVisible()) && (await m.evaluate(() => document.activeElement?.hasAttribute('data-life-open'))), 'gallery: Escape closes and returns focus');
  const vreq = requested.filter((u) => /\.(mp4|mov)(\?|$)/.test(u));
  check(vreq.length === 0, `no video is downloaded before a visitor presses play ${vreq.join(', ')}`);
  // Lesson videos: three click-to-play cards with lazy posters
  const lv = await m.evaluate(() => [...document.querySelectorAll('.lv__frame')].map((f) => ({ src: f.dataset.src, poster: f.querySelector('img')?.loading, label: f.querySelector('[data-lv-play]')?.getAttribute('aria-label') })));
  check(lv.length === 3 && lv.every((v) => v.poster === 'lazy' && /^Play video: /.test(v.label ?? '')), 'lesson videos: 3 cards, lazy posters, labelled play buttons');
  const sizes = await Promise.all(lv.map(async (v) => { const r = await m.request.get(new URL(v.src, BASE).href); return r.ok() && (r.headers()['content-type'] ?? '').startsWith('video/mp4') ? (await r.body()).length : 0; }));
  check(sizes.every((b) => b > 5e5 && b < 8e6), `lesson video files served as MP4 (${sizes.map((b) => (b / 1e6).toFixed(1) + ' MB').join(', ')})`);
  const play = m.locator('[data-lv-play]').first();
  await play.scrollIntoViewIfNeeded();
  await play.click();
  await m.waitForTimeout(600);
  const vid = await m.evaluate(() => { const v = document.querySelector('.lv video'); return v && { controls: v.controls, inline: v.playsInline, focused: document.activeElement === v, src: v.getAttribute('src') }; });
  check(vid && vid.controls && vid.inline && vid.focused && requested.some((u) => u.endsWith(vid.src)), 'lesson video: pressing play loads that video only, with native controls and focus');
  await m.close();

  // 320px: gallery, band and ribbon fit
  const s3 = await browser.newPage({ viewport: { width: 320, height: 640 }, reducedMotion: 'reduce' });
  await s3.goto(BASE, { waitUntil: 'networkidle' });
  const fit = await s3.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll('.life__item, .band, .mode__photo, .lessons')].filter((e) => e.getBoundingClientRect().right > vw + 1).length === 0 && document.documentElement.scrollWidth <= vw;
  });
  check(fit, '320px: photography sections fit without sideways scrolling');
  await s3.close();

  // Core Web Vitals (lab): throttled 4G + 4x CPU on a mid-range phone viewport
  const cwv = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const cdp = await cwv.context().newCDPSession(cwv);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cwv.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  });
  await cwv.goto(BASE, { waitUntil: 'load' });
  await cwv.waitForTimeout(3500);
  const vitals = await cwv.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3) }));
  check(vitals.lcp > 0 && vitals.lcp < 4000 && vitals.cls < 0.1, `Core Web Vitals (throttled 4G, 4x CPU): LCP ${vitals.lcp} ms, CLS ${vitals.cls}`);
  await cwv.close();
}

// 12. Phase 7: /gallery
{
  const GAL = new URL('gallery', BASE).href;
  const g = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const req = [];
  g.on('request', (r) => req.push(r.url()));
  const errs = [];
  g.on('pageerror', (e) => errs.push(e.message));
  await g.goto(GAL, { waitUntil: 'networkidle' });
  const info = await g.evaluate(() => {
    const items = [...document.querySelectorAll('.mg__item')];
    const srcs = items.map((li) => li.querySelector('img').getAttribute('src').split('/').pop().split('.')[0]);
    return {
      total: items.length,
      visible: items.filter((li) => !li.hidden).length,
      videos: items.filter((li) => li.querySelector('[data-kind="video"]')).length,
      dupes: srcs.filter((x, i) => srcs.indexOf(x) !== i),
      hiddenSrcs: items.filter((li) => li.hidden).map((li) => li.querySelector('img').getAttribute('src')),
    };
  });
  check(info.total === 28 && info.videos === 4 && info.dupes.length === 0, `gallery: ${info.total - info.videos} photos and ${info.videos} videos, none repeated`);
  check(info.visible === 12 && !info.hiddenSrcs.some((s) => req.some((u) => u.endsWith(s))), 'gallery: first batch of 12; later batches are not downloaded');
  check(!req.some((u) => /\.mp4/.test(u)), 'gallery: no video downloaded before it is played');

  const chip = (id) => g.locator(`[data-filter="${id}"]`);
  await chip('videos').click();
  const vids = await g.evaluate(() => [...document.querySelectorAll('.mg__item:not([hidden])')].map((li) => li.dataset.cat));
  check(vids.length === 4 && vids.every((c) => c === 'videos') && (await chip('videos').getAttribute('aria-pressed')) === 'true', 'gallery: Videos filter shows only the 4 videos (aria-pressed)');
  await chip('student-life').click();
  check((await g.locator('.mg__item:not([hidden])').count()) === 0 && (await g.locator('[data-mg-empty]').isVisible()), 'gallery: empty category shows a "coming soon" note');
  await chip('all').click();
  await g.locator('[data-mg-more]').click();
  check((await g.locator('.mg__item:not([hidden])').count()) === 24 && (await g.evaluate(() => document.activeElement?.closest('.mg__item')?.dataset.i)) === '12', 'gallery: "Show more" loads the next batch and moves focus to it');
  check((await g.locator('[data-mg-status]').textContent()).includes('of 28'), 'gallery: filter status is announced (aria-live)');

  // Lightbox: keyboard, swipe, Esc, focus return
  const first = g.locator('.mg__item:not([hidden]) a[data-kind="photo"]').first();
  await first.click();
  const lb = g.locator('[data-mg-lb]');
  const w = await lb.locator('img').evaluate((i) => new Promise((r) => (i.complete && i.naturalWidth ? r(i.naturalWidth) : i.addEventListener('load', () => r(i.naturalWidth), { once: true }))));
  check((await lb.isVisible()) && w >= 800, `gallery lightbox: opens full screen with a ${w}px image`);
  await g.keyboard.press('ArrowRight');
  check((await lb.locator('[data-mg-count]').textContent()) === '2 / 28', 'gallery lightbox: arrow keys navigate');
  const box = await lb.locator('[data-mg-stage]').boundingBox();
  await g.evaluate(({ x, y }) => {
    const s = document.querySelector('[data-mg-stage]');
    s.dispatchEvent(new PointerEvent('pointerdown', { clientX: x + 250, clientY: y, bubbles: true }));
    s.dispatchEvent(new PointerEvent('pointerup', { clientX: x + 60, clientY: y, bubbles: true }));
  }, { x: box.x, y: box.y + box.height / 2 });
  check((await lb.locator('[data-mg-count]').textContent()) === '3 / 28', 'gallery lightbox: swipe left moves to the next item');
  await g.keyboard.press('Escape');
  check(!(await lb.isVisible()) && (await g.evaluate(() => !!document.activeElement?.closest('.mg__item'))), 'gallery lightbox: Escape closes and returns focus to the grid');

  // Video plays in the lightbox only when chosen
  await chip('videos').click();
  const before = req.filter((u) => /\.mp4/.test(u)).length;
  await g.locator('.mg__item:not([hidden]) a').first().click();
  await g.waitForTimeout(500);
  const v = await g.evaluate(() => { const el = document.querySelector('[data-mg-stage] video'); return el && { controls: el.controls, inline: el.playsInline }; });
  check(before === 0 && v?.controls && v?.inline && req.filter((u) => /\.mp4/.test(u)).length >= 1, 'gallery: a video is fetched only when played, with native controls');
  await g.keyboard.press('Escape');
  await g.waitForTimeout(300); // the dialog's close event is dispatched asynchronously
  check((await g.locator('[data-mg-stage] video').count()) === 0, 'gallery: closing the viewer stops and removes the video');
  check(errs.length === 0, `gallery: no script errors ${errs.join(' | ')}`);
  await g.close();

  // No JavaScript: everything visible, filters hidden, links go to the files
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const nj = await ctx.newPage();
  await nj.goto(GAL, { waitUntil: 'domcontentloaded' });
  check((await nj.locator('.mg__item:not([hidden])').count()) === 28 && !(await nj.locator('[data-mg-filters]').isVisible()), 'gallery no JavaScript: all 28 items visible, filter bar hidden');
  await ctx.close();

  // 320px fit, accessibility, Core Web Vitals
  const s3 = await browser.newPage({ viewport: { width: 320, height: 640 }, reducedMotion: 'reduce' });
  await s3.goto(GAL, { waitUntil: 'networkidle' });
  check(await s3.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), 'gallery 320px: no sideways scrolling');
  await s3.addScriptTag({ content: axeSource });
  const v2 = await s3.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.filter((x) => ['serious', 'critical'].includes(x.impact)).map((x) => `${x.id} (${x.nodes.length})`));
  check(v2.length === 0, `gallery: no serious/critical accessibility violations ${v2.join(', ')}`);
  await s3.close();
  const cw = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const cdp = await cw.context().newCDPSession(cw);
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cw.addInitScript(() => {
    window.__lcp = 0; window.__cls = 0;
    new PerformanceObserver((l) => l.getEntries().forEach((e) => (window.__lcp = e.startTime))).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
  });
  await cw.goto(GAL, { waitUntil: 'load' });
  await cw.waitForTimeout(3500);
  const vit = await cw.evaluate(() => ({ lcp: Math.round(window.__lcp), cls: +window.__cls.toFixed(3), img: performance.getEntriesByType('resource').filter((e) => e.initiatorType === 'img').reduce((t, e) => t + e.transferSize, 0) }));
  check(vit.lcp < 4000 && vit.cls < 0.1, `gallery Core Web Vitals (throttled 4G, 4x CPU): LCP ${vit.lcp} ms, CLS ${vit.cls}, images on load ${Math.round(vit.img / 1024)} KB`);
  await cw.close();

  // Homepage links to the gallery
  const h = await browser.newPage();
  await h.goto(BASE, { waitUntil: 'domcontentloaded' });
  check((await h.locator('a.explore[href="/gallery"]').count()) === 1 && (await h.locator('header a[href="/gallery"]').count()) >= 1, 'homepage: "Explore Life at BIA" link and navigation lead to /gallery');
  await h.close();
}

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
