<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { Github, Globe, ExternalLink } from 'lucide-vue-next'
import type { Project } from '~/lib/types/projects'
import { useChatSuggestions } from '~/composables/useChatSuggestions'
import ProjectDetailDialog from '~/components/ProjectDetailDialog.vue'

// Analytics composable for tracking events
const { trackEvent, trackInteraction } = useAnalytics()

const props = defineProps<{ 
  project: Project,
  index?: number,
  isVisible: boolean,
  animationDelay: string
}>()

const { handleChatSuggestion: handleSuggestion } = useChatSuggestions()

const accentHexColors = ['#FF4081', '#FFAB40', '#69F0AE', '#00B8D4', '#536DFE', '#D500F9'];
const currentAccentHex = computed(() => accentHexColors[(props.index || 0) % accentHexColors.length]);

// Style object to set the CSS custom property
const itemStyle = computed(() => ({
  '--item-accent-color': currentAccentHex.value
}));


// Determine if it's a GitHub link
const isGithubLink = computed(() => props.project.link?.includes('github.com') || false)

const detailsOpen = ref(false)
const cardRef = ref<HTMLElement | null>(null)

// The dialog has no in-DOM trigger element (the whole card opens it), so
// restore focus to the card ourselves when the dialog closes.
watch(detailsOpen, (isOpen) => {
  if (!isOpen) {
    nextTick(() => cardRef.value?.focus())
  }
})

const handleLocalChatSuggestion = () => {
  // Track project interaction via chat suggestion
  trackEvent('project_interaction', {
    project_name: props.project.title,
    interaction_type: 'chat_suggestion',
    project_index: props.index || 0
  })
  handleSuggestion(props.project.chatSuggestion)
};

// Card click opens the detail dialog when the project has details;
// falls back to the chat suggestion for projects without them.
const handleCardClick = () => {
  if (props.project.details) {
    trackEvent('project_interaction', {
      project_name: props.project.title,
      interaction_type: 'details_open',
      project_index: props.index || 0
    })
    detailsOpen.value = true
  } else {
    handleLocalChatSuggestion()
  }
};

// Track external link clicks
const trackExternalLinkClick = (event: Event) => {
  event.stopPropagation()
  trackInteraction('click', 'project-external-link', {
    project_name: props.project.title,
    link_url: props.project.link,
    link_type: isGithubLink.value ? 'github' : 'live_demo',
    project_index: props.index || 0
  })
}

</script>

<template>
  <div
    ref="cardRef"
    role="button"
    tabindex="0"
    :aria-label="`${props.project.title}: view details`"
    class="block h-full group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--item-accent-color)]/50 rounded-lg"
    :style="[itemStyle, { transitionDelay: props.animationDelay }]"
    :class="{
      'opacity-100 translate-y-0 scale-100': props.isVisible,
      'opacity-0 translate-y-[10px] scale-[0.98]': !props.isVisible
    }"
    @click="handleCardClick"
    @keydown.enter.prevent="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <div 
      class="project-card relative flex flex-col h-full overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-md group-hover:ring-1"
      :class="['group-hover:ring-[var(--item-accent-color)]/30']" 
    >
      <div class="relative p-5 flex-grow flex flex-col">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center">
            <div 
              class="icon-container flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300"
              :class="[
                'bg-[var(--item-accent-color)]/10',
                'group-hover:bg-[var(--item-accent-color)]/20'
              ]"
            >
              <component 
                :is="isGithubLink ? Github : Globe" 
                class="icon-glyph w-5 h-5 transition-all duration-300"
                :class="[
                  'text-[var(--item-accent-color)]',
                  'group-hover:text-[var(--item-accent-color)]'
                ]"
              />
            </div>
            <h3 
              class="text-md font-medium tracking-tight transition-colors duration-300 pr-8"
              :class="['group-hover:text-[var(--item-accent-color)]']"
            >
              {{ props.project.title }}
            </h3>
          </div>
          <a
            v-if="props.project.link"
            :href="props.project.link"
            target="_blank"
            rel="noopener noreferrer"
            class="p-1.5 text-muted-foreground hover:text-[var(--item-accent-color)] transition-colors duration-300 rounded-md hover:bg-background/70"
            @click="trackExternalLinkClick"
          >
            <ExternalLink class="w-4 h-4" />
            <span class="sr-only">View Project</span>
          </a>
        </div>
        
        <div class="flex-grow space-y-2">
          <p class="text-sm text-muted-foreground">
            {{ props.project.description }}
          </p>
        </div>

        <!-- Always visible on mobile (no hover there); hover-revealed on desktop -->
        <div
          v-if="props.project.details"
          class="mt-3 flex items-center text-xs text-muted-foreground opacity-70 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
        >
          <span class="text-[var(--item-accent-color)]">Details</span>
        </div>
      </div>
    </div>

    <ProjectDetailDialog
      v-if="props.project.details"
      v-model:open="detailsOpen"
      :project="props.project"
      :accent-hex="currentAccentHex"
      @chat="handleLocalChatSuggestion"
    />
  </div>
</template>

<style scoped>
.project-card {
  will-change: transform, opacity, box-shadow; 
  /* Note: transform and opacity are handled by the parent 'a' tag's animation now */
}
</style>