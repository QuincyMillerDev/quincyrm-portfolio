# Case Study: Grid Analytics at Hubbell - Enterprise Data Platform Work

## Overview / Summary

From July 2024 to September 2025 I was an individual contributor at Hubbell.X, Hubbell's new-product division, building a grid-analytics platform for power utilities. This is my enterprise chapter: Azure, Databricks, Terraform, compliance-minded engineering, and the reality of shipping software into organizations that move carefully. The three stories below are the ones I tell about it.

## Story One: Four Environments, Four Different Truths

The platform ran across four environments: dev, QA, demo, and production. Each had drifted into a different Databricks layout, with nobody owning the difference, and the whole thing sat on a monolithic Terraform state. Deployments blocked regularly, and engineers were losing hours to manual state file surgery.

The fix was structural rather than heroic: I refactored the Terraform repository into smaller, scoped modules, decoupling the dependencies so a change in one area could not block deployments everywhere else. The interesting part was not the Terraform syntax, it was the archaeology: mapping what each environment actually contained versus what anyone believed it contained, before touching anything. Reliable Databricks deployments and the recovered developer hours were the payoff.

## Story Two: Research Code to a Shipping Feature

Researchers had developed a meter-to-transformer network topology correction algorithm: given noisy utility records, figure out which electricity meters actually hang off which transformers. My job was making it real. That meant a Python SDK for topology data management, a Databricks and Apache Spark pipeline processing hundreds of millions of grid records, and integration through a .NET Web API and Angular front end so utility customers could see their corrected network on a map.

The gap between "the algorithm works on the research dataset" and "a customer can run this on their data" was the whole job: data quality handling, pipeline reliability, performance at scale, and presenting results in a way a utility engineer trusts. The feature contributed to the project winning its second beta customer, which for an experimental division is the metric that matters.

## Story Three: Making the Team Faster

Two threads here. First, the CI/CD pipeline: PyTest execution in Azure DevOps was failing and slow, so I rebuilt it to run tests in parallel across self-hosted build agents and added coverage gates. Pull request build times dropped by 80%, which changes how a team works: developers stop batching changes to avoid the pipeline and start shipping smaller, safer increments.

Second, AI adoption: I built secure Python MCP servers that gave developers documentation access directly inside their editors, and ran a hands-on workshop on GitHub Copilot best practices and prompt engineering. This was 2024 to 2025, when most enterprise teams were still deciding whether AI-assisted development was allowed, so the work was as much about trust and security review as about code. Those practices outlasted me and became part of how the team operates.

## What Enterprise Taught Me

*   Constraints you did not write yourself make you better. Security review, compliance expectations, and international collaboration (including a research team in Spain) impose a rigor that a solo builder never gets from velocity alone.
*   Documentation is a deliverable. Onboarding guides, architecture diagrams, and runbooks were part of my output, and they are why the work survived my departure.
*   Mentorship runs both directions. I onboarded a senior developer with seventeen years of experience onto the project while receiving weekly mentorship from a staff engineer. Teaching and being taught in the same week is the fastest way I know to grow.

I left in September 2025 to become Head of Product & Engineering at Invested Inc. The enterprise experience is exactly why I could take that job: I had seen what disciplined engineering looks like at scale, and I carried it into a startup context.

---
