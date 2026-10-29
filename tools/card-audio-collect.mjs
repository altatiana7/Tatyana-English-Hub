// Collects every English text a card can speak and writes card-audio/texts.json ({key: text to record}).
// Run: node tools/card-audio-collect.mjs   (serves the repo locally and opens each page in headless Chromium)
// Then push: the "Card audio" workflow records any new texts with a natural neural voice.
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const PAGES = {
  'kate-english-hub/homework-lesson2-generations.html': `generationCards.flatMap(c=>[c.en,c.ex])`,
  'kate-english-hub/homework-lesson3-money.html': `W.flatMap(w=>[w.t,w.ex])`,
  'kate-english-hub/homework-lesson5-bbc-words.html': `ATT.concat(BBC).flatMap(c=>[c[0],c[2]])`,
  'teacher-kate-7b22c1/lesson5-attention-trap.html': `CARDS.flatMap(c=>[c[0],c[2]])`,
  'teacher-kate-7b22c1/lesson6-korea-being-seen.html': `IV.concat(CARDS.flatMap(c=>[c[0],c[2]]))`,
  'teacher-kate-7b22c1/phrasal-verbs-money.html': `VERBS.flatMap(x=>[x.def,x.v,x.ex])`,
  'kate-english-hub/speaking-music-studying.html': `vocab.flatMap(v=>[v[0],v[1]])`,
  'kate-english-hub/useful-tools-false-synonyms.html': `A.concat(B).map(w=>w.en)`,
  'ege-teachers-hub/family-quizlet.html': `cardData.map(c=>c[0])`,
  'ege-teachers-hub/family-lesson13.html': `cardData.map(c=>c[0])`,
  'ege-teachers-hub/extra-family.html': `C.flatMap(c=>[c[0],c[2]])`,
  'ege-teachers-hub/lessonw1.html': `WORDS.flatMap(w=>[w[0],w[1]+'. '+w[2]]).concat(COLL.map(c=>c[0]),HUNT.map(h=>h[1]))`,
  'teacher-nikita-7f3a92/education.html': `DEGREES.map((d,i)=>DK.deg.speak(i)).concat(VOCAB.map(v=>v[0]),VWORDS.map(v=>v[0]),BIASV.map(v=>v[0]),IOC_TALK)`,
  'ege-teachers-hub/pamyatki.html': `SECTIONS.flatMap(s=>(s.cards||[]).filter(c=>!c.frac).flatMap(c=>[c.f,c.b,c.ex]))`,
};

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  fs.readFile(p, (e, d) => { if (e) { res.statusCode = 404; return res.end(); } res.setHeader('content-type', TYPES[path.extname(p)] || 'application/octet-stream'); res.end(d); });
}).listen(0);
const port = server.address().port;

const out = path.join(ROOT, 'card-audio/texts.json');
const manifest = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : {};
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('pageerror', () => {});
let total = 0;
for (const [file, expr] of Object.entries(PAGES)) {
  await page.goto(`http://localhost:${port}/${file}`, { waitUntil: 'load', referer: `http://localhost:${port}/` });
  try { await page.waitForFunction(() => window.CardAudio, null, { timeout: 8000 }); } catch (e) { console.log('NO PLAYER', file, '->', page.url()); continue; }
  const rows = await page.evaluate(expr => {
    const list = eval(expr) || [];
    return list.filter(t => t && CardAudio.isEn(t)).map(t => [CardAudio.key(t), CardAudio.spoken(t)]);
  }, expr);
  let n = 0;
  for (const [k, t] of rows) { if (t && !manifest[k]) { manifest[k] = t; n++; } }
  total += rows.length;
  console.log(String(rows.length).padStart(5), 'texts', String(n).padStart(5), 'new', file);
}
await browser.close(); server.close();
fs.mkdirSync(path.dirname(out), { recursive: true });
const sorted = Object.fromEntries(Object.entries(manifest).sort());
fs.writeFileSync(out, JSON.stringify(sorted, null, 0).replace(/","/g, '",\n"') + '\n');
console.log('manifest entries:', Object.keys(sorted).length);
