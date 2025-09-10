# Auto Keyword Tailor — Product & Technical Overview

## Executive Summary
Auto Keyword Tailor is a focused resume optimization product that analyzes a user’s resume against a target job description to extract missing ATS keywords and tailor the resume content—truthfully and naturally—to improve Applicant Tracking System (ATS) match rates. It supports parsing resumes (PDF/DOCX) into structured JSON Resume data, keyword extraction, AI‑assisted content enhancements, and export to consistent PDF/DOCX templates. Authentication is handled via Clerk, persistence via Supabase, and rendering via React PDF and `docx`.

## Target Users & Personas
- **Active Job Seekers**: Need fast, role‑specific resume tailoring to pass ATS screens.
- **Career Changers**: Require guidance to align past experience to new role language.
- **University Students/Graduates**: Need structure, keywords, and presentation quality.
- **Coaches/Bootcamps**: Want repeatable, quality outputs for many students/clients.

## Value Proposition
- **Higher ATS pass‑through** with precise, missing‑keyword detection and natural integration.
- **Truthful tailoring**: Enforces authenticity rules and avoids over‑claiming via business logic and prompts.
- **Speed to custom resume**: Parse, tailor, preview, and export in minutes.
- **Consistency and quality**: Centralized schema, validated AI outputs, and standardized templates.

## Key Features
- **Resume parsing** (PDF/DOCX → JSON Resume) with URL sanitization and schema validation.
- **Keyword extraction** from job descriptions versus current resume content.
- **AI optimization**: Keyword integration plus impact/metrics/polish improvements, or enhancement‑only mode.
- **Resume management**: Create, update, set default, delete; quota‑aware.
- **Preview & Export**: On‑demand PDF preview, PDF and DOCX downloads from the same data pipeline.
- **Usage tracking & limits**: Monthly free limits; unlimited for subscribers.
- **Authentication & Webhooks**: Clerk auth and user provisioning via webhooks.
- **Subscription awareness**: Subscriber status read from Clerk `publicMetadata` and Supabase.
- **Error handling & rate limits**: Unified API handler, structured logging, endpoint throttling.

## Pricing & Packaging (suggested)
- **Free**: 1 stored resume, 20 optimizations/month, PDF preview, DOCX/PDF export enabled, watermark optional.
- **Pro (Subscription)**: Up to 10 stored resumes, unlimited optimizations, priority limits, advanced templates.
- Optional add‑ons: Additional templates, recruiter‑style review, job tracker export.

## Metrics & KPIs
- New signups, activation rate (parse+optimize+export), conversion to Pro, retention.
- Avg optimizations per user, keywords applied/session, time to export.
- Template usage distribution, export success rate, error rates, rate‑limit hits.

## System Architecture (High Level)
- **Frontend**: Next.js App Router, React 19, Tailwind UI components.
- **Auth**: Clerk middleware `middleware.ts` guards private routes; sign‑in/up flows under `/app/auth/*`.
- **APIs**: Next.js route handlers in `app/api/**` with a shared wrapper (`withApiHandler`) for auth, error handling, and rate limits.
- **Services**: Domain services in `lib/services/**` encapsulate business logic (keywords, optimize, parse, template render, usage, dashboard, subscription, resume lifecycle).
- **Data**: Supabase for persistence with repositories in `lib/supabase/repositories/**` and an admin client for server routes.
- **AI**: `@ai-sdk/openai` GPT‑5 models for text extraction/optimization with strict JSON parsing and schema validation.
- **Docs/Rendering**: React PDF for preview/PDF and `docx` for DOCX export using the same data.

## Security, Privacy, Compliance
- **AuthN/AuthZ**: Clerk sessions enforced via middleware and `withApiHandler`.
- **PII**: Resume content treated as PII; avoid logging raw content; structured logging with previews only.
- **Rate limiting**: Centralized rate limits per route group to mitigate abuse.
- **Validation**: Zod schemas for env, inputs, AI JSON, and structured resume data.
- **Secrets**: Keys via environment variables validated in `lib/config/env.ts`.
- **Data residency**: Supabase project region; ensure backups, least‑privilege service keys.

## Failure Modes & Safeguards
- AI returns invalid JSON → robust parsing, fallback, and validation; user‑facing error messages.
- Supabase errors → safe defaults returned for subscription/usage; actionable logs.
- Large exports → streaming generation and clear error handling for PDF/DOCX.

---

## Detailed Technical Overview

### Authentication & Middleware
- `middleware.ts`: Public routes, maintenance mode toggle, and enforcement of protected routes via `auth.protect()`.
- Clerk webhook: `app/api/webhooks/clerk/route.ts` verifies `svix-*` headers and syncs user profile data.

