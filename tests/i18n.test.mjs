import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { LOCALES } from '../src/lib/i18n.mjs';
import { parseFrontMatter } from '../src/lib/markdown.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (file) => JSON.parse(await readFile(path.join(ROOT, file), 'utf8'));

// Flattens nested objects and arrays into { "a.b.0.c": "value" }.
function flatten(node, prefix = '', out = {}) {
  if (typeof node === 'string') {
    out[prefix] = node;
  } else if (Array.isArray(node)) {
    node.forEach((child, i) => flatten(child, `${prefix}.${i}`, out));
  } else if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node)) flatten(child, prefix ? `${prefix}.${key}` : key, out);
  } else {
    out[prefix] = node;
  }
  return out;
}

const placeholders = (value) => [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).filter((n) => n !== 'em').sort();
const tokens = (value) => [...value.matchAll(/\{\{(\w+)\}\}/g)].map((m) => m[1]).sort();

const english = flatten(await readJson('src/locales/en.json'));

for (const locale of LOCALES) {
  test(`${locale.code}: strings file exists and matches English`, async () => {
    const file = `src/locales/${locale.code}.json`;
    assert.ok(existsSync(path.join(ROOT, file)), `${file} is missing`);
    const strings = flatten(await readJson(file));

    assert.deepEqual(Object.keys(strings).sort(), Object.keys(english).sort(), 'keys differ from en.json');
    for (const [key, value] of Object.entries(strings)) {
      assert.equal(typeof value, 'string', `${key} is not a string`);
      assert.ok(value.trim(), `${key} is empty`);
      assert.deepEqual(placeholders(value), placeholders(english[key]), `${key}: placeholders differ from English`);
      const opens = (value.match(/\{em\}/g) ?? []).length;
      const closes = (value.match(/\{\/em\}/g) ?? []).length;
      assert.equal(opens, closes, `${key}: unbalanced {em}`);
      assert.ok(opens <= 1, `${key}: at most one {em} highlight`);
    }
  });

  test(`${locale.code}: legal pages exist and keep their tokens`, async () => {
    for (const doc of ['privacy', 'terms', 'disclaimer']) {
      const file = path.join(ROOT, 'src/content/legal', locale.code, `${doc}.md`);
      assert.ok(existsSync(file), `${path.relative(ROOT, file)} is missing`);
      const source = await readFile(file, 'utf8');
      const en = await readFile(path.join(ROOT, 'src/content/legal/en', `${doc}.md`), 'utf8');
      const { data } = parseFrontMatter(source);
      assert.ok(data.title, `${doc}: missing title`);
      assert.equal(data.updated, parseFrontMatter(en).data.updated, `${doc}: "updated" should match English`);
      assert.deepEqual(tokens(source), tokens(en), `${doc}: {{tokens}} differ from English`);
      assert.equal((source.match(/^## /gm) ?? []).length, (en.match(/^## /gm) ?? []).length, `${doc}: section count differs`);
    }
  });
}

test('translated articles match an English article', async () => {
  const dir = path.join(ROOT, 'src/content/articles');
  const englishSlugs = (await readdir(path.join(dir, 'en'))).filter((f) => f.endsWith('.md'));
  for (const locale of LOCALES.filter((l) => l.code !== 'en')) {
    const localeDir = path.join(dir, locale.code);
    if (!existsSync(localeDir)) continue;
    for (const file of (await readdir(localeDir)).filter((f) => f.endsWith('.md'))) {
      assert.ok(englishSlugs.includes(file), `${locale.code}/${file} has no English original`);
    }
  }
});
