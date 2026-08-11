<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileContainer from '~/components/ProfileContainer.vue'
import ProjectsContainer from '~/components/ProjectsContainer.vue'
import type { Project } from '~/lib/types/projects'
// Keep the data definition
const name = "Hi, I'm Quincy"
const desktopPictureUrl = '/images/portrait.jpg'
const mobilePictureUrl = '/images/portrait_small.jpg'
const subtitle = "I build AI systems that run in production"
const descriptionMd = `
Head of Product & Engineering @ Invested Inc., running AltIndex for tens of thousands of investors. Founder of SponsorBridge and Karrow.

My inbox is always open.
`
// Social links and icons
const links = [
  { name: 'GitHub', url: 'https://github.com/quincymillerdev', icon: 'lucide:github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/qrm111/', icon: 'lucide:linkedin' },
  { name: 'X.com', url: 'https://x.com/_quincyrm/', icon: 'lucide:twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/quincyrm_/', icon: 'lucide:instagram' },
  { name: 'Email', url: 'mailto:quincymiller6589@gmail.com', icon: 'lucide:mail' }
]


const projects: Project[] = [
  {
    title: 'AltIndex',
    description: 'Alternative data platform for retail investors. I run product and engineering: 23 daily data pipelines, 104 signals per company across 4,600+ equities, serving tens of thousands of investors.',
    link: 'https://altindex.com',
    chatSuggestion: 'Tell me about the engineering behind AltIndex.',
    details: {
      tagline: 'A production data platform owned end to end: pipelines, backend, web, mobile, billing, and alerting.',
      bullets: [
        'Replaced a legacy PHP monolith with React 19, Expo, and Tailwind on the front end and Python, FastAPI, and async SQLAlchemy behind it',
        '23 alternative data pipelines running daily: social sentiment, job postings, insider and congressional trading, app-store metrics, news, and more',
        'Alerting engine delivering roughly 15,800 alerts a month across 16 signal types on a dedicated worker',
        'Billing unified across Stripe and mobile in-app purchases through a single webhook pipeline',
        'Subscription gating rebuilt around a single Plan primitive, with one matrix test covering every tier against every gate',
      ],
      stack: ['Python', 'FastAPI', 'React 19', 'Expo', 'TypeScript', 'MySQL', 'LLM APIs'],
    },
  },
  {
    title: 'SponsorBridge',
    description: 'Sponsorship management platform I founded, with an AI quality-control pipeline that reviews sponsored content against brand rules and cites evidence for every finding.',
    chatSuggestion: 'How does the SponsorBridge AI quality-control pipeline work?',
    details: {
      tagline: 'AI QC built for a domain where a confidently wrong answer costs someone money.',
      bullets: [
        'Decomposed pipeline: compile brand rules into typed checks, locate the sponsored segment, check in batches, verify every violation',
        'Factored verification: the verifier re-checks cited evidence blind to the finder\'s reasoning, and can only remove findings, never add them',
        'Returns evidence and citations rather than assertions, and declines rather than guessing',
        'Bounded, reproducible runs: one to three dollars per two-hour video, cached re-runs in seconds',
        'Full platform around it: contracts, review workflows, invoicing, and a custom video player, built solo',
      ],
      stack: ['TypeScript', 'Convex', 'Claude', 'AssemblyAI', 'Mux'],
    },
  },
  {
    title: 'Grid Analytics at Hubbell',
    description: 'Enterprise data platform work in Hubbell\'s new-product division: Spark pipelines over hundreds of millions of grid records, and the infrastructure that made shipping reliable.',
    chatSuggestion: 'What did Quincy build on the grid-analytics platform at Hubbell?',
    details: {
      tagline: 'The enterprise chapter: Azure, Databricks, Terraform, and research code turned into a shipping product.',
      bullets: [
        'Took a meter-to-transformer topology correction algorithm from research to a shipping feature, contributing to the project\'s second beta customer',
        'Refactored a monolithic Terraform state into scoped modules across four drifted environments',
        'Cut pull request build times by 80% with parallel self-hosted CI agents and coverage gates',
        'Built secure Python MCP servers and ran the team\'s hands-on workshop on AI-assisted development',
      ],
      stack: ['Python', 'Spark', 'Databricks', 'Azure', 'Terraform', '.NET', 'Angular'],
    },
  },
  {
    title: 'Karrow',
    description: 'A product I founded that turns newsletter archives into scheduled social content in the operator\'s own voice.',
    link: 'https://karrow.com',
    chatSuggestion: 'Tell me about Karrow and its architecture.',
    details: {
      tagline: 'Solo-built B2B SaaS on a deliberately different stack, with LLM generation behind a human review gate.',
      bullets: [
        'Ingestion, voice-matched generation, review workflow, scheduling, and billing, designed and operated by one person',
        'Metered billing on raw Stripe Meters, fully decoupled from auth so neither system can break the other',
        'Source-blind ingest driver behind an adapter registry: the second newsletter source is what made the seam real',
      ],
      stack: ['TanStack Start', 'Convex', 'Better Auth', 'Stripe'],
    },
  },
  {
    title: 'Ilograph MCP Server',
    description: 'An open-source MCP server giving AI agents real-time access to Ilograph documentation for architecture diagramming.',
    link: 'https://github.com/QuincyMillerDev/ilograph-mcp-server',
    chatSuggestion: 'Tell me about the Ilograph MCP Server and its technical architecture.',
    details: {
      bullets: [
        'Python MCP server built on FastMCP and asyncio for high-concurrency tool execution',
        'Async fetching layer with an httpx client, exponential backoff, and a decoupled in-memory TTL cache',
      ],
      stack: ['Python', 'FastMCP', 'asyncio', 'httpx'],
    },
  },
  {
    title: 'This Site',
    description: 'A Nuxt 3 portfolio with a RAG chatbot that cites its sources and declines when it does not know. You are looking at it.',
    link: 'https://github.com/QuincyMillerDev/quincyrm-portfolio',
    chatSuggestion: 'How does this website\'s RAG chatbot work?',
    details: {
      bullets: [
        'RAG pipeline: query rephrasing, Pinecone retrieval, streamed generation with LangChain',
        'Provenance by construction: source attributions come from the retrieval step, not from the model, so they cannot be hallucinated',
        'Per-IP daily rate limiting; Strava stats cached in Vercel KV by a daily cron',
      ],
      stack: ['Nuxt 3', 'TypeScript', 'LangChain', 'Pinecone', 'Vercel'],
    },
  },
  {
    title: 'Multimodal Care Coordinator',
    description: 'An award-winning senior design AI system for a digital health startup, streamlining patient onboarding and provider workflows.',
    link: 'https://github.com/QuincyMillerDev/Multimodal-Care-Coordinator',
    chatSuggestion: 'What was the purpose of the Multimodal Care Coordinator project?',
    details: {
      bullets: [
        'Led a team of five engineers through two semesters; third place at the UConn Capstone Competition',
        'LLM agent orchestration for patient onboarding and appointment booking',
        'RAG system over company documentation so telehealth providers could query it in natural language',
      ],
      stack: ['Python', 'FastAPI', 'LangChain', 'Pinecone', 'OpenAI'],
    },
  },
  {
    title: 'Domain-Specific NER with BERT',
    description: 'Fine-tuned a BERT model for movie-domain named entity recognition, reaching a 94.47% F1 score on the MIT Movie Corpus.',
    link: 'https://github.com/QuincyMillerDev/BERT-NLP',
    chatSuggestion: 'Explain the approach behind Quincy\'s BERT fine-tuning project.',
    details: {
      bullets: [
        'Transfer learning on BERT-base-uncased for domain-specific named entity recognition',
        '94.47% F1 on the MIT Movie Corpus with PyTorch and Hugging Face Transformers',
      ],
      stack: ['PyTorch', 'Hugging Face', 'scikit-learn'],
    },
  },
]

const activeSection = ref<string | null>(null)
const projectsContainerVisible = ref(false)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}

onMounted(() => {
  setTimeout(() => {
    projectsContainerVisible.value = true;
  }, 150); // Delay for ProjectsContainer wrapper
});
</script>

<template>
  <div class="space-y-12">
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'z-10': activeSection === 'profile',
      }"
      @mouseenter="setHoveredSection('profile')"
      @mouseleave="setHoveredSection(null)"
    >
      <ProfileContainer 
        :name="name" 
        :desktop-picture-url="desktopPictureUrl" 
        :mobile-picture-url="mobilePictureUrl"
        :subtitle="subtitle"
        :description-md="descriptionMd"
        :links="links"
        location="Connecticut, USA"
      />
    </div>
    
    <div
      class="relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="[
        projectsContainerVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-[10px] scale-[0.98]'
      ]"
    >
      <div
        class="transition-all duration-300 ease-out relative"
        :class="{
          'z-10': activeSection === 'projects',
        }"
        @mouseenter="setHoveredSection('projects')"
        @mouseleave="setHoveredSection(null)"
      >
        <ProjectsContainer :projects="projects" />
      </div>
    </div>
  </div>
</template>