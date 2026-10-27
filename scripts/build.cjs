const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8').replace(/\r\n/g, '\n');
const campaign = JSON.parse(read('data/campaign.json'));
const { posts } = campaign;
assert.equal(campaign.campaign, 'CL30-20261029-20261127');
assert.equal(campaign.timezone, 'America/Guatemala');
assert.equal(posts.length, 150);
for (const field of ['id', 'title', 'hook']) assert.equal(new Set(posts.map(p => p[field].toLowerCase().trim())).size, 150, `Duplicado en ${field}`);
const dates = Array.from({ length: 30 }, (_, i) => new Date(Date.UTC(2026, 9, 29 + i)).toISOString().slice(0, 10));
for (const p of posts) {
  for (const key of ['id', 'date', 'network', 'pillar', 'title', 'hook', 'objective', 'audience', 'cta', 'production', 'kpi', 'duration', 'stage']) assert(typeof p[key] === 'string' && p[key].trim(), `${p.id}: ${key} vacío`);
  assert(dates.includes(p.date));
  assert(['LinkedIn', 'Instagram', 'TikTok'].includes(p.network));
  assert(['Reel', 'Carrusel'].includes(p.format));
  assert(/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(p.time));
  assert(p.id.startsWith('CL30-'));
  assert(Array.isArray(p.outline) && p.outline.length >= 5 && p.outline.every(s => typeof s === 'string' && s.trim()));
  if (p.source) assert.equal(new URL(p.source).protocol, 'https:');
}
for (const date of dates) {
  const day = posts.filter(p => p.date === date);
  assert.equal(day.length, 5);
  for (const [network, total] of [['LinkedIn', 1], ['Instagram', 3], ['TikTok', 1]]) assert.equal(day.filter(p => p.network === network).length, total);
  for (const pillar of ['IA', 'Formación', 'Empleabilidad']) assert.equal(day.filter(p => p.network === 'Instagram' && p.pillar === pillar).length, 1);
}
let html = read('src/template.html');
const replacements = {
  __STYLES__: read('src/styles.css').trimEnd(),
  __APP_JS__: read('src/app.js').trimEnd(),
  __CONTENT_JSON__: JSON.stringify(posts).replace(/</g, '\\u003c')
};
for (const [marker, value] of Object.entries(replacements)) {
  assert.equal(html.split(marker).length, 2, `Marcador inválido: ${marker}`);
  html = html.replace(marker, () => value);
}
assert(!/__CONTENT_JSON__|__APP_JS__|__STYLES__/.test(html));
assert(html.includes('<title>Campuslands · Calendario editorial</title>'));
assert(!/file:\/\/\/|C:\\Users\\|C:\/Users\//i.test(html), 'El sitio no debe depender de rutas del equipo');
new (require('node:vm').Script)(read('src/app.js'));
if (process.argv.includes('--check')) {
  assert.equal(read('docs/index.html'), html, 'La web publicada no coincide con las fuentes. Ejecuta npm run build.');
  assert(fs.existsSync(path.join(root, 'docs/.nojekyll')));
  console.log('PASS: 150 publicaciones, IDs, fechas, redes, sintaxis y sitio sincronizado con fuentes.');
} else {
  fs.mkdirSync(path.join(root, 'docs'), { recursive: true });
  fs.writeFileSync(path.join(root, 'docs/index.html'), html);
  fs.writeFileSync(path.join(root, 'docs/.nojekyll'), '');
  console.log('Generado docs/index.html: 150 publicaciones, sin dependencias externas.');
}
