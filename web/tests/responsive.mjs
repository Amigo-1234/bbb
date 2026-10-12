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
        .filter((e) => e.offsetParent && e.getBoundingClientRect().height < 44)
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

await browser.close();
console.log(failures ? `\n${failures} check(s) failed` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
