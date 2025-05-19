# Portfolio Chatbot RAG Architecture

## 1. Overview

This document outlines the Retrieval-Augmented Generation (RAG) architecture for a portfolio chatbot. The chatbot will answer questions about the user's professional profile using a pre-defined dataset processed into embeddings and stored in a **Pinecone vector database**. The system uses Nuxt.js for the frontend/backend and **Langchain.js** for AI functionalities and LLM abstraction.

## 2. Product Requirements

*   AI responses must support streaming for a real-time feel.
*   AI responses must support Markdown for rich text formatting.
*   The AI should primarily answer questions relevant to the user's professional profile (work experience, projects, skills, etc.).
*   Answers should be accurate and based on the provided information, they should subtle describe the portfolio user in a postive light (he/she is trying to get hired)
*   If a question is outside the scope of the portfolio information or the AI cannot find a relevant answer, it should indicate so gracefully.

## 3. Proposed Tech Stack

*   **Frontend:** Nuxt.js (Vue 3, TypeScript, TailwindCSS, Shadcn Vue, Radix Vue) using existing chat components (`ChatInput.vue`, `ChatMessage.vue`, `ChatInterface.vue`, `ChatSheet.vue`).
*   **Backend:** Nuxt.js Server Routes.
*   **AI Orchestration & Abstraction:** **Langchain.js** for the RAG pipeline (document loading, chunking, embedding, vector store interaction, prompt construction, LLM calls, model swapping).
*   **LLM:** OpenAI (e.g., `gpt-3.5-turbo`, `gpt-4o`, `gpt-4o-mini`) or Anthropic models via Langchain.js.
*   **Embedding Model:** OpenAI `text-embedding-3-small` or `text-embedding-ada-002` via Langchain.js (e.g., `OpenAIEmbeddings`).
*   **Vector Database:** **Pinecone (Cloud-hosted managed service)**. The Nuxt.js application (Vercel deployed) will connect to this instance using its API.
*   **Data Source for Embeddings:** Manually curated Markdown files (e.g., `about-me.md`, `work-experience.md`).

## 4. System Architecture

The RAG system has an offline data ingestion/embedding pipeline and an online query processing pipeline, orchestrated by Langchain.js.

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

### 4.1. Offline: Data Ingestion & Embedding Pipeline (Using Langchain.js)

This scripted process runs upfront and upon portfolio information updates.

