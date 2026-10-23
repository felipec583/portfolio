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
  'No estoy trabajando',
  "I'm not working",
  'pallet',
  'pallets',
  'stock',
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
  assert.deepEqual(es.about, [
    'Trabajo en el backend porque me gusta poner orden donde hay complejidad. Para mí, construir software no es solo hacer que una función retorne un resultado, sino asegurarme de que los datos fluyan de forma predecible, que la base de datos no sufra con consultas innecesarias y que los procesos pesados no bloqueen la respuesta al usuario.',
    'Me enfoco en diseñar APIs REST claras con Node.js, TypeScript y PostgreSQL, cuidando siempre la estructura del código y la documentación para que cualquier otro desarrollador pueda entender qué hace el sistema sin tener que adivinar.',
    'Hoy estoy aplicando todo esto en un proyecto personal: una herramienta full-stack para resolver un problema cotidiano que tengo con el control de gastos, cálculo de compras y división de cuentas, combinando un backend estructurado con una interfaz en Angular.',
  ]);
  assert.deepEqual(en.about, [
    "I work on the backend because I like bringing structure to complex systems. To me, building software isn't just about making a function return a result—it's about making sure data flows predictably, the database doesn't get hammered by repetitive requests, and heavy tasks stay out of the user's way.",
    "I focus on building clean REST APIs with Node.js, TypeScript, and PostgreSQL, paying close attention to code organization and documentation so anyone else touching the codebase knows exactly what's going on.",
    "Right now, I'm putting this into practice on a personal project: a full-stack app to fix a daily headache I have with tracking expenses, totaling shopping lists, and splitting debts, pairing a structured API with an Angular client.",
  ]);
  assert.equal(es.about.join(' ').includes('specializing'), false);
  assert.equal(en.about.join(' ').includes('specializing'), false);
  assert.equal(es.about.join(' ').includes('finance-tracker'), false);
});

test('Fruzty ended October 2026', () => {
  assert.equal(es.job.dates, 'Enero 2025 – Octubre 2026');
  assert.equal(en.job.dates, 'Jan 2025 – Oct 2026');
  assert.equal(es.job.facts.length, 2);
  assert.equal(en.job.facts.length, 2);
});

test('education is place, study, and dates', () => {
  assert.deepEqual(
    es.education.map((row) => [row.place, row.study, row.dates]),
    [
      ['Universidad Mayor', 'Ingeniería en Informática', 'Previsto diciembre 2027'],
      ['Desafío Latam', 'Certificado Full-Stack', 'Marzo 2023 – Mayo 2024'],
      ['Universidad Bicentenaria de Aragua', 'Comunicación Social', 'Agosto 2013 – Noviembre 2018'],
    ],
  );
  assert.deepEqual(
    en.education.map((row) => [row.place, row.study, row.dates]),
    [
      ['Universidad Mayor', 'Informatics Engineering', 'Expected Dec 2027'],
      ['Desafío Latam', 'Full-Stack certificate', 'March 2023 – May 2024'],
      ['Universidad Bicentenaria de Aragua', 'Bachelor of Social Communication', 'Aug 2013 – Nov 2018'],
    ],
  );
  assert.equal(JSON.stringify(es.education).includes('Venezuela'), false);
  assert.equal(JSON.stringify(en.education).includes('Venezuela'), false);
});

test('Angular is on the stack in both locales', () => {
  assert.equal(es.stack.includes('Angular'), true);
  assert.equal(en.stack.includes('Angular'), true);
});

test('copy does not carry rejected claims', () => {
  const blob = JSON.stringify({ es, en });
  for (const phrase of forbidden) {
    assert.equal(blob.includes(phrase), false, phrase);
  }
});
