# Portfolio Astro Site Implementation Plan

> **For agentic workers:** Execute inline in this session. Do not dispatch a subagent per task. Steps use checkbox (`- [ ]`) syntax for tracking. After each task, run that task’s bug check and fix what it finds before the next task starts. Felipe runs `git push`. The agent does not.

**Goal:** Publish a one-page Spanish/English portfolio at `https://felipec583.github.io/portfolio/` that rebuilds itself on every push to `main`.

**Architecture:** Static Astro site. Spanish is `src/pages/index.astro`. English is `src/pages/en/index.astro`. Both render `src/layouts/Base.astro` with a typed copy object. Copy lives in `src/i18n/es.ts` and `src/i18n/en.ts`. Colors and the 1024px split live in `src/styles/global.css`. Pushing `main` runs `npm test`, then builds with Node 22.23.4, then deploys to GitHub Pages. There is no staging site and no manual upload.

**Tech Stack:** Astro 7.4.2, Node 22.23.4 via nvm-windows, npm 10.9.8, `node:test`, GitHub Actions (`actions/checkout@v7`, `actions/setup-node@v7`, `withastro/action@v6`, `actions/deploy-pages@v5`).

## Global Constraints

- Node on this PC and in the build is `22.23.4`. Astro 7.4.2 `engines.node` is `>=22.23.4`. Do not scaffold on `22.22.3`. Do not switch to Node 24 or 26.
- nvm is nvm-windows 1.1.11. It does not read `.nvmrc` on `cd`. The switch is `nvm use 22.23.4`.
- `site` is `https://felipec583.github.io`. `base` is `/portfolio`. `defaultLocale` is `es`. `locales` are `es` and `en`. `routing.prefixDefaultLocale` is `false`.
- Language switch uses `getRelativeLocaleUrl`. Two real URLs. Do not port the mock’s one-file `data-es` script.
- Desktop (`min-width: 1024px`): left column sticky, `width: 48%`, right column `width: 52%`. Phone (`max-width: 1023px`): left column scrolls away, section label sticks, identity column is not fixed.
- Palette: `--bg #0e141b`, `--text #e7eef6`, `--muted #9aabbb`, `--faint #6d7d8e`, `--accent #8eb6f2`, `--pill rgba(142, 182, 242, 0.14)`.
- Left column: Felipe Castillo, role, “Node.js, TypeScript, PostgreSQL”, ES/EN, five section links, GitHub / LinkedIn / email as icons. No city. No phone number.
- Right column order: About, Proyectos, Experiencia, Stack, Educación. Same sections in both languages.
- About uses the sentences in Task 2. It is not a paste of the résumé summary.
- One project: PlateNote, `https://github.com/felipec583/platenote`. No Finance Tracker card. No live-demo link. No screenshots.
- Fruzty is Jan 2025 – Oct 2026 / Enero 2025 – Octubre 2026. No “Present”. No “actualidad”. No “el código es de la empresa”.
- Do not edit `C:\Users\Felipe\Desktop\RESUME\Latex\RESUME EN.tex` or `RESUME ES.tex`.
- Off the page: BookPal, css-exercises, Desafio-6, codewars, NestJS, TypeORM, ERP, PHP, ML, “tiempo real”, Viña, `+56`.
- `mocks/` stays on disk through the page task and is never `git add`ed. A later commit deletes the folder and ignores it. The push cannot upload it.
- Later content edits touch `src/i18n/es.ts` and `src/i18n/en.ts` together. A palette edit touches the `:root` block in `src/styles/global.css`. The workflow does not change.
- The agent does not `git push`. Felipe does, after the last bug check.

---

### Task 1: Node, Astro project, git remote

**Files:**
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\package.json`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\package-lock.json`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\astro.config.mjs`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\tsconfig.json`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\.nvmrc`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\.gitignore`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\pages\.gitkeep`

**Interfaces:**
- Consumes: nvm-windows on this PC. Active Node is 22.22.3 until this task.
- Produces: `astro` 7.4.2 installed, `origin` = `https://github.com/felipec583/portfolio.git`, branch `main`. No pages yet.

