import { html, raw } from '../lib/html.mjs';
import { icons } from './icons.mjs';
import {
  PILLARS,
  articleCard,
  button,
  criteriaList,
  ctaBand,
  formatDate,
  logoGrid,
  pad,
  pageHero,
  pillarCard,
  sectionHead,
} from './components.mjs';

export function homePage(ctx) {
  const { t, plain, url, site } = ctx;
  const latest = ctx.articles.slice(0, 3);
  const body = html`<section class="hero">
  <div class="hero-bg" aria-hidden="true">
    <div class="hero-glow"></div>
    <div class="hero-grid"></div>
    <span class="hero-mark">01</span>
  </div>
  <div class="container hero-inner">
    <p class="eyebrow">${t('home.hero.eyebrow')}</p>
    <h1 class="display display--hero">${t('home.hero.title')}</h1>
    <p class="lead lead--lg">${t('home.hero.lead')}</p>
    <div class="actions">
      ${button(url('founders/'), t('home.hero.primary'), 'primary', 'btn-lg')}
      ${button(url('invest/'), t('home.hero.secondary'), 'ghost', 'btn-lg')}
    </div>
    <ul class="hero-pillars" aria-label="${plain('home.pillars.eyebrow')}">
      ${PILLARS.map((p, i) => html`<li><a href="${url(`invest/${p}/`)}"><span>${pad(i + 1)}</span>${t(`pillars.${p}.name`)}</a></li>`)}
    </ul>
  </div>
</section>

<section class="section" id="pillars">
  <div class="container">
    ${sectionHead({ eyebrow: t('home.pillars.eyebrow'), title: t('home.pillars.title'), lead: t('home.pillars.lead') })}
    <div class="pillar-grid">${PILLARS.map((p, i) => pillarCard(ctx, p, i))}</div>
  </div>
</section>

<section class="section section--panel">
  <div class="container split">
    ${sectionHead({ eyebrow: t('home.model.eyebrow'), title: t('home.model.title'), lead: t('home.model.lead') })}
    <div class="model-grid">
      <article class="model-card" data-reveal>
        <span class="model-index">01</span>
        <h3 class="h3">${t('home.model.investTitle')}</h3>
        <p>${t('home.model.investText')}</p>
        <a class="link-arrow" href="${url('invest/')}">${t('home.model.investLink')}${icons.arrow()}</a>
      </article>
      <article class="model-card" data-reveal>
        <span class="model-index">02</span>
        <h3 class="h3">${t('home.model.incubateTitle')}</h3>
        <p>${t('home.model.incubateText')}</p>
        <a class="link-arrow" href="${url('incubation/')}">${t('home.model.incubateLink')}${icons.arrow()}</a>
      </article>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: t('home.criteria.eyebrow'), title: t('home.criteria.title'), lead: t('home.criteria.lead') })}
    ${criteriaList(ctx)}
  </div>
</section>

<section class="section section--line">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({ eyebrow: t('home.ecosystem.eyebrow'), title: t('home.ecosystem.title'), lead: t('home.ecosystem.lead') })}
      <a class="link-arrow" href="${url('ecosystem/')}">${t('home.ecosystem.link')}${icons.arrow()}</a>
    </div>
    ${logoGrid(ctx, ctx.companies, { limit: 12 })}
  </div>
</section>

${latest.length
  ? html`<section class="section section--line">
  <div class="container">
    <div class="section-head-row">
      ${sectionHead({ eyebrow: t('home.insights.eyebrow'), title: t('home.insights.title'), lead: t('home.insights.lead') })}
      <a class="link-arrow" href="${url('insights/')}">${t('common.allInsights')}${icons.arrow()}</a>
    </div>
    <div class="article-grid">${latest.map((a) => articleCard(ctx, a))}</div>
  </div>
</section>`
  : ''}

${ctaBand(ctx)}`;

  return {
    id: 'home',
    section: 'home',
    path: '',
    fullTitle: `${plain('brand.name')} | ${plain('meta.homeTitle')}`,
    description: plain('meta.siteDescription'),
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: plain('brand.name'),
      legalName: site.company.legalName,
      url: site.siteUrl,
      logo: `${site.siteUrl}/assets/img/logo.png`,
      email: site.contact.general,
      sameAs: [site.social.x, site.social.linkedin].filter(Boolean),
    },
  };
}

