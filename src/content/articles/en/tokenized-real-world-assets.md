---
title: "Tokenized real-world assets: what has to be true for them to scale"
description: Tokenized assets promise fractional ownership, faster settlement and collateral that moves, but only if six legal, operational and market conditions are met.
date: 2026-10-28
pillar: fintech
type: thesis
author: 01 Capital Research
---

Putting an asset on a blockchain is easy. Making the token mean something is hard. A token can record who owns what and move almost instantly, but it cannot, by itself, make a court recognize its owner, make a borrower repay or make a counterparty appear when the owner wants to exit.

We believe tokenized real-world assets can scale, but from the claim outward, not from the chain outward. The promise is real, and it is conditional. It depends on a specific set of legal, operational and market conditions being true. We expect the companies that make those conditions true, not those that simply mint tokens, to build the durable value.

## What tokenization promises

Four benefits make the case.

**Fractional ownership.** Assets that were indivisible or carried high minimums, such as a building, a private loan or a share in a fund, can be divided into small units. Within the limits of who is allowed to invest, that widens access and lets each investor own exactly the amount that fits.

**Faster or continuous settlement.** In traditional markets, a trade is agreed at one moment and settled later, through layers of intermediaries that each keep their own records and reconcile them with one another. On a shared ledger, the asset and the payment can move together in a single step, so neither side is exposed while waiting for the other. Settlement does not have to stop when the market closes.

**Programmability.** The asset can carry its own rules: who may own it, how income is distributed, how votes are counted, what happens at maturity. Distributions can be paid automatically to current owners, and corporate actions can be processed once instead of being reconciled across a chain of custodians.

**Collateral that can move.** Much of the financial system runs on collateral, and too much of it is stuck where it was posted. Moving it depends on operations teams, cutoff times and business hours. Tokenized collateral can move between institutions 24/7, including in moments of stress when margin calls arrive after the close. We believe this use case may matter more, and sooner, than broad retail access.

## Why the hard part is off-chain

A token is a pointer. It refers to something that lives outside the blockchain: a fund share recorded by a transfer agent, a loan agreement in a lender's files, gold in a vault, title to a building in a land registry. The blockchain can guarantee that the token moved. It cannot guarantee that the thing it points to exists, performs or belongs to the token's owner.

That is the central design problem. Every link between the chain and the world outside it is a point of trust. Good structures make those points few, accountable and verifiable. Weak structures hide them behind a smooth interface.

So the useful question is not whether an asset can be tokenized. Almost anything can. The useful question is what has to be true for the token to carry the rights it claims, and to keep carrying them under stress. We see six conditions.

> A token can prove that it moved. It cannot prove that the promise behind it will be kept.

## What has to be true: the claim and its plumbing

### The token is an enforceable legal claim

The token must map to a legal right that a court in the relevant jurisdiction would enforce. In some structures the token is the security itself, where the law allows a ledger to serve as the register of ownership. In others it represents an interest in a separate legal entity that owns the asset. Each approach involves trade-offs, and every one must answer hard questions. If the issuer fails, are the assets protected from its creditors? If the ledger and the official register disagree, which one prevails? If a private key is lost or stolen, can the claim be restored?

Imagine a token representing a share of a rental property. If the company managing the property becomes insolvent, the token owner needs to know, in advance and in writing, where they stand. If that answer is unclear, the token is a receipt, not an asset.

### Custody and servicing are reliable

Tokenized assets need two kinds of custody: custody of the underlying asset, and custody of the keys that control the tokens. Both must be segregated, auditable and run by parties with clear legal duties.

Then there is servicing, the unglamorous work of collecting payments, distributing income, handling defaults, processing corporate actions and producing statements and tax documents. For a loan, servicing is most of the work. Tokenization does not remove it. It moves it. If servicing stays manual, the token adds a layer of cost instead of removing one.

### Off-chain data is trustworthy

