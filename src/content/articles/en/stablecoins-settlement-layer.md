---
title: Stablecoins are becoming the internet's settlement layer
description: Settlement, not the payment screen, is the real bottleneck in moving money online, and we believe stablecoins are becoming the layer that fixes it.
date: 2026-10-28
pillar: fintech
type: thesis
author: 01 Capital Research
---

Paying online feels instant. Settling does not. A customer taps a phone, a screen says *approved*, and the experience is over in a moment. Behind that screen, the money is still moving through a chain of institutions that reconcile with each other in batches, during business hours, one hop at a time.

Much of payments innovation has focused on the screen: smoother checkouts, faster onboarding, better apps. Those improvements are real, but they sit on the same settlement plumbing. Our thesis is that settlement, not payments UX, is the real bottleneck, and that stablecoins are becoming the internet's settlement layer: programmable, always-on money that can move between any two parties with an internet connection. We also believe value will accrue less to issuance alone and more to the businesses that connect stablecoins to the real economy.

## Settlement is the bottleneck

Every payment has two parts. The first is the message, an instruction that says who pays whom and how much. The second is settlement, the moment money actually changes hands and the transfer becomes final. Most consumer payment products have made the message fast and pleasant. Few have changed settlement.

That gap has consequences. A merchant that accepts a card sees an approval immediately but receives the funds later, minus fees, and can still face a dispute long after the sale. A platform paying users around the world often has to prefund balances in each market it serves, because the rails underneath do not move money on demand.

A faster app on slow rails is still slow rails. Some fintech companies offer instant transfers by fronting the money themselves and settling later. That works, but it turns every payment into a credit and liquidity problem on the company's own balance sheet, and the cost of carrying that problem grows with volume.

## The friction of correspondent banking

The friction is sharpest across borders. Imagine a supplier in one country paying a manufacturer in another. Unless their banks have a direct relationship, the payment travels through correspondent banks, each of which keeps an account with the next. Every hop adds a fee, a compliance check and a cutoff time. The payment can stall over weekends and public holidays in any country along the route.

The sender often cannot see where the money is. The recipient may receive less than the invoice, with deductions taken along the way and little explanation. If one detail is wrong, the payment can bounce back days later, and the process starts again.

The hidden cost is capital. To keep this system running, banks and payment companies park money in prefunded accounts around the world, waiting for payments that may never come. That idle money is expensive, and customers ultimately pay for it. Correspondent relationships are also costly to maintain, so the ones that earn the least tend to be cut first, which leaves smaller banks, and businesses in smaller markets, poorly served.

None of this is anyone's failure. It is the natural result of a network built from bilateral relationships between institutions that do not share a ledger.

## Programmable, always-on money

A stablecoin is a token on a blockchain designed to keep a stable value against a currency, usually the dollar, backed by reserves and redeemable through its issuer. That simple design changes settlement in four ways.

**The transfer is the settlement.** When a stablecoin moves from one wallet to another, the payment and its settlement are the same event. There is no batch to wait for and no chain of ledgers to reconcile. Both parties see the same record.

**It runs 24/7.** Public blockchains do not close for weekends, holidays or cutoff times. A payout can arrive when the recipient needs it, not when the banks reopen.

**It is global by default.** Anyone with a compatible wallet can receive a stablecoin. Reaching a new country becomes a question of local access and compliance, not of new banking relationships.

**It is programmable.** Because the money lives on a ledger that runs code, payment logic can live beside it. Funds can sit in escrow and release when a delivery is confirmed. A payout can be split among several parties in one transaction. Wages can stream as they are earned. Treasury rules, such as sweeping idle balances at the end of each day, can run automatically.

For a business, this changes treasury itself. Instead of trapping working capital in prefunded accounts across many currencies, it can keep one stablecoin balance and convert locally when needed. Instead of reconciling statements from several banks, it can read one ledger.

This is why we describe stablecoins as a settlement layer rather than a payment method. The internet gave the world a common way to move information between parties that do not know each other. We believe stablecoins on public blockchains are becoming the common way to settle value between parties that do not share a bank.

## Where value accrues

