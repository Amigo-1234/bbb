/**
 * BIA JUPEB motion layer (homepage only).
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

const root = document.documentElement;
const EASE = 'power3.out';
const EASE_TEXT = 'power4.out';

const $ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  scope.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = document) =>
  [...scope.querySelectorAll<T>(sel)];

/** Run a block; on failure make sure nothing it touched stays hidden. */
function safely(name: string, targets: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.warn(`[motion] ${name} skipped`, err);
    root.classList.remove('js-motion');
    gsap.set(targets, { clearProps: 'opacity,visibility,transform,clipPath' });
  }
}

/** Fire once when `trigger` scrolls into view (also fires on load if already passed). */
function onEnter(trigger: Element, fn: () => void, start = 'top 82%') {
  ScrollTrigger.create({ trigger, start, once: true, onEnter: fn });
}

/** Masked line-by-line text reveal. The split is reverted afterwards so text reflows naturally. */
function maskLines(el: HTMLElement, vars: gsap.TweenVars = {}) {
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

/* ------------------------------------------------------------------------ */

function hero() {
  const title = $('.hero__title')!;
  const copy = $$('.hero__copy > *').filter((el) => el !== title);
  const media = $('.hero__media')!;
  const track = $('.hero__media .carousel__track');
  const bar = $('.hero__media .carousel__bar');
  const facts = $$('.facts > div');
  const chrome = $$('.notice, .header');

  // Take over from the CSS pre-hide with inline state, then animate with explicit end values.
  gsap.set([...chrome, ...copy, title, media, '.facts'], { autoAlpha: 0 });
  gsap.set(chrome, { transition: 'none' });
  root.classList.remove('js-motion');
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'auto' });
  const show = { autoAlpha: 1 };

  const tl = gsap.timeline({
    defaults: { ease: EASE, duration: 0.8 },
    onComplete: () => {
      split.revert();
      gsap.set([...chrome, ...copy, ...facts, bar], { clearProps: 'transform,transition' });
    },
  });

  tl.fromTo(chrome, { yPercent: -100, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.7, stagger: 0.05 })
    .fromTo(copy[0], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.35')
    .set(title, show, '<')
    .from(split.lines, { yPercent: 110, duration: 1.05, ease: EASE_TEXT, stagger: 0.1 }, '<0.1')
    .fromTo(copy.slice(1), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.09 }, '-=0.7')
    .set(media, show, 0.35)
    .fromTo(
      track,
      { clipPath: 'inset(14% 10% 14% 10% round 4px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 4px)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' },
      0.35,
    )
    .fromTo(bar, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.9')
    .set('.facts', show, '-=0.6')
    .fromTo(facts, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.6 }, '<');
}

/** Section headings: label slides in, title reveals line by line, intro follows. */
function headings() {
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

/** Honours: cards rise with a slight tilt, grade letters climb out of a mask, watermark drifts. */
function honours(desktop: boolean) {
  const section = $('.honours')!;
  const cards = $$('.result', section);
  gsap.set(cards, { autoAlpha: 0 });
  onEnter($('.honours [data-carousel]')!, () => {
    const tl = gsap.timeline();
    tl.fromTo(
      cards,
      { y: 70, rotateX: -10, autoAlpha: 0, transformPerspective: 900, transformOrigin: '50% 100%', transition: 'none' },
      { y: 0, rotateX: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', stagger: 0.09, clearProps: 'transform,transition' },
    ).from(
      $$('.result__grade span', section),
      { yPercent: 105, duration: 0.9, ease: EASE_TEXT, stagger: { each: 0.045 } },
      0.25,
    );
  }, 'top 80%');

  // Re-animate the grades of the card that becomes current when the slider moves.
  $('.honours [data-carousel]')!.addEventListener('carousel:change', (e) => {
    const card = cards[(e as CustomEvent<{ index: number }>).detail.index];
    if (!card || !ScrollTrigger.isInViewport(card)) return;
    gsap.fromTo(
      $$('.result__grade span', card),
      { yPercent: 60, autoAlpha: 0.2 },
      { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: EASE, stagger: 0.05, overwrite: true },
    );
  });

  const mark = $('.honours__mark', section);
  if (mark) {
    gsap.fromTo(mark, { autoAlpha: 0, rotate: -6 }, {
      autoAlpha: 1,
      rotate: 0,
      duration: 1.6,
      ease: EASE,
      scrollTrigger: { trigger: section, start: 'top 75%', once: true },
    });
    if (desktop) {
      gsap.to(mark, { yPercent: 18, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true } });
    }
  }
}

/** Journey: a crimson route fills as you scroll and each milestone switches on. */
function journey(desktop: boolean) {
  const wrap = $('.journey')!;
  const fill = $('.route__fill', wrap)!;
  const rail = $('.route__rail', wrap)!;
  const steps = $$('.route > li', wrap);
  const axis = desktop ? 'x' : 'y';

  // Rail length and milestone positions along it (recomputed on every refresh).
  let stops: number[] = [];
  const measure = () => {
    const last = steps[steps.length - 1];
    if (axis === 'y') {
      rail.style.height = `${last.offsetTop - steps[0].offsetTop}px`;
      const len = last.offsetTop - steps[0].offsetTop || 1;
      stops = steps.map((s) => (s.offsetTop - steps[0].offsetTop) / len);
    } else {
      rail.style.height = '';
      const len = rail.offsetWidth || 1;
      stops = steps.map((s) => s.offsetLeft / len);
    }
  };
  measure();
  ScrollTrigger.addEventListener('refreshInit', measure);

  wrap.classList.add('is-live');
  const activate = (p: number) =>
    steps.forEach((s, i) => s.classList.toggle('is-active', p >= stops[i] - 0.001 && p > 0.001));

  gsap.fromTo(
    fill,
    { [axis === 'x' ? 'scaleX' : 'scaleY']: 0 },
    {
      [axis === 'x' ? 'scaleX' : 'scaleY']: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        start: desktop ? 'top 78%' : 'top 70%',
        end: desktop ? 'top 30%' : 'bottom 65%',
        scrub: 0.6,
        onUpdate: (self) => activate(self.progress),
        onRefresh: (self) => activate(self.progress),
      },
    },
  );

  gsap.set(steps, { autoAlpha: 0 });
  onEnter(wrap, () =>
    gsap.fromTo(steps, { y: 26, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: EASE, stagger: 0.12 }),
  );

  return () => {
    ScrollTrigger.removeEventListener('refreshInit', measure);
    wrap.classList.remove('is-live');
    steps.forEach((s) => s.classList.remove('is-active'));
    rail.style.height = '';
  };
}

