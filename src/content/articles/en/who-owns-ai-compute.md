---
title: "Who owns AI compute? The case for decentralized infrastructure"
description: AI compute is concentrating in very few hands, and we believe open networks can coordinate distributed capacity, starting with inference and fine-tuning.
date: 2026-10-28
pillar: ai
type: thesis
author: 01 Capital Research
---

Every AI product is, underneath, a claim on compute. Models are trained on it, served on it and improved on it. The organizations that control the largest pools of it increasingly set the pace, the terms and the direction for everyone else.

We believe this concentration is one of the most important structural facts in technology, and that it is too often treated as a law of nature rather than a market outcome. Our thesis is that open networks, which coordinate idle and distributed hardware through software and shared incentives, will take on a meaningful share of AI workloads.

We expect them to win first in inference, fine-tuning, batch jobs and edge deployments. We do not expect them to replace the largest centralized clusters, and they do not need to. They need to be cheaper, more available or more resilient for the workloads they target, and honest about the rest.

## Compute is the bottleneck, and it is concentrating

For most of the software era, the scarce inputs were talent and distribution. Hardware was a commodity, rented by the hour. AI has changed that. Training a frontier model requires very large numbers of accelerators wired together to act as one machine, and serving it at scale means reserving capacity well in advance.

Supply is narrow at every layer. The most advanced accelerators come from very few suppliers, and much of the capacity built on them sits with the largest cloud providers and a handful of AI labs. That structure creates three risks for everyone else.

- **Cost.** When a few suppliers control capacity, they set the terms. Startups commit to reserved capacity they may not fully use, or pay a premium for on-demand access when they need it most. For an AI company, the cost of compute can decide whether the unit economics work at all.
- **Access.** In a constrained market, capacity flows to the largest customers first. Researchers, early-stage companies and entire regions wait behind them, and some can be shut out by export rules or simple commercial priority.
- **Resilience.** When much of the world's AI runs in a few facilities operated by a few companies, a single outage, policy change or change in terms ripples through every product built on top.

None of this is a criticism of the companies building large clusters, which are responding rationally to demand. The question is whether there is a credible alternative for the many workloads that do not need a frontier cluster.

## What open networks can do

Outside the largest clusters sits a long tail of capable hardware that is underused for much of the day: accelerators in smaller data centers between contracts, university machines overnight, workstations, gaming computers and increasingly capable consumer devices. The capacity exists. What has been missing is a reliable way to coordinate it.

An open compute network is a market and a scheduler in one system. At its core, it does four things.

1. It lets anyone with suitable hardware offer capacity, described in standard terms.
2. It matches jobs to machines based on memory, location, latency, reliability and cost.
3. It checks that the work was done correctly.
4. It settles payment between parties who have never met, across borders and at any hour.

Bitcoin showed, in a narrow domain, that open incentives can coordinate a global network of hardware operators who neither know nor trust one another. Its work has no value outside the network; it exists to make the ledger expensive to attack. The opportunity in AI is to point the same coordination at work that is valuable in its own right: training, adapting and serving models.

If that works, the benefits are structural. Supply becomes elastic, because new capacity can join without a procurement process. Access opens to anyone who can pay, within the limits of the law. Resilience improves, because no single operator's failure takes the system down.

## The hard problems

Pooling spare computers is an old idea. It is not yet a default option for AI because the workloads raise hard problems, and pretending otherwise is how projects in this category fail. We see five.

### Verification

When you rent a machine from a stranger, how do you know the job ran correctly, on the model you specified, without shortcuts? Checking the work behind a Bitcoin block is far cheaper than doing it. Most AI work offers no such shortcut.

Networks combine several approaches. Redundant execution sends the same task to several nodes and compares the results, with tolerances, because different hardware can produce slightly different numbers. Optimistic schemes accept results unless challenged, and dishonest operators lose a stake. Hardware attestation relies on trusted execution environments, and cryptographic proofs of computation are improving but remain costly for large models. We expect the winning networks to match the method to the value and risk of each job.

### Latency and bandwidth

Large training runs are communication problems as much as computation problems. Accelerators in a frontier cluster exchange updates constantly over dedicated high-bandwidth links. Spread the same job across the public internet, and the network, not the chips, becomes the bottleneck. Training methods that synchronize less often and compress what they send are promising. We expect them to widen what can run on distributed hardware, but not to close the gap for the largest, most tightly coupled runs.

