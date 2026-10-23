import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function block(css: string, query: string): string {
  const start = css.indexOf(query);
  assert.notEqual(start, -1, query);
  const next = css.indexOf('@media', start + query.length);
  return css.slice(start, next === -1 ? undefined : next);
}

test('desktop sticks the identity column and phone does not', () => {
  const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
  const wide = block(css, '@media (min-width: 1024px)');
  const phone = block(css, '@media (max-width: 1023px)');
  assert.match(wide, /\.side\s*\{[^}]*position:\s*sticky/);
  assert.doesNotMatch(wide, /clip:\s*rect/);
  assert.match(css, /radial-gradient/);
  assert.match(wide, /width:\s*48%/);
  assert.match(wide, /\.main\s*\{[^}]*width:\s*52%/);
  assert.match(phone, /\.label\s*\{[^}]*position:\s*sticky/);
  assert.doesNotMatch(phone, /\.side\s*\{[^}]*position:\s*sticky/);
  assert.match(css, /--bg:\s*#0e141b/);
  assert.match(css, /--accent:\s*#8eb6f2/);
});

test('build emits Spanish at / and English at /en/', () => {
  execFileSync('npx', ['astro', 'build'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  const es = readFileSync(join(root, 'dist/index.html'), 'utf8');
  const en = readFileSync(join(root, 'dist/en/index.html'), 'utf8');
  assert.match(es, /<html lang="es">/);
  assert.match(en, /<html lang="en">/);
  assert.match(es, /Trabajo en el backend porque me gusta poner orden/);
  assert.match(en, /I work on the backend because I like bringing structure/);
  assert.equal(es.includes('I work on the backend because I like bringing structure'), false);
  assert.equal(en.includes('Trabajo en el backend porque me gusta poner orden'), false);
  assert.equal(es.includes('diciembre de 2027'), false);
  assert.equal(en.includes('December 2027'), false);
  assert.match(es, /href="https:\/\/github\.com\/felipec583\/platenote"/);
  assert.match(en, /href="https:\/\/github\.com\/felipec583\/platenote"/);
  assert.match(es, /Octubre 2026/);
  assert.match(en, /Oct 2026/);
  assert.match(es, /--bg:#0e141b/);
  assert.match(en, /--bg:#0e141b/);
  assert.match(es, /href="\/portfolio\/en\/?"/);
  assert.match(en, /id="education"/);
  for (const phrase of ['Viña', '+56', 'finance-tracker', 'Kamil', 'Present']) {
    assert.equal(es.includes(phrase), false, phrase);
    assert.equal(en.includes(phrase), false, phrase);
  }
});
