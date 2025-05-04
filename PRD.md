# Product Requirements Document: Personal Portfolio with AI Chatbot Guide

**Version:** 1.0
**Date:** 2025-05-04
**Author:** [Your Name/T3 Chat]

## 1. Introduction

This document outlines the requirements for a personal portfolio website designed to showcase the skills and experience of a full-stack software engineer. The site will feature a modern, minimal, mobile-first design. Its core differentiating feature will be an integrated Large Language Model (LLM) chatbot acting as a personalized guide. This chatbot will allow visitors to interactively learn about the engineer's background, projects, skills, and interests using natural language queries (text and speech), leveraging both static data and real-time information fetched from external APIs.

## 2. Goals

*   **Primary:** Effectively showcase full-stack development capabilities (Frontend, Backend, AI Integration, API usage, Cloud Deployment) to potential employers, recruiters, and collaborators.
*   **Secondary:** Provide an engaging, unique, and informative user experience for visitors wanting to learn about the engineer.
*   **Tertiary:** Serve as a practical application demonstrating proficiency with modern web technologies and AI integration.
*   **Design:** Create a clean, minimal, aesthetically pleasing, and fast-loading website optimized for mobile devices.

## 3. Target Audience

*   Technical Recruiters and Hiring Managers
*   Potential Employers or Clients
*   Fellow Software Engineers and Potential Collaborators
*   Anyone interested in learning about the engineer's professional profile.

## 4. Functional Requirements

### 4.1 Core AI Chatbot Guide

*   **FR-C1:** **Text Input:** Users must be able to type questions into a chat input field.
*   **FR-C2:** **Speech Input:** Users must be able to activate microphone input (via a button) to ask questions using voice. Browser-based Speech-to-Text (STT) will convert audio to text for processing.
*   **FR-C3:** **LLM Integration:** The chatbot backend must integrate with the Gemini API to understand user queries and generate relevant responses.
*   **FR-C4:** **Retrieval-Augmented Generation (RAG):**
    *   The system must use a vector database (Pinecone) populated with embedded personal data (CV, project details, skills, bio, etc.).
    *   When a user asks a question, the system must retrieve relevant data chunks from Pinecone to provide context to the LLM for generating accurate answers about the engineer.
*   **FR-C5:** **Tool Calling / API Integration:** The chatbot must be able to trigger server-side functions to fetch real-time data from external services when relevant to the user's query:
    *   **GitHub:** Fetch public repository information, recent activity summaries.
    *   **Spotify:** Fetch currently playing track or recent top tracks/artists (requires secure handling of authentication/tokens).
    *   **Strava:** Fetch recent activity summaries or stats (requires secure handling of authentication/tokens).
*   **FR-C6:** **Natural Language Response:** The chatbot must provide responses in a conversational, natural language format. The personality should be configurable via system prompts (e.g., professional yet approachable).
*   **FR-C7:** **Context Awareness:** The chatbot should maintain conversational context within a single session (e.g., remember the last few exchanges).
*   **FR-C8:** **Loading/Processing Indication:** Clear visual indicators must be displayed while the chatbot is processing a request or waiting for API responses.
*   **FR-C9:** **Error Handling:** The chatbot interface must gracefully handle and communicate errors (e.g., "I couldn't fetch GitHub data right now," "Sorry, I didn't understand that.").
*   **FR-C10:** **Chat History Display:** The conversation history (user queries and chatbot responses) must be displayed clearly in a scrollable chat window.

### 4.2 Standard Portfolio Sections

*   **FR-S1:** **About Section:** A page or section detailing the engineer's background, interests, skills overview, and potentially including photos.
*   **FR-S2:** **Projects Section:** A dedicated area showcasing key projects. Each project should include:
    *   Name and Description
    *   Technologies Used
    *   Link to Live Demo (if applicable)
    *   Link to Source Code (if public)
    *   Screenshots or Demo Video/GIF
*   **FR-S3:** **Experience Section:** A chronological timeline or list of professional roles, including company, title, dates, and key responsibilities/achievements.
*   **FR-S4:** **Contact Information / Links:** Easily accessible links to professional profiles (LinkedIn, GitHub) and a method for contact (e.g., email address).