/** Points scale: bars grow to their value in sequence. */
function scale() {
  const bars = $$('.scale__bar');
  const values = bars.map((b) => b.style.getPropertyValue('--w'));
  gsap.set(bars, { '--w': '0%' });
  onEnter($('.scale')!, () =>
    bars.forEach((bar, i) =>
      gsap.to(bar, { '--w': values[i], duration: 1.1, ease: 'expo.out', delay: i * 0.08 }),
    ),
  );
}

/** Programme: illustrations draw themselves, then the fee ledger cascades in. */
function programme() {
  for (const stream of $$('.stream')) {
    const strokes = $$('.art path, .art ellipse, .art circle', stream);
    const fills = $$('.art__fill, .art__dot', stream);
    const text = $$('.stream__kicker, .stream__name, .stream__blurb', stream);
    const rows = $$('.stream__fees > div', stream);
    gsap.set([...text, ...rows], { autoAlpha: 0 });
    gsap.set(strokes, { drawSVG: '0%' });
    gsap.set(fills, { fillOpacity: 0 });
    onEnter(stream, () => {
      const tl = gsap.timeline({ defaults: { ease: EASE } });
      tl.to(strokes, { drawSVG: '100%', duration: 1.2, ease: 'power2.inOut', stagger: 0.06 })
        .to(fills, { fillOpacity: 1, duration: 0.6 }, '-=0.4')
        .fromTo(text, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.2)
        .fromTo(rows, { x: -14, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.55);
    }, 'top 78%');
  }

  const plan = $('.plan');
  const chips = $$('.combos__chip');
  const combos = $$('.combos__list > div, .combos__title');
  gsap.set([plan, ...combos].filter(Boolean), { autoAlpha: 0 });
  onEnter($('.fees-foot')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(plan, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9 })
      .fromTo(combos, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.08 }, 0.1)
      .from(chips, { scale: 0.85, autoAlpha: 0, duration: 0.45, ease: 'back.out(2)', stagger: 0.03 }, 0.35);
  });
}

/** Calendar: the timeline sweeps open left to right, dates tick in, "Next" pops. */
function calendar() {
  const list = $('.timeline')!;
  const items = $$('.timeline__item', list);
  gsap.set(items, { autoAlpha: 0 });
  onEnter(list, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(list, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' })
      .fromTo(items, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1 }, 0.15)
      .from($$('.timeline__tag', list), { scale: 0.4, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.5)', stagger: 0.1 }, '-=0.3');
  });
}

/** Ways to study: icon discs pop, ticks draw themselves. */
function modes() {
  const modes = $$('.mode');
  const icons = $$('.mode__icon');
  const ticks = $$('.mode--shared li svg path');
  gsap.set(modes, { autoAlpha: 0 });
  gsap.set(ticks, { drawSVG: '0%' });
  onEnter($('.modes')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(modes, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12 })
      .from(icons, { scale: 0.3, rotate: -25, duration: 0.7, ease: 'back.out(2)', stagger: 0.12 }, 0.15)
      .to(ticks, { drawSVG: '100%', duration: 0.5, ease: 'power2.out', stagger: 0.1 }, 0.5);
  });
}

