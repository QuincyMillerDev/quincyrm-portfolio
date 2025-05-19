import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable.');
}
if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  throw new Error(
    'Missing one or more Pinecone environment variables: PINECONE_API_KEY, PINECONE_INDEX_NAME'
  );
}

/**
 * Initializes and returns a Pinecone client instance.
 * @throws Error if Pinecone API key or environment is not set.
 * @returns {Pinecone} The Pinecone client instance.
 */
export function initializePineconeClient(): Pinecone {
  return new Pinecone({
    apiKey: PINECONE_API_KEY!,
  });
}

/**
 * Retrieves a specific Pinecone index.
 * @param {Pinecone} pineconeClient - The initialized Pinecone client.
 * @param {string} indexName - The name of the Pinecone index to retrieve.
 * @returns {import('@pinecone-database/pinecone').Index} The Pinecone index instance.
 */
export function getPineconeIndex(pineconeClient: Pinecone, indexName: string = PINECONE_INDEX_NAME!) {
  return pineconeClient.Index(indexName);
}

/**
 * Initializes and returns an OpenAIEmbeddings model instance.
 * @param {string} [modelName="text-embedding-3-large"] - The name of the OpenAI embedding model to use.
 * @throws Error if OpenAI API key is not set.
 * @returns {OpenAIEmbeddings} The OpenAIEmbeddings model instance.
 */
export function initializeOpenAIEmbeddings(modelName: string = "text-embedding-3-large"): OpenAIEmbeddings {
  return new OpenAIEmbeddings({
    openAIApiKey: OPENAI_API_KEY!,
    modelName,
  });
}

/**
 * Initializes and returns a ChatOpenAI (LLM) model instance.
 * @param {string} [modelName="gpt-3.5-turbo"] - The name of the OpenAI chat model to use.
 * @param {number} [temperature=0.7] - The sampling temperature for the model.
 * @param {boolean} [streaming=true] - Whether to enable streaming responses.
 * @throws Error if OpenAI API key is not set.
 * @returns {ChatOpenAI} The ChatOpenAI model instance.
 */
export function initializeChatOpenAI(
  modelName: string = "gpt-3.5-turbo",
  temperature: number = 0.7,
  streaming: boolean = true
): ChatOpenAI {
  return new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY!,
    modelName,
    temperature,
    streaming,
  });
}
