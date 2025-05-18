<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { Button } from '~/components/ui/button'
import { Textarea } from '~/components/ui/textarea'
import { Icon } from '@iconify/vue'

const message = ref('')
const textareaRef = ref<ComponentPublicInstance & { $el: HTMLTextAreaElement } | null>(null)

const emit = defineEmits(['send'])

const isOverLimit = () => message.value.length > 400

const handleSend = () => {
  if (message.value.trim() && !isOverLimit()) {
    emit('send', message.value)
    message.value = ''
    
    // Reset textarea height
    if (textareaRef.value && textareaRef.value.$el) {
      textareaRef.value.$el.style.height = 'auto'
    }
  }
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Auto-resize textarea
const resizeTextarea = () => {
  if (!textareaRef.value || !textareaRef.value.$el) return
  
  textareaRef.value.$el.style.height = 'auto'
  textareaRef.value.$el.style.height = `${Math.min(textareaRef.value.$el.scrollHeight, 150)}px`
}

const setMessage = (newMessage: string) => {
  message.value = newMessage
  nextTick(() => {
    if (textareaRef.value && textareaRef.value.$el) {
      textareaRef.value.$el.focus()
    }
    resizeTextarea()
  })
}

defineExpose({ setMessage })
</script>

<template>
  <div class="relative">
    <!-- Subtle gradient separator -->
    <div class="absolute top-0 left-0 right-0 h-6 bg-gradient-to-t from-transparent to-background/90 pointer-events-none" />
    
    <div class="p-3">
      <div class="relative flex items-end gap-2 bg-background/50 backdrop-blur-sm rounded-lg p-2 border border-border/40 shadow-sm hover:border-border/60 transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/20">
        <Textarea
          ref="textareaRef"
          v-model="message"
          placeholder="Ask me a question..."
          class="min-h-[44px] max-h-[150px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2 text-sm hide-scrollbar"
          @keydown="handleKeyDown"
          @input="resizeTextarea"
        />
        
        <div class="flex items-center gap-1 pb-1 pr-1">
          <!-- Send button -->
          <Button 
            variant="ghost" 
            size="icon" 
            class="h-9 w-9 rounded-lg flex-shrink-0 bg-primary/10 hover:bg-green-600/20 text-primary hover:text-green-600 transition-all duration-300 hover:scale-105"
            :disabled="!message.trim() || isOverLimit()"
            @click="handleSend"
          >
            <Icon icon="lucide:send" class="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
            <span class="sr-only">Send message</span>
          </Button>
        </div>
      </div>
      
      <!-- Character limit warning -->
      <div v-if="isOverLimit()" class="text-xs text-red-500 mt-1 text-right pr-1">
        Character limit exceeded ({{ message.length }}/400)
      </div>
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