### Reliability

A data center comes with a contract and an operations team. A heterogeneous network comes with machines that can vanish mid-job because their owner needed them back. Open networks have to engineer reliability in software, through checkpointing, redundancy, reputation systems, service tiers and penalties for operators who miss commitments. Production inference has to answer 24/7, so none of this is optional.

### Data privacy

Many valuable workloads involve sensitive data: medical records, financial transactions, proprietary code. Enterprises are rightly unwilling to send that data to an anonymous machine. Confidential computing hardware, encryption, data minimization and routing sensitive jobs only to vetted operators all help. We expect privacy to set the order of adoption, with public data and non-sensitive inference moving first and regulated data following as attestation matures.

### The economics of incentives

Token incentives can bootstrap supply quickly. They can also produce a network full of hardware and empty of customers. If operators earn mostly from token emissions rather than from fees paid by real users, the network is subsidizing supply with no demand to meet it, and subsidies end. The real test is not how much capacity a network lists, but how much of it paying customers use, and whether useful work costs less than the alternatives.

## Where decentralized compute works first

Put those constraints together and a map emerges. We expect decentralized compute to win first where workloads are parallel, tolerant of latency or naturally distributed.

- **Inference.** Serving a trained model is usually a self-contained job that fits on one machine or a small group. Requests can be routed to nearby nodes, retried on failure and spot-checked, and we expect demand to grow as open models improve.
- **Fine-tuning.** Adapting an open model to a specific domain, especially with methods that train only a small set of added parameters, needs far less coordination than pretraining and fits on modest hardware.
- **Batch workloads.** Embedding document collections, generating synthetic data, running evaluations and processing media do not need to finish in the next second. They need a low cost per unit of work, which is exactly where idle capacity competes.
- **Edge workloads.** Some inference belongs close to the user for reasons of latency, privacy or connectivity: on devices, in local facilities and in places the largest clouds serve poorly. Distributed demand suits distributed supply.

Centralized clusters keep their advantage where tight coupling matters most. Pretraining frontier models needs uniform hardware, dedicated interconnects and a single operator accountable for uptime. We expect workloads with strict compliance requirements to stay with providers that can sign contracts, pass audits and accept liability.

> The question is not whether open networks can beat a frontier cluster. It is whether they can beat the alternative for the workloads they target.

That is not a weakness in the thesis. As AI moves from the lab into products, we expect everyday workloads to grow as a share of demand. The likely end state, in our view, is a layered market: frontier training stays concentrated, while a growing share of everything downstream runs on whatever capacity is cheapest, closest and good enough.

## Tokens are plumbing, not the product

We expect most decentralized compute networks to use a token, and the strongest teams are precise about why. In this category, a token can do three useful jobs.

- **Payment and settlement** between strangers, across borders, in small amounts and at machine speed.
- **Collateral** that operators post and lose if they cheat or miss commitments, which is what makes optimistic verification work.
- **Bootstrapping** supply before customer demand can sustain it, on a schedule that tapers as fees take over.

What a token should not be is the product. Customers want predictable cost and quality, and most would rather not manage a separate asset to get it. The best designs let them pay in stable units and keep token mechanics behind the scenes.

The test is simple. Remove the token from the pitch and look only at fees, costs and reliability. If the network still makes sense, the token is doing its job. If it does not, the token is covering for a missing business.

## What we look for

We back teams building the open compute layer and the products that run on it. We look for:

- **Demand before supply.** Paying customers, pilots or letters of intent for real workloads, not just a long list of connected machines.
- **A wedge workload.** Inference, fine-tuning, batch or edge, chosen because the team can be clearly better there.
- **Verification that fits the workload,** with a clear view of its cost and failure modes.
- **Economics that work without relying on the token price,** with fees from real usage on a path to covering what operators earn.
- **Serious engineering on reliability and privacy,** because enterprise customers test both before they trust you.
- **Founders with deep domain knowledge** in distributed systems or machine learning infrastructure, who ship quickly and are candid about trade-offs.

If that describes your company, we would like to see your deck.
