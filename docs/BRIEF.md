# 01 Capital website redesign: brief

This is the one-time brief for rebuilding www.01.capital. Standing rules for agents are in [AGENTS.md](../AGENTS.md).

**How to use this file.** Items marked `[ ]` are open decisions, and most come with a **Proposed** answer. Accept it, change it, or fill in the blank, either in chat or by editing this file. The build starts once everything under [Needed before the build](#needed-before-the-build) is settled.

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

## The current site

This section describes the static export in this repo, uploaded on 2026-10-27.

What's there:

- Three one-page HTML files:
  - `index.html` (English)
  - `index-CN.html` (Traditional Chinese, under the name 零壹資本)
  - `index-KR.html` (Korean)

  There is no Japanese page.
- Sections: hero slider, About, Why Web3, RWA, Our Services (9 services), Our Strengths, Our Portfolio (32 logos), and Connect With Us.
- Contact is marketing@01.capital and X ([@01capital01](https://x.com/01capital01)). There's no contact form, team section or articles.
- The footer reads "2024 © All Rights Reserved by 01 Capital Limited".
- The site uses a ready-made jQuery/Bootstrap template with the Poppins and Roboto fonts. The live site is served through Cloudflare.

Problems the rebuild must fix:

- The three languages describe different firms:
  - English says "Web3 consultants".
  - Korean says "Web3 venture capitalists" and mentions providing funding.
  - Chinese says "Web3 incubation and business digitalization".
- Basic page settings are wrong or missing:
  - Every page declares `lang="en"`.
  - The English page title is in Korean.
  - The Korean menu item reads "번역" ("translation") and is hidden from some menus.
  - Page descriptions are empty, and the footer year is 2024.
- Some services read as market manipulation or need a licence (see [Services](#services-the-incubation-arm)).
- The portfolio puts investments, 01 Capital's own projects and collaborations under one heading. Four logos have no link, and no logo has a name or alt text.
- The site blocks right-click and Ctrl shortcuts. That stops visitors copying text, searching the page and, in some browsers, zooming.
- 11 files the pages reference are missing from the export, including the hero images, two background images and the icon set.

## Needed before the build

### Positioning

- [ ] **One-line positioning.** Proposed: "01 Capital is a venture firm investing in fintech, blockchain and AI, with an incubation arm that helps founders build and launch."
- [ ] **Consulting for traditional businesses** (the current "Web3 Consulting" service). Proposed: keep it as one incubation service, "Enterprise Web3 adoption", rather than the headline.
- [ ] **Real-world assets (RWA).** RWA has its own section today. Proposed: make it a focus area under Fintech.
- [ ] **Web3 gaming.** About a third of the current logos are games. Proposed: make it a focus area under Blockchain.

### Investment pillars

For each pillar, write or approve:

- [ ] our view (2–3 sentences)
- [ ] focus areas (proposals below)
- [ ] stage, check size and geography (real figures only; leave blank anything you don't publish)

| Pillar | Proposed focus areas |
|---|---|
| Fintech | Payments and stablecoins, wallets and exchanges, lending and credit, RWA tokenization |
| Blockchain | Base layers and scaling, decentralized infrastructure (storage, compute, networking), consumer apps and gaming |
| AI | Decentralized compute and models, AI agents, applied AI (health, consumer) |

- [ ] **What we look for**, across all pillars. Proposed:
  - Founders with deep domain knowledge who ship quickly.
  - A real problem with evidence of demand: users, revenue, pilots or letters of intent.
  - A business model, and a token model if there is one, that works without relying on the token price.
  - Regulation taken seriously from day one, especially in payments, lending and tokenized assets.
  - Fintech, blockchain or AI that is essential to the product, not decoration.

### Portfolio

[`portfolio.json`](../portfolio.json) lists all 32 companies from the current site in display order, with their names, links and logos.

- [ ] **Category for every company.** The options are:
  - `portfolio`: 01 Capital invested. Only these companies go under Portfolio.
  - `incubated`: 01 Capital built or incubated it.
  - `partner`: 01 Capital worked with it.
- [ ] **Main pillar for every company:** `fintech`, `blockchain` or `ai`.
- [ ] **Missing links.** Supply links for Eldarune, AIPICK and JUST, and say which project JUST is. Also confirm `internetcomputer.org` for Internet Computer.
- [ ] **Logo permission.** Confirm you may show each logo, especially for partners.
- [ ] **Optional per company:** a one-line description, the year, and the status (active, acquired or closed).

### Services (the incubation arm)

| Current service | Proposed | Why |
|---|---|---|
| Investment Research | Keep as "Strategy and research" | |
| Incubation | Keep, split into "Venture building" and "Token and economic design" | Token design deserves its own entry |
| Brand Management | Keep as "Brand, community and go-to-market" | |
| Web3 Consulting | Keep as "Enterprise Web3 adoption" | For traditional businesses |
| Real-World Assets (RWA) | Keep as "RWA structuring" (advice) | |
| Exchange Listing | Reword as "Listing readiness" advice | Never promise a listing |
| Market Value | Drop | Its promises to "maintain and enhance market capitalisation" and of "price stability management" read as market manipulation |
| Digital Assets | Drop unless licensed | Asset management and custody are regulated, and they're aimed at investors, not founders |
| Secondary Market Trading | Drop unless licensed | Same as Digital Assets |

- [ ] Approve the table or mark changes.
- [ ] Is anything you offer today missing? For example: legal and company setup, fundraising support and investor introductions, hiring, technical or security reviews, or office space.

Proposed grouping on the Incubation page:

- **Build:** venture building, token and economic design, technical support
- **Launch:** brand, community and go-to-market; listing readiness
- **Grow:** strategy and research, introductions through the global network
- **Enterprise:** Web3 adoption, RWA structuring

### Languages

- [ ] **Chinese script.** The current page is Traditional Chinese. Proposed: keep Traditional (`zh-Hant`) and add Simplified later if needed.
- [ ] **Web addresses.** Proposed: English at `/`, then `/zh/`, `/ko/` and `/ja/`. Old `index-CN.html` and `index-KR.html` links redirect to the new pages.
- [ ] **What gets translated.** Proposed: every site page at launch. Articles start in English, and the important ones get translated.
- [ ] **Reviewers.** Who checks the Chinese, Korean and Japanese? Machine translations stay drafts until a native speaker approves them.
- [ ] **Default language.** Proposed: English, with a language switcher on every page and no automatic redirects.

### Articles ("Insights")

- [ ] **Launch set.** Pick 4–6 of these candidate topics, or add your own:
  1. Why fintech, blockchain and AI are converging (house view)
  2. Stablecoins are becoming the internet's settlement layer (Fintech)
  3. Tokenized real-world assets: what has to be true for them to scale (Fintech)
  4. Blockchains as infrastructure: where durable value is being built (Blockchain)
  5. Who owns AI compute? The case for decentralized infrastructure (AI)
  6. What we look for in a pitch deck (founder guide)
  7. Token design mistakes we see in early-stage projects (founder guide)
- [ ] **Authors.** Each article needs a named author from the team who reviews and approves it.
- [ ] **Figures.** Articles use only figures you supply, or public figures with a dated source that you've checked.
- [ ] **Disclaimer.** Proposed text, subject to legal review: "This article is for information only. It is not investment, legal or tax advice, or an offer to buy or sell any security or digital asset. 01 Capital and its affiliates may hold positions in companies or assets mentioned."

### Deck submission (Brevo)

Proposed flow:

1. A founder fills in the form in any of the four languages.
2. A small server function checks the spam challenge (Cloudflare Turnstile), then:
   - adds or updates the founder as a contact in a Brevo deal-flow list, saving their answers as contact attributes
   - emails the submission to the deals inbox
   - sends the founder a confirmation in their language
3. The founder sees a "thanks, here's what happens next" page.

Proposed form fields:

- name, email, company and website
- pillar
- stage: pre-seed, seed, Series A or later
- amount raising (USD)
- country
- a one-line description
- deck link (DocSend, Google Drive, Dropbox or other); decks are links, not uploads
- how you heard about us (optional)
- a consent checkbox linked to the privacy policy

Decisions:

- [ ] **Deals inbox.** Proposed: a new deals@01.capital address rather than marketing@.
- [ ] **Reply promise.** Proposed: "We read every submission and reply within 10 business days if there's a fit." Only promise what the team will do.
- [ ] **NDA line.** Proposed: "We don't sign NDAs at first review, so please share only what you're comfortable sending."
- [ ] **Privacy policy and consent text.** Who drafts and approves them? They're needed because the form collects personal data from several countries.
- [ ] **Brevo setup (owner).** Create the deal-flow list and its contact attributes, authenticate 01.capital as a sender domain, and create an API key.

The settings go in `.env.example`, the usual name for this file. Say if you'd rather keep `.sample.env`.

```
BREVO_API_KEY=
BREVO_DEALFLOW_LIST_ID=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=
DEALS_INBOX_EMAIL=
TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
```

### Brand and design

- [ ] **Logo files.** The repo only has a 577×239 PNG, and its white text disappears on light backgrounds. Needed: a vector logo (SVG, AI or EPS) and a version for light backgrounds.
- [ ] **Colors.** Proposed: keep the logo's red-to-orange gradient as the accent, on a dark, mostly monochrome base.
- [ ] **Reference sites.** Name 2–3 sites you like and what you like about each. For example: a16z for editorial depth, Sequoia for restraint, Paradigm for research.
- [ ] **Imagery.** The original hero images aren't in the export; send them if you want to keep them. Otherwise the proposal is type-led design with abstract graphics and no stock photos.
- **Fonts.** Whatever font is chosen must cover Chinese, Korean and Japanese characters; Poppins and Roboto don't. The Noto Sans CJK family is one option.

### Team and company facts

- [ ] **Team:** name, role, photo, short bio, and LinkedIn or X for everyone shown.
- [ ] **Fund facts to publish:** typical stage, check size, geography and number of investments. Use real figures only, and leave out anything you don't publish.
- [ ] **Legal entity:** where 01 Capital Limited is registered, and any licences it holds. This is needed for the footer, the disclaimers and the services decision.
- [ ] **Contact:** office location(s), email addresses (general, deals, press) and social accounts besides X.

### Technical setup

Proposed:

- An [Astro](https://astro.build/) static site with one text file per language. Articles and portfolio data live as files in this repo.
- Hosting on Cloudflare, which already serves the live site. One server function handles the Brevo call, and Turnstile blocks spam.
- Cloudflare Web Analytics, which doesn't use cookies.

Decisions:

- [ ] Approve the stack.
- [ ] **Who edits content after launch?** If it's people who don't code, we add a content management system (CMS), and that changes the plan.
- [ ] **Access.** Who has access to the Cloudflare account and the domain's DNS?

## Proposed sitemap

- **Home:** positioning, the three pillars, selected portfolio, latest insights, and a call to action for founders
- **Invest:** an overview, plus one page per pillar covering our view, focus areas, what we look for, stage and check size, and the companies in that pillar
- **Portfolio:** Portfolio, Incubated and Partners, filterable by pillar
- **Incubation:** the services grouped as above, how the program works, and who it's for
- **Insights:** articles, filterable by pillar
- **Founders:** submit a deck, what happens next, and an FAQ
- **About:** approach and team
- **Contact**
- **Legal:** privacy policy, terms and disclaimer

## Definition of done

- Every page exists in all four languages, with correct `lang` and `hreflang` tags.
- The site works well on mobile and meets WCAG 2.2 AA accessibility.
- Every page has a title, description and social preview image, and there's a sitemap.xml.
- The deck form is tested end to end in every language: the contact is created in Brevo, the deals inbox receives the email, and the founder receives the confirmation.
- No company appears without a confirmed link and category.
- There are no secrets in the repo, and `.env.example` documents every setting.
- Old web addresses redirect to the new pages.

## Phases

1. Design system, English pages, portfolio and the deck form.
2. Articles.
3. Chinese, Korean and Japanese, once the English copy is final, with native-speaker review.
4. Launch: switch DNS, check redirects and turn on analytics.
