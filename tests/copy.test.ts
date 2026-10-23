import assert from 'node:assert/strict';
import test from 'node:test';
import { en } from '../src/i18n/en.ts';
import { es } from '../src/i18n/es.ts';

const forbidden = [
  'Present',
  'actualidad',
  'Viña',
  '+56',
  'BookPal',
  'Desafio-6',
  'codewars',
  'Kamil',
  'NestJS',
  'TypeORM',
  'ERP',
  'el código es de la empresa',
  'tiempo real',
];

function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => keyPaths(item, `${prefix}[${index}]`));
  }
  if (value !== null && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      keyPaths(child, prefix ? `${prefix}.${key}` : key),
    );
  }
  return [prefix];
}

test('both locales expose the same fields', () => {
  assert.deepEqual(keyPaths(es), keyPaths(en));
  assert.deepEqual(
    es.nav.map((item) => item.id),
    en.nav.map((item) => item.id),
  );
  assert.deepEqual(es.stack, en.stack);
  assert.deepEqual(
    es.projects.map((project) => project.href),
    en.projects.map((project) => project.href),
  );
});

test('PlateNote is the only project', () => {
  assert.equal(es.projects.length, 1);
  assert.equal(es.projects[0].href, 'https://github.com/felipec583/platenote');
  assert.equal(en.projects[0].name, 'PlateNote');
});

test('about is the site wording, not the résumé summary', () => {
  assert.equal(
    es.about,
    'Construyo backends con Node.js y TypeScript, sobre todo APIs y los datos que pasan por ellas. PostgreSQL guarda esa información, y los archivos van a S3 cuando no deben quedar en el flujo principal. Así trabajé en una startup. Antes de software estudié Comunicación Social, así que documentar y pasar un pedido del negocio a algo claro para construir es parte del trabajo.',
  );
  assert.equal(
    en.about,
    'I build backends with Node.js and TypeScript, mostly APIs and the data that moves through them. PostgreSQL holds that data, and files go to S3 when they should not sit in the main flow. I worked this way at a startup. Before software I studied Social Communication, so writing the documentation and turning a business request into a clear build is part of the job.',
  );
  assert.notEqual(es.about, en.about);
  assert.equal(es.about.includes('specializing'), false);
  assert.equal(en.about.includes('specializing'), false);
});

test('Fruzty ended October 2026', () => {
  assert.equal(es.job.dates, 'Enero 2025 – Octubre 2026');
  assert.equal(en.job.dates, 'Jan 2025 – Oct 2026');
  assert.equal(es.job.facts.length, 3);
  assert.equal(en.job.facts.length, 3);
});

test('education is three lines and the school name keeps the accent', () => {
  assert.equal(es.education.length, 3);
  assert.equal(en.education.length, 3);
  assert.equal(es.education.some((line) => line.includes('Desafío')), true);
  assert.equal(en.education.some((line) => line.includes('Dec 2027')), true);
});

test('copy does not carry rejected claims', () => {
  const blob = JSON.stringify({ es, en });
  for (const phrase of forbidden) {
    assert.equal(blob.includes(phrase), false, phrase);
  }
});
