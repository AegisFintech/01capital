import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parseFrontMatter, renderMarkdown, slugify } from '../src/lib/markdown.mjs';

test('parses front matter, including quoted values with colons', () => {
  const { data, body } = parseFrontMatter('---\ntitle: "Tokens: a guide"\ndate: 2026-10-28\n---\n\nHello');
  assert.deepEqual(data, { title: 'Tokens: a guide', date: '2026-10-28' });
  assert.equal(body.trim(), 'Hello');
});

test('returns the whole source when there is no front matter', () => {
  assert.deepEqual(parseFrontMatter('Just text'), { data: {}, body: 'Just text' });
});

test('rejects malformed front matter lines', () => {
  assert.throws(() => parseFrontMatter('---\nnot a pair\n---\n'), /Invalid front matter/);
});

test('renders headings, paragraphs, lists and quotes', () => {
  const html = renderMarkdown('## Why now\n\nFirst line\ncontinues here.\n\n- one\n- two\n\n1. first\n2. second\n\n> A pull quote.');
  assert.equal(
    html,
    [
      '<h2 id="why-now">Why now</h2>',
      '<p>First line continues here.</p>',
      '<ul><li>one</li><li>two</li></ul>',
      '<ol><li>first</li><li>second</li></ol>',
      '<blockquote><p>A pull quote.</p></blockquote>',
    ].join('\n'),
  );
});

test('turns a stray H1 into an H2', () => {
  assert.match(renderMarkdown('# Title'), /^<h2 id="title">Title<\/h2>$/);
});

test('renders bold, italic and safe links, and escapes HTML', () => {
  const html = renderMarkdown('**Bold** and *italic* <script>x</script> [site](https://example.com) [bad](javascript:alert(1))');
  assert.match(html, /<strong>Bold<\/strong>/);
  assert.match(html, /<em>italic<\/em>/);
  assert.match(html, /&lt;script&gt;/);
  assert.match(html, /<a href="https:\/\/example.com">site<\/a>/);
  assert.doesNotMatch(html, /href="javascript/);
});

test('leaves lone asterisks alone', () => {
  assert.equal(renderMarkdown('2 * 3 * 4'), '<p>2 * 3 * 4</p>');
});

test('slugifies Latin and CJK headings', () => {
  assert.equal(slugify('What we look for'), 'what-we-look-for');
  assert.equal(slugify('我們收集的資料'), '我們收集的資料');
});