1.  **Data Preparation:** Create/update Markdown files (`*.md`) in `content/portfolio-data/` with clear structure.
2.  **Pinecone Setup:**
    *   Sign up for Pinecone at [pinecone.io](https://www.pinecone.io/).
    *   Create a Pinecone project.
    *   Create an **Index**. Note the **index name**, **environment**, and **dimension** (which must match your embedding model's output, e.g., OpenAI `text-embedding-3-small` is 1536). The free tier typically allows for one index.
    *   Obtain your **API Key** and **Environment** string from the Pinecone console.
3.  **Ingestion Script (Langchain.js):** A script (e.g., `scripts/ingest-data.ts`) uses Langchain.js for:
    *   **Document Loading:** `DirectoryLoader` (with `TextLoader` for Markdown) loads files from `content/portfolio-data/`.
    *   **Text Splitting:** `MarkdownTextSplitter` or `RecursiveCharacterTextSplitter` chunks documents.
    *   **Embedding Generation:** An embedding model (e.g., `OpenAIEmbeddings`) generates vectors for chunks.
    *   **Storage in Pinecone:** `PineconeStore` integration connects to your Pinecone index using the API key and environment, and stores `Document` objects and embeddings (e.g., via `PineconeStore.fromDocuments()`).
    This script can run locally or in a CI/CD pipeline, using environment variables for Pinecone credentials.

### 4.2. Online: Query Processing Pipeline (Handled by Nuxt Server Route with Langchain.js)

This occurs in real-time during user interaction.

1.  **User Query:** User inputs question in chat interface.
2.  **Frontend Request:** Nuxt/Vue frontend sends query and chat history to `/api/chat` Nuxt server route.
3.  **Langchain.js Orchestration in Nuxt Server Route:**
    *   Initialize Langchain.js components: LLM (e.g., `ChatOpenAI`, streaming enabled), embedding model (e.g., `OpenAIEmbeddings`), and **Pinecone vector store** (connecting to your Pinecone index using API key and environment).
    *   **Chat History Integration:**
        *   Frontend sends recent chat history with the query.
        *   The server route uses this history with Langchain.js to provide conversational context to the LLM, typically by formatting and including it in the prompt.
    *   **Query Embedding:** Generate embedding for the user's query (or a rephrased query based on history) using the embedding model.
    *   **Vector Search (Retrieval):** **Pinecone vector store** instance (`vectorStore.similaritySearch()`) finds top K relevant chunks from your index.
    *   **Context Augmentation & Prompt Construction:** Langchain.js `PromptTemplate` builds the prompt. Example:
            ```
            You are a helpful AI assistant for [User's Name]'s portfolio.
            Answer the user's question based ONLY on the provided context.
            If the context doesn't contain the answer, say "I'm sorry, I don't have that specific information in my knowledge base."
            Format your answers in Markdown. Be concise and professional.

            Context:
            ---
            {context}
            ---
            Chat History:
            {chat_history}
            ---
            User Question: {question}
            ```
    *   **LLM Interaction (Generation):** A Langchain.js chain (e.g., `RetrievalQAChain` or `RunnableSequence`) manages retrieval, prompt formatting, and the LLM call. The LLM streams responses (e.g., `llm.stream()`), yielding text chunks.
4.  **Response Streaming & Rendering (Nuxt Frontend with Pinia Store):**
    *   Nuxt server route streams LLM text chunks. Each chunk is sent via the HTTP response stream.
    *   **`chatStore.ts` (Pinia Store):**
        *   On user message: adds user message, sets `isTyping = true`, calls `/api/chat`.
        *   Handles incoming stream: creates a new bot message object with empty content, then appends arriving chunks to its `content` property.
        *   Conceptual stream handling in store:
                async function fetchStreamedResponse(userMessageContent: string) {
                  isTyping.value = true;
                  const botMessageId = Date.now().toString();
                  messages.value.push({
                    id: botMessageId,
                    content: "", // Start with empty content
                    isUser: false,
                    timestamp: new Date().toISOString()
                  });

                  const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessageContent, history: messages.value.slice(0, -2) }) // Send message and history
                  });

                  if (!response.body) return;
                  const reader = response.body.getReader();
                  const decoder = new TextDecoder();
                  let done = false;

                  while (!done) {
                    const { value, done: readerDone } = await reader.read();
                    done = readerDone;
                    const chunk = decoder.decode(value, { stream: true });
                    
                    // Find the bot message and append content
                    const botMessage = messages.value.find(m => m.id === botMessageId);
                    if (botMessage) {
                      botMessage.content += chunk;
                    }
                  }
                  isTyping.value = false;
                }
            *   On stream end: sets `isTyping.value = false`.
    *   **`ChatInterface.vue`:** Calls `chatStore` actions, reactively displays messages. Bot message updates as `chatStore` appends chunks.
    *   **`ChatMessage.vue`:** `parsedContent` computed property re-evaluates as `content` changes, progressively rendering Markdown.

## 5. Implementation Details

### 5.1. Embedding Ingestion (Langchain.js + Pinecone)

1.  **Content:** Markdown files in `content/portfolio_data/`.
2.  **Pinecone Index:** A Pinecone index created and configured (API Key, Environment, Index Name obtained).
3.  **Ingestion Script (`scripts/ingest-data.ts`):** Langchain.js script reads Markdown, splits, embeds, and stores in the Pinecone index. Run script to (re)populate Pinecone.

    **Conceptual Langchain.js Ingestion Script Snippet:**
    ```typescript
    // In your ingest script (e.g., scripts/ingest-data.ts)
    import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
    import { TextLoader } from 'langchain/document_loaders/fs/text'; // Or a Markdown specific loader
    import { MarkdownTextSplitter } from 'langchain/text_splitter'; // Or RecursiveCharacterTextSplitter
    import { OpenAIEmbeddings } from '@langchain/openai';
    import { PineconeStore } from '@langchain/pinecone'; // Updated import for Pinecone
    import { Pinecone } from '@pinecone-database/pinecone'; // Official Pinecone client
    import 'dotenv/config'; // For API keys

    const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
    const PINECONE_ENVIRONMENT = process.env.PINECONE_ENVIRONMENT;
    const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME || "portfolio-data"; // Ensure this index exists in Pinecone
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    async function main() {
      if (!OPENAI_API_KEY || !PINECONE_API_KEY || !PINECONE_ENVIRONMENT || !PINECONE_INDEX_NAME) {
        throw new Error("Missing one or more required environment variables: OPENAI_API_KEY, PINECONE_API_KEY, PINECONE_ENVIRONMENT, PINECONE_INDEX_NAME.");
      }

      // Initialize Pinecone client
      const pinecone = new Pinecone({
        apiKey: PINECONE_API_KEY,
        environment: PINECONE_ENVIRONMENT,
      });
      const pineconeIndex = pinecone.Index(PINECONE_INDEX_NAME);

      // 1. Load documents
      const loader = new DirectoryLoader(
        'content/portfolio_data', 
        {
          '.md': (path) => new TextLoader(path), // Basic loader for .md files
        }
      );
      const docs = await loader.load();

      if (docs.length === 0) {
        console.log("No documents found to ingest.");
        return;
      }
      console.log(`Loaded ${docs.length} documents.`);

      // 2. Split documents
      const splitter = new MarkdownTextSplitter({ // Or RecursiveCharacterTextSplitter
        chunkSize: 1000,
        chunkOverlap: 100,
      });
      const chunks = await splitter.splitDocuments(docs);
      console.log(`Split into ${chunks.length} chunks.`);

      // 3. Initialize embedding model
      const embeddings = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY, modelName: "text-embedding-3-small" });

      // 4. Store in Pinecone
      // PineconeStore.fromDocuments will add documents to the specified Pinecone index.
      // For a full refresh, you might need to delete existing vectors in the index if desired.
      // Pinecone's Langchain integration usually handles upserting based on IDs if provided,
      // or simply adds new vectors. Check Langchain and Pinecone documentation for specifics
      // on handling updates vs. fresh ingests for your use case.
      await PineconeStore.fromDocuments(chunks, embeddings, {
        pineconeIndex,
        // namespace: "your-namespace-if-needed", // Optional: for multi-tenancy within an index
        // textKey: "text", // Optional: if your documents have a different key for text content
      });

      console.log(`Successfully embedded and stored ${chunks.length} chunks in Pinecone index '${PINECONE_INDEX_NAME}'.`);
    }

    main().catch(error => {
      console.error("Error during data ingestion:", error);
      process.exit(1);
    });
    ```
    To run this: `npx ts-node scripts/ingest-data.ts` (ensure `ts-node`, `typescript`, `@pinecone-database/pinecone`, `@langchain/pinecone` are dependencies/dev dependencies).

