<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TimelineItem from './TimelineItem.vue'
import type { TimelineItemData, TypeConfigMap, SkillColorMap } from '~/lib/types/timeline'

defineOptions({ name: 'AboutTimeline' })

const props = defineProps<{ items: TimelineItemData[] }>()

// For animation
const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

// Type-specific icons and colors
const typeConfig: TypeConfigMap = {
  work: {
    icon: 'lucide:briefcase',
    color: 'bg-[#3B82F6]/10 text-[#3B82F6]',
    border: 'border-[#3B82F6]/20',
    accentHue: 210,
    accentColorHex: '#3B82F6'
  },
  education: {
    icon: 'lucide:graduation-cap',
    color: 'bg-amber-500/10 text-amber-500',
    border: 'border-amber-500/20',
    accentHue: 36,
    accentColorHex: '#F59E0B'
  },
  project: {
    icon: 'lucide:code',
    color: 'bg-emerald-500/10 text-emerald-500',
    border: 'border-emerald-500/20',
    accentHue: 145,
    accentColorHex: '#10B981'
  },
  achievement: {
    icon: 'lucide:award',
    color: 'bg-violet-500/10 text-violet-500',
    border: 'border-violet-500/20',
    accentHue: 262,
    accentColorHex: '#8B5CF6'
  }
};

const timelineItems: TimelineItemData[] = props.items?.length ? props.items : []

// Color mapping for skills
const skillColorMap: SkillColorMap = {
  'terraform': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30' },
  'python': { bg: 'bg-teal-500/10', text: 'text-teal-600', border: 'border-teal-500/30' },
  'typescript': { bg: 'bg-blue-500/10', text: 'text-blue-600', border: 'border-blue-500/30' },
  'ci/cd': { bg: 'bg-indigo-500/10', text: 'text-indigo-600', border: 'border-indigo-500/30' },
  'vue.js': { bg: 'bg-emerald-500/10', text: 'text-emerald-600', border: 'border-emerald-500/30' },
  'nuxt': { bg: 'bg-green-500/10', text: 'text-green-600', border: 'border-green-500/30' },
  'azure': { bg: 'bg-sky-600/10', text: 'text-sky-700', border: 'border-sky-600/30' },
  'angular': { bg: 'bg-red-500/10', text: 'text-red-600', border: 'border-red-500/30' },
  'c#': { bg: 'bg-purple-500/10', text: 'text-purple-600', border: 'border-purple-500/30' },
  'databricks': { bg: 'bg-orange-400/10', text: 'text-orange-500', border: 'border-orange-400/30' },
  'postgresql': { bg: 'bg-blue-700/10', text: 'text-blue-800', border: 'border-blue-700/30' },
  'node.js': { bg: 'bg-lime-500/10', text: 'text-lime-600', border: 'border-lime-500/30' },
  'docker': { bg: 'bg-cyan-400/10', text: 'text-cyan-500', border: 'border-cyan-400/30' },
  'nginx': { bg: 'bg-emerald-700/10', text: 'text-emerald-800', border: 'border-emerald-700/30' },
  'mysql': { bg: 'bg-indigo-400/10', text: 'text-indigo-500', border: 'border-indigo-400/30' },
  '.net': { bg: 'bg-purple-600/10', text: 'text-purple-700', border: 'border-purple-600/30' },
  'java': { bg: 'bg-orange-500/10', text: 'text-orange-600', border: 'border-orange-500/30' },
  'spring boot': { bg: 'bg-green-600/10', text: 'text-green-700', border: 'border-green-600/30' },
  'react': { bg: 'bg-cyan-500/10', text: 'text-cyan-600', border: 'border-cyan-500/30' },
  'default': { bg: 'bg-slate-500/10', text: 'text-slate-600', border: 'border-slate-500/30' }
};

const getSkillColors = (skillName: string) => {
  const lowerSkillName = skillName.toLowerCase();
  return skillColorMap[lowerSkillName] || skillColorMap.default;
};

</script>

<template>
  <section class="mt-12 relative">
    <h2 
      class="text-xl font-medium mb-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="{ 'opacity-100 translate-y-0 scale-100': isVisible, 'opacity-0 translate-y-[10px] scale-[0.98]': !isVisible }"
    >Timeline</h2>
    
    <!-- Timeline container -->
    <div 
      class="relative transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100"
      :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
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
          :animation-delay="`${idx * 100}ms`"
        />
      </div>
    </div>
  </section>
</template>