- [ ] **Step 1: Switch Node with nvm**

This folder is not a git repo. Do not clone. A clone needs an empty directory, and `mocks/` is already here.

```bat
nvm install 22.23.4
nvm use 22.23.4
node -v
```

Expected: `v22.23.4`

If `nvm use` says access denied, open a terminal that can write `C:\Program Files\nodejs` and run `nvm use 22.23.4` again. Stop if `node -v` is anything else. Astro 7.4.2 will not start on 22.22.3.

- [ ] **Step 2: Write package.json**

```json
{
  "name": "portfolio",
  "version": "0.0.1",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=22.23.4",
    "npm": ">=9.6.5"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "node --experimental-strip-types --test"
  },
  "dependencies": {
    "astro": "7.4.2"
  }
}
```

- [ ] **Step 3: Install Astro**

Run from `C:\Users\Felipe\Desktop\PROJECTS\portfolio`:

```bash
npm install
npx astro --version
```

Expected: version line contains `7.4.2`. Do not run `npm create astro`. The folder is not empty.

- [ ] **Step 4: Write the config files**

`.nvmrc`

```
22.23.4
```

`.gitignore`

```
node_modules/
dist/
.astro/
```

`tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

`astro.config.mjs`

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://felipec583.github.io',
  base: '/portfolio',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
```

Create an empty `src/pages/.gitkeep` so the pages directory exists before Task 3.

- [ ] **Step 5: Init git and add the one remote**

```bash
git init -b main
git remote add origin https://github.com/felipec583/portfolio.git
git remote -v
```

Expected: `origin` fetches and pushes `https://github.com/felipec583/portfolio.git`. No other remote.

- [ ] **Step 6: Bug check**

Do not commit, and do not start Task 2, unless every line is true.

- `node -v` prints `v22.23.4`
- `npx astro --version` contains `7.4.2`
- `git remote -v` shows only `origin` → `https://github.com/felipec583/portfolio.git`
- `git status --short` lists `mocks/` as untracked, not staged

Fix the failed line, then check again.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .nvmrc .gitignore src/pages/.gitkeep docs/superpowers/plans/2026-10-23-portfolio-astro-site.md
git commit -m "$(cat <<'EOF'
Pin Astro 7.4.2 to the patched Node 22 line.

The empty GitHub repo is the origin. Pages deploy from this folder, not from a clone.
EOF
)"
```

---

### Task 2: Spanish and English copy

**Files:**
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\i18n\types.ts`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\i18n\es.ts`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\i18n\en.ts`
- Test: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\tests\copy.test.ts`

**Interfaces:**
- Consumes: nothing from Task 1 except the test script.
- Produces: `Copy` from `src/i18n/types.ts`. `es` from `src/i18n/es.ts`. `en` from `src/i18n/en.ts`. Task 3 imports these names.

- [ ] **Step 1: Write the failing test**

`tests/copy.test.ts`

```ts
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
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm test
```

Expected: FAIL. Node cannot find `../src/i18n/en.ts`.

- [ ] **Step 3: Write the copy modules**

`src/i18n/types.ts`

```ts
export type Project = {
  name: string;
  href: string;
  dates: string;
  problem: string;
  built: string;
  decision: string;
  pills: string[];
};

export type Copy = {
  htmlLang: 'es' | 'en';
  role: string;
  tagline: string;
  aboutTitle: string;
  about: string;
  projectsTitle: string;
  projects: Project[];
  experienceTitle: string;
  job: {
    company: string;
    role: string;
    dates: string;
    facts: string[];
  };
  stackTitle: string;
  stack: string[];
  educationTitle: string;
  education: string[];
  nav: { id: string; label: string }[];
  ariaGithub: string;
  ariaLinkedin: string;
  ariaEmail: string;
};
```

`src/i18n/es.ts`

```ts
import type { Copy } from './types.ts';

