import { html } from '../lib/html.mjs';
import { icons } from './icons.mjs';

export const PILLARS = ['fintech', 'blockchain', 'ai'];

export const pad = (n) => String(n).padStart(2, '0');

export function button(href, label, variant = 'primary', extra = '') {
  return html`<a class="btn btn-${variant}${extra ? ` ${extra}` : ''}" href="${href}">${label}${variant === 'primary' ? icons.arrow() : ''}</a>`;
}

export function sectionHead({ eyebrow, title, lead, id, align = 'left' }) {
  return html`<header class="section-head section-head--${align}">
      ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
      <h2 class="h2"${id ? html` id="${id}"` : ''}>${title}</h2>
      ${lead ? html`<p class="lead">${lead}</p>` : ''}
    </header>`;
}

export function pageHero({ eyebrow, title, lead, actions = '', variant = '' }) {
  return html`<section class="page-hero${variant ? ` page-hero--${variant}` : ''}">
  <div class="page-hero-bg" aria-hidden="true"></div>
  <div class="container">
    ${eyebrow ? html`<p class="eyebrow">${eyebrow}</p>` : ''}
    <h1 class="display">${title}</h1>
    ${lead ? html`<p class="lead lead--lg">${lead}</p>` : ''}
    ${actions ? html`<div class="actions">${actions}</div>` : ''}
  </div>
</section>`;
}

export function pillarCard(ctx, pillar, index) {
  const { t, url } = ctx;
  return html`<a class="pillar-card" href="${url(`invest/${pillar}/`)}" data-reveal>
      <span class="pillar-card-top">
        <span class="pillar-icon">${icons[pillar]()}</span>
        <span class="pillar-index">${pad(index + 1)}</span>
      </span>
      <span class="pillar-name">${t(`pillars.${pillar}.name`)}</span>
      <span class="pillar-tagline">${t(`pillars.${pillar}.tagline`)}</span>
      <span class="pillar-summary">${t(`pillars.${pillar}.summary`)}</span>
      <span class="link-arrow">${t('common.explore')}${icons.arrow()}</span>
    </a>`;
}

export function criteriaList(ctx) {
  const items = ctx.get('criteria.items');
  return html`<ol class="criteria">
      ${items.map(
        (item, i) => html`<li class="criteria-item" data-reveal>
        <span class="criteria-num">${pad(i + 1)}</span>
        <h3 class="criteria-title">${item.title}</h3>
        <p class="criteria-text">${item.text}</p>
      </li>`,
      )}
    </ol>`;
}

export function logoGrid(ctx, companies, { limit, filterable = false } = {}) {
  const shown = limit ? companies.slice(0, limit) : companies;
  return html`<ul class="logo-grid" data-logo-grid>
      ${shown.map((company) => logoCell(ctx, company, filterable))}
    </ul>`;
}

function logoCell(ctx, company, filterable) {
  const { plain } = ctx;
  const img = html`<img src="${company.logoUrl}" alt="${company.name}" width="${company.logoWidth}" height="${company.logoHeight}" loading="lazy" decoding="async">`;
  const pillarAttr = filterable && company.pillar ? html` data-pillar="${company.pillar}"` : '';
  if (!company.url) {
    return html`<li class="logo-cell"${pillarAttr}><span class="logo-link">${img}<span class="logo-name">${company.name}</span></span></li>`;
  }
  const label = `${plain('ecosystem.visit', { name: company.name })} (${plain('a11y.newTab')})`;
  return html`<li class="logo-cell"${pillarAttr}><a class="logo-link" href="${company.url}" target="_blank" rel="noopener" aria-label="${label}">${img}<span class="logo-name">${company.name}${icons.external()}</span></a></li>`;
}

export function articleCard(ctx, article) {
  const { t, plain } = ctx;
  const pillar = article.pillar !== 'none' ? article.pillar : null;
  const badge = article.locale !== ctx.locale.code ? html`<span class="tag tag--muted">${t('insights.englishBadge')}</span>` : '';
  return html`<article class="article-card" data-reveal data-pillar="${pillar ?? 'none'}" data-type="${article.type}">
      <a class="article-card-link" href="${article.url}"${article.locale !== ctx.locale.code ? html` hreflang="${article.locale}"` : ''}>
        <span class="article-card-meta">
          ${pillar ? html`<span class="tag">${t(`pillars.${pillar}.name`)}</span>` : ''}
          <span class="tag tag--muted">${t(`insights.types.${article.type}`)}</span>
          ${badge}
        </span>
        <h3 class="article-card-title" lang="${article.locale}">${article.title}</h3>
        <p class="article-card-text" lang="${article.locale}">${article.description}</p>
        <span class="article-card-foot">
          <span>${plain('insights.minRead', { minutes: article.minutes })}</span>
          <span class="link-arrow" aria-hidden="true">${icons.arrow()}</span>
        </span>
      </a>
    </article>`;
}

export function ctaBand(ctx, { title, text, button: label, href } = {}) {
  const { t, url } = ctx;
  return html`<section class="cta-band">
  <div class="container">
    <div class="cta-inner" data-reveal>
      <div class="cta-copy">
        <h2 class="h2">${title ?? t('cta.title')}</h2>
        <p class="lead">${text ?? t('cta.text')}</p>
      </div>
      ${button(href ?? url('founders/'), label ?? t('cta.button'), 'primary', 'btn-lg')}
    </div>
  </div>
</section>`;
}

export function formatDate(locale, isoDate) {
  return new Intl.DateTimeFormat(locale.lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${isoDate}T00:00:00Z`));
}
