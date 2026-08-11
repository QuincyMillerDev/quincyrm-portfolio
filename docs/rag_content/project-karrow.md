# Project: Karrow - Newsletter Archives into Social Content

## Overview / Summary

Karrow ([karrow.com](https://karrow.com)) is a software product I founded that turns a newsletter operator's archive into scheduled social content in the operator's own voice. Connect a newsletter source, and Karrow ingests the archive, learns the voice, generates platform-appropriate posts per issue, and schedules them for review and publishing. It is a self-serve B2B SaaS that I designed, built, and operate solo, alongside my full-time role.

## The Stack, and Why

Karrow runs on TanStack Start (full-stack React), Convex as the backend (database, server functions, scheduled functions), Better Auth for authentication, and Stripe for billing. The stack was chosen deliberately for a solo operator: one backend system instead of a separate database, queue, cron, and server, with realtime built in for the draft, review, approve workflow.

Two decisions worth noting:

*   **Metered billing done honestly.** Operators pay a flat base per newsletter, with connected accounts as a per-unit lever and posting as a metered passthrough via Stripe Meters. The obvious easy path (an auth provider's built-in billing) could not express metered usage, so billing is raw Stripe, fully decoupled from auth so a breaking change in one never touches the other.
*   **A source-blind ingest driver.** Ingestion originally shipped coupled to one newsletter platform (beehiiv) at the schema level. When the second source (Ghost) landed, I generalized: per-source modules shrank to pure adapter clients, and all orchestration (backfill, polling, per-post ingest, dedup, retry handling, webhook registration) lifted into a single source-blind driver dispatching through an adapter registry. One discriminated connections table replaced per-source tables. The seam existed on paper before that, but a contract with one implementation is a hypothesis; the second source is what made it real.

Product scoping was research-driven: primary demand research killed a planned third integration before any code was written, because that platform's audience turned out to want subscriber acquisition, not editorial publishing, which is the wrong fit for a voice-from-archive product.

## Engineering Discipline

Karrow has thirteen architecture decision records for a product built by one person. That is not ceremony: each ADR records the options rejected and why, which is what lets me return to the codebase after weeks away, and what gives AI coding agents the context to work on it effectively.

## What It Demonstrates

Karrow is my range proof: a completely different stack from AltIndex (Convex and TanStack versus FastAPI and React), a different business model (metered B2B SaaS versus consumer subscriptions), and the same habits (documented decisions, seams that earn their existence, billing treated as a first-class system). It also demonstrates comfort with LLM generation pipelines under a review-and-approve workflow, where a human gate sits between the model and anything public.

---
