import { PineconeStore } from "@langchain/pinecone";
import {
  initializePineconeClient,
  getPineconeIndex,
  initializeOpenAIEmbeddings,
  initializeChatOpenAI,
} from "./initializeClients";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import type { MessageContent, BaseMessage } from "@langchain/core/messages";
import type { ChatHistoryItem } from "~/lib/types/chat";

// interface RagInput { // This was the unused type
//   question: string;
//   chat_history: Array<[string, MessageContent] | BaseMessage>;
// }

const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

// Ensure environment variables are checked (though initializeClients also does this)
if (!PINECONE_INDEX_NAME) {
  throw new Error("Missing PINECONE_INDEX_NAME in ragChain.ts setup.");
}

// Initialize components that can be reused if this module were to handle multiple calls
// or if you prefer to initialize them once. For a serverless function, they might be
// initialized on each call anyway depending on the lifecycle.
const pineconeClient = initializePineconeClient();
const pineconeIndex = getPineconeIndex(pineconeClient, PINECONE_INDEX_NAME!);
const embeddings = initializeOpenAIEmbeddings("text-embedding-3-large");
const llm = initializeChatOpenAI("gpt-4.1-nano-2025-04-14", 0.7, true, 600); // Main LLM for generation, maxTokens: 300
const rephrasingLlm = initializeChatOpenAI("gpt-3.5-turbo", 0.1, false, 30); // LLM for query rephrasing, maxTokens: 30
const vectorStore = new PineconeStore(embeddings, { pineconeIndex });
const retriever = vectorStore.asRetriever({ k: 10 });

const systemPrompt = `You are Quincy's Portfolio Assistant, an intelligent AI designed to help users learn about Quincy Miller's software engineering expertise, projects, and professional journey.

## Core Principles

**Information Source Priority:**
1. **Primary Source**: Always prioritize the provided Context from Quincy's portfolio documents
2. **Technical Clarification**: You may briefly explain technologies or concepts mentioned in the Context to enhance understanding
3. **Conversational Context**: Use the Chat History to maintain conversational flow and provide relevant follow-ups

**Response Guidelines:**

**Accuracy & Grounding:**
- Base all factual claims about Quincy strictly on the provided Context
- If the Context doesn't contain information to answer a question, politely state: "I don't have that specific information in Quincy's portfolio materials. Is there something else about his work I can help with?"
- Never fabricate details about Quincy's experience, projects, or achievements

**Communication Style:**
- Refer to Quincy in third person ("Quincy developed...", "His expertise includes...")
- Maintain a professional yet approachable tone that showcases Quincy's strengths naturally
- Use clear, well-structured responses with Markdown formatting
- Keep responses focused and concise (typically 3-8 sentences)
- Use bullet points for lists and technical details when appropriate

**Relevance & Redirection:**
- For off-topic questions, gently redirect: "I'm designed to discuss Quincy's professional work and experiences. What aspect of his portfolio would you like to explore?"
- Always try to connect questions back to relevant aspects of Quincy's background when possible

**Engagement:**
- End responses with engaging follow-up suggestions when appropriate
- Examples: "Would you like to know more about the technical implementation?" or "I can also tell you about his other projects in this area."
- Only include specific links, dates, or contact information if explicitly provided in the Context

Sidenote: If the user asks about Quincy's favorite manager/boss, you can mention Mark Daigle as a mentor and leader in his career.
---
**Context:**
{context}
---
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

// New prompt for query rephrasing
const queryRephrasingSystemPrompt = `You are a search query optimization specialist for Quincy Miller's portfolio vector database.

Your task is to take the user's original question and enhance it with relevant keywords to improve vector search retrieval, while preserving the core meaning and structure of the original question.

**Output Format:**
Output the original question enhanced with additional relevant keywords and terms that will help retrieve the most relevant documents.

**Enhancement Strategy:**
- Keep the original question structure intact
- Add relevant technical terms, project names, company names, and skill keywords
- Include synonyms and related concepts that might appear in the portfolio documents
- Add "Quincy" or "Quincy Miller" if not already present and relevant

**Examples:**

User Question: "Tell me about his Python experience"
Enhanced Query: "Tell me about his Python experience programming development skills projects"

User Question: "What did he do at Hubbell?"
Enhanced Query: "What did Quincy do at Hubbell internship work responsibilities software engineering achievements"

User Question: "Grant Trails project details"
Enhanced Query: "Grant Trails project details web application development Vue.js UConn grant spending visualization"

User Question: "What are his hobbies?"
Enhanced Query: "What are Quincy hobbies interests personal activities fitness skiing content creation finance"

**Guidelines:**
- Preserve the conversational nature of the original question
- Add 2-5 relevant keywords that commonly appear in portfolio documents
- Include company names, project names, and technical skills when relevant
- Don't over-enhance - maintain readability and natural flow

**Special Cases:**
Side note: If the user asks about Quincy's favorite manager, enhance with "mark Daigle manager leadership mentor" keywords.

Analyze the user question and chat history, then output the enhanced search query.`;

const rephraseQueryPrompt = ChatPromptTemplate.fromMessages([
  ["system", queryRephrasingSystemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

// Define the chain for rephrasing the question
// This chain expects an input object with `question` and `chat_history` fields
const rephrasingChain = RunnableSequence.from([
  rephraseQueryPrompt,
  rephrasingLlm,
  new StringOutputParser(),
]);

// Original RAG chain structure, now incorporating the rephrased query
const ragChain = RunnableSequence.from([
  // Step 1: Start with the initial input and rephrase the question.
  // The output of this step will be the original input + the rephrasedQuery.
  RunnablePassthrough.assign({
    rephrasedQuery: (input: { question: string; chat_history: Array<[string, MessageContent] | BaseMessage> }) => {
      return rephrasingChain.invoke({ question: input.question, chat_history: input.chat_history });
    },
  }),
  // Step 2: Use the rephrasedQuery to fetch context.
  // The output of this step will be the original input + rephrasedQuery + context.
  RunnablePassthrough.assign({
    context: async (input: { rephrasedQuery: string; question: string; chat_history: Array<[string, MessageContent] | BaseMessage> }) => {
      const retrievedDocs = await retriever.invoke(input.rephrasedQuery);
      return formatDocumentsAsString(retrievedDocs);
    },
  }),
  // Step 3: Prepare the final input for the generation LLM.
  // We select the necessary fields for the final prompt.
  (input: { question: string; chat_history: Array<[string, MessageContent] | BaseMessage>; context: string }) => ({
    question: input.question,
    chat_history: input.chat_history,
    context: input.context,
  }),
  prompt, // Main generation prompt
  llm,    // Main generation LLM
  new StringOutputParser(),
]);

export async function streamRagResponse(
  userMessage: string,
  chatHistory?: ChatHistoryItem[]
): Promise<ReadableStream<Uint8Array>> {
  const processedHistory: Array<[string, MessageContent] | BaseMessage> = (
    chatHistory || []
  ).map((item) => {
    return [item.role, item.content] as [string, MessageContent];
  });

  const stream = await ragChain.stream({
    question: userMessage,
    chat_history: processedHistory,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        controller.enqueue(new TextEncoder().encode(chunk as string));
      }
      controller.close();
    },
  });
}
