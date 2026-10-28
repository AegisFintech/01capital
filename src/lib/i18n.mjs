import { escapeHtml, raw, renderValue } from './html.mjs';

// `lang` goes into <html lang> and hreflang; `prefix` is the URL folder;
// `colon` and `parens` are the punctuation each language uses in titles and labels.
export const LOCALES = [
  { code: 'en', lang: 'en', prefix: '', label: 'English', short: 'EN', ogLocale: 'en_US', colon: ': ', parens: [' (', ')'] },
  { code: 'zh-Hant', lang: 'zh-Hant', prefix: 'zh', label: '繁體中文', short: '繁中', ogLocale: 'zh_TW', colon: '：', parens: ['（', '）'] },
  { code: 'ko', lang: 'ko', prefix: 'ko', label: '한국어', short: '한국어', ogLocale: 'ko_KR', colon: ': ', parens: [' (', ')'] },
  { code: 'ja', lang: 'ja', prefix: 'ja', label: '日本語', short: '日本語', ogLocale: 'ja_JP', colon: '：', parens: ['（', '）'] },
];

export const DEFAULT_LOCALE = LOCALES[0];

export function localePath(locale, path = '') {
  const prefix = locale.prefix ? `/${locale.prefix}/` : '/';
  return `${prefix}${path}`.replace(/\/{2,}/g, '/');
}

export function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages);
}

// Strings may contain {em}…{/em} for emphasis and {name} placeholders.
export function createTranslator(messages, localeCode) {
  const get = (key) => {
    const value = lookup(messages, key);
    if (value === undefined) throw new Error(`[${localeCode}] Missing string "${key}"`);
    return value;
  };

  const t = (key, vars = {}) => {
    const value = get(key);
    if (typeof value !== 'string') throw new Error(`[${localeCode}] "${key}" is not a string`);
    return raw(formatHtml(value, vars));
  };

  const plain = (key, vars = {}) => {
    const value = get(key);
    if (typeof value !== 'string') throw new Error(`[${localeCode}] "${key}" is not a string`);
    return formatPlain(value, vars);
  };

  return { t, plain, get };
}

export function formatHtml(value, vars = {}) {
  return escapeHtml(value)
    .replace(/\{em\}/g, '<em>')
    .replace(/\{\/em\}/g, '</em>')
    .replace(/\{(\w+)\}/g, (match, name) => (name in vars ? renderValue(vars[name]) : match));
}

export function formatPlain(value, vars = {}) {
  return value
    .replace(/\{\/?em\}/g, '')
    .replace(/\{(\w+)\}/g, (match, name) => (name in vars ? String(vars[name]) : match));
}
