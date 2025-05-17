<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import type { Hobby } from '@/types/hobby'
import { computed } from 'vue';

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

const currentAccentHex = computed(() => props.hobby.accentColorHex || '#888888'); // Default hex

// Style object to set the CSS custom property
const itemStyle = computed(() => ({
  '--item-accent-color': currentAccentHex.value
}));

// Classes now reference the CSS custom property
const cardRingClass = 'group-hover:ring-[var(--item-accent-color)]/30';
const iconContainerBgClass = 'bg-[var(--item-accent-color)]/10';
const iconContainerTextColorClass = 'text-[var(--item-accent-color)]';
const iconContainerHoverBgClass = 'group-hover:bg-[var(--item-accent-color)]/20';
const iconContainerHoverTextColorClass = 'group-hover:text-[var(--item-accent-color)]';
const titleHoverColorClass = 'group-hover:text-[var(--item-accent-color)]';
const buttonTextColorClass = 'text-[var(--item-accent-color)]';
const buttonHoverBgClass = 'hover:bg-[var(--item-accent-color)]/10';
const buttonHoverTextColorClass = 'hover:text-[var(--item-accent-color)]';

</script>

<template>
  <div
    class="group block h-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
    :style="[itemStyle, { transitionDelay: animationDelay }]"
    :class="{ 
      'opacity-100 translate-y-0 scale-100': isVisible, 
      'opacity-0 translate-y-[10px] scale-[0.98]': !isVisible 
    }"
    @click="handleClick"
  >
    <div
      class="relative bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 overflow-hidden transition-all duration-200 hover:shadow-md group-hover:ring-1 h-full flex flex-col"
      :class="[
        isActive ? 'shadow-md' : '',
        cardRingClass
      ]"
    >
      <div class="p-5 flex-grow flex flex-col">
        <!-- Header with icon -->
        <div class="flex items-center mb-3">
          <div
            class="w-8 h-8 rounded-full flex items-center justify-center mr-3 transition-all duration-300"
            :class="[
              iconContainerBgClass, 
              iconContainerTextColorClass, 
              iconContainerHoverBgClass, 
              iconContainerHoverTextColorClass
            ]"
          >
            <Icon :icon="hobby.icon" class="w-4 h-4 transition-transform duration-300" />
          </div>
          <h3
            class="text-base font-medium transition-colors duration-300"
            :class="[titleHoverColorClass]"
          >
            {{ hobby.name }}
          </h3>
        </div>

        <!-- Description -->
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="text-sm text-muted-foreground mb-4 flex-grow" v-html="hobby.description" />

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
            class="text-xs px-3 py-1 h-auto transition-colors duration-300"
            :class="[buttonTextColorClass, buttonHoverBgClass, buttonHoverTextColorClass]"
            as-child
          >
            <a :href="hobby.link.url" target="blank" rel="noopener noreferrer">
              <Icon icon="lucide:external-link" class="w-3 h-3 mr-1" />
              {{ hobby.link.label }}
            </a>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template> 