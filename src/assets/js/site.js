// 01 Capital — small progressive enhancements. The site works without this file,
// except for the deck form, which needs JavaScript for its spam check.
(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');

  // Header background after scrolling.
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu.
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    header?.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', (event) => {
    if (event.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
    document.querySelectorAll('[data-lang-switch][open]').forEach((el) => el.removeAttribute('open'));
  });
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  // Close the language menu when clicking elsewhere.
  document.addEventListener('click', (event) => {
    document.querySelectorAll('[data-lang-switch][open]').forEach((el) => {
      if (!el.contains(event.target)) el.removeAttribute('open');
    });
  });

  // Reveal on scroll.
  const revealables = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    revealables.forEach((el) => observer.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-visible'));
  }

  // Filter chips for insights and the ecosystem.
  document.querySelectorAll('[data-filters]').forEach((group) => {
    const kind = group.dataset.filters;
    const items = document.querySelectorAll(kind === 'article' ? '[data-article-grid] .article-card' : '[data-logo-grid] .logo-cell');
    group.addEventListener('click', (event) => {
      const button = event.target.closest('[data-filter]');
      if (!button) return;
      const filter = button.dataset.filter;
      group.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      items.forEach((item) => {
        const show =
          filter === 'all' ||
          item.dataset.pillar === filter ||
          (filter === 'founders' && item.dataset.type === 'founder-guide');
        item.hidden = !show;
        if (show) item.classList.add('is-visible');
      });
    });
  });

  // Deck submission form.
  const form = document.querySelector('[data-deck-form]');
  if (form) {
    const status = form.querySelector('[data-status]');
    const submit = form.querySelector('[data-submit]');
    const success = document.querySelector('[data-success]');
    const submitLabel = submit.innerHTML;

    const showError = (message) => {
      status.textContent = message;
      status.classList.add('is-error');
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
      status.classList.remove('is-error');
      status.textContent = '';

      const data = Object.fromEntries(new FormData(form).entries());
      data.consent = form.elements.consent?.checked === true;
      if (form.querySelector('.cf-turnstile') && !data['cf-turnstile-response']) {
        showError(form.dataset.errorCaptcha);
        return;
      }

      submit.disabled = true;
      submit.textContent = form.dataset.submitting;
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'content-type': 'application/json', accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json().catch(() => ({}));
        if (response.ok && result.ok) {
          form.hidden = true;
          success.hidden = false;
          success.focus();
          return;
        }
        if (result.error === 'validation' && Array.isArray(result.fields)) {
          result.fields.forEach((name) => form.elements[name]?.setAttribute?.('aria-invalid', 'true'));
          form.querySelector('[aria-invalid="true"]')?.focus();
          showError(form.dataset.errorValidation);
        } else if (result.error === 'captcha') {
          showError(form.dataset.errorCaptcha);
        } else {
          showError(form.dataset.errorGeneric);
        }
      } catch {
        showError(form.dataset.errorGeneric);
      } finally {
        submit.disabled = false;
        submit.innerHTML = submitLabel;
        window.turnstile?.reset?.();
      }
    });
  }
})();