export function investPage(ctx) {
  const { t, plain, url } = ctx;
  const facts = ['stages', 'checkSize', 'geography']
    .map((key) => ({ key, value: ctx.localized(ctx.site.fund[key]) }))
    .filter((fact) => fact.value);
  const approach = ctx.get('invest.approach.items');

  const body = html`${pageHero({
    eyebrow: t('invest.eyebrow'),
    title: t('invest.title'),
    lead: t('invest.lead'),
    actions: button(url('founders/'), t('nav.submit'), 'primary', 'btn-lg'),
  })}

${facts.length
  ? html`<section class="section section--tight">
  <div class="container">
    <h2 class="sr-only">${t('invest.glance.title')}</h2>
    <dl class="facts">
      ${facts.map((fact) => html`<div class="fact"><dt>${t(`invest.glance.${fact.key}`)}</dt><dd>${fact.value}</dd></div>`)}
    </dl>
  </div>
</section>`
  : ''}

<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: t('invest.pillars.eyebrow'), title: t('invest.pillars.title'), lead: t('invest.pillars.lead') })}
    <div class="pillar-grid">${PILLARS.map((p, i) => pillarCard(ctx, p, i))}</div>
  </div>
</section>

<section class="section section--panel" id="criteria">
  <div class="container">
    ${sectionHead({ eyebrow: t('invest.criteria.eyebrow'), title: t('invest.criteria.title') })}
    ${criteriaList(ctx)}
  </div>
</section>

<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: t('invest.approach.eyebrow'), title: t('invest.approach.title') })}
    <div class="feature-grid feature-grid--3">
      ${approach.map(
        (item, i) => html`<article class="feature" data-reveal>
        <span class="feature-index">${pad(i + 1)}</span>
        <h3 class="h3">${item.title}</h3>
        <p>${item.text}</p>
      </article>`,
      )}
    </div>
  </div>
</section>

${ctaBand(ctx)}`;

  return {
    id: 'invest',
    section: 'invest',
    path: 'invest/',
    title: plain('invest.metaTitle'),
    description: plain('invest.metaDescription'),
    body,
  };
}

export function pillarPage(ctx, pillar) {
  const { t, plain, get, url } = ctx;
  const key = `pillars.${pillar}`;
  const focus = get(`${key}.focus`);
  const lookFor = get(`${key}.lookFor`);
  const companies = ctx.companies.filter((c) => c.pillar === pillar);
  const related = ctx.articles.filter((a) => a.pillar === pillar);
  const others = PILLARS.filter((p) => p !== pillar);

  const body = html`${pageHero({
    eyebrow: html`${icons[pillar]()} ${t('pillarPage.eyebrow')} ${pad(PILLARS.indexOf(pillar) + 1)}`,
    title: t(`${key}.title`),
    lead: t(`${key}.summary`),
    variant: pillar,
  })}

<section class="section section--tight">
  <div class="container split split--view">
    <p class="eyebrow">${t('pillarPage.viewTitle')}</p>
    <p class="statement" data-reveal>${t(`${key}.view`)}</p>
  </div>
</section>

<section class="section section--line">
  <div class="container">
    ${sectionHead({ eyebrow: t('pillarPage.focusTitle'), title: t(`${key}.tagline`) })}
    <div class="feature-grid feature-grid--${focus.length === 4 ? '4' : '3'}">
      ${focus.map(
        (item, i) => html`<article class="feature" data-reveal>
        <span class="feature-index">${pad(i + 1)}</span>
        <h3 class="h3">${item.title}</h3>
        <p>${item.text}</p>
      </article>`,
      )}
    </div>
  </div>
</section>

<section class="section section--panel">
  <div class="container split">
    ${sectionHead({ eyebrow: t('home.criteria.eyebrow'), title: t(`${key}.lookForTitle`) })}
    <ul class="checklist">
      ${lookFor.map((item) => html`<li data-reveal>${icons.check()}<span>${item}</span></li>`)}
    </ul>
  </div>
</section>

${companies.length
  ? html`<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: t('nav.ecosystem'), title: t('pillarPage.companiesTitle') })}
    ${logoGrid(ctx, companies)}
  </div>
