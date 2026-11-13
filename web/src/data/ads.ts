/**
 * Google AdSense — prepared but switched OFF.
 *
 * While `client` is empty, nothing ad-related is output anywhere: no AdSense
 * script, no verification meta tag, no ads.txt and no ad slots. The privacy and
 * cookie pages describe advertising in the future tense until ads are on.
 *
 * To switch on (see docs/adsense.md):
 *   1. Set `client` to the publisher ID from AdSense ("ca-pub-" + 16 digits).
 *      This adds the site-verification meta tag, the AdSense script and /ads.txt.
 *   2. After approval, create display ad units in AdSense and paste their IDs
 *      into `slots`. Slots with an empty ID render nothing.
 */
export const ads = {
  /** AdSense publisher ID, e.g. "ca-pub-0000000000000000". Empty = advertising off. */
  client: '',
  /** Manual display ad unit IDs (numbers only), one per approved placement. */
  slots: {
    /** End of each guide article, after the text and before "Practise for JUPEB". */
    guideEnd: '',
    /** Guides index, below the list of guides. */
    guidesIndex: '',
  },
} as const;

export type AdSlotName = keyof typeof ads.slots;

export const adsEnabled = /^ca-pub-\d{16}$/.test(ads.client);

/** "ca-pub-123…" → "pub-123…" (the form ads.txt uses). */
export const publisherId = ads.client.replace(/^ca-/, '');