/** Gallery: photographs unveil upward with a slow settle; slider moves stay native. */
function gallery() {
  const shots = $$('.shot');
  const imgs = $$('.shot img');
  gsap.set(shots, { autoAlpha: 0 });
  onEnter($('.gallery [data-carousel]')!, () => {
    const tl = gsap.timeline();
    tl.fromTo(
      shots,
      { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' },
      { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.12, clearProps: 'clipPath' },
    ).from(imgs, { scale: 1.25, duration: 1.6, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' }, 0);
  }, 'top 78%');
}

/** Parallax for a photo inside an overflow-hidden frame (desktop only). */
function parallax(img: Element | null, trigger: Element | null, amount = 8) {
  if (!img || !trigger) return;
  gsap.fromTo(
    img,
    { yPercent: -amount, scale: 1.16 },
    { yPercent: amount, scale: 1.16, ease: 'none', scrollTrigger: { trigger, start: 'top bottom', end: 'bottom top', scrub: true } },
  );
}

/** Leadership: portrait unveils, mission sets line by line, team rows slide in. */
function people(desktop: boolean) {
  const frame = $('.founder picture');
  const caption = $('.founder figcaption');
  const quote = $('.mission p');
  const mark = $('.mission__mark');
  const rows = $$('.team__list li, .team__title, .mission footer');
  gsap.set([frame, caption, quote, mark, ...rows].filter(Boolean), { autoAlpha: 0 });

  onEnter($('.people')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(frame, { autoAlpha: 1, clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' })
      .fromTo(caption, { y: 16, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.6)
      .fromTo(mark, { scale: 0.4, rotate: -20, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(2)' }, 0.2)
      .add(maskLines(quote!, { stagger: 0.08, duration: 1.1 }), 0.3)
      .fromTo(rows, { x: 18, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.07 }, 0.8);
  }, 'top 75%');

  if (desktop) parallax($('.founder img'), $('.founder'));
}

/** FAQ: questions cascade in; answers glide open. */
function faq() {
  const items = $$('.faq__item');
  gsap.set(items, { autoAlpha: 0 });
  onEnter($('.faq__list')!, () =>
    gsap.fromTo(items, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE, stagger: 0.06 }),
  );
  for (const item of items) {
    item.addEventListener('toggle', () => {
      if (!(item as HTMLDetailsElement).open) return;
      gsap.fromTo($('p', item), { height: 0, autoAlpha: 0, y: -6 }, { height: 'auto', autoAlpha: 1, y: 0, duration: 0.45, ease: EASE, clearProps: 'height,transform' });
    });
  }
}

/** Guides: an index that slides in row by row. */
function guides() {
  const rows = $$('.guides li');
  gsap.set(rows, { autoAlpha: 0 });
  onEnter($('.guides')!, () =>
    gsap.fromTo(rows, { x: -30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: EASE, stagger: 0.08 }),
  );
}

/** Apply: the closing statement rises, the centre photograph opens from the side. */
function apply(desktop: boolean) {
  const title = $('.apply__title')!;
  const rest = $$('.apply__eyebrow, .apply__lead, .apply__ctas');
  const frame = $('.apply__visit picture');
  const caption = $('.apply__visit figcaption');
  gsap.set([title, ...rest, frame, caption].filter(Boolean), { autoAlpha: 0 });
  onEnter($('.apply')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(rest[0], { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
      .add(maskLines(title, { duration: 1.2 }), 0.1)
      .fromTo(rest.slice(1), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1 }, 0.45)
      .fromTo(frame, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.2)
      .fromTo(caption, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, 1);
  }, 'top 72%');
  if (desktop) parallax($('.apply__visit img'), $('.apply__visit'), 6);
}

/** Footer columns settle in. */
function footer() {
  const cols = $$('.footer__grid > *');
  gsap.set(cols, { autoAlpha: 0 });
  onEnter($('.footer')!, () =>
    gsap.fromTo(cols, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: EASE, stagger: 0.08 }),
  'top 90%');
}

/* ------------------------------------------------------------------------ */

let heroPlayed = false;

export async function initMotion() {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: reduce)', () => {
    root.classList.remove('js-motion');
    root.dataset.motion = 'reduced';
  });
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      desktop: '(min-width: 960px)',
    },
    (ctx) => {
      const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
      if (!motion) {
        root.classList.remove('js-motion');
        root.dataset.motion = 'reduced';
        return;
      }
      root.dataset.motion = 'running';

      let undoJourney: (() => void) | undefined;
      // The entrance plays once per visit, even if a breakpoint change re-runs this block.
      if (!heroPlayed) {
        heroPlayed = true;
        safely('hero', '.notice, .header, .hero__copy > *, .hero__media, .facts, .facts > div', hero);
      }
      safely('headings', '.head__label, .head__title, .head__intro', headings);
      safely('honours', '.result, .honours__mark', () => honours(desktop));
      safely('journey', '.route > li', () => (undoJourney = journey(desktop)));
      safely('scale', '.scale__bar', scale);
      safely('programme', '.stream *, .plan, .combos *', programme);
      safely('calendar', '.timeline, .timeline__item', calendar);
      safely('modes', '.mode', modes);
      safely('gallery', '.shot, .shot img', gallery);
      safely('people', '.founder *, .mission *, .team *', () => people(desktop));
      safely('faq', '.faq__item', faq);
      safely('guides', '.guides li', guides);
      safely('apply', '.apply *', () => apply(desktop));
      safely('footer', '.footer__grid > *', footer);

      return () => undoJourney?.();
    },
  );

  // Positions depend on web fonts and lazy images; re-measure once they settle.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
}
