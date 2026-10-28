#!/usr/bin/env node
// Builds the static site into dist/. No dependencies: run with `node build.mjs`.
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { DEFAULT_LOCALE, LOCALES, createTranslator, localePath } from './src/lib/i18n.mjs';
import { countWords, parseFrontMatter, renderMarkdown } from './src/lib/markdown.mjs';
import { escapeHtml } from './src/lib/html.mjs';
import { layout } from './src/templates/layout.mjs';
import { PILLARS } from './src/templates/components.mjs';
import * as pages from './src/templates/pages.mjs';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(ROOT, 'src');

const ARTICLE_TYPES = ['house-view', 'thesis', 'founder-guide'];
const ARTICLE_PILLARS = [...PILLARS, 'none'];
const LEGAL_DOCS = ['privacy', 'terms', 'disclaimer'];
const LEGACY_REDIRECTS = [
  ['/index-CN.html', '/zh/'],
  ['/index-KR.html', '/ko/'],
];

export async function build({ outDir = path.join(ROOT, 'dist'), log = console.log } = {}) {
  const site = await loadSite();
  const portfolio = await readJson(path.join(ROOT, 'portfolio.json'));
  const messages = await loadMessages();
  const locales = LOCALES.filter((loc) => messages[loc.code]);
  const missingLocales = LOCALES.filter((loc) => !messages[loc.code]).map((loc) => loc.code);
  if (missingLocales.length) log(`! Skipping locales with no strings file: ${missingLocales.join(', ')}`);

  const companies = await loadCompanies(portfolio);
  const articles = await loadArticles(locales);
  const assets = await assetUrls();
  const year = new Date().getUTCFullYear();

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });
  await cp(path.join(SRC, 'assets'), path.join(outDir, 'assets'), { recursive: true });
  await cp(path.join(SRC, 'assets/img/favicon.ico'), path.join(outDir, 'favicon.ico'));

  const written = [];
  const sitemap = [];

  for (const locale of locales) {
    const translator = createTranslator(messages[locale.code], locale.code);
    const localeArticles = articlesFor(locale, articles);
    const ctx = {
      ...translator,
      locale,
      locales,
      site,
      companies,
      articles: localeArticles,
      assets,
      year,
      url: (p = '') => localePath(locale, p),
      urlFor: (loc, p = '') => localePath(loc, p),
      localized: (value) => localized(value, locale),
    };

    const routes = [
      pages.homePage(ctx),
      pages.investPage(ctx),
      ...PILLARS.map((p) => pages.pillarPage(ctx, p)),
      pages.incubationPage(ctx),
      pages.ecosystemPage(ctx),
      pages.insightsPage(ctx),
      pages.foundersPage(ctx),
      pages.aboutPage(ctx),
      pages.contactPage(ctx),
      ...(await loadLegal(locale, site)).map((doc) => pages.legalPage(ctx, doc)),
    ];

    for (const article of localeArticles.filter((a) => a.locale === locale.code)) {
      const page = pages.articlePage(ctx, article);
      const translations = locales.filter((loc) => articles[loc.code]?.some((a) => a.slug === article.slug));
      page.locales = translations;
      page.languageLinks = Object.fromEntries(
        locales.map((loc) => [loc.code, translations.includes(loc) ? localePath(loc, page.path) : localePath(loc, 'insights/')]),
      );
      routes.push(page);
    }

    for (const page of routes) {
      const file = path.join(outDir, locale.prefix, page.path, 'index.html');
      await writePage(file, layout(ctx, page));
      written.push(path.relative(outDir, file));
      sitemap.push({ path: page.path, locale, locales: page.locales ?? locales });
    }

    if (locale.code === DEFAULT_LOCALE.code) {
      const page = pages.notFoundPage(ctx);
      page.locales = [locale];
      page.languageLinks = Object.fromEntries(locales.map((loc) => [loc.code, localePath(loc, '')]));
      await writePage(path.join(outDir, '404.html'), layout(ctx, page));
      written.push('404.html');
    }
  }

  await writeFile(path.join(outDir, 'sitemap.xml'), sitemapXml(site, sitemap));
  await writeFile(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.siteUrl}/sitemap.xml\n`);
  await writeFile(path.join(outDir, '_redirects'), LEGACY_REDIRECTS.map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');
  await writeFile(path.join(outDir, '_headers'), HEADERS);
  for (const [from, to] of LEGACY_REDIRECTS) {
    await writeFile(path.join(outDir, from.slice(1)), redirectStub(site.siteUrl + to));
  }

  log(`✓ Built ${written.length} pages in ${locales.length} languages → ${path.relative(ROOT, outDir) || '.'}`);
  return { pages: written, locales: locales.map((l) => l.code), articles };
}

async function loadMessages() {
  const messages = {};
  for (const locale of LOCALES) {
    const file = path.join(SRC, 'locales', `${locale.code}.json`);
    if (existsSync(file)) messages[locale.code] = await readJson(file);
  }
  if (!messages[DEFAULT_LOCALE.code]) throw new Error('src/locales/en.json is required');
  return messages;
}

async function loadCompanies(portfolio) {
  const ids = new Set();
  return Promise.all(
    portfolio.companies.map(async (company) => {
      if (ids.has(company.id)) throw new Error(`portfolio.json: duplicate id "${company.id}"`);
      ids.add(company.id);
      if (company.category && !portfolio.categories.includes(company.category)) {
        throw new Error(`portfolio.json: "${company.id}" has unknown category "${company.category}"`);
      }
      if (company.pillar && !portfolio.pillars.includes(company.pillar)) {
        throw new Error(`portfolio.json: "${company.id}" has unknown pillar "${company.pillar}"`);
      }
      if (company.url && !/^https:\/\//.test(company.url)) {
        throw new Error(`portfolio.json: "${company.id}" url must start with https://`);
      }
      const logoFile = path.join(ROOT, company.logo);
      const { width, height } = pngSize(await readFile(logoFile));
      return {
        ...company,
        logoUrl: '/' + path.relative(SRC, logoFile).split(path.sep).join('/'),
        logoWidth: width,
        logoHeight: height,
      };
    }),
  );
}