</section>`
  : ''}

${related.length
  ? html`<section class="section section--line">
  <div class="container">
    ${sectionHead({ eyebrow: t('nav.insights'), title: t('pillarPage.insightsTitle') })}
    <div class="article-grid">${related.map((a) => articleCard(ctx, a))}</div>
  </div>
</section>`
  : ''}

<section class="section section--line">
  <div class="container">
    ${sectionHead({ eyebrow: t('pillarPage.otherPillars'), title: t('invest.pillars.title') })}
    <div class="pillar-grid pillar-grid--2">${others.map((p) => pillarCard(ctx, p, PILLARS.indexOf(p)))}</div>
  </div>
</section>

${ctaBand(ctx)}`;

  return {
    id: `pillar-${pillar}`,
    section: 'invest',
    path: `invest/${pillar}/`,
    title: `${plain(`${key}.name`)}${ctx.locale.colon}${plain(`${key}.tagline`)}`,
    description: plain(`${key}.metaDescription`),
    body,
  };
}

export function incubationPage(ctx) {
  const { t, plain, get, url } = ctx;
  const who = get('incubation.who.items');
  const groups = get('incubation.groups');
  const steps = get('incubation.process.steps');

  const body = html`${pageHero({
    eyebrow: t('incubation.eyebrow'),
    title: t('incubation.title'),
    lead: t('incubation.lead'),
    actions: button(url('founders/'), t('incubation.primary'), 'primary', 'btn-lg'),
  })}

<section class="section section--tight">
  <div class="container">
    ${sectionHead({ eyebrow: t('incubation.who.eyebrow'), title: t('incubation.who.title') })}
    <div class="feature-grid feature-grid--2">
      ${who.map(
        (item, i) => html`<article class="feature feature--card" data-reveal>
        <span class="feature-index">${pad(i + 1)}</span>
        <h3 class="h3">${item.title}</h3>
        <p>${item.text}</p>
      </article>`,
      )}
    </div>
  </div>
</section>

<section class="section section--line" id="services">
  <div class="container">
    ${sectionHead({ eyebrow: t('incubation.services.eyebrow'), title: t('incubation.services.title'), lead: t('incubation.services.lead') })}
    <div class="service-groups">
      ${groups.map(
        (group, i) => html`<section class="service-group" data-reveal aria-labelledby="service-group-${i + 1}">
        <header class="service-group-head">
          <span class="service-group-index">${pad(i + 1)}</span>
          <h3 class="h3" id="service-group-${i + 1}">${group.title}</h3>
          <p>${group.text}</p>
        </header>
        <ul class="service-list">
          ${group.items.map((item) => html`<li class="service"><h4 class="service-title">${item.title}</h4><p>${item.text}</p></li>`)}
        </ul>
      </section>`,
      )}
    </div>
  </div>
</section>

<section class="section section--panel">
  <div class="container">
    ${sectionHead({ eyebrow: t('incubation.process.eyebrow'), title: t('incubation.process.title') })}
    <ol class="steps">
      ${steps.map(
        (step, i) => html`<li class="step" data-reveal>
        <span class="step-index">${pad(i + 1)}</span>
        <h3 class="h3">${step.title}</h3>
        <p>${step.text}</p>
      </li>`,
      )}
    </ol>
  </div>
</section>

${ctaBand(ctx, { button: t('incubation.primary') })}`;

  return {
    id: 'incubation',
    section: 'incubation',
    path: 'incubation/',
    title: plain('incubation.metaTitle'),
    description: plain('incubation.metaDescription'),
    body,
  };
}

