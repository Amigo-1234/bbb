/**
 * /ads.txt — authorises Google to sell ad space on biajupeb.com.ng.
 * Generated only once an AdSense publisher ID is set in src/data/ads.ts;
 * until then no ads.txt is published (an empty or placeholder file helps nobody).
 * "f08c47fec0942fa0" is Google's fixed certification authority ID.
 */
import type { APIRoute, GetStaticPaths } from 'astro';
import { adsEnabled, publisherId } from '../data/ads';

export const getStaticPaths: GetStaticPaths = () => (adsEnabled ? [{ params: { ads: 'ads' } }] : []);

export const GET: APIRoute = () =>
  new Response(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
