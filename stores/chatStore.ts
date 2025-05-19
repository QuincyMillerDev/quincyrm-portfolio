import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChatHistoryItem } from '~/lib/types/chat'; // Import the shared type

interface Message extends ChatHistoryItem { // Extend ChatHistoryItem for frontend-specific fields
  id: string;
  isUser: boolean;
  timestamp: string;
  isSystemMessage?: boolean; // Added for system messages
  // role and content are inherited from ChatHistoryItem
}

// Module-level counter for unique message IDs
let messageIdCounter = 0;
function generateUniqueMessageId() {
  return `${Date.now()}-${messageIdCounter++}`;
}

export const useChatStore = defineStore('chat', () => {
  // Chat visibility state
  const isOpen = ref(false);
  const isMobileSheetOpen = ref(false);
  
  // Messages state
  const messages = ref<Message[]>([]);
  const isTyping = ref(false);
  
  // Toggle chat panel visibility (for desktop)
  function toggleChat() {
    isOpen.value = !isOpen.value;
  }
  
  // Toggle mobile sheet visibility
  function toggleMobileSheet() {
    isMobileSheetOpen.value = !isMobileSheetOpen.value;
  }
  
  async function fetchStreamedChatResponse(userMessageContent: string) {
    isTyping.value = true;
    const botMessageId = generateUniqueMessageId();

    // Add an initial empty bot message to the UI
    messages.value.push({
      id: botMessageId,
      role: 'assistant', 
      content: "",
      isUser: false,
      timestamp: new Date().toISOString(),
      isSystemMessage: false,
    });

    try {
      const historyToSubmit: ChatHistoryItem[] = messages.value
        .slice(-6, -1) 
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMessageContent, 
          history: historyToSubmit 
        }),
      });

      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({ error: 'Rate limit exceeded. Please try again tomorrow.' }));
        const rateLimitMessage = errorData.error || "You have exceeded the daily request limit. Your limit will reset at the start of the next UTC day.";
        
        // Remove the temporary empty bot message
        const botMessageIndexToRemove = messages.value.findIndex(m => m.id === botMessageId);
        if (botMessageIndexToRemove !== -1) {
          messages.value.splice(botMessageIndexToRemove, 1);
        }

        messages.value.push({
          id: generateUniqueMessageId(),
          role: 'system', // Special role for system messages
          content: rateLimitMessage,
          isUser: false,
          timestamp: new Date().toISOString(),
          isSystemMessage: true,
        });
        isTyping.value = false;
        return; 
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        // Fallback to the bot message placeholder for general errors
        const botMessageIndex = messages.value.findIndex(m => m.id === botMessageId);
        if (botMessageIndex !== -1) {
          messages.value[botMessageIndex].content = errorData.error || `API request failed with status ${response.status}`;
        } else {
           // This case should ideally not be reached if placeholder logic is robust
            messages.value.push({
              id: generateUniqueMessageId(),
              role: 'assistant',
              content: errorData.error || "Sorry, I encountered an error.",
              isUser: false,
              timestamp: new Date().toISOString(),
              isSystemMessage: false, // Explicitly false for general errors handled this way
            });
        }
        isTyping.value = false;
        return; 
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      const botMessageIndex = messages.value.findIndex(m => m.id === botMessageId);
      if (botMessageIndex === -1) {
        console.error('Bot message placeholder not found');
        isTyping.value = false;
        return;
      }

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        if (chunk) {
          messages.value[botMessageIndex].content += chunk;
        }
      }
    } catch (error) {
      console.error('Error fetching chat response:', error);
      const botMessageIndex = messages.value.findIndex(m => m.id === botMessageId);
      if (botMessageIndex !== -1 && !messages.value[botMessageIndex].isSystemMessage) { // Don't overwrite system message
        messages.value[botMessageIndex].content = "Sorry, I encountered an error. Please try again.";
      } else if (botMessageIndex === -1) {
        // If placeholder wasn't added or was removed, add a new error message
        messages.value.push({
          id: generateUniqueMessageId(),
          role: 'assistant',
          content: "Sorry, I encountered an error. Please try again.",
          isUser: false,
          timestamp: new Date().toISOString(),
          isSystemMessage: false,
        });
      }
    } finally {
      isTyping.value = false;
    }
  }
  
  // Add a new user message
  function addUserMessage(content: string) {
    if (!content.trim()) return;
    
    const userMessageData: Message = {
      id: generateUniqueMessageId(),
      role: 'user', // or 'human'
      content,
      isUser: true,
      timestamp: new Date().toISOString(),
    };
    messages.value.push(userMessageData);
    
    // Call the new function to get AI response
    fetchStreamedChatResponse(content);
  }
  
  // Clear all messages
  function clearMessages() {
    messages.value = [];
  }
  
  return {
    // State
    isOpen,
    isMobileSheetOpen,
    messages,
    isTyping,
    
    // Actions
    toggleChat,
    toggleMobileSheet,
    addUserMessage,
    clearMessages
  };
}); 