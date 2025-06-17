import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ChatHistoryItem } from '~/lib/types/chat'; // Import the shared type

// Analytics tracking for chat interactions
const { trackEvent, trackInteraction } = useAnalytics()

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
  const isAiResponding = ref(false);
  // Analytics tracking functions
  const trackChatInteraction = (messageContent: string, responseType: 'success' | 'error' | 'rate_limit') => {
    trackEvent('chat_interaction', {
      message_length: messageContent.length,
      response_type: responseType,
      conversation_length: messages.value.length,
      timestamp: new Date().toISOString()
    })
  }

  const trackChatSessionStart = () => {
    if (messages.value.length === 0) {
      trackEvent('chat_session_started', {
        timestamp: new Date().toISOString()
      })
    }
  }

  const trackChatOpen = () => {
    trackInteraction('click', 'chat-interface', {
      action: 'open',
      timestamp: new Date().toISOString()
    })
  }
  
  // Toggle chat panel visibility (for desktop)
  function toggleChat() {
    if (!isOpen.value) {
      trackChatOpen()
    }
    isOpen.value = !isOpen.value;
  }
  
  // Toggle mobile sheet visibility
  function toggleMobileSheet() {
    isMobileSheetOpen.value = !isMobileSheetOpen.value;
  }
  
  async function fetchStreamedChatResponse(userMessageContent: string) {
    isAiResponding.value = true;
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
        
        // Track rate limit hit
        trackChatInteraction(userMessageContent, 'rate_limit')
        
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
        isAiResponding.value = false;
        return; 
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        
        // Track error response
        trackChatInteraction(userMessageContent, 'error')
        
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
        isAiResponding.value = false;
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
        isAiResponding.value = false;
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
        
        // Track successful response completion
        trackChatInteraction(userMessageContent, 'success')
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
      isAiResponding.value = false;
    }
  }
  
  // Add a new user message
  function addUserMessage(content: string) {
    if (!content.trim()) return;
    
    // Track chat session start if this is the first message
    trackChatSessionStart()
    
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
  
  // Set a suggested message
  function setSuggestedMessage(message: string) {
    // Only send if AI is not responding, otherwise do nothing
    if (!isAiResponding.value) {
      addUserMessage(message); // Send the message immediately
    }
    // If AI is responding, do nothing at all
  }
  
  return {
    // State
    isOpen,
    isMobileSheetOpen,
    messages,
    isAiResponding,
    
    // Actions
    toggleChat,
    toggleMobileSheet,
    addUserMessage,
    clearMessages,
    setSuggestedMessage
  };
}); 