import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('push to main tests, then builds on Node 22.23.4', () => {
  const yml = readFileSync(join(root, '.github/workflows/deploy.yml'), 'utf8');
  assert.match(yml, /branches:\s*\[main\]/);
  assert.match(yml, /actions\/checkout@v7/);
  assert.match(yml, /actions\/setup-node@v7/);
  assert.match(yml, /node-version:\s*22\.23\.4/);
  assert.match(yml, /npm test/);
  assert.match(yml, /withastro\/action@v6/);
  assert.match(yml, /actions\/deploy-pages@v5/);
  const testAt = yml.indexOf('npm test');
  const actionAt = yml.indexOf('withastro/action@v6');
  assert.equal(testAt > -1 && testAt < actionAt, true);
});

test('README points later edits at the copy files and the palette', () => {
  const readme = readFileSync(join(root, 'README.md'), 'utf8');
  assert.match(readme, /src\/i18n\/es\.ts/);
  assert.match(readme, /src\/i18n\/en\.ts/);
  assert.match(readme, /src\/styles\/global\.css/);
  assert.match(readme, /22\.23\.4/);
});
