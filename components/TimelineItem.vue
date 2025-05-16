<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { computed } from 'vue'
import type { TimelineItemData, TypeConfig, SkillColorConfig } from '@/types/timeline'

const props = defineProps<{
  item: TimelineItemData
  typeConfig: Record<string, TypeConfig>
  getSkillColors: (skillName: string) => SkillColorConfig
  isVisible: boolean
  animationDelay: string
}>()


// Helper to safely access type configuration
const currentTypeConfig = computed(() => {
  return props.typeConfig[props.item.type] || { icon: 'lucide:help-circle', color: 'bg-slate-500/10 text-slate-500', border: 'border-slate-500/20', accentHue: 240 };
});

</script>

<template>
  <div
    class="relative pl-10 group"
    :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-4 opacity-0': !isVisible }"
    :style="{ 
      transition: `all 0.5s ease-out ${animationDelay}`,
      '--timeline-accent-hue': currentTypeConfig.accentHue + 'deg'
    }"
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
      class="bg-background/50 backdrop-blur-sm rounded-lg overflow-hidden transition-all duration-200 group-hover:shadow-md group-hover:ring-1 border border-border/40"
      :class="[`group-hover:ring-[hsl(var(--timeline-accent-hue)_70%_55%_/_0.3)]`]"
    >
      <!-- Header section -->
      <div class="p-4 pb-0">
        <h3 
          class="text-base font-medium transition-colors duration-300"
          :class="[`group-hover:text-[hsl(var(--timeline-accent-hue)_80%_60%)]`]"
        >
          {{ item.title }}
        </h3>

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
            'inline-flex items-center px-2 py-0.5 rounded-sm text-xs border',
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