### 4.3 General Site Features

*   **FR-G1:** **Responsive Design:** The website layout must adapt seamlessly to various screen sizes, prioritizing mobile devices (mobile-first).
*   **FR-G2:** **Navigation:** Simple, intuitive, and accessible navigation linking to all main sections of the site.
*   **FR-G3:** **Accessibility:** The website should adhere to WCAG 2.1 Level AA guidelines where feasible, including keyboard navigation, semantic HTML, sufficient color contrast, and ARIA attributes for dynamic components (like the chatbot).

## 5. Non-Functional Requirements

*   **NFR1:** **Performance:**
    *   Fast initial page load times (target LCP < 2.5s).
    *   Responsive UI interactions (< 100ms response time for UI feedback).
    *   Efficient backend processing for chatbot responses. Minimize latency where possible.
*   **NFR2:** **Usability:**
    *   Intuitive and easy-to-use interface, especially the chatbot.
    *   Clear information hierarchy.
    *   Minimal friction for visitors to find information.
*   **NFR3:** **Reliability:**
    *   High availability (leveraging Vercel's infrastructure).
    *   Graceful degradation if external APIs (GitHub, Spotify, Strava, Gemini) are unavailable.
*   **NFR4:** **Security:**
    *   All traffic served over HTTPS (handled by Vercel).
    *   API keys and sensitive credentials stored securely server-side (environment variables) and never exposed client-side.
    *   Implement rate limiting on server-side API endpoints interacting with LLM and external services to prevent abuse and manage costs.
    *   Basic input sanitization for user inputs to the chatbot.
*   **NFR5:** **Maintainability:**
    *   Clean, well-documented (comments, README), and modular code (Vue Composition API, TypeScript).
    *   Consistent coding style (use Prettier).
    *   Leverage reusable components (Shadcn Vue).
*   **NFR6:** **Scalability:** While high scalability isn't a primary goal, the serverless architecture (Vercel Functions) and managed services (Pinecone, Gemini API) provide inherent scalability.

## 6. Technical Stack & Architecture

*   **Frontend Framework:** Nuxt 3 (`Vue 3`, `TypeScript`, `Vite`)
*   **Styling:** Tailwind CSS (v4 preferred, v3 if v4 not stable/suitable), `Shadcn Vue`, `Radix Vue`
*   **State Management:** `Pinia`
*   **UI/UX Utilities:** `VueUse`
*   **AI Model:** Google Gemini API (`gemini-1.5-flash` or similar for chat, `text-embedding-004` or similar for embeddings)
*   **AI Orchestration:** Direct Gemini API calls via `@google/generative-ai` SDK (potentially LlamaIndex or LangChain if complexity increases)
*   **Vector Database (RAG):** Pinecone (`@pinecone-database/pinecone` SDK)
*   **Backend Logic:** Nuxt 3 Server Routes / API Endpoints (`Node.js` environment via Nitro)
*   **Deployment:** Vercel
*   **Speech-to-Text:** Web Speech API (`SpeechRecognition`) or other browser-compatible library.

### Architecture Overview:

1.  **Client (Browser):** Nuxt 3 frontend, Vue components, Pinia store, Tailwind/Shadcn styling. Handles UI rendering, user input (text/speech), calls to Nuxt backend API endpoints.
2.  **Backend (Nuxt Server/Vercel Functions):**
    *   API endpoints to handle client requests (e.g., `/api/chat`).
    *   Securely stores API keys (Gemini, Pinecone, GitHub, Spotify, Strava) using Nuxt `runtimeConfig`.
    *   Orchestrates chatbot logic (RAG retrieval from Pinecone, optional tool calls, prompt construction, Gemini API call).
    *   Handles external API calls (GitHub, Spotify, Strava) via dedicated server routes/functions.
3.  **Services:**
    *   **Pinecone:** Stores vector embeddings of personal data.
    *   **Gemini API:** Provides LLM and embedding capabilities.
    *   **GitHub/Spotify/Strava APIs:** Provide real-time external data.
    *   **Vercel:** Hosting, deployment, serverless functions, CDN, HTTPS.
