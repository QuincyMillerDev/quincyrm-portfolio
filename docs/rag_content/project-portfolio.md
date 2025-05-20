# Project: Personal Portfolio Website (This Website)

## Overview / Summary

This personal portfolio website ([quincyrm.com](https://www.quincyrm.com)) is a dynamic and interactive platform built to showcase my software engineering skills, projects, and professional experiences. Developed with Nuxt.js (Vue 3), it features a modern, responsive design. Key architectural components include an advanced AI-powered chatbot utilizing a Retrieval-Augmented Generation (RAG) architecture, and an automated Strava API integration for displaying fitness activities. The entire application is deployed and hosted on Vercel, leveraging its serverless functions, cron jobs, and Key-Value store (Vercel KV).

## Key Features & Functionality

*   **Feature 1: Responsive Design:** Fully responsive layout adapting to desktop, tablet, and mobile devices, ensuring a seamless user experience across all platforms.
*   **Feature 2: Interactive AI Chatbot (RAG based):**
    *   Provides contextual, Markdown-formatted answers to user questions about my profile, projects, and experiences.
    *   Employs a sophisticated RAG architecture, ensuring answers are grounded in provided documentation rather than generic knowledge.
    *   Supports streaming responses for a real-time conversational feel.
*   **Feature 3: Dynamic Content Sections:** Features dedicated sections for Profile/About Me (including a timeline, hobbies, and image gallery), Projects, and Work Experience. The content for the AI chatbot is sourced from Markdown files within the `docs/rag_content/` directory.
*   **Feature 4: Modern UI/UX:** Built with Nuxt.js (Vue 3), TypeScript, Tailwind CSS (v4), and Shadcn Vue (with Radix Vue) for a clean, performant, and modern user interface. Includes features like a typewriter effect for engaging text display.
*   **Feature 5: Strava API Integration:**
    *   Dynamically displays personal fitness statistics (running, cycling, etc.) on the About page.
    *   Features an automated daily background job to fetch and cache Strava data, ensuring fresh data without impacting site load times or hitting API rate limits.
*   **Feature 6: Markdown Content Rendering:** Utilizes Marked.js and DOMPurify for safely rendering Markdown content from the chatbot, ensuring rich text formatting while preventing XSS vulnerabilities.

## Technical Stack & Implementation Details

### Frontend Development
*   **Framework:** Nuxt.js (v3, Vue 3, TypeScript) for server-side rendering (SSR), client-side navigation, and overall application structure.
*   **Styling:** Tailwind CSS (v4) for utility-first CSS, Shadcn Vue for pre-built, customizable UI components, and Radix Vue for unstyled, accessible UI primitives.
*   **Icons:** Lucide Icons for a consistent and clean icon set.
*   **State Management:** Pinia for managing application-wide state, particularly for the chat interface and Strava data display.
*   **Markdown Processing:**
    *   `Marked.js`: For parsing Markdown text into HTML.
    *   `DOMPurify`: For sanitizing the HTML output from Marked.js to prevent XSS attacks.
*   **User Interface Enhancements:** `typewriter-effect` for animated text.

### AI Chatbot Architecture (RAG System)
The chatbot uses a Retrieval-Augmented Generation (RAG) approach orchestrated by Langchain.js, ensuring answers are based on the specific content of this portfolio.

```mermaid
graph TD
    subgraph Offline: Data Ingestion & Embedding (Langchain.js)
        A[Data Sources: Markdown Files about Portfolio] --> B(Langchain: Document Loaders & Text Splitters);
        B --> C{Langchain: Embedding Model};
        C --> D[Pinecone (Cloud DB)];
    end

    subgraph Online: Query Processing (Langchain.js & Nuxt Server Route)
        E[User via Chat UI] --> F(Nuxt Frontend);
        F --> G(/api/chat Nuxt Server Route with Langchain.js);
        G --> H{Langchain: Embedding Model};
        G --> I[Pinecone (Cloud DB)];
        H -- Query Embedding --> I;
        I -- Relevant Chunks --> G;
        G -- Augmented Prompt --> J{Langchain: LLM};
        J -- Streamed Markdown Response --> G;
        G -- Streamed Response --> F;
        F -- Renders Markdown --> E;
    end

    style A fill:#f9f,stroke:#333,stroke-width:2px
    style D fill:#f9f,stroke:#333,stroke-width:2px
    style I fill:#f9f,stroke:#333,stroke-width:2px
    style J fill:#lightgreen,stroke:#333,stroke-width:2px
    style C fill:#lightgreen,stroke:#333,stroke-width:2px
    style H fill:#lightgreen,stroke:#333,stroke-width:2px
```

**1. Offline: Data Ingestion & Embedding Pipeline:**
   This process runs upfront and whenever portfolio information is updated.
   *   **Data Source:** Manually curated Markdown files (`*.md`) located in the `docs/rag_content/` directory.
   *   **Script:** A TypeScript script (`scripts/ingest-data.ts`) using Langchain.js.
   *   **Document Loading:** `DirectoryLoader` (with `TextLoader` for Markdown) loads files.
   *   **Text Splitting:** `MarkdownTextSplitter` (or `RecursiveCharacterTextSplitter`) chunks documents into manageable pieces suitable for embedding.
   *   **Embedding Generation:** An OpenAI embedding model (e.g., `text-embedding-3-small`) generates vector embeddings for each text chunk.
   *   **Storage in Vector Database:**
        *   **Service:** Pinecone (Cloud-hosted managed vector database).
        *   **Process:** The `PineconeStore` Langchain integration connects to a pre-configured Pinecone index (e.g., "portfolio-data") using API keys and stores the document chunks and their corresponding embeddings. The index is configured with dimensions matching the embedding model (e.g., 1536 for `text-embedding-3-small`).

**2. Online: Query Processing Pipeline (Nuxt Server Route `/api/chat`):**
   This occurs in real-time when a user interacts with the chatbot.
   *   **User Input (`components/chat/ChatInput.vue`):** The user types a message into the `Textarea` within the `ChatInput.vue` component. Pressing Enter or clicking the Send button triggers the `handleSend` method.
   *   **State Management (`stores/chatStore.ts`):**
        *   The `handleSend` method in `ChatInput.vue` emits a `send` event with the message content.
        *   The parent component (likely managing the chat interface) listens for this event and calls the `addUserMessage` action in the `chatStore.ts` (Pinia store).
        *   `addUserMessage` adds the user's message to the `messages` array (for UI display) and then calls `fetchStreamedChatResponse`.
   *   **API Request (`stores/chatStore.ts` to `server/api/chat.post.ts`):**
        *   `fetchStreamedChatResponse` in `chatStore.ts` prepares a bot message placeholder for the UI and then makes a `POST` request to the `/api/chat` Nuxt server route. The request body includes the user's current message and a sanitized recent chat history.
   *   **Server-Side Processing (`server/api/chat.post.ts`):**
        *   The `defineEventHandler` in `server/api/chat.post.ts` receives the request.
        *   It performs rate limiting based on the client's IP address.
        *   It reads the `message` and `history` from the request body.
        *   It calls `streamRagResponse` from `lib/langchain/ragChain.ts`, passing the user's message and chat history.
   *   **RAG Chain Execution (`lib/langchain/ragChain.ts`):**
        *   The `streamRagResponse` function orchestrates the RAG pipeline:
            1.  **Query Rephrasing:** The user's `question` (and `chat_history`) is first passed to a `rephrasingChain`. This chain uses a dedicated LLM (`rephrasingLlm`, e.g., `gpt-3.5-turbo`) and a specialized prompt (`rephraseQueryPrompt`) to transform the input into an optimal search query for the vector database.
            2.  **Context Retrieval:** The `rephrasedQuery` is used to retrieve relevant document chunks from the Pinecone vector store via `retriever.getRelevantDocuments()`.
            3.  **Augmented Prompt Construction:** The original `question`, `chat_history`, and the retrieved `context` are formatted into a final prompt (`prompt`) for the main generation LLM.
            4.  **LLM Generation:** The main LLM (`llm`, e.g., `gpt-4.1-nano`) generates the answer based on the augmented prompt.
            5.  **Streaming Output:** The `ragChain.stream()` method returns a `ReadableStream` of text chunks.
   *   **Response Streaming (`server/api/chat.post.ts` back to `stores/chatStore.ts`):**
        *   `server/api/chat.post.ts` returns the `ReadableStream` obtained from `streamRagResponse` as the HTTP response.
        *   Back in `fetchStreamedChatResponse` in `chatStore.ts`, the code reads chunks from this stream. As each chunk arrives, it's appended to the `content` of the bot message placeholder in the `messages` array.
   *   **UI Update (`stores/chatStore.ts` to Vue Components):**
        *   The `messages` array in `chatStore.ts` is reactive. Changes to a bot message's content (as new chunks stream in) automatically update the chat interface (e.g., `ChatMessage.vue`), progressively displaying the Markdown-formatted response to the user.

### Strava Integration Architecture
This system fetches Strava activity data periodically, caches it, and displays it on the frontend.

**1. Background Data Fetching & Caching (Automated Daily Job):**
   *   **Trigger:** A Vercel Cron Job, defined in `vercel.json` (e.g., `0 0 * * *` for daily at midnight UTC), triggers the `/api/strava/update-job` Nuxt server route.
   *   **Authentication:** The cron job uses a `CRON_SECRET` environment variable for security, which the `update-job` endpoint verifies.
   *   **Update Job (`/api/strava/update-job`):**
        *   **Token Management:**
            *   Retrieves Strava token data (access token, refresh token, expiry time) from Vercel KV (key: `strava:tokenData`).
            *   If the access token is expired or missing, it uses the stored refresh token to request a new set of tokens from the Strava OAuth API (`https://www.strava.com/oauth/token`).
            *   Stores the updated token data back into Vercel KV. This requires `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and an initial `STRAVA_REFRESH_TOKEN` to be configured as environment variables.
        *   **Data Fetching:** Uses the valid access token to GET athlete statistics from the Strava API (`/athletes/{ownerId}/stats`). Requires `MY_STRAVA_OWNER_ID` environment variable.
        *   **KV Caching:** Stores the fetched athlete stats JSON in Vercel KV (key: `strava:stats:{ownerId}`).
        *   **Error Handling:** Logs errors and can clear invalid tokens from KV to facilitate recovery on the next run.

**2. Frontend Data Retrieval & Display:**
   *   **API Endpoint (`/api/strava/cached-stats.get.ts`):** A Nuxt server route that retrieves the cached athlete stats directly from Vercel KV. Returns a 404 if no cached data is found.
   *   **Pinia Store (`stores/stravaActivity.ts`):**
        *   Manages state for `athleteStats`, `isLoading`, and `error`.
        *   The `fetchAthleteStats` action calls the `/api/strava/cached-stats` endpoint.
        *   The `fitnessStats` getter transforms the raw API data into a format suitable for UI components, including unit conversions (meters to miles) and string formatting.
   *   **Vue Components (`pages/about.vue`, `components/HobbiesContainer.vue`, `components/HobbyItem.vue`):**
        *   The `about.vue` page calls `fetchAthleteStats` on mount.
        *   Computed properties merge static hobby data with dynamic `fitnessStats`.
        *   Components then render the hobby information, including the fetched Strava stats.

### Deployment (Vercel)
*   **Platform:** Deployed on Vercel, leveraging its global CDN and serverless infrastructure.
*   **Serverless Functions:** Nuxt.js server routes (e.g., `/api/chat`, `/api/strava/*`) are deployed as Vercel serverless functions.
*   **Cron Jobs:** Vercel Cron is used for scheduling the background Strava data update job.
*   **Storage:** Vercel KV is used for:
    *   Storing Strava OAuth tokens (`strava:tokenData`).
    *   Caching fetched Strava athlete statistics (`strava:stats:{ownerId}`).
*   **Environment Variables:** Critical for API keys (OpenAI, Pinecone, Strava Client ID/Secret/Refresh Token, Cron Secret, Strava Owner ID) and other configurations, managed securely within Vercel project settings.
*   **Build Process:** Vercel automatically builds the Nuxt.js application from the linked GitHub repository upon pushes to the main branch.

### Version Control & Development Tooling
*   **Version Control:** Git, GitHub.
*   **Development Tooling:** ESLint for code linting, Vite as the underlying build tool for Nuxt 3, and ts-node for running TypeScript scripts (like `ingest-data.ts`).

## Design & Development Process

The development process has been iterative, focusing on building a robust and engaging platform to showcase my full-stack development capabilities. Key aspects include:
*   **Modular Design:** Leveraging Nuxt.js and Vue components for a maintainable codebase.
*   **AI-First Approach for Q&A:** Designing the RAG system to handle queries about my professional profile efficiently, prioritizing accurate and contextually relevant responses.
*   **API Integration Best Practices:** Implementing secure and efficient data fetching for the Strava integration, including robust token management, background updates, and caching to enhance performance and reliability.
*   **Progressive Enhancement:** Starting with core features and iteratively adding more complex functionalities like the AI chatbot and Strava integration.
*   **Documentation-Driven Development (for RAG):** Creating detailed Markdown documents (like this one) specifically to serve as the knowledge base for the AI chatbot.
*   **Continuous Improvement:** This portfolio itself is an ongoing project, with plans to refine features, update content, and potentially integrate new technologies as I explore them.

## Positive Impact / Learnings / Reflection

Developing this portfolio website has been a fun undertaking and an interesting learning experience. It serves as a living demonstration of my skills in full-stack development, particularly with the Nuxt.js ecosystem, and my ability to architect and integrate complex systems like a RAG-based AI chatbot and third-party APIs with automated background processing.

Implementing the RAG architecture from scratch—from data ingestion and embedding with OpenAI models to vector storage in Pinecone and dynamic retrieval and generation with Langchain.js—has significantly deepened my understanding of practical AI application development. Designing the Strava data flow with Vercel Cron jobs for automation and Vercel KV for serverless caching has been a valuable exercise in building resilient and performant API integrations, considering aspects like rate limiting and data freshness.

This project continuously pushes me to explore new technologies (like Tailwind CSS v4 and Shadcn Vue for UI) and refine my approach to building user-centric and technically sophisticated web applications. It's not just a static showcase but also an active sandbox for experimentation, learning, and growth. It has also been a great opportunity to experience modern web development paradigms, tools, and abstractions that have evolved in recent years. Although my primary industry experience has been heavily backend-oriented, building this portfolio has been an enjoyable and effective refresher for frontend technologies and full-stack concerns. The process of documenting the architecture for the RAG system itself has also been a useful exercise in clarifying design choices.

--- 