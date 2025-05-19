export interface ChatHistoryItem {
  role: "user" | "assistant" | "system" | "human" | "ai";
  content: string;
}