### 5.2. Vector Database: Pinecone (Cloud-Hosted)

*   **Pros:** Fully managed service (no servers to maintain), offers a free tier suitable for small projects, scales well for larger needs, good Langchain.js integration, simple API key-based access.
*   **Cons:** Vendor lock-in, costs can increase beyond the free tier, free tier might have limitations on index size or features.
*   **Setup & Hosting:**
    1.  **Sign Up:** Create an account at [pinecone.io](https://www.pinecone.io/).
    2.  **Create Project & Index:** Within the Pinecone console, create a project. Then, create an **Index**.
        *   **Index Name:** Choose a descriptive name (e.g., `portfolio-data`).
        *   **Dimensions:** Set this to match the output dimensions of your embedding model (e.g., 1536 for OpenAI's `text-embedding-3-small`).
        *   **Metric:** Choose a similarity metric (e.g., `cosine`, `dotproduct`, `euclidean`). `cosine` is common for text embeddings.
        *   Select the free tier pod type if available and suitable, or a paid pod type.
    3.  **API Key & Environment:** Note your API Key and Environment string from the "API Keys" section in the Pinecone console. These are crucial for connecting your application.
    4.  **Environment Variables:** Store your `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, and `PINECONE_INDEX_NAME` as environment variables for your ingestion script and Nuxt.js application (e.g., in a `.env` file for local development, and in Vercel's environment variable settings for deployment).
*   **Langchain.js Integration:** The ingestion script and Nuxt server route will use `@langchain/pinecone` and the official `@pinecone-database/pinecone` client to connect to your Pinecone index using these credentials.

**Recommendation:** Pinecone is suitable and simplifies hosting. Ensure your chosen embedding model's dimension matches the Pinecone index configuration.

## 6. Key Considerations

*   **Pinecone Configuration & API Key Management:** Critical. Securely manage your Pinecone API key. Ensure your Pinecone index is configured with the correct dimensions for your embedding model.
*   **Langchain.js Versioning & Imports:** Use up-to-date packages and import paths (e.g., `@langchain/openai`, `@langchain/pinecone`).
*   **Prompt Engineering:** Crucial. Use Langchain's `PromptTemplate`. Effectively incorporate chat history.
*   **Chunking Strategy:** `MarkdownTextSplitter` is suitable. Tune `chunkSize` and `chunkOverlap`.
*   **"I don't know" Responses:** Manage via prompt and LLM instructions.
*   **Data Updates:** Ingestion script updates embeddings. For a full refresh with Pinecone, you might need to delete vectors from the index before re-ingesting, or manage upserts if your Langchain/Pinecone setup supports it by document ID. Consult Pinecone documentation for best practices on data updates.
*   **Cost:** Monitor OpenAI API (embeddings, LLM) and Pinecone costs (especially if you move beyond the free tier).
*   **Error Handling:** Implement robust error handling in API route and ingestion script.
*   **Streaming with Langchain.js:** Ensure chains and LLMs correctly support streaming to Nuxt API route (`llm.stream()` or similar).
*   **Chat History Management:** Pass history for conversational context. Balance context window size (last N messages) vs. token limits. Langchain offers advanced memory modules for complex needs, but direct passing is a good start.
*   **Rate Limiting and Spam Prevention:**
    *   **Server-Side:** IP-based rate limiting on `/api/chat` (Vercel features, middleware like `unstorage` or Vercel Edge Config).
    *   **Client-Side:** Disable send button during processing; input validation (max length).
    *   **Security:** Keep LLM API key server-side only.
    *   **Monitoring:** Monitor LLM provider usage; set budget alerts.
    *   **Advanced:** Cooldowns or Captcha if spam is severe.

## 7. Future Enhancements (Optional)

*   **Hybrid Search:** Combine vector search with keyword search for certain types of queries.
*   **Re-ranking:** Add a step to re-rank the retrieved chunks using a more sophisticated model before sending them to the LLM.
*   **Advanced Conversational Memory:** If simple history passing proves insufficient, explore Langchain.js memory modules (e.g., `ConversationSummaryBufferMemory`) to create more sophisticated summaries or distillations of the conversation to pass as context, optimizing token usage while retaining important information.
*   **Admin Interface:** Simple UI to manage Markdown content and trigger `ingest-data.ts` script.

## 8. Next Steps

1.  **Data Source:** Create Markdown files in `content/portfolio_data/`. (Already completed and ingested via `scripts/ingest-data.ts` using `docs/rag_content/`)
2.  **Pinecone Setup:**
    *   Sign up for Pinecone.
    *   Create a Pinecone project and an index (note index name, environment, and dimensions).
    *   Obtain your API Key.
    *   Set up environment variables: `PINECONE_API_KEY`, `PINECONE_ENVIRONMENT`, `PINECONE_INDEX_NAME`.
    (Assumed largely complete as data ingestion is done)
3.  **Ingestion Script (`scripts/ingest-data.ts`):** Develop and test Langchain.js script for data loading, chunking, embedding, and storing in your Pinecone index. (Already completed)
4.  **Nuxt Server Route (`server/api/chat.post.ts`):**
    *   **Create File:** Establish the `server/api/chat.post.ts` file.
    *   **Request Handling:** Configure the route to accept `POST` requests with `message` and `chat_history` in the body.
    *   **LangChain Initializations:**
        *   Initialize Pinecone client and index using abstractions from `lib/langchain/initializeClients.ts`.
        *   Initialize `OpenAIEmbeddings` model using abstractions from `lib/langchain/initializeClients.ts`.
        *   Initialize `ChatOpenAI` model
        *   Instantiate `PineconeStore` with the initialized Pinecone index and embeddings model.
    *   **RAG Pipeline Logic:**
        *   **Query Embedding:** Generate an embedding for the incoming user `message`.
        *   **Vector Search (Retrieval):** Use `PineconeStore.similaritySearch()` to retrieve relevant document chunks. Determine an appropriate `K` value.
        *   **Prompt Construction:** Create a `ChatPromptTemplate` that incorporates the retrieved `context`, the user's `question`, and the `chat_history`.
        *   **LLM Interaction & Streaming:** Invoke the chat model with the formatted prompt using its `.stream()` method. Pipe the streamed chunks to the HTTP response.
        *   *(Optional but Recommended)*: Consider using LangChain Expression Language (LCEL) to structure the RAG pipeline.
5.  **Frontend Integration (`ChatInterface.vue`, `chatStore.ts`):**
    *   **`chatStore.ts` Update:**
        *   Modify/create an action to send the user's message and `chat_history` to the `/api/chat` endpoint.
        *   Implement logic to handle the streamed response: create a new bot message and append incoming chunks to its `content` property.
        *   Manage an `isTyping` state.
    *   **`ChatInterface.vue` / `ChatInput.vue`:** Ensure these components correctly call the `chatStore` action.
    *   **`ChatMessage.vue`:** Confirm reactive rendering of Markdown content as it streams into the `chatStore`.
6.  **Testing:** Thoroughly test with diverse questions, chat flows, and edge cases.
    *   Verify accuracy and completeness of answers.
    *   Inspect retrieved chunks if answers are suboptimal.
    *   Evaluate the relevance and focus of retrieved information.
    *   Test streaming behavior and UI updates.
7.  **Refinement:** Adjust chunking parameters (if necessary based on testing, though current approach is good), prompts, retrieval K-value, and potentially the LLM model based on test results and desired performance/cost balance.

This architecture provides a foundation for the portfolio chatbot using **Pinecone** and Langchain. 