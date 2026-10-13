import type { APIRoute } from 'astro';
import { directionsCaptions } from '../../data/identity';

/** WebVTT captions for the directions video, built from the transcribed on-screen captions. */
const ts = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = (s % 60).toFixed(3).padStart(6, '0');
  return `00:${String(m).padStart(2, '0')}:${sec}`;
};

export const GET: APIRoute = () =>
  new Response(
    'WEBVTT\n\n' + directionsCaptions.map(([a, b, t], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${t}\n`).join('\n'),
    { headers: { 'Content-Type': 'text/vtt; charset=utf-8' } },
  );
