# 01 Capital website redesign: brief

This is the brief for rebuilding www.01.capital. Standing rules for agents are in [AGENTS.md](../AGENTS.md), and setup steps are in [DEPLOY.md](DEPLOY.md).

**Status (2026-10-28).** The new site is built in four languages, using the proposed answers below. Items marked `[ ]` under [Still needed from the owner](#still-needed-from-the-owner) are facts only the owner can supply. Until they're filled in, the related sections stay hidden or use neutral wording.

## Original request

> I want to update this website - https://www.01.capital/ with 3 major things in mind.
>
> 1. upgrade and improve the design + content greatly, make it into a major venture capital firm style. add in some articles to it with very powerful financial write up. also add relevant links (your best guess) to all the existing portfolio
>
> 2. put in especially prominent on our investment pillars, we invest in fintech, blockchain and AI. what do we look for and how to submit your deck (through brevo api, so give also .sample.env)
>
> 3. categories things neatly, we not only invest but also incubate, so the incubate part will be providing various services, guidance, and etc. - you will be suggesting and implementing things like you are a big fund house.
>
> put in en, cn, kr, jp languages. ask me any doubts before you begin

## Goals

1. Reposition 01 Capital from a "Web3 consultancy" to a venture firm with an incubation arm. The design and writing should match a major VC firm, and the site gets an articles section.
2. Make the three investment pillars (Fintech, Blockchain and AI) the most prominent thing on the site. That includes what we look for and how to submit a deck through Brevo.
3. Separate the two businesses clearly: **Invest** (the fund) and **Incubate** (services and guidance for founders).
4. Publish in English, Chinese, Korean and Japanese.

## Decisions made

These were agreed on 2026-10-28, when the owner chose to build with the proposals.

- [x] **Positioning:** "01 Capital is a venture firm investing in fintech, blockchain and AI, with an incubation arm that helps founders build and launch." Every language now says the same thing.
- [x] **Pillars and focus areas:**
  - Fintech: payments and stablecoins, wallets and exchanges, lending and credit, and real-world asset (RWA) tokenization
  - Blockchain: base layers and scaling, decentralized infrastructure, and consumer apps and gaming
  - AI: decentralized compute and models, AI agents, and applied AI
- [x] **What we look for:** five shared criteria (domain depth, proof of demand, durable economics, regulatory maturity, essential technology), plus four points for each pillar.
- [x] **Services** (the incubation arm), grouped as:
  - **Build:** venture building, token and economic design, technical support
  - **Launch:** brand, community and go-to-market; listing readiness
  - **Grow:** strategy and research, global network
  - **Enterprise:** Web3 adoption, real-world asset structuring
- [x] **Services removed:**
  - "Market Value" (market making and price support) is dropped.
  - "Digital Assets" (asset management, custody) and "Secondary Market Trading" are dropped until the owner confirms a license.
  - "Exchange Listing" becomes listing-readiness advice, with no promise of a listing.
- [x] **Chinese:** Traditional (`zh-Hant`) at `/zh/`, as on the old site.
- [x] **Web addresses:** English at `/`, then `/zh/`, `/ko/` and `/ja/`. The old `index-CN.html` and `index-KR.html` redirect to `/zh/` and `/ko/`.
- [x] **Portfolio:** all 32 companies appear under a neutral "Our ecosystem" heading until they're sorted into Portfolio, Incubated and Partners. Logos are shown in grey and turn to color on hover.
- [x] **Missing links:** found by web search for Internet Computer (`internetcomputer.org`), Eldarune (`eldarune.com`) and JUST (`just.network`), and flagged in `portfolio.json` for confirmation. AIPICK has no link yet.
- [x] **Articles:** six launch articles in English, bylined "01 Capital Research", each with a disclaimer:
  - Why fintech, blockchain and AI are converging
  - Stablecoins are becoming the internet's settlement layer
  - Tokenized real-world assets: what has to be true for them to scale
  - Who owns AI compute? The case for decentralized infrastructure
  - What we look for in a pitch deck
  - Token design mistakes we see in early-stage projects

  Non-English pages list them with an "English" badge.
- [x] **Deck form** on the "Submit your deck" page:
  - **Fields:** name, email, company, website, what you're looking for (investment, incubation or both), pillar, stage, amount raising, country, a one-line description, deck link, how you heard about us, and consent.
  - **Spam protection:** Cloudflare Turnstile plus a hidden honeypot field.
  - **On submit:** the founder is saved to a Brevo list, the deals inbox gets an email, and the founder gets a confirmation in their language.
  - **Promise:** "If there's a fit, we'll reply within 10 business days."
  - **NDA line:** "We don't sign NDAs at first review."
- [x] **Settings file:** `.env.example`, the usual name for this file (the original request said `.sample.env`).
- [x] **Stack:** plain HTML generated by a dependency-free Node script, hosted on Cloudflare Pages with one Pages Function for the Brevo call. The agent sandbox can't install npm packages, so Astro wasn't used. The output is plain HTML that could be hosted anywhere, but the deck form needs Cloudflare Pages Functions.
- [x] **Design:** dark theme built around the logo's red-to-orange gradient, with system fonts that cover Chinese, Korean and Japanese, and no stock photos.
- [x] **Analytics:** Cloudflare Web Analytics, which doesn't use cookies. It's turned on in the Cloudflare dashboard.

## Still needed from the owner

### Blocks a credible launch

- [ ] **Sort the companies.** In `portfolio.json`, set each company's `category`:
  - `portfolio`: invested
  - `incubated`
  - `partner`

  Also set its main `pillar`: `fintech`, `blockchain` or `ai`. Once this is done, the ecosystem page splits into sections and each pillar page shows its companies.
- [ ] **Confirm links.** Confirm the three links found by web search, then change their `url_source` to `confirmed`. For AIPICK, say which project it is: `aipick.io` (an AI motion game) or the X account `@AIPickofficial`, and give its link.
- [ ] **Legal entity and licenses.** Where is 01 Capital Limited registered, and does it hold any licenses? This is needed to finalize the legal pages. It also decides whether any of the removed services can return.
- [ ] **Legal review.** Have the privacy policy, terms and disclaimer reviewed, in all four languages. The privacy policy proposes keeping submissions for up to two years.
- [ ] **Brevo and Turnstile setup:** sender domain, deals inbox, list, contact attributes, API key and Turnstile keys. Follow the steps in [DEPLOY.md](DEPLOY.md).

### Makes the site stronger

- [ ] **Team:** name, role, photo, short bio, and LinkedIn or X for everyone to be shown. Add them to `team` in `src/data/site.json` (there's an example entry), and the About page shows them automatically.
- [ ] **Fund facts:** typical stage, check size and geography, in `src/data/site.json` under `fund`. These appear as an "At a glance" strip on the Invest page.
- [ ] **Article authors:** named authors from the team, to replace "01 Capital Research".
- [ ] **Translation review:** native speakers to review the Chinese, Korean and Japanese text. These are machine translations.
- [ ] **Article translations:** decide which articles to translate. Put translations in `src/content/articles/<language>/` with the same file name.
- [ ] **Logo files:** a vector logo (SVG) and a version for light backgrounds. The site uses the old 577×239 PNG.
- [ ] **Office address and other contacts:** add them to `src/data/site.json` (address, LinkedIn) to show them on the Contact page.

## Sitemap (as built)

- **Home:**
  - positioning
  - the three pillars
  - Invest and Incubate
  - what we look for
  - an ecosystem preview
  - the latest insights
  - a call to action for founders
- **Invest:** the pillars, what we look for and our approach, plus one page per pillar covering our view, focus areas, pillar criteria, companies and related insights
- **Incubation:** who it's for, the four service groups, and how it works
- **Ecosystem:** all 32 companies
- **Insights:** article cards with filters, plus one page per article
- **Submit your deck:** criteria, what happens next, the form and an FAQ
- **About:** approach and strengths. The team section appears once data is added.
- **Contact:** founders, partnerships and media, and social links
- **Legal:** privacy policy, terms of use and disclaimer

Every page exists at `/`, `/zh/`, `/ko/` and `/ja/`. Articles are in English for now.

## Definition of done

- [x] Every page exists in all four languages, with correct `lang` and `hreflang` tags.
- [x] Every page has a title, a description and a social preview image, and there's a sitemap.xml.
- [x] No company appears without a link from the old site or a recorded web search. AIPICK has no link and is shown without one.
- [x] No secrets in the repo; `.env.example` documents every setting.
- [x] Old web addresses redirect to the new pages.
- [x] The site is responsive and keyboard accessible, with visible focus states and support for reduced motion.
- [ ] The deck form is tested end to end against the real Brevo account, in every language. This needs the Brevo and Turnstile keys.
- [ ] Translations reviewed by native speakers.
- [ ] Launch: switch DNS to Cloudflare Pages and check the redirects.
