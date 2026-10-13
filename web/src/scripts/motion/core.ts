/**
 * BIA JUPEB motion core — shared helpers for the per-page motion modules.
 *
 * Principles
 * - Progressive enhancement: markup is fully visible without JS. Only the hero
 *   is pre-hidden (html.js-motion, set inline in <head>) and a 3s failsafe
 *   removes that if this module never starts.
 * - Everything runs inside gsap.matchMedia(): nothing animates under
 *   prefers-reduced-motion, parallax is desktop-only, and all tweens,
 *   ScrollTriggers and SplitText instances are reverted automatically.
 * - Transform / opacity / clip-path only; no pinning, no scroll hijacking.
 * - Each section block is isolated: if one throws, the rest still run and the
 *   failed block's content is restored to visible.
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin);

export { gsap, ScrollTrigger, SplitText };

export const root = document.documentElement;
export const EASE = 'power3.out';
export const EASE_TEXT = 'power4.out';

export const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);
export const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  [...scope.querySelectorAll<T>(sel)];

/** Run a block; on failure make sure nothing it touched stays hidden. */
export function safely(name: string, targets: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.warn(`[motion] ${name} skipped`, err);
    root.classList.remove('js-motion');
    gsap.set(targets, { clearProps: 'opacity,visibility,transform,clipPath' });
  }
}

/** Fire once when `trigger` scrolls into view (also fires on load if already passed). */
export function onEnter(trigger: Element, fn: () => void, start = 'top 82%') {
  ScrollTrigger.create({ trigger, start, once: true, onEnter: fn });
}

/** Masked line-by-line text reveal. The split is reverted afterwards so text reflows naturally. */
export function maskLines(el: HTMLElement, vars: gsap.TweenVars = {}) {
  const split = SplitText.create(el, { type: 'lines', mask: 'lines', aria: 'auto' });
  gsap.set(el, { autoAlpha: 1 });
  return gsap.from(split.lines, {
    yPercent: 110,
    duration: 1,
    ease: EASE_TEXT,
    stagger: 0.09,
    ...vars,
    onComplete: () => split.revert(),
  });
}


/** Parallax for a photo inside an overflow-hidden frame (desktop only). */
export function parallax(img: Element | null, trigger: Element | null, amount = 8) {
  if (!img || !trigger) return;
  gsap.fromTo(
    img,
    { yPercent: -amount, scale: 1.16 },
    { yPercent: amount, scale: 1.16, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true } },
  );
}

/** Footer columns settle in (shared by every page). */
export function footer() {
  const cols = $$('.footer__grid > *');
  gsap.set(cols, { autoAlpha: 0 });
  onEnter($('.footer')!, () =>
    gsap.fromTo(cols, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE, stagger: 0.08 }),
  'top 90%');
}

/** Site header + notice bar entrance used at the start of each page's hero timeline. */
export function chromeIn(tl: gsap.core.Timeline) {
  const chrome = $$('.notice, .header');
  gsap.set(chrome, { transition: 'none' });
  tl.fromTo(chrome, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05, clearProps: 'transform,transition' });
  return chrome;
}

/**
 * Run a page's motion inside gsap.matchMedia(): stands down under reduced
 * motion, passes `desktop` for parallax decisions, and refreshes positions once
 * fonts and images settle.
 */
export function runMotion(setup: (desktop: boolean) => void | (() => void)) {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: reduce)', () => {
    root.classList.remove('js-motion');
    root.dataset.motion = 'reduced';
  });
  mm.add({ motion: '(prefers-reduced-motion: no-preference)', desktop: '(min-width: 960px)' }, (ctx) => {
    const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
    if (!motion) return;
    root.dataset.motion = 'running';
    return setup(desktop);
  });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}

/** Section headings: label slides in, title reveals line by line, intro follows. */
export function headings() {
  for (const head of $$('.head')) {
    const label = $('.head__label', head);
    const title = $('.head__title', head)!;
    const intro = $('.head__intro', head);
    gsap.set([label, title, intro].filter(Boolean), { autoAlpha: 0 });
    onEnter(head, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.fromTo(label, { x: -16, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6 })
        .add(maskLines(title), 0.05);
      if (intro) tl.fromTo(intro, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.35);
    });
  }
}

