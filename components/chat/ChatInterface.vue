<script setup lang="ts">
import { nextTick, ref, onMounted, computed } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'
import { useChatStore } from '~~/stores/chatStore'
import { Icon } from '@iconify/vue'
import { useBreakpoints } from '@vueuse/core'

// Use chat store
const chatStore = useChatStore()

// Detect mobile breakpoint
const breakpoints = useBreakpoints({
  mobile: 768, // md breakpoint
})
const isMobile = breakpoints.smaller('mobile')

// Function to close chat based on device
const closeChat = () => {
  if (isMobile.value) {
    chatStore.toggleMobileSheet()
  } else {
    chatStore.toggleChat()
  }
}

const messagesEndRef = ref<HTMLDivElement | null>(null)
const headerVisible = ref(true)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEndRef.value) {
    messagesEndRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleSendMessage = (content: string) => {
  // Add message via store
  chatStore.addUserMessage(content)
  
  // Scroll to bottom after sending message
  scrollToBottom()
}

// Toggle header visibility on scroll
const messagesContainer = ref<HTMLDivElement | null>(null)
const chatInputRef = ref<InstanceType<typeof ChatInput> | null>(null)
const handleScroll = () => {
  if (!messagesContainer.value) return
  headerVisible.value = messagesContainer.value.scrollTop < 50
}

// Empty state
const isEmptyChat = computed(() => chatStore.messages.length === 0)

const populateInputWithSuggestion = (suggestion: string) => {
  chatInputRef.value?.setMessage(suggestion)
}

onMounted(() => {
  scrollToBottom()
  if (messagesContainer.value) {
    messagesContainer.value.addEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Chat header - animated and smaller -->
    <div 
      class="px-4 py-3 border-b border-border/30 flex justify-between items-center transition-all duration-300 backdrop-blur-sm bg-background/80 z-10"
      :class="[
        headerVisible ? 'opacity-100' : 'opacity-0 -translate-y-2',
      ]"
    >
      <div class="flex items-center gap-2">
        <div class="relative">
          <div class="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center">
            <Icon icon="lucide:message-square" class="w-4 h-4 text-violet-600 dark:text-violet-400" />
          </div>
        </div>
        <h3 class="font-medium text-sm text-foreground">Chat Assistant</h3>
      </div>
      
      <!-- Chat actions -->
      <div class="flex items-center gap-1">
        <button 
          v-if="chatStore.messages.length > 0"
          class="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50/30 dark:hover:bg-red-950/20 transition-colors"
          @click="chatStore.clearMessages"
        >
          <Icon icon="lucide:trash-2" class="w-3.5 h-3.5" />
          <span class="sr-only">Clear chat</span>
        </button>
        
        <button 
          class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          @click="closeChat"
        >
          <Icon icon="lucide:x" class="w-3.5 h-3.5" />
          <span class="sr-only">Close chat</span>
        </button>
      </div>
    </div>
    
    <!-- Chat messages area -->
    <div 
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-3 py-4 space-y-2 scroll-smooth hide-scrollbar"
    >
      <!-- Empty state -->
      <div 
        v-if="isEmptyChat" 
        class="h-full flex flex-col items-center justify-center text-center px-6 py-10"
      >
        <h3 class="text-base font-medium mb-1 text-foreground">Welcome to the Chat</h3>
        <p class="text-sm text-muted-foreground mb-4 max-w-xs">
          This feature is still under development.
        </p>
        <div class="grid grid-cols-2 gap-2 w-full max-w-xs">
          <button 
          v-for="(suggestion, i) in ['How does this chatbot work?', 'What was Quincy\'s most recent job?', 'Provide a list of Quincy\'s skills', 'What is Quincy\'s favorite food?']" 
            :key="i"
            class="text-xs px-3 py-2 rounded-lg border border-border/40 bg-muted/30 hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground"
            @click="populateInputWithSuggestion(suggestion)"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
      
      <!-- Messages -->
      <ChatMessage 
        v-for="message in chatStore.messages" 
        :key="message.id"
        :content="message.content"
        :is-user="message.isUser"
        :timestamp="message.timestamp"
      />
      
      <!-- Typing indicator -->
      <div v-if="chatStore.isTyping" class="flex items-center space-x-2 opacity-70 ml-10">
        <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 0ms;" />
        <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 150ms;" />
        <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 300ms;" />
      </div>
      
      <!-- Invisible element to scroll to -->
      <div ref="messagesEndRef" />
    </div>
    
    <!-- Input area -->
    <div class="mt-auto">
      <ChatInput ref="chatInputRef" @send="handleSendMessage" />
    </div>
  </div>
</template>

<style scoped>
/* Hide scrollbar for all browsers */
.hide-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;  /* Chrome, Safari and Opera */
}
</style>