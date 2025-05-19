import type { ChatHistoryItem } from "~/lib/types/chat";
import { streamRagResponse } from "../../lib/langchain/ragChain";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_INDEX_NAME = process.env.PINECONE_INDEX_NAME;

if (!OPENAI_API_KEY) {
  throw new Error("Server: Missing OPENAI_API_KEY environment variable.");
}
if (!PINECONE_API_KEY || !PINECONE_INDEX_NAME) {
  throw new Error(
    "Server: Missing one or more Pinecone environment variables: PINECONE_API_KEY, PINECONE_INDEX_NAME"
  );
}

// Simple in-memory store for daily rate limiting
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const MAX_REQUESTS_PER_DAY = 30;

function getStartOfNextUTCDay(): number {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  return tomorrow.getTime();
}

export default defineEventHandler(async (event) => {
  const forwardedFor = getRequestHeader(event, 'x-forwarded-for');
  // For local dev, x-forwarded-for might be undefined. Fallback to host or a fixed IP for testing.
  const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : (getRequestHost(event, { xForwardedHost: true }) || 'local-dev-ip');

  if (clientIp) {
    const now = Date.now();
    let record = ipRequestCounts.get(clientIp);

    if (!record || now >= record.resetTime) {
      record = { count: 1, resetTime: getStartOfNextUTCDay() };
      ipRequestCounts.set(clientIp, record);
    } else {
      record.count++;
      if (record.count > MAX_REQUESTS_PER_DAY) {
        console.warn(`Daily rate limit exceeded for IP: ${clientIp}. Count: ${record.count}`);
        return new Response(
          JSON.stringify({
            error:
              `You have exceeded the daily request limit (${MAX_REQUESTS_PER_DAY} requests). Your limit will reset at the start of the next UTC day (${new Date(record.resetTime).toUTCString()}).`,
          }),
          {
            status: 429, // Too Many Requests
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      ipRequestCounts.set(clientIp, record); // Update the count
    }
  }
  // End of rate limiting logic

  try {
    const { message, history } = (await readBody(event)) as {
      message: string;
      history?: ChatHistoryItem[];
    };

    if (!message) {
      return new Response(JSON.stringify({ error: "Message is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const readableStream = await streamRagResponse(message, history);

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e: unknown) {
    console.error("Error in /api/chat:", e);
    let errorMessage = "Internal Server Error";
    if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === "string") {
      errorMessage = e;
    }
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
