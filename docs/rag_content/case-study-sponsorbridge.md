# Case Study: SponsorBridge - AI Quality Control That Shows Its Work

## Overview / Summary

SponsorBridge is a platform I founded that helps creators and sponsors run sponsorship campaigns: contracts, deliverables, review workflows, invoicing, and, at its technical core, an AI quality-control pipeline that checks sponsored content against brand rules. It is my clearest piece of applied AI engineering, because the central problem is exactly the one that matters in production AI: a single confident model call is wrong often enough to be worthless, and the fix is architecture, not a better prompt.

## The Problem

A sponsor sends a creator a set of brand rules: say the product name correctly, show the logo, do not make health claims, include the disclosure. Someone has to verify that a two-hour video actually complies. Doing that by hand does not scale; doing it with one giant "here are the rules, here is the video, find violations" model call fails in a specific, well-documented way: compliance checking collapses on rare and co-occurring rule violations even when aggregate accuracy looks fine. Missing a rare mandatory requirement is the worst possible failure for a QC product, because it is precisely the case the customer bought the product to catch.

## The Design: Compile, Locate, Check, Verify

I decomposed the analysis into a deterministic pipeline with the model doing narrow judgment work inside each stage:

1.  **Transcribe:** Speech-to-text with custom vocabulary derived from the brand rules themselves, so product names transcribe correctly. Transcripts are cached, so re-runs on unchanged files skip transcription entirely.
2.  **Compile:** An LLM pass turns the campaign's brand rules and QC instructions into a typed checklist: each check has a question, a modality (speech, on-screen text, or visual), an expected outcome, and a severity. The checklist is cacheable per campaign because the rules snapshot is frozen.
3.  **Locate:** A text-only pass over the timestamped transcript finds the sponsored segments, so visual analysis targets the right frames instead of sampling blindly.
4.  **Check:** Checks run in small batches grouped by modality, with the full transcript and segment-targeted frames as evidence. Every check must return a verdict, and the output schema forces the evidence quote and the reasoning to come before the verdict, so the model commits to evidence before it commits to a conclusion.
5.  **Verify:** Every violation gets one factored verification call: a second model re-checks the cited evidence while deliberately blind to the finder's reasoning, because verifiers that see the original reasoning inherit its bias. A finding can only be dismissed by pointing at contradicting evidence. Ambiguous findings are kept but downgraded to warnings. There is no iterative re-review, because repeated review passes erode recall.

Timestamps always come from the transcript and frame labels, never from model estimates. Runs are bounded and reproducible: no open-ended agent loops deciding to fetch more evidence, because bounded sample-then-verify pipelines beat agentic loops on both variance and cost when the evidence fits in context.

## The Principles

*   **Recall comes from decomposition, precision comes from verification.** The verifier can only remove findings, never add them, so it cannot hurt recall below what the check stage produced.
*   **Evidence before verdicts.** The system returns quotes, frames, and citations, not assertions. A finding without evidence is not a finding.
*   **Decline rather than guess.** Checks that cannot be evaluated against the available evidence are routed to a skipped list and surfaced as such, never silently evaluated against nothing.
*   **Cost as a design input.** A full run on a two-hour video costs one to three dollars; re-runs on cached transcripts cost cents and take seconds.

When image deliverables were added later (social graphics, thumbnails), they ran through the same pipeline with the audio stages skipped rather than a parallel code path, which is the payoff of designing the pipeline around stages instead of around the video format.

## The Rest of the Platform

The QC pipeline sits inside a full product: layered data architecture, contract and entity separation, a unified activity event log, invoice-based billing, an asset library, and a custom video player for review workflows. Each significant decision has an architecture decision record; the platform has thirteen. I built SponsorBridge solo, end to end.

## Why It Matters

Most AI automation lives where a wrong answer is cheap. QC for sponsorships is a domain where a wrong answer costs someone money and trust, which rules out the easy design. SponsorBridge is my proof that I can build AI systems for the domains where the failure lands on a person: deterministic orchestration, narrow model judgment, factored verification, and provenance on every claim.

---