async function loadArticles(locales) {
  const byLocale = {};
  for (const locale of locales) {
    const dir = path.join(SRC, 'content/articles', locale.code);
    if (!existsSync(dir)) continue;
    const files = (await readdir(dir)).filter((f) => f.endsWith('.md')).sort();
    byLocale[locale.code] = await Promise.all(
      files.map(async (file) => {
        const { data, body } = parseFrontMatter(await readFile(path.join(dir, file), 'utf8'));
        const slug = file.replace(/\.md$/, '');
        for (const key of ['title', 'description', 'date', 'pillar', 'type', 'author']) {
          if (!data[key]) throw new Error(`${locale.code}/${file}: missing "${key}" in front matter`);
        }
        if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) throw new Error(`${locale.code}/${file}: date must be YYYY-MM-DD`);
        if (!ARTICLE_PILLARS.includes(data.pillar)) throw new Error(`${locale.code}/${file}: unknown pillar "${data.pillar}"`);
        if (!ARTICLE_TYPES.includes(data.type)) throw new Error(`${locale.code}/${file}: unknown type "${data.type}"`);
        const minutes = Math.max(1, Math.round(countWords(body) / (locale.code === 'en' ? 230 : 450)));
        return {
          ...data,
          slug,
          locale: locale.code,
          url: localePath(locale, `insights/${slug}/`),
          minutes,
          html: renderMarkdown(body),
        };
      }),
    );
  }
  return byLocale;
}

// Articles in the page's language, plus English ones that haven't been translated yet.
function articlesFor(locale, articles) {
  const own = articles[locale.code] ?? [];
  const fallback = locale.code === DEFAULT_LOCALE.code ? [] : (articles[DEFAULT_LOCALE.code] ?? []).filter((a) => !own.some((o) => o.slug === a.slug));
  return [...own, ...fallback].sort(
    (a, b) => b.date.localeCompare(a.date) || ARTICLE_TYPES.indexOf(a.type) - ARTICLE_TYPES.indexOf(b.type) || a.title.localeCompare(b.title),
  );
}

async function loadSite() {
  const site = await readJson(path.join(SRC, 'data/site.json'));
  site.team = (site.team ?? []).map((person) => ({
    ...person,
    photoUrl: person.photo ? '/' + path.relative(SRC, path.join(ROOT, person.photo)).split(path.sep).join('/') : '',
  }));
  return site;
}

async function loadLegal(locale, site) {
  const tokens = { legalName: site.company.legalName, email: site.contact.general };
  return Promise.all(
    LEGAL_DOCS.map(async (slug) => {
      let file = path.join(SRC, 'content/legal', locale.code, `${slug}.md`);
      if (!existsSync(file)) file = path.join(SRC, 'content/legal', DEFAULT_LOCALE.code, `${slug}.md`);
      const source = (await readFile(file, 'utf8')).replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (!(key in tokens)) throw new Error(`${file}: unknown token ${match}`);
        return tokens[key];
      });
      const { data, body } = parseFrontMatter(source);
      return { slug, title: data.title, updated: data.updated, html: renderMarkdown(body) };
    }),
  );
}

async function assetUrls() {
  const version = async (rel) => {
    const hash = createHash('sha256').update(await readFile(path.join(SRC, rel))).digest('hex').slice(0, 10);
    return `/${rel}?v=${hash}`;
  };
  return { css: await version('assets/css/site.css'), js: await version('assets/js/site.js') };
}

function localized(value, locale) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale.code] || value[DEFAULT_LOCALE.code] || '';
}

function pngSize(buffer) {
  if (buffer.toString('ascii', 1, 4) !== 'PNG') throw new Error('Logos must be PNG files');
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function writePage(file, page) {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, String(page));
}

function sitemapXml(site, entries) {
  const urls = entries.map(({ path: p, locale, locales }) => {
    const alternates = locales.length > 1
      ? locales.map((loc) => `\n    <xhtml:link rel="alternate" hreflang="${loc.lang}" href="${escapeHtml(site.siteUrl + localePath(loc, p))}"/>`).join('')
      : '';
    return `  <url>\n    <loc>${escapeHtml(site.siteUrl + localePath(locale, p))}</loc>${alternates}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
}

function redirectStub(target) {
  const href = escapeHtml(target);
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="robots" content="noindex">\n<meta http-equiv="refresh" content="0; url=${href}">\n<link rel="canonical" href="${href}">\n<title>01 Capital</title>\n</head>\n<body>\n<p><a href="${href}">01 Capital</a></p>\n</body>\n</html>\n`;
}

const HEADERS = `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  X-Frame-Options: DENY

/assets/*
  Cache-Control: public, max-age=604800
`;

async function readJson(file) {
  return JSON.parse(await readFile(file, 'utf8'));
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  build().catch((error) => {
    console.error(`✗ ${error.message}`);
    process.exitCode = 1;
  });
}
