import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { MarkdownTextSplitter } from "langchain/text_splitter";
import { PineconeStore } from "@langchain/pinecone";
import "dotenv/config";

import {
  initializePineconeClient,
  getPineconeIndex,
  initializeOpenAIEmbeddings,
} from "../lib/langchain/initializeClients.js";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;
const RAG_CONTENT_DIRECTORY = "docs/rag_content";

async function main() {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not set in environment variables.");
  }
  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set in environment variables.");
  }
  if (!PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is not set.");
  }

  console.log(`Initializing Pinecone client for index: ${PINECONE_INDEX_NAME}`);
  const pineconeClient = initializePineconeClient();
  const pineconeIndex = getPineconeIndex(pineconeClient, PINECONE_INDEX_NAME);
  console.log(`Successfully initialized Pinecone index client.`);

  // 1. Load documents
  console.log(`Loading documents from ${RAG_CONTENT_DIRECTORY}...`);
  const loader = new DirectoryLoader(RAG_CONTENT_DIRECTORY, {
    ".md": (path: string) => new TextLoader(path),
  });
  const docs = await loader.load();

  if (docs.length === 0) {
    console.log("No documents found to ingest.");
    return;
  }
  console.log(`Loaded ${docs.length} documents.`);

  // 2. Split documents
  console.log("Splitting documents into chunks...");
  const splitter = new MarkdownTextSplitter({
    chunkSize: 1500,
    chunkOverlap: 300,
  });
  const chunks = await splitter.splitDocuments(docs);
  console.log(`Split into ${chunks.length} chunks.`);

  // 3. Initialize embedding model
  console.log("Initializing OpenAI embedding model...");
  const embeddings = initializeOpenAIEmbeddings("text-embedding-3-large");
  console.log("OpenAI embedding model initialized.");

  // 4. Store in Pinecone
  console.log(
    `Storing ${chunks.length} chunks in Pinecone index '${PINECONE_INDEX_NAME}'...`
  );
  await PineconeStore.fromDocuments(chunks, embeddings, {
    pineconeIndex,
  });

  console.log(
    `Successfully embedded and stored ${chunks.length} chunks in Pinecone index '${PINECONE_INDEX_NAME}'.`
  );
}

main().catch((error) => {
  console.error("Error during data ingestion:", error);
  if (error.response && error.response.data) {
    console.error("Error response data:", error.response.data);
  } else if (error.cause) {
    console.error("Error cause:", error.cause);
  }
  process.exit(1);
});


// Run this script to ingest the data into Pinecone with the following command:
// node --loader ts-node/esm scripts/ingest-data.ts

// NOTE: ensure that the .env file is set up correctly with the correct API keys and index name.