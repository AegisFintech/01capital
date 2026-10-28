# 01 Capital website

The website of 01 Capital (零壹資本), a venture firm investing in fintech, blockchain and AI, with an incubation arm that helps founders build and launch.

- Four languages: English, Traditional Chinese, Korean and Japanese
- Pages: Home, Invest (with one page per pillar), Incubation, Ecosystem, Insights (articles), Submit your deck, About, Contact, and the legal pages
- A deck submission form that saves founders to Brevo and emails the deals inbox

## Quick start

Requires Node.js 20 or later. There are no dependencies to install.

```
npm run build     # generate the site into dist/
npm test          # run all checks
npm run preview   # open http://localhost:4321
```

## Layout

```
build.mjs                  builds dist/ from src/
src/locales/               page text, one JSON file per language
src/content/articles/      Insights articles (Markdown)
src/content/legal/         privacy policy, terms and disclaimer per language
src/data/site.json         company facts: team, fund facts, contacts
src/templates/             page templates
src/assets/                CSS, JavaScript and images
portfolio.json             companies shown in the ecosystem
functions/api/             Cloudflare Pages Function for deck submissions
dist/                      generated site (committed, so it can be uploaded anywhere)
legacy/                    the previous site, kept for reference
docs/BRIEF.md              redesign brief and open decisions
docs/DEPLOY.md             hosting, Brevo and Turnstile setup
```

See [docs/DEPLOY.md](docs/DEPLOY.md) to put the site online, and [docs/BRIEF.md](docs/BRIEF.md) for what still needs the owner's input.
