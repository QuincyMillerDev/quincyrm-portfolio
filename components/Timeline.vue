<script setup lang="ts">
import { ref, onMounted } from 'vue'
// import { Icon } from '@iconify/vue' // Removed as it's no longer used directly here
import TimelineItem from './TimelineItem.vue'

defineOptions({ name: 'AboutTimeline' })

interface TimelineItemData {
  year: string
  title: string
  company?: string
  location?: string
  description: string
  skills?: string[]
  type: 'work' | 'education' | 'project' | 'achievement'
}

const props = defineProps<{ items: TimelineItemData[] }>()

// For animation
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

// Type-specific icons and colors
const typeConfig: Record<string, { icon: string; color: string; border: string }> = {
  work: {
    icon: 'lucide:briefcase',
    color: 'bg-primary/10 text-primary',
    border: 'border-primary/20'
  },
  education: {
    icon: 'lucide:graduation-cap',
    color: 'bg-amber-500/10 text-amber-500',
    border: 'border-amber-500/20'
  },
  project: {
    icon: 'lucide:code',
    color: 'bg-emerald-500/10 text-emerald-500',
    border: 'border-emerald-500/20'
  },
  achievement: {
    icon: 'lucide:award',
    color: 'bg-violet-500/10 text-violet-500',
    border: 'border-violet-500/20'
  }
};

const timelineItems: TimelineItemData[] = props.items?.length ? props.items : []

// Color mapping for skills
const skillColorMap: Record<string, { bg: string; text: string; border: string }> = {
  'vue.js': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/30' },
  'typescript': { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' },
  'aws': { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30' },
  'ci/cd': { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/30' },
  'react': { bg: 'bg-sky-500/10', text: 'text-sky-600', border: 'border-sky-500/30' },
  'javascript': { bg: 'bg-yellow-400/10', text: 'text-yellow-600', border: 'border-yellow-400/30' },
  'css': { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/30' },
  'design systems': { bg: 'bg-pink-500/10', text: 'text-pink-600', border: 'border-pink-500/30' },
  'nuxt.js': { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/30' },
  'python': { bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-500/30' },
  'default': { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/30' }
};

const getSkillColors = (skillName: string) => {
  const lowerSkillName = skillName.toLowerCase();
  return skillColorMap[lowerSkillName] || skillColorMap.default;
};

</script>

<template>
  <section class="mt-12 relative">
    <h2 class="text-xl font-medium mb-6">Timeline</h2>
    
    <!-- Timeline container -->
    <div 
      class="relative"
      :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
      style="transition: opacity 0.6s ease-out"
    >
      <!-- Timeline line -->
      <div class="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-border/40 via-border/60 to-border/20" />
      
      <!-- Timeline items -->
      <div class="space-y-12">
        <TimelineItem
          v-for="(item, idx) in timelineItems"
          :key="idx"
          :item="item"
          :type-config="typeConfig"
          :get-skill-colors="getSkillColors"
          :is-visible="isVisible"
          :animation-delay="`${idx * 100 + 200}ms`"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom hover effect for timeline items */
.timeline-item:hover {
  transform: translateX(3px);
}
</style>