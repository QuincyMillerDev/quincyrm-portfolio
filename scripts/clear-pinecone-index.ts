import "dotenv/config";

import {
  initializePineconeClient,
  getPineconeIndex,
} from "../lib/langchain/initializeClients.js";

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

async function main() {
  if (!PINECONE_API_KEY) {
    throw new Error("PINECONE_API_KEY is not set in environment variables.");
  }
  if (!PINECONE_INDEX_NAME) {
    throw new Error("PINECONE_INDEX_NAME is not set.");
  }

  console.log(`Initializing Pinecone client for index: ${PINECONE_INDEX_NAME}`);
  const pineconeClient = initializePineconeClient();
  const pineconeIndex = getPineconeIndex(pineconeClient, PINECONE_INDEX_NAME);
  console.log(`Successfully initialized Pinecone index client for: ${PINECONE_INDEX_NAME}`);

  console.log(`Clearing all vectors from index: ${PINECONE_INDEX_NAME}...`);
  // Assuming the default namespace '' is what we want to clear.
  // If specific namespaces need to be cleared, this would need to be adjusted.
  await pineconeIndex.deleteAll();
  console.log(`Successfully cleared all vectors from index: ${PINECONE_INDEX_NAME}.`);
}

main().catch((error) => {
  console.error(`Error during Pinecone index clearing for '${PINECONE_INDEX_NAME}':`, error);
  if (error.response && error.response.data) {
    console.error("Error response data:", error.response.data);
  } else if (error.cause) {
    console.error("Error cause:", error.cause);
  }
  process.exit(1);
});

// Run this script to clear the Pinecone index with the following command:
// node --loader ts-node/esm scripts/clear-pinecone-index.ts

// NOTE: ensure that the .env file is set up correctly with the correct API key and index name.
// WARNING: This script will permanently delete all data in the specified Pinecone index.
// Make sure you are targeting the correct index and have a backup if necessary. 