export function ecosystemPage(ctx) {
  const { t, plain } = ctx;
  const categories = ['portfolio', 'incubated', 'partner'];
  const sorted = categories.some((c) => ctx.companies.some((co) => co.category === c));
  const hasPillars = ctx.companies.some((c) => c.pillar);

  const groups = sorted
    ? [...categories, null]
        .map((category) => ({ category, companies: ctx.companies.filter((c) => (c.category ?? null) === category) }))
        .filter((g) => g.companies.length)
    : [{ category: null, companies: ctx.companies }];

  const filters = hasPillars
    ? html`<div class="filters" role="group" aria-label="${plain('ecosystem.filterLabel')}" data-filters="logo">
      <button type="button" class="chip" aria-pressed="true" data-filter="all">${t('ecosystem.filterAll')}</button>
      ${PILLARS.map((p) => html`<button type="button" class="chip" aria-pressed="false" data-filter="${p}">${t(`pillars.${p}.name`)}</button>`)}
    </div>`
    : '';

  const body = html`${pageHero({ eyebrow: t('ecosystem.eyebrow'), title: t('ecosystem.title'), lead: t('ecosystem.lead') })}

<section class="section section--tight">
  <div class="container">
    ${filters}
    ${groups.map(
      (group) => html`<div class="logo-group">
      ${sorted ? html`<h2 class="h3 logo-group-title">${t(`ecosystem.groups.${group.category ?? 'other'}`)}</h2>` : ''}
      ${logoGrid(ctx, group.companies, { filterable: hasPillars })}
    </div>`,
    )}
    <p class="fine-print">${t('ecosystem.trademarks')}</p>
  </div>
</section>

${ctaBand(ctx)}`;

  return {
    id: 'ecosystem',
    section: 'ecosystem',
    path: 'ecosystem/',
    title: plain('ecosystem.metaTitle'),
    description: plain('ecosystem.metaDescription'),
    body,
  };
}

export function insightsPage(ctx) {
  const { t, plain } = ctx;
  const filterKeys = ['all', ...PILLARS.filter((p) => ctx.articles.some((a) => a.pillar === p))];
  if (ctx.articles.some((a) => a.type === 'founder-guide')) filterKeys.push('founders');
  const showNote = ctx.articles.some((a) => a.locale !== ctx.locale.code);

  const body = html`${pageHero({ eyebrow: t('insights.eyebrow'), title: t('insights.title'), lead: t('insights.lead') })}

<section class="section section--tight">
  <div class="container">
    ${ctx.articles.length > 1
      ? html`<div class="filters" role="group" aria-label="${plain('insights.filterLabel')}" data-filters="article">
      ${filterKeys.map(
        (key) => html`<button type="button" class="chip" aria-pressed="${key === 'all' ? 'true' : 'false'}" data-filter="${key}">${t(`insights.filters.${key}`)}</button>`,
      )}
    </div>`
      : ''}
    ${showNote ? html`<p class="note">${t('insights.englishOnly')}</p>` : ''}
    ${ctx.articles.length
      ? html`<div class="article-grid" data-article-grid>${ctx.articles.map((a) => articleCard(ctx, a))}</div>`
      : html`<p class="lead">${t('insights.empty')}</p>`}
  </div>
</section>

${ctaBand(ctx)}`;

  return {
    id: 'insights',
    section: 'insights',
    path: 'insights/',
    title: plain('insights.metaTitle'),
    description: plain('insights.metaDescription'),
    body,
  };
}