Smart contracts act on data: valuations, payments received, collateral levels, evidence that reserves exist. If that data is wrong, late or open to manipulation, automation spreads the error faster than any manual process could. The data must come from accountable sources, be independently verifiable and arrive on time, with clear fallbacks when a feed fails.

Valuation deserves particular care. A private loan or a building is valued periodically and with judgment. Showing a live figure for an asset that is only appraised from time to time creates false precision. Honest products disclose how often values update and how they are produced.

## What has to be true: the rules and the market

### Transfer restrictions and compliance live in the asset itself

Securities usually come with rules about who may own them and when they may be transferred. If a token can move freely to any wallet, the issuer cannot comply. If every transfer needs manual approval, the benefits of tokenization disappear. The answer is to express the rules in the asset. The token checks that the recipient has a valid eligibility credential before a transfer executes, and authorized parties can freeze or reassign tokens under a court order or a regulatory requirement.

Two details matter. Credentials should be portable, so an investor verified once is recognized across issuers and platforms. And compliance on a public ledger must not mean publishing investors' identities. Privacy-preserving verification is a requirement, not a feature.

### There are investors who can legally own it

Demand is constrained too. Institutional investors face rules about which instruments they may own, how those instruments must be custodied and how they are treated for capital and accounting purposes. If an investor's custodian cannot support the token, or its regulatory treatment is unclear, that investor cannot participate, however well designed the asset is. In many markets, retail access to these instruments is tightly restricted.

As a result, issuance can run ahead of eligible demand. Founders need to know exactly who their eligible investors are, and work backward from there.

### Secondary liquidity is real rather than assumed

Tokenization makes an asset transferable. It does not make it liquid. Liquidity requires counterparties willing to take the other side, intermediaries willing to make markets, venues licensed to match orders and enough information for both sides to agree on value. Transfer restrictions shrink the pool of eligible counterparties, and liquidity split across venues and chains is thinner still.

A token that can move 24/7 can still sit untouched for months. Honest designs say so. They offer redemption through the issuer or fund on stated terms, periodic liquidity windows or matching services, rather than implying an instant exit. The dangerous design promises instant redemption against an asset that takes months to turn into cash. That is a liquidity mismatch, and it is how runs begin.

## Where founders should build first

We believe the near-term opportunity is in the infrastructure that makes these conditions true, and in the use cases where they are already easiest to meet.

**Issuance and servicing infrastructure.** Asset managers, lenders and originators need tools to issue tokenized instruments with the legal structure, ownership register, distributions, reporting and investor communications built in. The prize is servicing at software cost. AI models can read loan documents, monitor covenants, reconcile payments and draft investor reports, turning servicing from a cost center into a product.

**Compliance layers.** Eligibility credentials, transfer-restriction engines, jurisdiction rules expressed as code, sanctions screening, regulatory reporting and privacy-preserving verification. Built once and used across many issuers and chains, a compliance layer becomes more valuable with every issuer and investor that joins it.

**Collateral use cases.** Tokenized cash-like instruments and high-quality government debt, used as collateral between institutions for margin, lending and settlement. Here the six conditions are easiest to satisfy. The underlying assets are simple and well understood, their values are reliable, the institutions involved already own them, and the benefit of moving collateral faster and around the clock is immediate.

We are more cautious about tokenizing illiquid, hard-to-value assets for broad audiences with implied promises of liquidity. Those products concentrate every unsolved condition in one place.

## What we look for

In tokenization founders, we look for:

- Teams that combine capital markets experience with engineering: people who have issued, serviced or supervised these instruments and can also ship software.
- A legal structure reviewed by qualified counsel in each target jurisdiction before the token is designed, not after.
- Regulated partners for custody, transfer agency and administration, identified early and with clear responsibilities.
- A precise answer to who the eligible investors are, and a credible way to reach them.
- Liquidity terms that match the underlying asset, stated plainly.
- Data and servicing treated as core competencies, not afterthoughts.
- Products that plug into existing institutions, with economics that do not depend on a token of their own.

If you are building the claims, the plumbing or the rules that tokenized markets need, we would like to see your deck.
