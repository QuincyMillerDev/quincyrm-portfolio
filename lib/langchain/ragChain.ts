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
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";
import type { MessageContent, BaseMessage } from "@langchain/core/messages";
import type { ChatHistoryItem } from "~/lib/types/chat";

interface RagInput {
  question: string;
  chat_history: Array<[string, MessageContent] | BaseMessage>;
}

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
const llm = initializeChatOpenAI("gpt-4.1-nano-2025-04-14", 0.7, true); // Ensure streaming is true
const vectorStore = new PineconeStore(embeddings, { pineconeIndex });
const retriever = vectorStore.asRetriever({ k: 4 });

const systemPrompt = `You are a helpful AI assistant for Quincy's software engineering portfolio website.
Your goal is to answer questions users may ask about Quincy's work and experiences. You will be provided with a context that contains information related to the users question.
This context was taken from markdown documents written by Quincy. All of these documents are written in Quincy's first person perspective.
Only answer questions based on the context provided or what you can infer from the context. Do NOT make up information or make assumptions about Quincy or the context.

Do not stray from the topic of Quincy. If the user asks about something unrelated to Quincy's work and experiences, politely ask them to ask a question about Quincy's work and experiences.

Response style:
- Be positive and friendly, yet professional. As Quincy's AI assistant, your goal is to show Quincy can be a valuable asset to any team. 
- Humility is even MORE important, let the experiences you share speak for themselves. Do not brag or boast about Quincy.
- Support markdown formatting.
- Be polite when you don't have the information to answer the question. Ask the user to try asking in a different way.
- Respond from a third person perspective about Quincy. Refrain from using first person pronouns like "I" or "me".
- Include specific details or additional information such as links when relevant AND provided in the context.

Context:
---
{context}
---
`;

const prompt = ChatPromptTemplate.fromMessages([
  ["system", systemPrompt],
  new MessagesPlaceholder("chat_history"),
  ["human", "{question}"],
]);

const ragChain = RunnableSequence.from<RagInput, string>([
  {
    question: (input: RagInput) => input.question,
    chat_history: (input: RagInput) => input.chat_history,
    context: async (input: RagInput) => {
      const retrievedDocs = await retriever.getRelevantDocuments(input.question);
      return formatDocumentsAsString(retrievedDocs);
    },
  },
  prompt,
  llm,
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
