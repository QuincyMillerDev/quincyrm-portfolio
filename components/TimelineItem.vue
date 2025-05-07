<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

// Define the structure for a single timeline item (consistent with original Timeline.vue)
interface TimelineItemData {
  year: string
  title: string
  company?: string
  location?: string
  description: string
  skills?: string[]
  type: 'work' | 'education' | 'project' | 'achievement'
}

// Define the structure for type-specific configurations
interface TypeConfig {
  icon: string
  color: string
  border: string
}

// Define the structure for skill color configurations
interface SkillColorConfig {
  bg: string
  text: string
  border: string
}

const props = defineProps<{
  item: TimelineItemData
  typeConfig: Record<string, TypeConfig> // Passed from parent
  getSkillColors: (skillName: string) => SkillColorConfig // Passed from parent
  isVisible: boolean // For entry animation
  animationDelay: string // For staggered entry animation, e.g., "100ms"
}>()

// const isHovered = ref(false); // Removed: No longer needed for this hover effect

// Helper to safely access type configuration
const currentTypeConfig = computed(() => {
  return props.typeConfig[props.item.type] || { icon: 'lucide:help-circle', color: 'bg-slate-500/10 text-slate-500', border: 'border-slate-500/20' };
});

</script>

<template>
  <div
    class="relative pl-10"
    :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-4 opacity-0': !isVisible }"
    :style="{ transition: `all 0.5s ease-out ${animationDelay}` }"
  >
    <!-- Timeline dot with icon -->
    <div
      class="absolute left-0 top-0 w-[30px] h-[30px] rounded-full flex items-center justify-center shadow-sm"
      :class="currentTypeConfig.color"
    >
      <Icon :icon="currentTypeConfig.icon" class="w-4 h-4" />
    </div>

    <!-- Year label -->
    <div class="text-sm font-medium text-muted-foreground mb-2">{{ item.year }}</div>

    <!-- Content card -->
    <div
      class="bg-background/50 backdrop-blur-sm rounded-lg shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:ring-1"
      :class="[`hover:ring-${currentTypeConfig.color.split(' ')[1].substring('text-'.length)}/20`]">
      <!-- Header section -->
      <div class="p-4 pb-0">
        <h3 class="text-base font-medium">{{ item.title }}</h3>

        <!-- Company and location if available -->
        <div v-if="item.company || item.location" class="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <div v-if="item.company" class="flex items-center">
            {{ item.company }}
          </div>
          <div v-if="item.location" class="flex items-center">
            <Icon icon="lucide:map-pin" class="w-3 h-3 mr-1 opacity-70" />
            {{ item.location }}
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="p-4 text-sm text-muted-foreground">
        {{ item.description }}
      </div>

      <!-- Skills tags if available -->
      <div v-if="item.skills && item.skills.length" class="px-4 pb-4 flex flex-wrap gap-1.5">
        <span
          v-for="skill in item.skills"
          :key="skill"
          :class="[
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs border',
            getSkillColors(skill).bg,
            getSkillColors(skill).text,
            getSkillColors(skill).border
          ]"
        >
          {{ skill }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline-item:hover { /* This class isn't used in the new template, but if you add it to the root div above, it would apply */
  transform: translateX(3px);
}
</style> 