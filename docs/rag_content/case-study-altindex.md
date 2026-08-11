# Case Study: AltIndex - Running a Production Alternative Data Platform

## Overview / Summary

AltIndex ([altindex.com](https://altindex.com)) is an alternative data platform for retail investors, owned by Invested Inc. Since September 2025 I have been Invested's Head of Product & Engineering, and AltIndex is the system I run: 23 daily data pipelines producing 104 signals per company across 4,600+ equities, web and mobile apps used by tens of thousands of investors, an alerting engine sending roughly 15,800 alerts a month across 16 signal types, and unified billing across Stripe and mobile in-app purchases. I am the lead engineer across every layer, from the ingestion pipelines to the React 19 web app and the Expo mobile app.

This is my deepest single body of engineering work, and it is the clearest demonstration of what I mean when I say I build systems that run in production rather than demos.

## The Inherited System

When I took over, AltIndex ran on a legacy PHP monolith that had grown over six years. The database held over one hundred tables, roughly a third of them dead, frozen, or empty, with nothing in the schema saying so. Column names were frequently misleading. There was no documentation of what was scheduled to run, and the only source of truth for the ingestion jobs was the production crontab itself.

My first real work was mapping the system as it actually ran: which pipelines still landed data, which tables the product actually read, and where the failure modes were. That map became the foundation for everything after.

## The Rebuild

I replaced the legacy front end with a modern stack while keeping the business running on top of it:

*   **Web:** React 19 with Tailwind, rebuilt around five core destinations after an information-architecture redesign.
*   **Mobile:** Expo/React Native apps for iOS and Android, sharing business logic with the web through a typed API client generated from the backend's OpenAPI schema.
*   **Backend:** Python with FastAPI and async SQLAlchemy, structured as domain-grouped packages with explicit boundaries. Cross-domain imports are forbidden by convention; each domain owns its own logic and limits.
*   **Streaming:** A unified server-sent events transport for streaming AI responses and live updates.

## Engineering Decisions I Am Proud Of

### The Plan entitlements model

Subscription gating had drifted across the codebase: the raw tier integer from the database was compared directly at more than seven different call sites, each re-deriving the tier model by hand, and a deprecated legacy tier value made raw comparisons actively dangerous. The frontend hand-mirrored three of the limits and had no knowledge of the other eight gated features, so the paywall UX could not tell users why they hit a wall.

The fix was a single `Plan` primitive: one place where raw database values collapse into free, starter, and pro, with explicit ranking rather than enum ordinals. Per-feature limits stayed with the domains that enforce them, but every enforcement site now asks the Plan model instead of comparing integers. A separate `is_protected_tier` concept keeps admin-account protection out of the entitlements path entirely, because a billing change should never be able to grant admin powers. Per-user entitlements are now served on the profile endpoint, so the frontend reads limits from the API instead of hardcoding them. A single matrix test covers every tier against every gate.

The lesson: when enforcement logic scatters, you do not fix it with discipline, you fix it with a primitive that makes the wrong thing unrepresentable.

### Billing across two providers

AltIndex sells subscriptions through Stripe on the web and through Apple and Google in-app purchases on mobile. A user's effective tier is the union of entitlements across providers, resolved through a single webhook pipeline with RevenueCat as the operational source of truth for subscription state. Getting billing right across providers, including environment routing for webhooks and reconciliation against Stripe, is some of the least glamorous and most important work in the product.

### The alerting engine

Subscribers receive alerts when signals move: roughly 15,800 alerts a month across 16 signal types, delivered through a dedicated worker with push and email delivery layers. Alerting is where data engineering meets product trust: a late alert is an annoyance, but a wrong alert teaches users to ignore the product.

### AI features with entitlement-aware access

The platform includes LLM-powered analytics features and an MCP connect surface, so paying users can bring AltIndex data into their own AI tools. AI access is gated through the same entitlements model as everything else, with per-tier turn caps.

## Data Engineering

The warehouse ingests alternative data across 23 pipelines running daily: social sentiment (Reddit and other sources), job postings, insider trading, congressional trading, app-store rankings, news coverage, web traffic, and more. Signals roll up into per-company scores and a timeline that powers charts, alerts, and the AI features. Working safely against tables with tens of millions of rows, on a database shared with a live product, taught me query discipline the hard way: bounded scans, indexed filters, and treating every liveness assumption as a hypothesis to verify rather than a fact to remember.

## Architecture Decision Records

I document every significant design decision in ADRs, thirty-four of them and counting for the platform. They cover everything from the unified SSE transport to the entitlements model to how analytics events are keyed. Writing the decision down, with the options rejected and why, is how a one-engineer platform stays maintainable and how the next engineer (or the AI agent assisting one) gets context that would otherwise live in my head.

## My Role, Precisely

I am a W2 employee of Invested Inc. with the title Head of Product & Engineering. I am not a founder of AltIndex; the company existed before I joined. What I own is the product and engineering function: the roadmap, the architecture, the code, and the outcomes.

---