export const es: Copy = {
  htmlLang: 'es',
  role: 'Desarrollador backend',
  tagline: 'Node.js, TypeScript y PostgreSQL.',
  aboutTitle: 'Sobre mí',
  about:
    'Construyo backends con Node.js y TypeScript, sobre todo APIs y los datos que pasan por ellas. PostgreSQL guarda esa información, y los archivos van a S3 cuando no deben quedar en el flujo principal. Así trabajé en una startup. Antes de software estudié Comunicación Social, así que documentar y pasar un pedido del negocio a algo claro para construir es parte del trabajo.',
  projectsTitle: 'Proyectos',
  projects: [
    {
      name: 'PlateNote',
      href: 'https://github.com/felipec583/platenote',
      dates: 'Jun 2024 – Ene 2025',
      problem: 'Problema: patentes, listas y turnos de un estacionamiento.',
      built: 'Una API en TypeScript, Express y PostgreSQL.',
      decision: 'Decisión: un cruce entre turnos marca las patentes que no coinciden.',
      pills: ['TypeScript', 'Express', 'PostgreSQL'],
    },
  ],
  experienceTitle: 'Experiencia',
  job: {
    company: 'Fruzty',
    role: 'Desarrollador backend',
    dates: 'Enero 2025 – Octubre 2026',
    facts: [
      'Cron jobs en Node.js sincronizan V1 y V2 por API.',
      'Los archivos van a S3 fuera del flujo principal.',
      'Una cola genera los documentos fuera del request.',
    ],
  },
  stackTitle: 'Stack',
  stack: [
    'TypeScript',
    'JavaScript',
    'SQL',
    'Node.js',
    'Express',
    'PostgreSQL',
    'AWS S3',
    'BullMQ',
    'Redis',
    'Docker',
    'Cursor',
    'Claude',
    'Git',
    'Postman',
  ],
  educationTitle: 'Educación',
  education: [
    'Universidad Mayor — en curso, hasta diciembre 2027',
    'Desafío Latam — certificado Full-Stack',
    'Comunicación Social',
  ],
  nav: [
    { id: 'about', label: 'Sobre mí' },
    { id: 'projects', label: 'Proyectos' },
    { id: 'experience', label: 'Experiencia' },
    { id: 'stack', label: 'Stack' },
    { id: 'education', label: 'Educación' },
  ],
  ariaGithub: 'GitHub',
  ariaLinkedin: 'LinkedIn',
  ariaEmail: 'Correo',
};
```

`src/i18n/en.ts`

```ts
import type { Copy } from './types.ts';

export const en: Copy = {
  htmlLang: 'en',
  role: 'Backend developer',
  tagline: 'Node.js, TypeScript, and PostgreSQL.',
  aboutTitle: 'About',
  about:
    'I build backends with Node.js and TypeScript, mostly APIs and the data that moves through them. PostgreSQL holds that data, and files go to S3 when they should not sit in the main flow. I worked this way at a startup. Before software I studied Social Communication, so writing the documentation and turning a business request into a clear build is part of the job.',
  projectsTitle: 'Projects',
  projects: [
    {
      name: 'PlateNote',
      href: 'https://github.com/felipec583/platenote',
      dates: 'Jun 2024 – Jan 2025',
      problem: 'Problem: parking-lot plates, lists, and shifts.',
      built: 'A TypeScript, Express, and PostgreSQL API.',
      decision: 'Decision: a cross-shift check flags plates that do not match.',
      pills: ['TypeScript', 'Express', 'PostgreSQL'],
    },
  ],
  experienceTitle: 'Experience',
  job: {
    company: 'Fruzty',
    role: 'Backend developer',
    dates: 'Jan 2025 – Oct 2026',
    facts: [
      'Node.js cron jobs sync V1 and V2 through APIs.',
      'Files go to S3 outside the main flow.',
      'A queue handles document generation outside the request.',
    ],
  },
  stackTitle: 'Stack',
  stack: [
    'TypeScript',
    'JavaScript',
    'SQL',
    'Node.js',
    'Express',
    'PostgreSQL',
    'AWS S3',
    'BullMQ',
    'Redis',
    'Docker',
    'Cursor',
    'Claude',
    'Git',
    'Postman',
  ],
  educationTitle: 'Education',
  education: [
    'Universidad Mayor — in progress, through Dec 2027',
    'Desafío Latam — Full-Stack certificate',
    'Social Communication',
  ],
  nav: [
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'stack', label: 'Stack' },
    { id: 'education', label: 'Education' },
  ],
  ariaGithub: 'GitHub',
  ariaLinkedin: 'LinkedIn',
  ariaEmail: 'Email',
};
```

- [ ] **Step 4: Run the test and confirm it passes**

```bash
npm test
```

Expected: PASS, 6 tests.

- [ ] **Step 5: Bug check**

Read `src/i18n/es.ts` and `src/i18n/en.ts`. Do not commit unless every line is true.

- The two `about` strings match Task 2 word for word
- Each file has one project, and the href is `https://github.com/felipec583/platenote`
- Dates are `Enero 2025 – Octubre 2026` and `Jan 2025 – Oct 2026`
- Education is three lines, and the school name is `Desafío`
- The stack lists match, and neither includes NestJS or TypeORM
- The Spanish about is not the English about

