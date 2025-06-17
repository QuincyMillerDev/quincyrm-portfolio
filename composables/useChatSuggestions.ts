import { nextTick } from 'vue'
import { useChatStore } from '~/stores/chatStore'
import { useBreakpoints } from '@vueuse/core'

export function useChatSuggestions() {
  const chatStore = useChatStore()
  const breakpoints = useBreakpoints({ mobile: 768 })
  const isMobile = breakpoints.smaller('mobile')

  const handleChatSuggestion = (suggestion?: string) => {
    if (suggestion) {
      const chatPanelIsOpen = !isMobile.value && chatStore.isOpen;
      const chatSheetIsOpen = isMobile.value && chatStore.isMobileSheetOpen;
      const isChatCurrentlyOpen = chatPanelIsOpen || chatSheetIsOpen;

      // If this is the first suggestion, we need to open chat before sending
      if (!chatStore.isAiResponding) {
        if (!isChatCurrentlyOpen) {
          if (isMobile.value) {
            chatStore.toggleMobileSheet();
          } else {
            chatStore.toggleChat();
          }
        }
        // The suggestion will be sent immediately by setSuggestedMessage
        chatStore.setSuggestedMessage(suggestion);
        return;
      }

      // Original behavior for subsequent suggestions
      if (isChatCurrentlyOpen) {
        chatStore.setSuggestedMessage(suggestion);
      } else {
        if (isMobile.value) {
          chatStore.toggleMobileSheet();
        } else {
          chatStore.toggleChat();
        }
        nextTick(() => {
          chatStore.setSuggestedMessage(suggestion);
        });
      }
    }
  };

  return {
    handleChatSuggestion,
    isMobile // Exporting isMobile in case it's needed directly by components
  }
} 