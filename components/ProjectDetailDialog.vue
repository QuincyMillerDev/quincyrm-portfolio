<script setup lang="ts">
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from 'reka-ui'
import { X, ExternalLink, MessageCircle, Github, Globe } from 'lucide-vue-next'
import { computed } from 'vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import type { Project } from '~/lib/types/projects'

const props = defineProps<{
  project: Project
  accentHex: string
}>()

const open = defineModel<boolean>('open', { required: true })

const emit = defineEmits<{
  (e: 'chat'): void
}>()

const isGithubLink = computed(() => props.project.link?.includes('github.com') || false)

// Style object to set the CSS custom property for the accent color
const dialogStyle = computed(() => ({
  '--item-accent-color': props.accentHex,
}))

const handleChat = () => {
  open.value = false
  emit('chat')
}
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay class="dialog-overlay fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
      <DialogContent
        class="dialog-content fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg max-h-[85vh] overflow-y-auto rounded-lg border border-border/60 bg-background p-5 sm:p-6 shadow-xl focus:outline-none"
        :style="dialogStyle"
      >
        <div class="flex items-start justify-between gap-4 mb-3">
          <div class="flex items-center min-w-0">
            <div
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-[var(--item-accent-color)]/10"
            >
              <component
                :is="isGithubLink ? Github : Globe"
                class="w-5 h-5 text-[var(--item-accent-color)]"
              />
            </div>
            <DialogTitle class="text-lg font-medium tracking-tight truncate">
              {{ props.project.title }}
            </DialogTitle>
          </div>
          <DialogClose
            class="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors duration-200 flex-shrink-0"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </DialogClose>
        </div>

        <DialogDescription class="text-sm text-muted-foreground mb-4">
          {{ props.project.details?.tagline || props.project.description }}
        </DialogDescription>

        <ul v-if="props.project.details?.bullets?.length" class="space-y-2.5 mb-4">
          <li
            v-for="(bullet, idx) in props.project.details.bullets"
            :key="idx"
            class="flex text-sm text-foreground/90 leading-relaxed"
          >
            <span
              class="flex-shrink-0 w-1.5 h-1.5 rounded-full mt-[0.45rem] mr-2.5 bg-[var(--item-accent-color)]"
            />
            <span>{{ bullet }}</span>
          </li>
        </ul>

        <div v-if="props.project.details?.stack?.length" class="flex flex-wrap gap-1.5 mb-5">
          <Badge
            v-for="tech in props.project.details.stack"
            :key="tech"
            variant="secondary"
            class="text-xs font-normal"
          >
            {{ tech }}
          </Badge>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <Button
            v-if="props.project.chatSuggestion"
            variant="default"
            size="sm"
            class="gap-1.5"
            @click="handleChat"
          >
            <MessageCircle class="w-3.5 h-3.5" />
            Ask the chatbot
          </Button>
          <Button
            v-if="props.project.link"
            as-child
            variant="outline"
            size="sm"
            class="gap-1.5"
          >
            <a :href="props.project.link" target="_blank" rel="noopener noreferrer">
              <ExternalLink class="w-3.5 h-3.5" />
              {{ isGithubLink ? 'View code' : 'Visit' }}
            </a>
          </Button>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
.dialog-overlay[data-state='open'] {
  animation: overlay-in 200ms ease-out;
}
.dialog-overlay[data-state='closed'] {
  animation: overlay-out 150ms ease-in;
}

/* The content grows out from the card click: scale + slight rise, matching the
   site's cubic-bezier(0.16, 1, 0.3, 1) animation language. */
.dialog-content {
  transform: translate(-50%, -50%);
}
.dialog-content[data-state='open'] {
  animation: content-in 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.dialog-content[data-state='closed'] {
  animation: content-out 150ms ease-in;
}

@keyframes overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes content-in {
  from {
    opacity: 0;
    transform: translate(-50%, -46%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes content-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
}
</style>
