<script setup lang="ts">
import { computed } from 'vue'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

interface Props {
  content: string
  isUser: boolean
  timestamp?: string
}

const props = defineProps<Props>()

// Parse markdown in messages
const parsedContent = computed(() => {
  const dirty = marked.parse(props.content) as string
  return DOMPurify.sanitize(dirty)
})

// Format timestamp if provided
const formattedTime = computed(() => {
  if (!props.timestamp) return ''
  return new Date(props.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
})
</script>

<template>
  <div 
    class="group flex w-full mb-4 transition-opacity"
    :class="[
      isUser ? 'justify-end' : 'justify-start',
    ]"
  >
    <!-- AI Message -->
    <template v-if="!isUser">
      <div class="flex max-w-[85%]">
        <Avatar class="h-8 w-8 mr-2 mt-1 flex-shrink-0 opacity-80">
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
          <AvatarFallback class="bg-primary/10 text-primary">AI</AvatarFallback>
        </Avatar>
        
        <div>
          <div 
            class="bg-muted/30 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-foreground"
          >
            <ClientOnly>
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div 
                class="prose prose-sm dark:prose-invert max-w-none"
                v-html="parsedContent"
              />
            </ClientOnly>
          </div>
          <div class="text-xs text-muted-foreground mt-1 ml-1 opacity-0 group-hover:opacity-70 transition-opacity">
            {{ formattedTime }}
          </div>
        </div>
      </div>
    </template>
    
    <!-- User Message -->
    <template v-else>
      <div class="flex flex-col items-end max-w-[85%]">
        <div 
          class="bg-primary/10 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tr-sm text-sm text-foreground"
        >
          <ClientOnly>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div 
              class="prose prose-sm dark:prose-invert max-w-none"
              v-html="parsedContent"
            />
          </ClientOnly>
        </div>
        <div class="text-xs text-muted-foreground mt-1 mr-1 opacity-0 group-hover:opacity-70 transition-opacity">
          {{ formattedTime }}
        </div>
      </div>
    </template>
  </div>
</template>