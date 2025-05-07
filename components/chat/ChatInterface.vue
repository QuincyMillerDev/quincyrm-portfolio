<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import ChatMessage from './ChatMessage.vue'
import ChatInput from './ChatInput.vue'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

// Sample messages for UI demonstration
const messages = ref<Message[]>([
  {
    id: '1',
    content: "👋 Hi there! I'm Quincy's AI assistant. How can I help you learn more about Quincy's work and experience?",
    isUser: false,
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    content: "What kind of projects has Quincy worked on?",
    isUser: true,
    timestamp: new Date(Date.now() - 3500000).toISOString()
  },
  {
    id: '3',
    content: "Quincy has worked on a variety of projects, including:\n\n- **Web Applications**: Built modern web apps using Vue.js, React, and TypeScript\n- **AI Integration**: Developed systems that leverage machine learning for smarter user experiences\n- **Design Systems**: Created cohesive design systems for enterprise applications\n\nAre you interested in learning more about any specific area?",
    isUser: false,
    timestamp: new Date(Date.now() - 3400000).toISOString()
  }
])

const messagesEndRef = ref<HTMLDivElement | null>(null)
const isTyping = ref(false)

const scrollToBottom = async () => {
  await nextTick()
  if (messagesEndRef.value) {
    messagesEndRef.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleSendMessage = (content: string) => {
  // Add user message
  messages.value.push({
    id: Date.now().toString(),
    content,
    isUser: true,
    timestamp: new Date().toISOString()
  })
  
  // Simulate AI typing
  isTyping.value = true
  
  // Scroll to bottom after sending message
  scrollToBottom()
  
  // Simulate AI response after a delay
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      id: (Date.now() + 1).toString(),
      content: "That's an interesting question! I'd be happy to tell you more about Quincy's experience with that.",
      isUser: false,
      timestamp: new Date().toISOString()
    })
    
    // Scroll to bottom after receiving response
    scrollToBottom()
  }, 1500)
}

onMounted(() => {
  scrollToBottom()
})
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- Chat messages area -->
    <div class="flex-1 overflow-y-auto px-2 py-4 space-y-1 scroll-smooth">
      <!-- Date separator -->
      <div class="flex justify-center my-4">
        <div class="text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
          Today
        </div>
      </div>
      
      <!-- Messages -->
      <ChatMessage 
        v-for="message in messages" 
        :key="message.id"
        :content="message.content"
        :is-user="message.isUser"
        :timestamp="message.timestamp"
      />
      
      <!-- Typing indicator -->
      <div v-if="isTyping" class="flex items-center space-x-2 opacity-70 ml-10">
        <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 0ms;" />
        <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 150ms;" />
        <div class="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style="animation-delay: 300ms;" />
      </div>
      
      <!-- Invisible element to scroll to -->
      <div ref="messagesEndRef" />
    </div>
    
    <!-- Input area -->
    <div class="mt-auto pt-2">
      <ChatInput @send="handleSendMessage" />
    </div>
  </div>
</template>