export function articlePage(ctx, article) {
  const { t, plain, url, site } = ctx;
  const pillar = article.pillar !== 'none' ? article.pillar : null;
  const more = ctx.articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const body = html`<article class="article">
  <header class="article-header">
    <div class="page-hero-bg" aria-hidden="true"></div>
    <div class="container container--narrow">
      <a class="back-link" href="${url('insights/')}">${icons.arrowLeft()}${t('common.allInsights')}</a>
      <p class="article-meta">
        ${pillar ? html`<a class="tag" href="${url(`invest/${pillar}/`)}">${t(`pillars.${pillar}.name`)}</a>` : ''}
        <span class="tag tag--muted">${t(`insights.types.${article.type}`)}</span>
      </p>
      <h1 class="display display--article">${article.title}</h1>
      <p class="lead lead--lg">${article.description}</p>
      <p class="byline">
        <span>${t('article.by', { author: article.author })}</span>
        <time datetime="${article.date}">${formatDate(ctx.locale, article.date)}</time>
        <span>${plain('insights.minRead', { minutes: article.minutes })}</span>
      </p>
    </div>
  </header>
  <div class="container container--narrow">
    <div class="prose prose--article">${raw(article.html)}</div>
    <aside class="disclaimer-box" aria-labelledby="article-disclaimer">
      <h2 id="article-disclaimer">${t('article.disclaimerTitle')}</h2>
      <p>${t('article.disclaimer')}</p>
    </aside>
  </div>
</article>

${more.length
  ? html`<section class="section section--line">
  <div class="container">
    ${sectionHead({ eyebrow: t('nav.insights'), title: t('article.more') })}
    <div class="article-grid">${more.map((a) => articleCard(ctx, a))}</div>
  </div>
</section>`
  : ''}

${ctaBand(ctx)}`;

  return {
    id: 'article',
    section: 'insights',
    path: `insights/${article.slug}/`,
    title: article.title,
    description: article.description,
    ogType: 'article',
    body,
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      datePublished: article.date,
      inLanguage: ctx.locale.lang,
      author: { '@type': 'Organization', name: article.author },
      publisher: { '@type': 'Organization', name: plain('brand.name'), logo: { '@type': 'ImageObject', url: `${site.siteUrl}/assets/img/logo.png` } },
      mainEntityOfPage: site.siteUrl + url(`insights/${article.slug}/`),
    },
  };
}

const TURNSTILE_LANGUAGES = { en: 'en', 'zh-Hant': 'zh-tw', ko: 'ko', ja: 'ja' };

