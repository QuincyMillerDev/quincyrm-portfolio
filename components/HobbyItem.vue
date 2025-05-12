<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import type { Hobby } from '@/types/hobby'

const props = defineProps<{
  hobby: Hobby
  isActive: boolean
  isVisible: boolean // For entry animation
  animationDelay: string // For staggered entry animation
}>()

const emit = defineEmits<{
  (e: 'toggle-active', id: string): void
}>()

const handleClick = () => {
  emit('toggle-active', props.hobby.id)
}
</script>

<template>
  <div
    class="group relative bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 overflow-hidden transition-all duration-200 hover:shadow-md"
    :class="[
      isActive ? 'shadow-md ring-1' : '',
      `hover:ring-1 hover:ring-${hobby.color}-500/20 ring-${hobby.color}-500/20`
    ]"
    :style="{
      transition: `all 0.3s ease-out ${animationDelay}`,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      opacity: isVisible ? 1 : 0
    }"
    @click="handleClick"
  >
    <!-- Subtle accent color -->
    <div
      class="absolute top-0 left-0 w-full h-1 opacity-70"
      :class="`bg-${hobby.color}-500/40`"
    />

    <div class="p-5">
      <!-- Header with icon -->
      <div class="flex items-center mb-3">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center mr-3"
          :class="`bg-${hobby.color}-500/10 text-${hobby.color}-500`"
        >
          <Icon :icon="hobby.icon" class="w-4 h-4" />
        </div>
        <h3 class="text-base font-medium">{{ hobby.name }}</h3>
      </div>

      <!-- Description -->
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="text-sm text-muted-foreground mb-4" v-html="hobby.description" />

      <!-- Stats -->
      <div
        v-if="hobby.stats && hobby.stats.length"
        class="grid grid-cols-2 gap-3 mb-4"
      >
        <div
          v-for="stat in hobby.stats"
          :key="stat.label"
          class="flex items-center"
        >
          <div class="w-6 h-6 flex items-center justify-center mr-2 opacity-70">
            <Icon v-if="stat.icon" :icon="stat.icon" class="w-4 h-4" />
          </div>
          <div>
            <div class="text-xs text-muted-foreground">{{ stat.label }}</div>
            <template v-if="stat.url">
              <a
                :href="stat.url"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium text-muted-foreground hover:text-orange-500 hover:underline transition-colors duration-150 truncate"
              >
                {{ stat.value }}
              </a>
            </template>
            <template v-else>
              <div class="text-sm font-medium">{{ stat.value }}</div>
            </template>
          </div>
        </div>
      </div>

      <!-- Specific Link for Fitness Hobby -->
      <div v-if="hobby.id === 'fitness'" class="text-right -mt-2 mb-4 mr-1"> 
          <a 
            href="https://www.strava.com/athletes/144953166"
            target="_blank" 
            rel="noopener noreferrer"
            class="text-xs text-muted-foreground hover:text-orange-500 hover:underline transition-colors duration-150 flex items-center justify-end"
          >
            Data Source: Strava
            <Icon icon="lucide:external-link" class="w-3 h-3 ml-1" />
          </a>
      </div>

      <!-- Generic Hobby Link (if defined in hobby data) -->
      <div v-if="hobby.link" class="mt-auto"> 
        <Button
          variant="ghost"
          size="sm"
          class="text-xs px-3 py-1 h-auto"
          :class="`text-${hobby.color}-500 hover:bg-${hobby.color}-500/10`"
          as-child
        >
          <a :href="hobby.link.url" target="_blank" rel="noopener noreferrer">
            <Icon icon="lucide:external-link" class="w-3 h-3 mr-1" />
            {{ hobby.link.label }}
          </a>
        </Button>
      </div>
    </div>
  </div>
</template> 