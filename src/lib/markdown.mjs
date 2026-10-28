import { escapeHtml } from './html.mjs';

// Parses a front matter block of `key: value` lines between `---` fences.
export function parseFrontMatter(source) {
  const text = source.replace(/\r\n/g, '\n');
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);
  if (!match) return { data: {}, body: text };

  const data = {};
  for (const line of match[1].split('\n')) {
    if (!line.trim()) continue;
    const colon = line.indexOf(':');
    if (colon === -1) throw new Error(`Invalid front matter line: "${line}"`);
    const key = line.slice(0, colon).trim();
    let value = line.slice(colon + 1).trim();
    if (value.length >= 2 && /^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    data[key] = value;
  }
  return { data, body: text.slice(match[0].length) };
}

// Renders the Markdown subset used for articles and legal pages:
// ## and ### headings, paragraphs, - and 1. lists, > quotes,
// **bold**, *italic* and [links](https://…).
export function renderMarkdown(source) {
  const out = [];
  let paragraph = [];
  let list = null;
  let quote = [];

  const flushParagraph = () => {
    if (paragraph.length) out.push(`<p>${inline(paragraph.join(' '))}</p>`);
    paragraph = [];
  };
  const flushList = () => {
    if (list) {
      const items = list.items.map((item) => `<li>${inline(item)}</li>`).join('');
      out.push(`<${list.type}>${items}</${list.type}>`);
    }
    list = null;
  };
  const flushQuote = () => {
    if (quote.length) out.push(`<blockquote><p>${inline(quote.join(' '))}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };
  const addListItem = (type, text) => {
    flushParagraph();
    flushQuote();
    if (!list || list.type !== type) {
      flushList();
      list = { type, items: [] };
    }
    list.items.push(text);
  };

  for (const rawLine of source.replace(/\r\n/g, '\n').split('\n')) {
    const line = rawLine.trim();
    let match;
    if (!line) {
      flushAll();
    } else if ((match = /^(#{1,3})\s+(.*)$/.exec(line))) {
      flushAll();
      // A stray H1 becomes an H2: the page title is the only H1.
      const level = Math.max(2, match[1].length);
      out.push(`<h${level} id="${slugify(match[2])}">${inline(match[2])}</h${level}>`);
    } else if ((match = /^[-*]\s+(.*)$/.exec(line))) {
      addListItem('ul', match[1]);
    } else if ((match = /^\d+[.)]\s+(.*)$/.exec(line))) {
      addListItem('ol', match[1]);
    } else if ((match = /^>\s?(.*)$/.exec(line))) {
      flushParagraph();
      flushList();
      quote.push(match[1]);
    } else {
      flushList();
      flushQuote();
      paragraph.push(line);
    }
  }
  flushAll();
  return out.join('\n');
}

export function inline(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*\s][^*]*?)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (match, label, href) =>
      /^(https?:\/\/|mailto:|\/)/.test(href) ? `<a href="${href}">${label}</a>` : match,
    );
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .replace(/[*_`]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '');
}

export function countWords(markdown) {
  return markdown.replace(/[#>*_\-\d.]+/g, ' ').split(/\s+/).filter(Boolean).length;
}