### Environment Configuration
- `lib/config/env.ts`: Zod‑validated envs (OpenAI, Clerk, Supabase, logging). Fails fast on misconfig.

### API Handler Pattern
- `withApiHandler` in `lib/utils/error-handler.ts`:
  - Resolves Clerk `userId`, maps to Supabase user via `UserRepository`.
  - Optional `rateLimit` config per route.
  - Standardizes error serialization.

### Core Domain Services
- `keyword-extraction-service.ts`
  - Builds resume context from `ResumeData`.
  - Calls GPT‑5 to extract ONLY missing keywords from job description.
  - Validates with zod and normalizes compound keywords.
- `resume-optimization-service.ts`
  - Two flows:
    - Enhancement‑only (no keywords): tone/metrics/impact improvements.
    - Keyword‑driven: one change per keyword + enhancements.
  - Strict JSON contract and validation; applies changes via `ChangeApplicationUtil`.
- `resume-parser-service.ts`
  - Parses PDF via `pdf-parse`, DOCX via `mammoth`, then AI structuring to JSON Resume schema.
  - URL sanitization and deep normalization; warnings/suggestions returned.
- `template-renderer.ts`
  - PDF: React PDF components `StandardTemplatePDF` and `CompactTemplatePDF`.
  - DOCX: custom layout engine with consistent typography/spacing; same data inputs.
- `resume-service.ts`
  - CRUD with business rules (name length, schema validation, default selection).
  - Storage quotas via `canUserStoreResumes` and subscription status.
- `usage-service.ts`
  - Records optimization usage and enforces free vs. subscriber limits.
  - Pulls subscription status primarily from Clerk `publicMetadata`.
- `dashboard-service.ts`
  - Aggregates user metrics: recent optimizations, usage, resume counts, subscription status.
- `subscription-service.ts`
  - Reads subscription state from Supabase fallback; provides status checks.

### API Routes (Selected)
- `POST /api/keywords` → Extract missing keywords from JD vs resume.
- `POST /api/optimize` → Apply keyword/enhancement changes; record usage.
- `GET /api/resumes` and `POST /api/resumes` → List/create resumes.
- `GET/PUT/DELETE /api/resumes/[id]` → Fetch/update/delete resume.
- `GET /api/resumes/default` and `PUT /api/resumes/[id]/default` → Default selection.
- `POST /api/resumes/preview` → HTML with embedded PDF preview.
- `GET /api/resumes/[id]/download-pdf|download-docx` → Exports.
- `GET /api/usage/stats` → Usage, quotas, remaining.
- `GET /api/subscription/status` → Subscription state.
- `GET /api/dashboard/metrics` → Aggregated dashboard metrics.

### Business Rules & Limits
- `lib/constants.ts`:
  - Free: 1 stored resume, 20 optimizations/month.
  - Pro: 10 stored resumes, unlimited optimizations.
  - Helpers for can/cannot actions, monthly resets.

### Data Model (JSON Resume high‑level)
- `basics` (name, label, contact, profiles, summary)
- `work`, `education`, `projects`, `awards`, `certificates`, `publications`, `volunteer`, `skills`, `languages`, `interests`, `references`
- Each entry normalized and validated with IDs for deterministic rendering.

### Frontend Experience (high‑level)
- Editor UI with sidebar sections and toolbar, live preview integration.
- Floating user dashboard with usage/subscription status and upgrade prompts.
- Auth pages under `app/auth/*`; maintenance page and global layout with theme provider.

### Observability & Ops
- Structured logging via `lib/logger/logger.ts` with categories: DATA_FLOW, PDF_OPERATION, DOCX_OPERATION, AI_PROCESSING.
- Rate limits configured via `lib/utils/rate-limit.ts` per API group.
- Error boundaries in UI (`components/error/*`) and AsyncErrorBoundary.

### Deployment & Environments
- Next.js 15 with React 19; Vercel compatible deployment.
- Env validation ensures boot‑time correctness; maintenance mode toggle for prod.

## Roadmap Ideas
- Additional templates (modern, creative), cover letter generation, LinkedIn profile tailoring.
- Multi‑resume A/B experiments per job posting.
- JD parsing from links (auto‑scrape), company‑specific style guides.
- Team seats for coaches/recruiters, shared template libraries.

## Risks & Mitigations
- AI hallucination → strict schemas, validation, limited transformations, and user review UX.
- Vendor limits/latency → retries, backoff, small prompts, localized parsing.
- Data sensitivity → PII handling, minimal logging, user‑requested deletion API.

## Appendix: Tech Stack
- Next.js, React 19, Tailwind, Radix UI.
- Clerk for auth/webhooks.
- Supabase for persistence.
- `@ai-sdk/openai` GPT‑5 for AI tasks.
- React PDF, `docx` for document generation.
- Zod for schema validation, Jest for tests.
