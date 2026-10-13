// Writes private-media/index.ts so the review build can import the private photos.
import { readdirSync, writeFileSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const dir = new URL('../private-media/', import.meta.url);
const photos = readdirSync(new URL('photos/', dir)).filter((f) => f.endsWith('.jpg')).sort();
const videos = readdirSync(new URL('videos/', dir)).filter((f) => f.endsWith('.mp4')).sort();
const probe = (f) =>
  JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height:format=duration', '-of', 'json', f], { encoding: 'utf8' }));
let src = '// GENERATED — private review media index (gitignored). Do not commit.\n';
src += photos.map((f) => `import ${f.slice(0, -4)} from './photos/${f}';`).join('\n') + '\n';
src += videos.map((f) => `import ${f.slice(0, -4)}poster from './posters/${f.slice(0, -4)}.jpg';`).join('\n') + '\n';
src += `export const photos = { ${photos.map((f) => f.slice(0, -4)).join(', ')} };\n`;
src += 'export const videos = {\n';
for (const f of videos) {
  const id = f.slice(0, -4);
  const p = probe(new URL(`videos/${f}`, dir).pathname);
  const bytes = statSync(new URL(`videos/${f}`, dir)).size;
  src += `  ${id}: { src: '/review-media/${f}', poster: ${id}poster, width: ${p.streams[0].width}, height: ${p.streams[0].height}, duration: ${Math.round(+p.format.duration)}, bytes: ${bytes} },\n`;
}
src += '};\nexport const isReview = true;\n';
writeFileSync(new URL('index.ts', dir), src);
console.log('wrote private-media/index.ts');
