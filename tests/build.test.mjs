import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, readdir, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from '../build.mjs';
import { LOCALES, localePath } from '../src/lib/i18n.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ROUTES = [
  '',
  'invest/',
  'invest/fintech/',
  'invest/blockchain/',
  'invest/ai/',
  'incubation/',
  'ecosystem/',
  'insights/',
  'founders/',
  'about/',
  'contact/',
  'legal/privacy/',
  'legal/terms/',
  'legal/disclaimer/',
];
// Wording from the old site's market-making and asset-management services.
const BANNED = [/market[- ]making/i, /market capitali[sz]ation/i, /price stability/i, /custody solutions/i, /secondary market trading/i];

let out;
let result;
let htmlFiles;

before(async () => {
  out = await mkdtemp(path.join(os.tmpdir(), '01cap-build-'));
  result = await build({ outDir: out, log: () => {} });
  htmlFiles = (await walk(out)).filter((f) => f.endsWith('.html'));
});

after(async () => {
  await rm(out, { recursive: true, force: true });
});

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));
  return files.flat();
}

const read = (rel) => readFile(path.join(out, rel), 'utf8');
const pageFile = (locale, route) => path.join(locale.prefix, route, 'index.html');

test('builds every language', () => {
  assert.deepEqual(result.locales, LOCALES.map((l) => l.code));
});

test('every route exists in every language with the right lang attribute', async () => {
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const html = await read(pageFile(locale, route));
      assert.match(html, new RegExp(`<html lang="${locale.lang}">`), `${locale.code} /${route}`);
    }
  }
});

test('regular pages link every language version with hreflang', async () => {
  for (const locale of LOCALES) {
    const html = await read(pageFile(locale, 'invest/'));
    for (const other of LOCALES) {
      assert.ok(html.includes(`hreflang="${other.lang}" href="https://www.01.capital${localePath(other, 'invest/')}"`), `${locale.code} → ${other.code}`);
    }
    assert.ok(html.includes('hreflang="x-default" href="https://www.01.capital/invest/"'));
  }
});

test('every article has a page and a disclaimer', async () => {
  const articles = result.articles.en;
  assert.ok(articles.length >= 4, 'expected the launch articles');
  for (const article of articles) {
    const html = await read(path.join('insights', article.slug, 'index.html'));
    assert.match(html, /class="disclaimer-box"/);
    assert.ok(html.includes(`<h1 class="display display--article">`));
  }
});

test('internal links and assets resolve', async () => {
  const broken = new Set();
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    for (const [, url] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
      const target = path.join(out, decodeURIComponent(url));
      const exists = url.endsWith('/') ? existsSync(path.join(target, 'index.html')) : existsSync(target);
      if (!exists) broken.add(`${path.relative(out, file)} → ${url}`);
    }
  }
  assert.deepEqual([...broken], []);
});

test('pages are free of template leftovers, empty alt text and retired services', async () => {
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
    const rel = path.relative(out, file);
    assert.doesNotMatch(text, /\{\/?em\}|\{\{\w+\}\}|\{(author|minutes|name|email|privacy|link|year|legalName|date)\}/, `${rel}: unreplaced placeholder`);
    assert.doesNotMatch(text, /undefined|\[object Object\]/, `${rel}: template bug`);
    for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
      assert.match(img, /alt="[^"]+"/, `${rel}: image without alt text: ${img}`);
    }
    for (const pattern of BANNED) assert.doesNotMatch(text, pattern, `${rel}: mentions ${pattern}`);
    assert.doesNotMatch(html, /contextmenu/, `${rel}: blocks right-click`);
  }
});

test('every page has one h1, a title and a description', async () => {
  for (const file of htmlFiles) {
    const html = await readFile(file, 'utf8');
    if (/http-equiv="refresh"/.test(html)) continue;
    const rel = path.relative(out, file);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, `${rel}: needs exactly one h1`);
    assert.match(html, /<title>[^<]+<\/title>/, `${rel}: missing title`);
    assert.match(html, /<meta name="description" content="[^"]+">/, `${rel}: missing description`);
  }
});

test('the deck form posts to the function with the right fields', async () => {
  const html = await read('founders/index.html');
  assert.match(html, /<form class="deck-form" action="\/api\/submit-deck" method="post"/);
  for (const name of ['name', 'email', 'company', 'website', 'lookingFor', 'pillar', 'stage', 'raiseUsd', 'country', 'oneLiner', 'deckUrl', 'source', 'consent', 'language', 'fax']) {
    assert.ok(html.includes(`name="${name}"`), `missing field ${name}`);
  }
});

test('old page addresses redirect to the new language pages', async () => {
  const redirects = await read('_redirects');
  assert.match(redirects, /^\/index-CN\.html \/zh\/ 301$/m);
  assert.match(redirects, /^\/index-KR\.html \/ko\/ 301$/m);
  assert.match(await read('index-CN.html'), /url=https:\/\/www\.01\.capital\/zh\//);
});

test('the sitemap lists every page', async () => {
  const sitemap = await read('sitemap.xml');
  const count = (sitemap.match(/<loc>/g) ?? []).length;
  assert.equal(count, result.pages.filter((p) => p !== '404.html').length);
  assert.doesNotMatch(sitemap, /404/);
});

test('the committed dist/ folder matches a fresh build', async () => {
  const committed = path.join(ROOT, 'dist');
  assert.ok(existsSync(committed), 'dist/ is missing: run npm run build');
  const fresh = (await walk(out)).map((f) => path.relative(out, f)).sort();
  const current = (await walk(committed)).map((f) => path.relative(committed, f)).sort();
  assert.deepEqual(current, fresh, 'dist/ files differ: run npm run build');
  for (const rel of fresh) {
    const [a, b] = await Promise.all([readFile(path.join(out, rel)), readFile(path.join(committed, rel))]);
    if ((await stat(path.join(out, rel))).size !== b.length || !a.equals(b)) assert.fail(`dist/${rel} is out of date: run npm run build`);
  }
});
