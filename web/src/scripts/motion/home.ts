/**
 * Homepage motion. See ./core.ts for the shared principles and helpers.
 */
import { gsap, SplitText, root, EASE, EASE_TEXT, $, $$, safely, onEnter, maskLines, parallax, footer, chromeIn, runMotion, headings } from './core';


function hero() {
  const title = $('.hero__title')!;
  const copy = $$('.hero__copy > *').filter((el) => el !== title);
  const track = $('.hero__media .carousel__track');
  const bar = $('.hero__media .carousel__bar');
  const facts = $$('.facts > div');

  // Take over from the CSS pre-hide with inline state, then animate with explicit end values.
  // The hero photograph is never hidden (it is the LCP element); it is only clipped, then revealed.
  gsap.set([...copy, title, '.facts'], { autoAlpha: 0 });
  const split = SplitText.create(title, { type: 'lines', mask: 'lines', aria: 'auto' });
  const show = { autoAlpha: 1 };

  const tl = gsap.timeline({
    defaults: { ease: EASE, duration: 0.8 },
    onComplete: () => {
      split.revert();
      gsap.set([...copy, ...facts, bar], { clearProps: 'transform' });
    },
  });

  chromeIn(tl);
  root.classList.remove('js-motion');
  tl.fromTo(copy[0], { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.35')
    .set(title, show, '<')
    .from(split.lines, { yPercent: 110, duration: 1.05, ease: EASE_TEXT, stagger: 0.1 }, '<0.1')
    .fromTo(copy.slice(1), { y: 22, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.09 }, '-=0.7')
    .fromTo(
      track,
      { clipPath: 'inset(14% 10% 14% 10% round 4px)' },
      { clipPath: 'inset(0% 0% 0% 0% round 4px)', duration: 1.3, ease: 'expo.out', clearProps: 'clipPath' },
      0.1,
    )
    .fromTo(
      '.hero__inset',
      { y: 40, autoAlpha: 0, rotate: -3 },
      { y: 0, autoAlpha: 1, rotate: 0, duration: 1.1, ease: 'expo.out', clearProps: 'transform' },
      0.9,
    )
    .fromTo(bar, { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 }, '-=0.9')
    .set('.facts', show, '-=0.6')
    .fromTo(facts, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.07, duration: 0.6 }, '<');
}

/** Honours: cards rise with a slight tilt, grade letters climb out of a mask, watermark drifts. */
function honours(_desktop: boolean) {
  const section = $('.honours')!;
  const head = $$('.hall__head > *', section);
  const cards = $$('.hall__cards .ach', section);
  const laurel = $$('.hall__head .laurel path, .hall__head .laurel ellipse', section);
  gsap.set([...head, ...cards], { autoAlpha: 0 });
  gsap.set(laurel, { drawSVG: '0%' });
  onEnter(section, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.to(laurel, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut', stagger: { each: 0.02, from: 'end' } })
      .fromTo(head, { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08 }, 0.1)
      .fromTo(
        cards,
        { y: 60, autoAlpha: 0, transition: 'none' },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,transition' },
        0.35,
      )
      .from($$('.ach__grade span[aria-hidden]', section), { yPercent: 105, duration: 0.8, ease: EASE_TEXT, stagger: { each: 0.03 } }, 0.55);
  }, 'top 75%');
}

/** Gallery: photographs unveil upward with a slow settle; slider moves stay native. */
function gallery() {
  const tiles = $$('.life__item');
  const imgs = $$('.life__item img');
  const band = $('.band');
  gsap.set(tiles, { autoAlpha: 0 });
  onEnter($('.life')!, () => {
    gsap
      .timeline()
      .fromTo(
        tiles,
        { autoAlpha: 0, clipPath: 'inset(100% 0% 0% 0%)' },
        { autoAlpha: 1, clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.out', stagger: 0.08, clearProps: 'clipPath' },
      )
      .from(imgs, { scale: 1.18, duration: 1.4, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' }, 0);
  }, 'top 78%');
  if (band) {
    onEnter(band, () =>
      gsap.fromTo(band, { clipPath: 'inset(8% 6% 8% 6%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.out', clearProps: 'clipPath' }),
    );
  }
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

/** Apply: the closing statement rises, the address card slides in. */
function apply() {
  const title = $('.apply__title')!;
  const rest = $$('.apply__eyebrow, .apply__lead, .apply__ctas');
  const card = $('.apply__card');
  gsap.set([title, ...rest, card].filter(Boolean), { autoAlpha: 0 });
  onEnter($('.apply')!, () => {
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.fromTo(rest[0], { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6 })
      .add(maskLines(title, { duration: 1.2 }), 0.1)
      .fromTo(rest.slice(1), { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.1 }, 0.45)
      .fromTo(card, { x: 30, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, clearProps: 'transform' }, 0.3);
  }, 'top 72%');
}

let heroPlayed = false;

export function initHomeMotion() {
  runMotion((desktop) => {
    // The entrance plays once per visit, even if a breakpoint change re-runs this block.
    if (!heroPlayed) {
      heroPlayed = true;
      safely('hero', '.notice, .header, .hero__copy > *, .hero__media', hero);
    }
    safely('headings', '.head__label, .head__title, .head__intro', headings);
    safely('honours', '.hall__head > *, .hall__cards .ach', () => honours(desktop));
    safely('gallery', '.life__item, .life__item img', gallery);
    safely('people', '.founder *, .mission *, .team *', () => people(desktop));
    safely('faq', '.faq__item', faq);
    safely('apply', '.apply *', apply);
    safely('footer', '.footer__grid > *', footer);
  });
}