export function foundersPage(ctx) {
  const { t, plain, get, url, site } = ctx;
  const next = get('founders.next');
  const faq = get('founders.faq');
  const criteria = get('criteria.items');
  const deckGuide = ctx.articles.find((a) => a.slug === 'what-we-look-for-in-a-pitch-deck');
  const email = html`<a href="mailto:${site.contact.deals}">${site.contact.deals}</a>`;
  const [open, close] = ctx.locale.parens;
  const optional = html`<span class="optional">${open}${t('form.optional')}${close}</span>`;
  const select = (name, key, options) => html`<select id="f-${name}" name="${name}" required>
          <option value="">${t('form.select')}</option>
          ${options.map((o) => html`<option value="${o}">${t(`form.${key}.${o}`)}</option>`)}
        </select>`;

  const body = html`${pageHero({ eyebrow: t('founders.eyebrow'), title: t('founders.title'), lead: t('founders.lead') })}

<section class="section section--tight">
  <div class="container founders-layout">
    <aside class="founders-aside">
      <h2 class="h3">${t('founders.lookForTitle')}</h2>
      <ul class="compact-list">
        ${criteria.map((c) => html`<li>${icons.check()}<span><strong class="compact-title">${c.title}</strong>${c.text}</span></li>`)}
      </ul>
      <h2 class="h3">${t('founders.nextTitle')}</h2>
      <ol class="mini-steps">
        ${next.map((s, i) => html`<li><span class="mini-step-index">${pad(i + 1)}</span><span><strong>${s.title}</strong><br>${s.text}</span></li>`)}
      </ol>
      <p class="note">${t('founders.nda')}</p>
    </aside>

    <div class="form-card" id="submit">
      <form class="deck-form" action="/api/submit-deck" method="post" data-deck-form
        data-submitting="${plain('form.submitting')}"
        data-error-generic="${plain('form.errorGeneric', { email: site.contact.deals })}"
        data-error-validation="${plain('form.errorValidation')}"
        data-error-captcha="${plain('form.errorCaptcha')}">
        <h2 class="h3">${t('form.title')}</h2>
        <div class="form-grid">
          <div class="field">
            <label for="f-name">${t('form.name')}</label>
            <input id="f-name" name="name" required maxlength="120" autocomplete="name">
          </div>
          <div class="field">
            <label for="f-email">${t('form.email')}</label>
            <input id="f-email" name="email" type="email" required maxlength="200" autocomplete="email">
          </div>
          <div class="field">
            <label for="f-company">${t('form.company')}</label>
            <input id="f-company" name="company" required maxlength="120" autocomplete="organization">
          </div>
          <div class="field">
            <label for="f-website">${t('form.website')}${optional}</label>
            <input id="f-website" name="website" type="url" maxlength="300" placeholder="https://" autocomplete="url">
          </div>
          <fieldset class="field field--full">
            <legend>${t('form.lookingFor')}</legend>
            <div class="choice-row">
              ${['investment', 'incubation', 'both'].map(
                (o, i) => html`<label class="choice"><input type="radio" name="lookingFor" value="${o}" required${i === 0 ? raw(' checked') : ''}><span>${t(`form.lookingForOptions.${o}`)}</span></label>`,
              )}
            </div>
          </fieldset>
          <div class="field">
            <label for="f-pillar">${t('form.pillar')}</label>
            ${select('pillar', 'pillarOptions', ['fintech', 'blockchain', 'ai', 'other'])}
          </div>
          <div class="field">
            <label for="f-stage">${t('form.stage')}</label>
            ${select('stage', 'stageOptions', ['pre-seed', 'seed', 'series-a', 'series-b-plus', 'established'])}
          </div>
          <div class="field">
            <label for="f-raise">${t('form.raise')}${optional}</label>
            <input id="f-raise" name="raiseUsd" maxlength="40" inputmode="decimal" aria-describedby="f-raise-hint">
            <p class="hint" id="f-raise-hint">${t('form.raiseHint')}</p>
          </div>
          <div class="field">
            <label for="f-country">${t('form.country')}</label>
            <input id="f-country" name="country" required maxlength="80" autocomplete="country-name">
          </div>
          <div class="field field--full">
            <label for="f-oneliner">${t('form.oneLiner')}</label>
            <textarea id="f-oneliner" name="oneLiner" required maxlength="280" rows="2"></textarea>
          </div>
          <div class="field field--full">
            <label for="f-deck">${t('form.deckUrl')}</label>
            <input id="f-deck" name="deckUrl" type="url" required maxlength="500" placeholder="https://" aria-describedby="f-deck-hint">
            <p class="hint" id="f-deck-hint">${t('form.deckUrlHint')}</p>
          </div>
          <div class="field field--full">
            <label for="f-source">${t('form.source')}${optional}</label>
            <input id="f-source" name="source" maxlength="200">
          </div>
          <div class="field-hp" aria-hidden="true">
            <label for="f-fax">Fax</label>
            <input id="f-fax" name="fax" tabindex="-1" autocomplete="off">
          </div>
          <input type="hidden" name="language" value="${ctx.locale.code}">
          <div class="field field--full field--check">
            <input id="f-consent" name="consent" type="checkbox" value="yes" required>
            <label for="f-consent">${t('form.consent', { privacy: html`<a href="${url('legal/privacy/')}">${t('form.privacyLink')}</a>` })}</label>
          </div>
          ${site.turnstileSiteKey
            ? html`<div class="field field--full"><div class="cf-turnstile" data-sitekey="${site.turnstileSiteKey}" data-theme="dark" data-language="${TURNSTILE_LANGUAGES[ctx.locale.code]}"></div></div>`
            : ''}
        </div>
        <div class="form-actions">
          <button class="btn btn-primary btn-lg" type="submit" data-submit>${t('form.submit')}${icons.arrow()}</button>
          <p class="form-status" role="status" aria-live="polite" data-status></p>
        </div>
        <noscript><p class="note">${t('form.noscript', { email })}</p></noscript>
      </form>
      <div class="form-success" hidden data-success tabindex="-1">
        <span class="success-icon">${icons.check()}</span>
        <h2 class="h3">${t('form.successTitle')}</h2>
        <p>${t('form.successText')}</p>
      </div>
      <p class="fine-print">${t('founders.fallback', { email })}</p>
    </div>
  </div>
</section>

<section class="section section--line">
  <div class="container split">
    ${sectionHead({ eyebrow: t('founders.eyebrow'), title: t('founders.faqTitle') })}
    <div class="faq">
      ${faq.map((item) => html`<details class="faq-item"><summary>${item.q}${icons.chevron()}</summary><p>${item.a}</p></details>`)}
      ${deckGuide
        ? html`<details class="faq-item"><summary>${t('founders.deckGuideQ')}${icons.chevron()}</summary><p>${t('founders.deckGuideA', { link: html`<a href="${deckGuide.url}" lang="${deckGuide.locale}">${deckGuide.title}</a>` })}</p></details>`
        : ''}
    </div>
  </div>
</section>`;

  return {
    id: 'founders',
    section: 'founders',
    path: 'founders/',
    title: plain('founders.metaTitle'),
    description: plain('founders.metaDescription'),
    body,
    head: site.turnstileSiteKey ? raw('<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>') : '',
  };
}

