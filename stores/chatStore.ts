import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: string;
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
  
  // Add a new user message
  function addUserMessage(content: string) {
    if (!content.trim()) return;
    
    messages.value.push({
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toISOString()
    });
    
    // In a real app, you would trigger AI response here
    simulateResponse(content);
  }
  
  // Simulate AI response (placeholder for actual API call)
  function simulateResponse(userMessage: string) {
    isTyping.value = true;
    
    // Simulate network delay
    setTimeout(() => {
      isTyping.value = false;
      
      // Add bot message
      messages.value.push({
        id: Date.now().toString(),
        content: `You said: "${userMessage}". This is a simulated response.`,
        isUser: false,
        timestamp: new Date().toISOString()
      });
    }, 1500);
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