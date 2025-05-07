<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

defineOptions({ name: 'AboutTimeline' })

interface TimelineItem {
  year: string
  title: string
  company?: string
  location?: string
  description: string
  skills?: string[]
  type: 'work' | 'education' | 'project' | 'achievement'
}

const props = defineProps<{ items: TimelineItem[] }>()

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

// Mock data for demonstration
const mockItems: TimelineItem[] = [
  {
    year: '2022 - Present',
    title: 'Senior Software Engineer',
    company: 'Tech Innovations Inc.',
    location: 'Remote',
    description: 'Leading development of cloud-native applications using Vue.js, TypeScript, and serverless architecture. Implemented CI/CD pipelines and mentored junior developers.',
    skills: ['Vue.js', 'TypeScript', 'AWS', 'CI/CD'],
    type: 'work'
  },
  {
    year: '2020 - 2022',
    title: 'Frontend Developer',
    company: 'Digital Solutions Co.',
    location: 'Boston, MA',
    description: 'Developed responsive web applications and contributed to the company\'s design system. Worked closely with UX designers to implement pixel-perfect interfaces.',
    skills: ['React', 'JavaScript', 'CSS', 'Design Systems'],
    type: 'work'
  },
  {
    year: '2019',
    title: 'Open Source Contribution',
    description: 'Major contributor to a popular open-source UI library, implementing accessibility improvements and performance optimizations.',
    type: 'project'
  },
  {
    year: '2016 - 2020',
    title: 'B.S. Computer Science',
    company: 'University of Technology',
    location: 'Cambridge, MA',
    description: 'Graduated with honors. Focus on software engineering and human-computer interaction.',
    type: 'education'
  },
  {
    year: '2018',
    title: 'Hackathon Winner',
    description: 'First place in the University Tech Challenge for developing an innovative accessibility tool for visually impaired users.',
    type: 'achievement'
  }
]

// Use provided items or mock data
const timelineItems: TimelineItem[] = props.items?.length ? props.items : mockItems
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
        <div 
          v-for="(item, idx) in timelineItems" 
          :key="idx"
          class="relative pl-10"
          :class="{ 'translate-y-0 opacity-100': isVisible, 'translate-y-4 opacity-0': !isVisible }"
          :style="{ transition: `all 0.5s ease-out ${idx * 100 + 200}ms` }"
        >
          <!-- Timeline dot with icon -->
          <div 
            class="absolute left-0 top-0 w-[30px] h-[30px] rounded-full flex items-center justify-center shadow-sm"
            :class="(typeConfig as any)[item.type].color"
          >
            <Icon :icon="(typeConfig as any)[item.type].icon" class="w-4 h-4" />
          </div>
          
          <!-- Year label -->
          <div class="text-sm font-medium text-muted-foreground mb-2">{{ item.year }}</div>
          
          <!-- Content card -->
          <div 
            class="bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md hover:ring-1"
            :class="[(typeConfig as any)[item.type].border, `hover:ring-${(typeConfig as any)[item.type].color.split(' ')[1].split('-')[1]}/20`]"
          >
            <!-- Header section -->
            <div class="p-4 pb-0">
              <h3 class="text-base font-medium">{{ item.title }}</h3>
              
              <!-- Company and location if available -->
              <div v-if="item.company || item.location" class="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <div v-if="item.company" class="flex items-center">
                  <Icon icon="lucide:building" class="w-3 h-3 mr-1 opacity-70" />
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
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-background border border-border/60"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
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