export function aboutPage(ctx) {
  const { t, plain, get } = ctx;
  const strengths = get('about.strengths.items');
  const team = ctx.site.team ?? [];

  const body = html`${pageHero({ eyebrow: t('about.eyebrow'), title: t('about.title'), lead: t('about.lead') })}

<section class="section section--tight">
  <div class="container">
    ${sectionHead({ eyebrow: t('about.approach.eyebrow'), title: t('about.approach.title') })}
    <div class="feature-grid feature-grid--2">
      <article class="feature feature--card" data-reveal>
        <span class="feature-index">01</span>
        <h3 class="h3">${t('home.model.investTitle')}</h3>
        <p>${t('about.approach.invest')}</p>
      </article>
      <article class="feature feature--card" data-reveal>
        <span class="feature-index">02</span>
        <h3 class="h3">${t('home.model.incubateTitle')}</h3>
        <p>${t('about.approach.incubate')}</p>
      </article>
    </div>
  </div>
</section>

<section class="section section--panel">
  <div class="container">
    ${sectionHead({ eyebrow: t('about.strengths.eyebrow'), title: t('about.strengths.title') })}
    <div class="feature-grid feature-grid--4">
      ${strengths.map(
        (item, i) => html`<article class="feature" data-reveal>
        <span class="feature-index">${pad(i + 1)}</span>
        <h3 class="h3">${item.title}</h3>
        <p>${item.text}</p>
      </article>`,
      )}
    </div>
  </div>
</section>

${team.length
  ? html`<section class="section">
  <div class="container">
    ${sectionHead({ eyebrow: t('about.team.eyebrow'), title: t('about.team.title') })}
    <ul class="team-grid">
      ${team.map(
        (person) => html`<li class="person" data-reveal>
        ${person.photoUrl ? html`<img src="${person.photoUrl}" alt="${person.name}" loading="lazy" width="480" height="560">` : ''}
        <h3 class="h3">${person.name}</h3>
        <p class="person-role">${ctx.localized(person.role)}</p>
        <p>${ctx.localized(person.bio)}</p>
        ${person.linkedin ? html`<a class="link-arrow" href="${person.linkedin}" rel="noopener" target="_blank">LinkedIn${icons.external()}</a>` : ''}
      </li>`,
      )}
    </ul>
  </div>
</section>`
  : ''}

${ctaBand(ctx)}`;

  return {
    id: 'about',
    section: 'about',
    path: 'about/',
    title: plain('about.metaTitle'),
    description: plain('about.metaDescription'),
    body,
  };
}

