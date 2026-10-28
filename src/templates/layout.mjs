import { html, raw } from '../lib/html.mjs';
import { icons } from './icons.mjs';

const NAV = [
  ['invest', 'invest/'],
  ['incubation', 'incubation/'],
  ['ecosystem', 'ecosystem/'],
  ['insights', 'insights/'],
  ['about', 'about/'],
];

export function layout(ctx, page) {
  const { locale, plain, site } = ctx;
  const brand = plain('brand.name');
  const title = page.fullTitle ?? `${page.title} | ${brand}`;
  const canonical = site.siteUrl + ctx.url(page.path);
  const image = `${site.siteUrl}/assets/img/og-image.png`;
  const jsonLd = page.jsonLd ? raw(`<script type="application/ld+json">${JSON.stringify(page.jsonLd).replace(/</g, '\\u003c')}</script>`) : '';

  return html`<!doctype html>
<html lang="${locale.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${page.description}">
<link rel="canonical" href="${canonical}">
${alternateLinks(ctx, page)}
<meta property="og:type" content="${page.ogType ?? 'website'}">
<meta property="og:site_name" content="${brand}">
<meta property="og:title" content="${page.ogTitle ?? title}">
<meta property="og:description" content="${page.description}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${locale.ogLocale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="${site.social.xHandle}">
<meta name="theme-color" content="#08080b">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="stylesheet" href="${ctx.assets.css}">
<script>document.documentElement.classList.add('js')</script>
<script src="${ctx.assets.js}" defer></script>
${page.head ?? ''}
${jsonLd}
</head>
<body class="page-${page.id}">
<a class="skip-link" href="#main">${ctx.t('a11y.skip')}</a>
${header(ctx, page)}
<main id="main">
${page.body}
</main>
${footer(ctx, page)}
</body>
</html>
`;
}

function alternateLinks(ctx, page) {
  const available = page.locales ?? ctx.locales;
  if (available.length < 2) return '';
  const links = available.map(
    (loc) => html`<link rel="alternate" hreflang="${loc.lang}" href="${ctx.site.siteUrl + ctx.urlFor(loc, page.path)}">`,
  );
  const fallback = available.find((loc) => loc.code === 'en') ?? available[0];
  links.push(html`<link rel="alternate" hreflang="x-default" href="${ctx.site.siteUrl + ctx.urlFor(fallback, page.path)}">`);
  return links.map((link) => html`${link}\n`);
}

function header(ctx, page) {
  const { t, plain, url } = ctx;
  const navItems = NAV.map(([key, path]) => {
    const current = page.section === key ? raw(' aria-current="page"') : '';
    return html`<li><a href="${url(path)}"${current}>${t(`nav.${key}`)}</a></li>`;
  });

  return html`<header class="site-header" data-header>
  <div class="container header-inner">
    <a class="brand" href="${url('')}" aria-label="${plain('a11y.home')}">
      <img src="/assets/img/logo.png" alt="${plain('brand.name')}" width="577" height="239">
    </a>
    <nav class="site-nav" id="site-nav" aria-label="${plain('a11y.mainNav')}" data-nav>
      <ul class="nav-list">${navItems}</ul>
      <a class="btn btn-primary btn-sm nav-cta" href="${url('founders/')}">${t('nav.submit')}</a>
    </nav>
    <div class="header-actions">
      ${languageSwitcher(ctx, page)}
      <a class="btn btn-primary btn-sm header-cta" href="${url('founders/')}">${t('nav.submit')}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav" data-nav-toggle>
        <span class="sr-only">${t('a11y.menu')}</span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
        <span class="nav-toggle-bar" aria-hidden="true"></span>
      </button>
    </div>
  </div>
</header>`;
}

function languageSwitcher(ctx, page) {
  const { locale, plain } = ctx;
  const options = ctx.locales.map((loc) => {
    const target = page.languageLinks?.[loc.code] ?? ctx.urlFor(loc, page.path);
    const current = loc.code === locale.code ? raw(' aria-current="true"') : '';
    return html`<li><a href="${target}" lang="${loc.lang}" hreflang="${loc.lang}"${current}>${loc.label}</a></li>`;
  });
  return html`<details class="lang-switch" data-lang-switch>
        <summary aria-label="${plain('a11y.language')}: ${locale.label}">${icons.globe()}<span>${locale.short}</span>${icons.chevron()}</summary>
        <ul class="lang-menu">${options}</ul>
      </details>`;
}

function footer(ctx, page) {
  const { t, plain, url, site } = ctx;
  const deckGuide = ctx.articles.find((a) => a.slug === 'what-we-look-for-in-a-pitch-deck');
  const year = ctx.year;
  const link = (path, key) => html`<li><a href="${url(path)}">${t(key)}</a></li>`;

  return html`<footer class="site-footer">
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <img src="/assets/img/logo.png" alt="${plain('brand.name')}" width="577" height="239" loading="lazy">
        <p>${t('footer.tagline')}</p>
        <a class="btn btn-primary btn-sm" href="${url('founders/')}">${t('nav.submit')}${icons.arrow()}</a>
      </div>
      <nav class="footer-cols" aria-label="${plain('a11y.footerNav')}">
        <div>
          <h2 class="footer-heading">${t('footer.firm')}</h2>
          <ul>
            ${link('about/', 'nav.about')}
            ${link('invest/', 'nav.invest')}
            ${link('incubation/', 'nav.incubation')}
            ${link('ecosystem/', 'nav.ecosystem')}
            ${link('insights/', 'nav.insights')}
            ${link('contact/', 'nav.contact')}
          </ul>
        </div>
        <div>
          <h2 class="footer-heading">${t('footer.founders')}</h2>
          <ul>
            ${link('founders/', 'nav.submit')}
            ${link('invest/#criteria', 'footer.whatWeLookFor')}
            ${deckGuide ? html`<li><a href="${deckGuide.url}">${t('footer.deckGuide')}</a></li>` : ''}
          </ul>
        </div>
        <div>
          <h2 class="footer-heading">${t('footer.legal')}</h2>
          <ul>
            ${link('legal/privacy/', 'footer.privacy')}
            ${link('legal/terms/', 'footer.terms')}
            ${link('legal/disclaimer/', 'footer.disclaimer')}
          </ul>
        </div>
        <div>
          <h2 class="footer-heading">${t('footer.follow')}</h2>
          <ul>
            <li><a href="${site.social.x}" rel="noopener" target="_blank">${icons.x()} ${site.social.xHandle}<span class="sr-only"> (${plain('a11y.newTab')})</span></a></li>
            ${site.social.linkedin ? html`<li><a href="${site.social.linkedin}" rel="noopener" target="_blank">LinkedIn<span class="sr-only"> (${plain('a11y.newTab')})</span></a></li>` : ''}
          </ul>
        </div>
      </nav>
    </div>
    <div class="footer-bottom">
      <p class="footer-notice">${t('footer.notice')}</p>
      <div class="footer-meta">
        <p>${t('footer.rights', { year, legalName: site.company.legalName })}</p>
        <ul class="footer-langs">
          ${ctx.locales.map((loc) => {
            const target = page.languageLinks?.[loc.code] ?? ctx.urlFor(loc, page.path);
            return html`<li><a href="${target}" lang="${loc.lang}" hreflang="${loc.lang}">${loc.label}</a></li>`;
          })}
        </ul>
      </div>
    </div>
  </div>
</footer>`;
}
