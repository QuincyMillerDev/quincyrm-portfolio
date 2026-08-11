# Skills: Quincy Miller - Technical & Soft Skills

## Overview / Summary

I am an AI engineer and full-stack product builder. My current work running AltIndex at Invested Inc. spans data engineering (23 daily pipelines), backend systems (Python, FastAPI, async SQLAlchemy), web and mobile front ends (React 19, Expo), billing, and LLM-powered product features. Before that I built enterprise data platforms at Hubbell on Azure and Databricks. My strongest belief about skills is that they compound: the same discipline that makes a data pipeline reliable makes an AI system trustworthy.

## Technical Skills

### Programming Languages
*   **Python:** Primary backend language. Production use with FastAPI and async SQLAlchemy (AltIndex), PySpark and Databricks pipelines (Hubbell), SDK development, MCP servers, and LLM orchestration.
*   **TypeScript/JavaScript:** Primary frontend language. Production use with React 19 and Expo/React Native (AltIndex), Vue.js and Nuxt (this portfolio, UConn projects), Angular (Hubbell), and Node.js.
*   **C#:** Production experience with .NET web APIs in enterprise settings (Hubbell).
*   **SQL:** Extensive production work with MySQL/MariaDB (AltIndex) and PostgreSQL (Hubbell, UConn projects), including query optimization against tables in the tens of millions of rows.
*   **Java:** Experience with Spring Boot (Hubbell internship, coursework).
*   **C/C++:** Systems programming, OpenGL, containerizing legacy analysis algorithms (ProteomeX), coursework in data structures and embedded systems.
*   **PHP:** Working knowledge from maintaining and ultimately replacing a legacy PHP monolith at AltIndex.
*   **Bash:** Comfortable with scripting for Linux environments and CI.

### AI Engineering
*   **LLM orchestration:** LangChain (this portfolio's RAG chatbot), custom deterministic pipelines around model calls (SponsorBridge's compile, locate, check, verify QC pipeline), OpenAI and Anthropic APIs.
*   **RAG systems:** Full lifecycle: document preparation, chunking, embeddings (OpenAI text-embedding-3), vector storage (Pinecone), query rephrasing, retrieval, provenance-cited generation, and decline-when-ungrounded behavior.
*   **MCP (Model Context Protocol):** Built MCP servers in Python (secure documentation access at Hubbell) and open source (Ilograph MCP Server with FastMCP and asyncio).
*   **Design principles I apply:** decomposition for recall, factored verification for precision, evidence before verdicts, bounded and reproducible runs over open-ended agent loops, and human approval gates where a wrong answer is expensive.
*   **AI-assisted development:** Daily agentic coding workflows; I have also taught this, running a hands-on Copilot and prompt-engineering workshop for professional engineers.
*   **ML foundations:** Fine-tuned BERT for domain-specific named entity recognition (94.47% F1 on the MIT Movie Corpus) with PyTorch and Hugging Face Transformers.

### Backend Development
*   **Frameworks:** FastAPI with async SQLAlchemy (AltIndex production), .NET Core/ASP.NET (Hubbell), Django REST Framework (ProteomeX), Express.js, Spring Boot (familiar).
*   **API design:** RESTful APIs at production scale, webhook pipelines (Stripe and RevenueCat billing events), server-sent events for streaming, versioning discipline.
*   **Auth:** JWT, OAuth, session management, API key issuance and entitlement gating.

### Data Engineering & Analytics
*   **AltIndex:** 23 daily ingestion pipelines aggregating social sentiment, job postings, insider trading, congressional trading, app-store metrics, news, and more, producing 104 signals per company across 4,600+ equities, plus an alerting engine delivering roughly 15,800 alerts a month across 16 signal types.
*   **Hubbell:** Databricks and Apache Spark pipelines over hundreds of millions of grid records, Delta Lake, workflow orchestration.
*   **Libraries:** Pandas, NumPy, PySpark.

### Cloud & DevOps
*   **Cloud platforms:** Microsoft Azure (primary at Hubbell), AWS (EC2 deployments at UConn), Vercel (this portfolio: serverless functions, cron jobs, KV).
*   **Infrastructure as Code:** Terraform, including refactoring a monolithic state into scoped modules across four environments.
*   **CI/CD:** Azure DevOps (including an 80% build-time reduction via parallel self-hosted agents and coverage gates), GitHub Actions.
*   **Containerization:** Docker across many projects.

### Frontend Development
*   **Frameworks:** React 19 and Expo/React Native (AltIndex production), Vue.js and Nuxt 3 (this portfolio), Angular (Hubbell), TanStack Start (Karrow).
*   **Styling and state:** Tailwind CSS, shadcn component systems, Pinia, TanStack Query.
*   **Visualization:** Mapbox GL JS, D3.js, charting for financial data.

### Databases
*   **Relational:** MySQL/MariaDB (AltIndex production, including working safely against eight-figure-row tables), PostgreSQL, Supabase.
*   **Vector:** Pinecone.
*   **Other:** Convex (Karrow), Vercel KV (this portfolio).

## Soft Skills & Methodologies

*   **Problem solving on inherited systems:** My defining pattern is taking over undocumented systems (a legacy PHP monolith, a drifted cloud environment, a dead research codebase) and making them reliable. I map how things actually run before changing them.
*   **Communication (written and verbal):** Architecture decision records for every significant design choice across my projects, onboarding guides, runbooks, and the ability to explain technical work to non-technical stakeholders. I have presented to executives, sponsors, and research teams.
*   **Teaching and mentorship:** Ran a hands-on AI development workshop for professional engineers, onboarded and mentored teammates including a senior developer new to my project, trained four student developers as I transitioned projects at UConn, and led workshops for the Husky Developers Club as Outreach Chair.
*   **Coaching under real constraints:** Volunteer adaptive rowing coach for a blind athlete who went on to compete at the Head of the Charles Regatta. Communicating rowing technique to someone who cannot see you demonstrate it is the hardest communication problem I have solved.
*   **Product ownership:** At Invested I own the roadmap as well as the code: prioritization, customer feedback loops, release management, and the judgment calls about what not to build.
*   **Agile delivery:** Sprint planning, stand-ups, and full ownership of user stories in professional settings; led Agile ceremonies for my senior design team.

## Learnings / Reflection

My path has run from research software to enterprise data platforms to running a consumer fintech product, and each stage sharpened the same instinct: reliability is a feature, and the person who understands the whole system is the person who can be trusted with the important parts of it. I am most at home where engineering depth meets a real user with a real problem, and my current work applying AI under production constraints is the most interesting version of that I have found.

---