If a line fails, edit the file, run `npm test` again, then re-read.

- [ ] **Step 6: Commit**

```bash
git add src/i18n tests/copy.test.ts
git commit -m "$(cat <<'EOF'
Add the Spanish and English copy as data, not as a résumé paste.

The test rejects a second project and the claims that stay off the page.
EOF
)"
```

---

### Task 3: Responsive page in both locales

**Files:**
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\styles\global.css`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\layouts\Base.astro`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\pages\index.astro`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\pages\en\index.astro`
- Delete: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\src\pages\.gitkeep`
- Test: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\tests\layout.test.ts`

**Interfaces:**
- Consumes: `Copy`, `es`, `en` from Task 2. `getRelativeLocaleUrl` from `astro:i18n`.
- Produces: `dist/index.html` (`lang="es"`) and `dist/en/index.html` (`lang="en"`). Stylesheet URLs start with `/portfolio/`.

- [ ] **Step 1: Write the failing test**

`tests/layout.test.ts`

```ts
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
  assert.match(es, /Construyo backends con Node\.js y TypeScript/);
  assert.match(en, /I build backends with Node\.js and TypeScript/);
  assert.equal(es.includes('I build backends'), false);
  assert.equal(en.includes('Construyo backends'), false);
  assert.match(es, /href="https:\/\/github\.com\/felipec583\/platenote"/);
  assert.match(en, /href="https:\/\/github\.com\/felipec583\/platenote"/);
  assert.match(es, /Octubre 2026/);
  assert.match(en, /Oct 2026/);
  assert.match(es, /\/portfolio\/_astro\//);
  assert.match(en, /\/portfolio\/_astro\//);
  assert.match(es, /href="\/portfolio\/en\/?"/);
  assert.match(en, /Educación|Education/);
  assert.match(en, /id="education"/);
  for (const phrase of ['Viña', '+56', 'finance-tracker', 'Kamil', 'Present']) {
    assert.equal(es.includes(phrase), false, phrase);
    assert.equal(en.includes(phrase), false, phrase);
  }
});
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm test
```

Expected: FAIL. `src/styles/global.css` does not exist, or `dist/index.html` does not exist.

- [ ] **Step 3: Write the stylesheet**

`src/styles/global.css`

