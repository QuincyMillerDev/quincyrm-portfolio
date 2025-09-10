# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Generate static site**: `npm run generate`
- **Preview production build**: `npm run preview`
- **Prepare Nuxt**: `npm run postinstall`

### Linting
- **Run ESLint**: `npx eslint .` (Uses Nuxt's ESLint configuration)

### Data Management
- **Ingest RAG content**: `npx ts-node scripts/ingest-data.ts`
- **Clear Pinecone index**: `npx ts-node scripts/clear-pinecone-index.ts`

## Architecture Overview

This is a **Nuxt 3 portfolio website** with an **AI-powered chatbot** using RAG (Retrieval-Augmented Generation). The chatbot answers questions about Quincy Miller's professional experience using content stored in a Pinecone vector database.

### Key Technologies
- **Frontend**: Nuxt 3, Vue 3, TypeScript, TailwindCSS v4, Shadcn-Vue, Reka UI
- **AI/RAG**: Langchain.js, OpenAI GPT models, Pinecone vector database
- **State Management**: Pinia
- **Styling**: TailwindCSS with custom components in `components/ui/`

### Project Structure

#### Core Application Files
- `app.vue` - Root application component
- `nuxt.config.ts` - Nuxt configuration with modules and plugins
- `pages/` - Route pages (index.vue, about.vue)

#### AI Chatbot System
- `server/api/chat.post.ts` - Main chat API endpoint with rate limiting
- `lib/langchain/ragChain.ts` - RAG pipeline implementation with query rephrasing
- `lib/langchain/initializeClients.ts` - Langchain client initialization
- `stores/chatStore.ts` - Pinia store for chat state management
- `components/chat/` - Chat UI components (ChatInterface, ChatInput, ChatMessage, etc.)

#### Content & Data
- `docs/rag_content/` - Markdown files containing Quincy's portfolio information
- `scripts/ingest-data.ts` - Script to process and embed content into Pinecone
- `scripts/clear-pinecone-index.ts` - Utility to clear vector database

#### UI Components
- `components/ui/` - Shadcn-Vue UI components (Button, Card, Sheet, etc.)
- `components/` - Custom portfolio components (ProjectCard, Timeline, ProfileContainer, etc.)

### Environment Variables Required
```
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_index_name
```

### RAG System Architecture

The chatbot uses a sophisticated RAG pipeline:

1. **Query Rephrasing**: User questions are rephrased using GPT-3.5-turbo for optimal vector search
2. **Vector Retrieval**: Pinecone searches for relevant content chunks (k=10)
3. **Response Generation**: GPT-4.1-nano generates responses using retrieved context
4. **Streaming**: Responses stream in real-time to the frontend

Key files for RAG system:
- `lib/langchain/ragChain.ts:39` - Main LLM configuration (GPT-4.1-nano)
- `lib/langchain/ragChain.ts:40` - Query rephrasing LLM (GPT-3.5-turbo)
- `lib/langchain/ragChain.ts:44-65` - System prompt for portfolio assistant
- `server/api/chat.post.ts:17-58` - Rate limiting implementation (30 requests/day per IP)

### State Management

- `stores/chatStore.ts` - Manages chat messages, streaming responses, and UI state
- `stores/stravaActivity.ts` - Handles Strava fitness data integration

### Styling System

- Uses **TailwindCSS v4** with custom configuration
- Shadcn-Vue components provide consistent UI patterns
- Custom fonts: Ubuntu, Red Hat Display, Noto Sans Display, JetBrains Mono
- Dark/light theme support via CSS variables

### Development Notes

- The portfolio content in `docs/rag_content/` should be re-ingested after updates using the ingest script
- Rate limiting is implemented per IP address with daily resets at UTC midnight
- Chat responses support Markdown formatting
- The system includes comprehensive error handling and fallback responses
- All API keys are server-side only for security

### Testing the RAG System

To verify the chatbot is working correctly:
1. Ensure environment variables are set
2. Run the ingest script to populate Pinecone: `npx ts-node scripts/ingest-data.ts`
3. Start the dev server: `npm run dev`
4. Test queries about Quincy's experience, projects, or skills through the chat interface