The obvious place to look for value is issuance. On its own, we think it is the narrowest opportunity. A credible issuer needs regulatory approval, careful reserve management, deep banking relationships and, above all, liquidity and acceptance that take years to build. Because liquidity attracts liquidity, we expect issuance to stay concentrated among a few large players. For users, one well-run digital dollar is largely interchangeable with another. They care whether it is redeemable, liquid and accepted.

> An issuer without distribution is a balance sheet waiting for customers.

We expect more of the value to accrue to the layers that connect stablecoins to real economic activity:

- **Distribution.** Wallets, neobanks, payroll providers, marketplaces and business software that own the customer relationship. Whoever owns the end user decides which stablecoin is used and where it flows.
- **On- and off-ramps.** Converting local currency into stablecoins and back, market by market, through local banks and local payment methods. Ramps are local, regulated and operationally hard, which is exactly what makes a good one defensible.
- **Compliance.** Identity verification, sanctions screening, transaction monitoring, sharing sender and recipient information between institutions, and analytics that trace funds across the ledger. The strongest products build compliance into the flow rather than bolting it on.
- **Treasury tools.** Businesses need to custody, approve, reconcile, account for and report stablecoin balances with the controls they expect from a bank. This is unglamorous software with high switching costs.
- **Merchant acceptance.** Checkout, invoicing, refunds and automatic conversion into local currency, integrated with the payment and accounting systems merchants already use. Merchants do not accept money they cannot reconcile.
- **FX.** Commerce happens in many currencies, not one. Converting between stablecoins in different currencies, and between stablecoins and local money, with deep liquidity and transparent spreads, is in our view one of the least developed and most important parts of the stack.

Each of these layers accumulates what a new entrant cannot easily copy: licenses, banking partners, integrations, local knowledge and the trust of finance teams. That is where we expect durable companies to be built.

## The risks are real

A settlement layer has to be trustworthy before it can be useful. Each of the main risks is also a design requirement.

**Reserve quality and transparency.** A stablecoin is only as sound as the assets behind it and the evidence that those assets exist. The questions that matter are what the reserves consist of, where they are kept, whether they are protected if the issuer fails, and how often an independent party verifies them. Designs that relied on market incentives instead of real reserves have already unwound when confidence broke.

**Loss of peg.** Even a well-reserved stablecoin can slip away from its target value in a panic, especially if users doubt they can redeem quickly. Redemption access matters: who can redeem directly, how fast and on what terms. Products built on stablecoins need monitoring, a clear policy for when a peg wobbles and, where it makes sense, support for more than one issuer.

**Regulatory divergence across markets.** Regulators in several large markets are writing stablecoin rules, and they do not agree on who may issue, how reserves must be managed and audited, how coins issued abroad are treated, or what wallet providers must do. A product that is compliant in one market may need to be rebuilt for the next. Some central banks also worry about digital dollars displacing their own currencies, which shapes how welcoming local rules are.

**Fragmentation across chains.** The same stablecoin often exists on many blockchains, and its liquidity is split between them. Moving value across chains relies on bridges or issuer-run transfer services, and bridges have been a repeated point of failure. Sending funds on the wrong network can mean losing them. Infrastructure that hides this complexity, so a customer sends dollars rather than choosing a chain, is valuable precisely because the landscape underneath is messy.

We see each of these risks as a market. Reserve transparency, peg monitoring, multi-market compliance and chain abstraction are all products this settlement layer needs.

## What we look for

In stablecoin and payments founders, we look for:

- Deep knowledge of the money flow being fixed: the corridor, the customer, the banking partners and the compliance obligations at each step.
- A specific wedge, such as one corridor, one vertical or one type of payout, with real usage from real customers rather than activity driven by incentives.
- Licensing and compliance treated as core product work from day one, with a clear plan for each market.
- A distribution advantage, whether a channel, a partner, a community or deep knowledge of a vertical.
- Products customers can use without needing to know a blockchain is involved.
- Resilience by design: more than one issuer or chain where it makes sense, a plan for a loss of peg, and controls a finance team and a regulator would both recognize.
- Economics that work without a token or subsidies.

If that describes your company, we would like to see your deck.
