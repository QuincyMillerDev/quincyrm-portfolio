<script setup lang="ts">
import { computed } from 'vue'
import { Github, Globe } from 'lucide-vue-next'

interface Project {
  title: string
  description: string
  link: string
}

const props = defineProps<{ 
  project: Project,
  index?: number,
  isVisible: boolean,
  animationDelay: string
}>()

const accentHexColors = ['#FF4081', '#FFAB40', '#69F0AE', '#00B8D4', '#536DFE', '#D500F9'];
const currentAccentHex = computed(() => accentHexColors[(props.index || 0) % accentHexColors.length]);

// Style object to set the CSS custom property
const itemStyle = computed(() => ({
  '--item-accent-color': currentAccentHex.value
}));

// Determine if it's a GitHub link
const isGithubLink = computed(() => props.project.link.includes('github.com'))

// Removed unused class string constants

</script>

<template>
  <a 
    :href="props.project.link" 
    target="_blank" 
    rel="noopener noreferrer"
    class="block h-full group"
    :style="itemStyle"
  >
    <div 
      class="project-card relative flex flex-col h-full overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-md group-hover:ring-1"
      :style="{
        'transition': `all 0.3s ease-out ${props.animationDelay || '0s'}`,
        'transform': props.isVisible ? 'translateY(0px)' : 'translateY(20px)',
        'opacity': props.isVisible ? 1 : 0
      }" 
      :class="['group-hover:ring-[var(--item-accent-color)]/30']"
    >
      <div class="p-5 flex-grow flex flex-col">
        <div class="flex items-center mb-3">
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
            class="text-md font-medium tracking-tight transition-colors duration-300"
            :class="['group-hover:text-[var(--item-accent-color)]']"
          >
            {{ props.project.title }}
          </h3>
        </div>
        
        <div class="flex-grow space-y-2">
          <p class="text-sm text-muted-foreground line-clamp-3">
            {{ props.project.description }}
          </p>
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
.project-card {
  will-change: transform, opacity, box-shadow;
}
</style>