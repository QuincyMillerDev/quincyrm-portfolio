<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Icon } from '@iconify/vue'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const message = ref('')
const isRecording = ref(false)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const emit = defineEmits(['send'])

const handleSend = () => {
  if (message.value.trim()) {
    emit('send', message.value)
    message.value = ''
  }
}

const toggleRecording = () => {
  isRecording.value = !isRecording.value
  // In a real implementation, this would start/stop speech recognition
}

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSend()
  }
}

// Auto-resize textarea
const resizeTextarea = () => {
  if (!textareaRef.value) return
  
  textareaRef.value.style.height = 'auto'
  textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
}
</script>

<template>
  <div class="relative">
    <!-- Subtle gradient separator -->
    <div class="absolute top-0 left-0 right-0 h-4 bg-gradient-to-t from-transparent to-background/80 pointer-events-none" />
    
    <div class="relative flex items-end gap-2 bg-background/50 backdrop-blur-sm rounded-lg p-2 border border-border/40">
      <Textarea
        ref="textareaRef"
        v-model="message"
        placeholder="Ask me anything..."
        class="min-h-[40px] max-h-[120px] resize-none bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-2"
        :class="{ 'pr-10': isRecording }"
        @keydown="handleKeyDown"
        @input="resizeTextarea"
      />
      
      <div class="flex items-center gap-1">
        <!-- Microphone button -->
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger as-child>
              <Button 
                variant="ghost" 
                size="icon" 
                class="h-8 w-8 rounded-full flex-shrink-0 transition-colors"
                :class="{ 'bg-primary/20 text-primary': isRecording }"
                @click="toggleRecording"
              >
                <Icon 
                  :icon="isRecording ? 'lucide:mic' : 'lucide:mic'" 
                  class="h-4 w-4"
                  :class="{ 'text-primary animate-pulse': isRecording }"
                />
                <span class="sr-only">{{ isRecording ? 'Stop recording' : 'Start recording' }}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{{ isRecording ? 'Stop recording' : 'Start voice input' }}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <!-- Send button -->
        <Button 
          variant="ghost" 
          size="icon" 
          class="h-8 w-8 rounded-full flex-shrink-0 bg-primary/10 hover:bg-primary/20 text-primary"
          :disabled="!message.trim()"
          @click="handleSend"
        >
          <Icon icon="lucide:send" class="h-4 w-4" />
          <span class="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  </div>
</template>