```css
:root {
  --bg: #0e141b;
  --text: #e7eef6;
  --muted: #9aabbb;
  --faint: #6d7d8e;
  --accent: #8eb6f2;
  --pill: rgba(142, 182, 242, 0.14);
}

* { box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: "Segoe UI", sans-serif;
  line-height: 1.55;
}

a { color: inherit; }

a:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.wrap { width: min(1120px, calc(100% - 48px)); margin: 0 auto; }

.layout { padding: 48px 0 96px; }

.side h1 {
  font-size: clamp(2rem, 4vw, 2.75rem);
  letter-spacing: -0.04em;
  margin: 0 0 8px;
  line-height: 1.05;
}

.role { margin: 0 0 8px; font-size: 1.125rem; }

.tag { margin: 0; max-width: 28ch; color: var(--muted); }

.langs { display: flex; gap: 12px; margin: 24px 0 0; }

.langs a {
  letter-spacing: 0.08em;
  font-size: 0.75rem;
  font-weight: 650;
  color: var(--muted);
  text-decoration: none;
}

.langs a[aria-current="page"] { color: var(--accent); }

.jump { list-style: none; padding: 0; margin: 32px 0 0; }

.jump a {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--muted);
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  font-weight: 650;
  padding: 8px 0;
}

.jump a::before { content: ""; width: 24px; height: 1px; background: var(--faint); }

.jump a:hover { color: var(--accent); }

.jump a:hover::before { width: 48px; background: var(--accent); }

.social { display: flex; gap: 16px; margin: 32px 0 0; }

.social a { color: var(--muted); display: inline-flex; }

.social a:hover { color: var(--accent); }

.social svg { display: block; }

.label {
  margin: 0 0 16px;
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

section { margin-bottom: 64px; }

.card h2, .job h2 { margin: 0 0 8px; font-size: 1.125rem; }

.card h2 a { text-decoration: none; }

.card h2 a:hover { color: var(--accent); }

.meta { color: var(--faint); font-size: 0.85rem; margin: 0 0 12px; }

.card p, .job p, .about p, .education li {
  margin: 0 0 8px;
  color: var(--muted);
  max-width: 62ch;
}

.education { margin: 0; padding: 0; list-style: none; }

.pills { display: flex; flex-wrap: wrap; gap: 8px; margin: 16px 0 0; padding: 0; list-style: none; }

.pills li {
  font-size: 0.75rem;
  color: var(--accent);
  background: var(--pill);
  border-radius: 999px;
  padding: 4px 8px;
}

.card + .card { margin-top: 32px; }

@media (min-width: 1024px) {
  .layout {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    min-height: 100vh;
    padding: 0;
  }

  .side {
    position: sticky;
    top: 0;
    height: 100vh;
    width: 48%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 96px 0;
  }

  .main { width: 52%; padding: 96px 0; }

  .label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
  }

  .social { margin: 0; }
}

@media (max-width: 1023px) {
  .wrap { width: min(100% - 32px, 40rem); }

  .label {
    position: sticky;
    top: 0;
    z-index: 2;
    background: color-mix(in srgb, var(--bg) 86%, transparent);
    backdrop-filter: blur(8px);
    padding: 16px 0;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
  }
}
```

- [ ] **Step 4: Write the layout and the two pages**

`src/layouts/Base.astro`

