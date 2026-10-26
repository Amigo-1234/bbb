/**
 * Success-stories page: category filters (always on) and the motion layer.
 * Without JavaScript the filter bar stays hidden and every result is listed.
 */
import { Flip } from 'gsap/Flip';
import { gsap, ScrollTrigger, SplitText, root, EASE, EASE_TEXT, $, $$, safely, onEnter, maskLines, footer, chromeIn, runMotion, headings } from './core';

gsap.registerPlugin(Flip);

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');

function initFilters() {
  const bar = $('[data-filters]');
  const rows = $$('[data-ledger] > li');
  const status = $('[data-filter-status]');
  if (!bar || !rows.length) return;
  bar.hidden = false;
  const buttons = $$<HTMLButtonElement>('[data-filter]', bar);

  const apply = (filter: string) => {
    const state = reduceMotion.matches ? null : Flip.getState(rows);
    let shown = 0;
    for (const row of rows) {
      const match = filter === 'all' || row.dataset.category === filter;
      row.hidden = !match;
      if (match) shown++;
    }
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === filter)));
    const label = buttons.find((b) => b.dataset.filter === filter)?.textContent?.trim();
    if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'result' : 'results'}${filter === 'all' ? '' : ` in ${label}`}`;
    if (state) {
      Flip.from(state, {
        duration: 0.55,
        ease: 'power2.inOut',
        absolute: true,
        nested: true,
        // The whole stagger is capped so restoring a long list stays quick as results are added.
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.45, delay: 0.15, stagger: { amount: Math.min(0.3, 0.03 * els.length) } }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, duration: 0.25 }),
      });
    }
    ScrollTrigger.refresh();
  };

  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter!)));
}

function hero() {
  const copy = $$('.sh__copy > *');
  const title = $('.sh__title')!;
  const art = $('.sh__art')!;
  const strokes = $$('.sh__art path, .sh__art ellipse');
  const centre = $('.sh__art .laurel__centre');
  const caption = $('.sh__art-caption');

  gsap.set([...copy, art], { autoAlpha: 0 });
  gsap.set(strokes, { drawSVG: '0%' });
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'auto' });

  const tl = gsap.timeline({ defaults: { ease: EASE, duration: 0.8 }, onComplete: () => split.revert() });
  chromeIn(tl);
  root.classList.remove('js-motion');
  const rest = copy.filter((el) => el !== title);
  tl.fromTo(rest[0], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.35')
    .set(title, { autoAlpha: 1 }, '<')
    .from(split.lines, { yPercent: 110, duration: 1.05, ease: EASE_TEXT, stagger: 0.1 }, '<0.1')
    .fromTo(rest.slice(1), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.09 }, '-=0.7')
    .set(art, { autoAlpha: 1 }, 0.3)
    .fromTo(
      '.sh__photo',
      { clipPath: 'inset(12% 8% 12% 8%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' },
      0.3,
    )
    .fromTo('.sh__medal', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out' }, 0.8)
    .to(strokes, { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut', stagger: { each: 0.02, from: 'end' } }, 0.3)
    .fromTo(centre, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: 'back.out(1.8)' }, 1.2)
    .fromTo(caption, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 1.4);
}

/** Featured plates: frames unveil, grade letters climb out of their mask. */
function plates(desktop: boolean) {
  const items = $$('.plate');
  gsap.set(items, { autoAlpha: 0 });
  onEnter($('.plates')!, () => {
    const tl = gsap.timeline();
    tl.fromTo(
      items,
      { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' },
      { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.14, clearProps: 'clipPath' },
    ).from($$('.plate__grade span[aria-hidden]'), { yPercent: 105, duration: 0.9, ease: EASE_TEXT, stagger: 0.05 }, 0.35);
  }, 'top 78%');
  if (desktop) {
    gsap.to('.plate--lead .plate__grade', {
      yPercent: -10,
      ease: 'none',
      scrollTrigger: { trigger: '.plates', start: 'top bottom', end: 'bottom top', scrub: true },
    });
  }
}

/** Portrait cards rise in sequence; the photo band opens. */
function portraits() {
  const cards = $$('.portrait');
  gsap.set(cards, { autoAlpha: 0 });
  onEnter($('.portrait')!.closest('[data-carousel]')!, () =>
    // Capped so a long carousel never leaves off-screen cards invisible for seconds.
    gsap.fromTo(cards, { y: 40, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: { amount: Math.min(0.6, 0.08 * cards.length) } }),
  'top 80%');
  const items = $$('.band__item');
  gsap.set(items, { autoAlpha: 0 });
  onEnter($('.band')!, () =>
    gsap.fromTo(items, { autoAlpha: 0, clipPath: 'inset(0% 0% 100% 0%)' }, { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', stagger: 0.12, clearProps: 'clipPath' }),
  'top 85%');
}

/** Ledger rows reveal in batches as they scroll in. */
function ledger() {
  const rows = $$('.ledger__row');
  gsap.set(rows, { autoAlpha: 0 });
  ScrollTrigger.batch(rows, {
    start: 'top 92%',
    once: true,
    onEnter: (batch) => gsap.fromTo(batch, { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE, stagger: 0.05 }),
  });
  const bar = $('[data-filters]');
  if (bar) {
    gsap.set(bar, { autoAlpha: 0 });
    onEnter(bar, () => gsap.fromTo(bar, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: EASE }));
  }
}

/** Universities: names rise, course ticks draw. */
function universities() {
  const unis = $$('.uni');
  const ticks = $$('.uni__courses svg path');
  gsap.set(unis, { autoAlpha: 0 });
  gsap.set(ticks, { drawSVG: '0%' });
  onEnter($('.unis')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(unis, { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.12 })
      .to(ticks, { drawSVG: '100%', duration: 0.45, stagger: 0.06 }, 0.4);
  });
}

function voices() {
  const text = $('.voices__text')!;
  const rest = $$('.voices__mark, .voices__alumni');
  gsap.set([text, ...rest], { autoAlpha: 0 });
  onEnter($('.voices__body')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(rest[0], { scale: 0.4, rotate: -20, autoAlpha: 0 }, { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.8, ease: 'back.out(2)' })
      .add(maskLines(text, { duration: 1.1 }), 0.15)
      .fromTo(rest.slice(1), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7 }, 0.6);
  }, 'top 78%');
}

function cta() {
  const title = $('.cta__title')!;
  const rest = $$('.cta__eyebrow, .cta__actions > *');
  gsap.set([title, ...rest], { autoAlpha: 0 });
  onEnter($('.cta')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(rest[0], { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
      .add(maskLines(title, { duration: 1.2 }), 0.1)
      .fromTo(rest.slice(1), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.08 }, 0.5);
  }, 'top 75%');
}

let heroPlayed = false;

export function initSuccessPage() {
  initFilters();
  runMotion((desktop) => {
    if (!heroPlayed) {
      heroPlayed = true;
      safely('hero', '.notice, .header, .sh__copy > *, .sh__art, .sh__art *', hero);
    }
    safely('headings', '.head__label, .head__title, .head__intro', headings);
    safely('plates', '.plate, .plate *', () => plates(desktop));
    safely('portraits', '.portrait, .band__item', portraits);
    safely('ledger', '.ledger__row, [data-filters]', ledger);
    safely('universities', '.uni, .uni *', universities);
    safely('voices', '.voices__text, .voices__mark, .voices__alumni', voices);
    safely('cta', '.cta__title, .cta__eyebrow, .cta__actions > *', cta);
    safely('footer', '.footer__grid > *', footer);
  });
}
