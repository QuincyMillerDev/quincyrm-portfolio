<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { Icon } from '@iconify/vue'

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
    class="group flex w-full mb-4 transition-all duration-300 hover:translate-x-0.5"
    :class="[
      isUser ? 'justify-end' : 'justify-start',
    ]"
  >
    <!-- AI Message -->
    <template v-if="!isUser">
      <div class="flex max-w-[85%]">
        <!-- AI Avatar -->
        <div class="mr-2 mt-1 flex-shrink-0">
          <div class="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/40 flex items-center justify-center">
            <Icon icon="lucide:sparkles" class="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
          </div>
        </div>
        
        <div>
          <div 
            class="bg-muted/30 backdrop-blur-sm px-4 py-3 rounded-lg border border-border/30 shadow-sm text-sm text-foreground group-hover:border-border/50 transition-all duration-300"
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
          class="bg-primary/10 backdrop-blur-sm px-4 py-3 rounded-lg border border-primary/10 shadow-sm text-sm text-foreground group-hover:border-primary/20 transition-all duration-300"
        >
          <ClientOnly>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div 
              class="prose prose-sm dark:prose-invert max-w-none"
              v-html="parsedContent"
            />
          </ClientOnly>
        </div>
        <div class="text-xs text-muted-foreground mt-1 mr-1 opacity-0 group-hover:opacity-70 transition-opacity flex items-center gap-1">
          {{ formattedTime }}
          <Icon icon="lucide:check" class="w-3 h-3 text-primary" />
        </div>
      </div>
    </template>
  </div>
</template>