```astro
---
import '../styles/global.css';
import { getRelativeLocaleUrl } from 'astro:i18n';
import type { Copy } from '../i18n/types.ts';

interface Props {
  copy: Copy;
}

const { copy } = Astro.props;
const esHref = getRelativeLocaleUrl('es');
const enHref = getRelativeLocaleUrl('en');
---

<!doctype html>
<html lang={copy.htmlLang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Felipe Castillo</title>
  </head>
  <body>
    <div class="wrap layout">
      <aside class="side">
        <div>
          <h1>Felipe Castillo</h1>
          <p class="role">{copy.role}</p>
          <p class="tag">{copy.tagline}</p>
          <div class="langs">
            <a href={esHref} aria-current={copy.htmlLang === 'es' ? 'page' : undefined}>ES</a>
            <a href={enHref} aria-current={copy.htmlLang === 'en' ? 'page' : undefined}>EN</a>
          </div>
          <ul class="jump">
            {copy.nav.map((item) => (
              <li><a href={`#${item.id}`}>{item.label}</a></li>
            ))}
          </ul>
        </div>
        <nav class="social" aria-label="Links">
          <a href="https://github.com/felipec583" aria-label={copy.ariaGithub}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12.3c0 5.2 3.4 9.6 8.1 11.2.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.9 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.4-1.3-5.4-6 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C16.6 4.7 17.6 5 17.6 5c.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.4 6 .4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.7-1.6 8.1-6 8.1-11.2A11.5 11.5 0 0 0 12 .5z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/facl" aria-label={copy.ariaLinkedin}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.7 3.3A2.2 2.2 0 1 0 4.7 7.7 2.2 2.2 0 0 0 4.7 3.3zM3 8.8h3.4V21H3V8.8zM9.2 8.8H12.5v1.7h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.2 2.3 4.2 5.3V21H16.7v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V21H9.2V8.8z"/></svg>
          </a>
          <a href="mailto:felipecastillo48@gmail.com" aria-label={copy.ariaEmail}>
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M3 5.5h18a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1zm9 7.2 7.6-5.7H4.4L12 12.7zM4 16.8l4.7-3.5-1.2-1.6L4 14.4v2.4zm16 0v-2.4l-3.5-2.7-1.2 1.6L20 16.8z"/></svg>
          </a>
        </nav>
      </aside>
      <main class="main">
        <section id="about">
          <h2 class="label">{copy.aboutTitle}</h2>
          <div class="about"><p>{copy.about}</p></div>
        </section>
        <section id="projects">
          <h2 class="label">{copy.projectsTitle}</h2>
          {copy.projects.map((project) => (
            <article class="card">
              <p class="meta">{project.dates}</p>
              <h2><a href={project.href}>{project.name}</a></h2>
              <p>{project.problem}</p>
              <p>{project.built}</p>
              <p>{project.decision}</p>
              <ul class="pills">
                {project.pills.map((pill) => <li>{pill}</li>)}
              </ul>
            </article>
          ))}
        </section>
        <section id="experience">
          <h2 class="label">{copy.experienceTitle}</h2>
          <article class="job">
            <p class="meta">{copy.job.dates}</p>
            <h2>{copy.job.role} · {copy.job.company}</h2>
            {copy.job.facts.map((fact) => <p>{fact}</p>)}
          </article>
        </section>
        <section id="stack">
          <h2 class="label">{copy.stackTitle}</h2>
          <ul class="pills">
            {copy.stack.map((item) => <li>{item}</li>)}
          </ul>
        </section>
        <section id="education">
          <h2 class="label">{copy.educationTitle}</h2>
          <ul class="education">
            {copy.education.map((line) => <li>{line}</li>)}
          </ul>
        </section>
      </main>
    </div>
  </body>
</html>
```

`src/pages/index.astro`

```astro
---
import Base from '../layouts/Base.astro';
import { es } from '../i18n/es.ts';
---

<Base copy={es} />
```

`src/pages/en/index.astro`

```astro
---
import Base from '../../layouts/Base.astro';
import { en } from '../../i18n/en.ts';
---

<Base copy={en} />
```

```bash
git rm src/pages/.gitkeep
```

- [ ] **Step 5: Run the tests and confirm they pass**

```bash
npm test
```

Expected: PASS. Copy tests still pass. Layout tests pass. `dist/index.html` and `dist/en/index.html` exist.

- [ ] **Step 6: Bug check in the browser**

```bash
npm run preview
```

`base` is `/portfolio`, so the local URL is `http://localhost:4321/portfolio/`, not the site root. Open that URL and `http://localhost:4321/portfolio/en/`. Check each at desktop width and at 390px. Do not commit unless every line is true.

- Five sections, in order: About, projects, experience, stack, education
- GitHub, LinkedIn, and email are icons. No city. No phone number
- The EN link lands on `/en/`. The ES link on that page returns to `/portfolio/` with no `/es/` prefix
- PlateNote is the only repo link. No Finance Tracker. No live-demo link
- Fruzty says October 2026 on the English page and Octubre 2026 on the Spanish page
- At 390px there is no horizontal scroll. The name scrolls away. The section label sticks. The left column is not fixed
- At desktop width the left column stays on screen

If a line fails, fix it, run `npm test` again, and reload both URLs. Stop the preview server when every line is true.

- [ ] **Step 7: Commit**