export function contactPage(ctx) {
  const { t, plain, url, site } = ctx;
  const address = ctx.localized(site.company.address);

  const body = html`${pageHero({ eyebrow: t('contact.eyebrow'), title: t('contact.title'), lead: t('contact.lead') })}

<section class="section section--tight">
  <div class="container">
    <div class="feature-grid feature-grid--3">
      <article class="feature feature--card" data-reveal>
        <span class="feature-index">01</span>
        <h2 class="h3">${t('contact.foundersTitle')}</h2>
        <p>${t('contact.foundersText')}</p>
        ${button(url('founders/'), t('nav.submit'), 'primary')}
        <a class="contact-link" href="mailto:${site.contact.deals}">${icons.mail()}${site.contact.deals}</a>
      </article>
      <article class="feature feature--card" data-reveal>
        <span class="feature-index">02</span>
        <h2 class="h3">${t('contact.generalTitle')}</h2>
        <p>${t('contact.generalText')}</p>
        <a class="contact-link" href="mailto:${site.contact.general}">${icons.mail()}${site.contact.general}</a>
      </article>
      <article class="feature feature--card" data-reveal>
        <span class="feature-index">03</span>
        <h2 class="h3">${t('contact.socialTitle')}</h2>
        <p>${t('contact.socialText')}</p>
        <a class="contact-link" href="${site.social.x}" rel="noopener" target="_blank">${icons.x()}${site.social.xHandle}<span class="sr-only"> (${plain('a11y.newTab')})</span></a>
      </article>
    </div>
    ${address ? html`<div class="office"><h2 class="h3">${t('contact.officeTitle')}</h2><p>${address}</p></div>` : ''}
  </div>
</section>`;

  return {
    id: 'contact',
    section: 'contact',
    path: 'contact/',
    title: plain('contact.metaTitle'),
    description: plain('contact.metaDescription'),
    body,
  };
}

export function legalPage(ctx, doc) {
  const { t, plain } = ctx;
  const body = html`<section class="page-hero page-hero--legal">
  <div class="page-hero-bg" aria-hidden="true"></div>
  <div class="container container--narrow">
    <h1 class="display display--legal">${doc.title}</h1>
    <p class="byline">${t('legal.updated', { date: formatDate(ctx.locale, doc.updated) })}</p>
  </div>
</section>
<section class="section section--tight">
  <div class="container container--narrow">
    <div class="prose">${raw(doc.html)}</div>
  </div>
</section>`;

  return {
    id: `legal-${doc.slug}`,
    section: 'legal',
    path: `legal/${doc.slug}/`,
    title: doc.title,
    description: plain(`legal.${doc.slug}.metaDescription`),
    body,
  };
}

export function notFoundPage(ctx) {
  const { t, plain, url } = ctx;
  const body = html`<section class="page-hero page-hero--center">
  <div class="page-hero-bg" aria-hidden="true"></div>
  <div class="container">
    <p class="eyebrow">404</p>
    <h1 class="display">${t('notFound.title')}</h1>
    <p class="lead lead--lg">${t('notFound.text')}</p>
    <div class="actions">${button(url(''), t('notFound.home'), 'primary', 'btn-lg')}</div>
  </div>
</section>`;

  return {
    id: 'not-found',
    section: 'none',
    path: '404.html',
    title: plain('notFound.metaTitle'),
    description: plain('meta.siteDescription'),
    body,
  };
}
