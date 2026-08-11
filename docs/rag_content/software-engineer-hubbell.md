# Work Experience: Software Development Engineer at Hubbell.X (July 2024 - September 2025)

## Overview / Summary

From July 2024 to September 2025 I was a Software Development Engineer at Hubbell.X, Hubbell's high risk, high reward new-product division. It was my first full-time role after graduation, and I left it in September 2025 to become Head of Product & Engineering at Invested Inc. I was dedicated to a single NPX (New Product Experimentation) project: a grid-analytics platform for power utilities. The role combined heavy data engineering, designing and operating large-scale data pipelines, with full-stack feature development. Operating within an agile framework, I took full ownership of user stories and features, collaborating with my immediate team and with international research teams, including one based in Spain.

## Key Responsibilities & Achievements

*   **Rebuilt the cloud architecture via Terraform refactoring:** The platform's infrastructure had drifted across four environments (dev, QA, demo, and prod), each with a different Databricks layout, and its monolithic Terraform state caused persistent deployment blockages. I led the refactor into smaller, scoped modules. **Impact:** Decoupled dependencies, made Databricks workspace deployments reliable, and recovered the developer hours that had been going into manual state file fixes.
*   **Took a research algorithm to a shipping feature:** I productionalized a complex meter-to-transformer network topology correction algorithm. This involved architecting a Python SDK for topology data management, designing a Databricks and Apache Spark pipeline over hundreds of millions of grid records, and surfacing results through a .NET Web API and Angular front end so utility customers could see their corrected network. **Impact:** Delivered an end-to-end feature that contributed to winning the project's second beta customer and validating the commercial viability of the research.
*   **Cut CI/CD build times by 80%:** I re-engineered the Azure DevOps CI/CD pipeline to resolve failures in PyTest execution, implementing parallel test runs across self-hosted Azure build agents and adding code-quality gates (coverage and deprecated-method reports). **Impact:** An 80% reduction in pull request build times and a much faster feedback loop for the whole team.
*   **Introduced AI-assisted development to the team:** I built secure Python MCP servers that gave developers documentation access inside their editors, and ran a hands-on workshop on GitHub Copilot best practices and prompt engineering. **Impact:** Those practices outlasted my tenure and became part of how the team works day to day.
*   **Mentorship in both directions:** I onboarded and mentored team members, including a senior developer with seventeen years of experience who was new to the project, covering architecture, Databricks workflows, and domain knowledge. At the same time I participated in Hubbell's formal mentorship program, receiving weekly guidance from the project's staff engineer lead. **Impact:** Faster ramp-up for the team and an accelerated learning curve for me.
*   **Technical documentation:** I authored onboarding guides, system architecture diagrams, and operational runbooks for infrastructure and DevOps, keeping knowledge continuity as the team grew.

## Skills Used and Developed

*   **Cloud & DevOps:** Microsoft Azure, Azure DevOps, Terraform, Databricks (Delta Lake, Spark SQL, workflow orchestration), CI/CD design, Infrastructure as Code
*   **Backend & Data:** Python (Pandas, PySpark), Apache Spark, C#, .NET, API development, ETL/ELT pipeline design, SQL, PostgreSQL
*   **Frontend:** Angular, TypeScript, Kendo UI
*   **AI tooling:** MCP server development in Python, prompt engineering, developer enablement
*   **Software engineering:** System design, modular architecture, integration and unit testing (PyTest), technical documentation, Agile (Scrum)
*   **Soft skills:** Cross-functional communication, stakeholder management, mentorship in both directions, project ownership

## Learnings / Reflection

Hubbell was a period of intense professional growth. Taking ownership of infrastructure that four environments had quietly drifted apart taught me that the first real work on any inherited system is mapping how it actually behaves rather than how it is documented. Productionalizing the topology algorithm gave me the full arc from research code to a customer-facing feature, including the unglamorous parts: data quality, pipeline reliability, and explaining results to people who do not care how Spark works.

Mentoring a senior colleague while being mentored by a staff engineer at the same time underscored that knowledge transfer is a skill of its own, and one I genuinely enjoy. My manager Mark Daigle was a key highlight of the experience; without his support I would not have reached the level of success at Hubbell that I did. I left in September 2025 for the opportunity to run product and engineering at Invested Inc., which built directly on everything this role taught me.

---
