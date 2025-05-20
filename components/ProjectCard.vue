<script setup lang="ts">
import { computed } from 'vue'
import { Github, Globe, ExternalLink } from 'lucide-vue-next'
import type { Project } from '~/lib/types/projects'
import { useChatSuggestions } from '~/composables/useChatSuggestions'

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

const handleLocalChatSuggestion = () => {
  handleSuggestion(props.project.chatSuggestion)
};

</script>

<template>
  <div 
    class="block h-full group transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default cursor-pointer"
    :style="[itemStyle, { transitionDelay: props.animationDelay }]"
    :class="{ 
      'opacity-100 translate-y-0 scale-100': props.isVisible, 
      'opacity-0 translate-y-[10px] scale-[0.98]': !props.isVisible 
    }"
    @click="handleLocalChatSuggestion"
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
            :href="props.project.link" 
            target="_blank" 
            rel="noopener noreferrer"
            class="p-1.5 text-muted-foreground hover:text-[var(--item-accent-color)] transition-colors duration-300 rounded-md hover:bg-background/70"
            @click.stop
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  will-change: transform, opacity, box-shadow; 
  /* Note: transform and opacity are handled by the parent 'a' tag's animation now */
}
</style>