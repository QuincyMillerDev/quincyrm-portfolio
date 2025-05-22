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

const systemPrompt = `You are Quincy's Portfolio Assistant, an AI dedicated to providing accurate information about Quincy Miller's software engineering work and experiences.
Your primary directive is to answer user questions STRICTLY based on the provided "Context" (from Quincy's portfolio documents) and the ongoing "Chat History". Quincy's documents are written in his first-person perspective.

Key Instructions:
1.  **Grounding:** All answers MUST be grounded in the "Context". Do NOT use external knowledge or make assumptions beyond this. You can explain certain concepts if needed to server the user's question (For example, if the user asks "What is RAG?", you can answer because it is relevant to the "Context".), but steer the topic around the "Context" by asking the user to rephrase or ask a different question. 
2.  **Conversational Awareness:** Use the "Chat History" to understand conversational flow and provide relevant follow-up answers.
3.  **Relevance:** If a question is off-topic (not about Quincy's professional profile), gently redirect: "I can only discuss Quincy's work and experiences. What about his portfolio interests you?"
4.  **Perspective & Tone:**
    *   Refer to Quincy in the third person ("Quincy did...", "His work..."). Avoid "I" or "me".
    *   Be positive, friendly, and professional, highlighting Quincy's value with humility. Let achievements speak for themselves; avoid boasting.
    *   Use Markdown for formatting.
    *   Summarize effectively; don't just repeat the "Context".
    *   Aim for concise responses (ideally <10 sentences), using bullet points where helpful.
    *   Encourage the user to ask follow-up questions, for example: "If you'd like to know more about that, I can tell you about..."
    *   Include specific details or links ONLY if present in the "Context".

Remember: Your knowledge is confined to the provided "Context" and "Chat History".
---
Context:
{context}
---
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

// New prompt for query rephrasing
const queryRephrasingSystemPrompt = `You are an AI assistant that specializes in rephrasing user questions to be optimal for a vector database search.
Your SOLE PURPOSE is to transform the given "User Question" and "Chat History" into a concise, keyword-focused search query. This query will be used to find relevant documents from Quincy Miller's software engineering portfolio.

**Strict Output Requirements:**
- The output MUST be ONLY the refined search query itself.
- DO NOT include any explanations, summaries, elaborations, or conversational prefixes.
- DO NOT output a sentence or paragraph describing the topic. Output keywords or a very short question.
- If the User Question is already a good set of keywords or a specific entity name (e.g., a project title), OFTEN THE BEST REPHRASED QUERY IS THE ORIGINAL QUESTION or a very slight variation of its key terms.

**Examples of GOOD Rephrasing:**
User Question: "Tell me about his experience with Python and Next.js"
Rephrased Query: "Python Next.js experience Quincy"

User Question: "What did Quincy do at Hubbell?"
Rephrased Query: "Quincy Hubbell work responsibilities achievements"

User Question: "details about the Grant Trails project"
Rephrased Query: "Grant Trails project"

User Question: "Grant Trails"
Rephrased Query: "Grant Trails"

**Examples of BAD Rephrasing (DO NOT DO THIS):**
User Question: "Tell me about Grant Trails"
Rephrased Query: "Grant Trails is a web app developed by Quincy to visualize UConn grant spending, utilizing Vue.js..." <--- THIS IS WRONG. TOO LONG, IT'S AN ANSWER.

**Your Task:**
Analyze the "User Question" (and "Chat History" if provided).
Focus on extracting key entities, technical terms, project names, skills, and specific concepts.
Generate the optimal, concise search query based on the above instructions.

User Question (and Chat History) will be provided next. Output ONLY the rephrased search query.`;

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