```bash
git add src/styles/global.css src/layouts/Base.astro src/pages tests/layout.test.ts
git commit -m "$(cat <<'EOF'
Render the split page in Spanish and English from the same layout.

Phone widths drop the sticky identity column. The language switch is a real URL.
EOF
)"
```

---

### Task 4: Deploy on push, and the note for later edits

**Files:**
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\.github\workflows\deploy.yml`
- Create: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\README.md`
- Modify: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\.gitignore`
- Delete: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\mocks\`
- Test: `C:\Users\Felipe\Desktop\PROJECTS\portfolio\tests\deploy.test.ts`

**Interfaces:**
- Consumes: `npm test` and `npm run build` from Tasks 1–3.
- Produces: a push to `main` that fails the job when tests fail, and deploys `dist/` when they pass. README names the two files a later edit touches.

- [ ] **Step 1: Write the failing test**

`tests/deploy.test.ts`

```ts
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
```

- [ ] **Step 2: Run the test and confirm it fails**

```bash
npm test
```

Expected: FAIL. `.github/workflows/deploy.yml` does not exist.

- [ ] **Step 3: Write the workflow and the README**

`.github/workflows/deploy.yml`

```yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v7
      - name: Node 22.23.4
        uses: actions/setup-node@v7
        with:
          node-version: 22.23.4
          cache: npm
      - name: Test
        run: npm ci && npm test
      - name: Install, build, and upload
        uses: withastro/action@v6
        with:
          node-version: 22.23.4

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

`README.md`

```md
# Felipe Castillo

Spanish: https://felipec583.github.io/portfolio/
English: https://felipec583.github.io/portfolio/en/

Node 22.23.4. `nvm use 22.23.4` on this PC. nvm-windows does not switch from `.nvmrc` by itself.

A push to `main` runs the tests, then deploys. There is no second environment.

To add a project or change a sentence, edit `src/i18n/es.ts` and `src/i18n/en.ts` together, then `npm test`.

To change the palette, edit the `:root` variables in `src/styles/global.css`. Leave the `1024px` and `1023px` blocks unless the layout itself changes.

Finance Tracker is not on the page.
```

- [ ] **Step 4: Run the tests and confirm they pass**

```bash
npm test
```

Expected: PASS, including the copy and layout tests.

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/deploy.yml README.md tests/deploy.test.ts
git commit -m "$(cat <<'EOF'
Deploy from main only after the copy and layout tests pass.

Later content and palette edits use the same push. They do not need a new workflow.
EOF
)"
```

- [ ] **Step 6: Remove the mocks in their own commit**

Do not `git add mocks` in Task 1. A later `git rm` would delete them from the latest commit only. The scaffold commit would still hold the HTML, and the push would upload that history.

```bash
rm -rf mocks
printf '\nmocks/\n' >> .gitignore
git add .gitignore
git commit -m "$(cat <<'EOF'
Remove the design mocks.

The split layout is in the site. These files would only sit unused on the remote.
EOF
)"
git log -- mocks
```

Expected: `git status` does not list `mocks/`. `git log -- mocks` prints nothing. The folder is gone locally and it was never part of a commit.

- [ ] **Step 7: Bug check, then stop**

Do not `git push`. Felipe pushes. Do not start that handoff unless every line is true.

- `npm test` passes
- `git status` is clean
- `mocks/` is gone from disk
- `git log -- mocks` prints nothing
- `.github/workflows/deploy.yml` sets `node-version: 22.23.4`, runs `npm test`, and that step is above `withastro/action@v6`

Hand Felipe these commands and stop:

```bash
gh api --method POST /repos/felipec583/portfolio/pages -f build_type=workflow
git push -u origin main
```

The POST returns 201, or 409 when Pages is already set to a workflow. After the push, the Actions run is the deploy. `deploy-pages@v5` uses GitHub’s Node 24 for that step only. The build log must show Node 22.23.4. Then open `https://felipec583.github.io/portfolio/` and `https://felipec583.github.io/portfolio/en/` at desktop width and at 390px. Do not upload a `dist/` folder by hand.
