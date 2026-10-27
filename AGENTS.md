# AGENTS.md

These are standing rules for anyone, human or agent, working on the 01 Capital website (www.01.capital).

The redesign brief and its open decisions are in [docs/BRIEF.md](docs/BRIEF.md). Read it before any redesign work, and settle its open items with the site owner before building. Don't start the redesign as part of an unrelated task.

## Repo

- `index.html`, `index-CN.html`, `index-KR.html` and the `css/`, `js/`, `images/` and `assets/` folders are a static export of the current live site. Treat them as reference material for the rebuild, not code to extend. 11 files they reference are missing from the export.
- `portfolio.json` is the single source of truth for the companies shown on the site.
- The live site can't be fetched from the agent sandbox, so use the export for current content.
- The stack and its commands aren't chosen yet; see the proposal in docs/BRIEF.md. Add build, run and test commands here when the rebuild starts.

## Content

- Don't invent facts. That means no fund size, returns, deal counts, people, quotes, statistics or dates the owner hasn't supplied. Leave a visible TODO instead.
- No market-making, price-support, market-cap or return claims anywhere.
- Don't advertise regulated services (asset management, custody, or trading for clients) unless docs/BRIEF.md confirms 01 Capital is licensed for them.
- Show a company only if it has a confirmed link and a category. The categories are `portfolio` (01 Capital invested), `incubated` and `partner`.
- Every article needs a named author and the disclaimer from docs/BRIEF.md.

## Languages

- The site has four languages: English, Chinese, Korean and Japanese. English is the source; finish it before translating.
- Every user-facing string exists in all four languages. Don't hard-code text in templates.
- Use standard codes in `lang` and `hreflang`: `en`, `zh-Hant` or `zh-Hans` (see docs/BRIEF.md), `ko` and `ja`. Never use `cn`, `kr` or `jp` as language codes; web addresses can differ.
- Machine translations are drafts until a native speaker has reviewed them.

## Secrets and forms

- Never commit `.env`, API keys or other secrets. Document every setting in `.env.example`.
- The Brevo API key stays on the server. Never send it to the browser.

## Quality

- Don't block right-click, copying, text selection or zoom.
- Every image has alt text, and logos use the company name.
- Every page has a title, a meta description and a social preview image.
