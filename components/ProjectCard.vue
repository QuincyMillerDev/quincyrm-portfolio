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

// Generate a random accent color for each card
const accentHues = [340, 25, 120, 200, 260, 290]
const accentHue = accentHues[(props.index || 0) % accentHues.length]

// Determine if it's a GitHub link
const isGithubLink = computed(() => props.project.link.includes('github.com'))
</script>

<template>
  <a 
    :href="props.project.link" 
    target="_blank" 
    rel="noopener noreferrer"
    class="block h-full group"
  >
    <div 
      class="project-card relative flex flex-col h-full overflow-hidden rounded-lg border border-border/40 bg-background/50 backdrop-blur-sm transition-all duration-300 group-hover:shadow-md group-hover:ring-1"
      :style="{
        '--accent-hue': accentHue + 'deg',
        '--accent-text-hover': `hsl(var(--accent-hue), 90%, 65%)`,
        'transition': `all 0.3s ease-out ${props.animationDelay || '0s'}`,
        'transform': props.isVisible ? 'translateY(0px)' : 'translateY(20px)',
        'opacity': props.isVisible ? 1 : 0
      }"
      :class="[`group-hover:ring-[hsl(var(--accent-hue)_70%_50%_/_0.3)]`]">
      
      <div class="p-5 flex-grow flex flex-col">
        <div class="flex items-center mb-3">
          <div 
            class="icon-container flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-300 bg-[hsl(var(--accent-hue),_70%,_50%,_0.1)] group-hover:bg-[hsl(var(--accent-hue),_70%,_50%,_0.2)] group-hover:scale-105"
          >
            <component 
              :is="isGithubLink ? Github : Globe" 
              class="icon-glyph w-5 h-5 transition-all duration-300 text-[hsl(var(--accent-hue),_80%,_60%)] group-hover:text-[hsl(var(--accent-hue),_90%,_70%)] group-hover:scale-110"
            />
          </div>
          <h3 
            class="text-md font-medium tracking-tight transition-colors duration-300 group-hover:text-[var(--accent-text-hover)]"
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