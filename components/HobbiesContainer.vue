<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'

interface HobbyStats {
  label: string
  value: string
  icon?: string
}

interface Hobby {
  id: string
  name: string
  icon: string
  description: string
  stats?: HobbyStats[]
  color: string
  link?: {
    url: string
    label: string
  }
}

const props = defineProps<{
  hobbies: Hobby[]
}>()

// For animations
const isVisible = ref(false)
const activeHobby = ref('')

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

const toggleActive = (id: string) => {
  if (activeHobby.value === id) {
    activeHobby.value = ''
  } else {
    activeHobby.value = id
  }
}

// Sample hobbies data
const sampleHobbies: Hobby[] = [
  {
    id: 'fitness',
    name: 'Fitness & Nutrition',
    icon: 'lucide:dumbbell',
    description: 'Dedicated to maintaining a balanced lifestyle through regular strength training, cardio, and mindful nutrition. I track my workouts and nutrition to continuously improve my fitness level.',
    stats: [
      { label: 'Weekly Workouts', value: '5', icon: 'lucide:activity' },
      { label: 'Running', value: '15 mi/week', icon: 'lucide:timer' },
      { label: 'Strength Training', value: '3x week', icon: 'lucide:weight' }
    ],
    color: 'emerald',
    link: {
      url: '#',
      label: 'Strava Profile'
    }
  },
  {
    id: 'skiing',
    name: 'Backcountry Skiing',
    icon: 'lucide:mountain-snow',
    description: 'Passionate about exploring remote mountain terrain on skis. I prioritize avalanche safety education and enjoy the solitude and beauty of winter backcountry.',
    stats: [
      { label: 'Seasons', value: '8+', icon: 'lucide:calendar' },
      { label: 'Vertical Feet', value: '50K+/season', icon: 'lucide:arrow-up' },
      { label: 'Favorite Terrain', value: 'Alpine', icon: 'lucide:mountain' }
    ],
    color: 'sky',
    link: {
      url: '#',
      label: 'Trip Reports'
    }
  },
  {
    id: 'finance',
    name: 'Personal Finance',
    icon: 'lucide:bar-chart-2',
    description: 'Interested in financial independence and long-term investing strategies. I enjoy analyzing market trends and optimizing personal financial systems.',
    stats: [
      { label: 'Investment Style', value: 'Long-term', icon: 'lucide:trending-up' },
      { label: 'Focus Areas', value: 'Index Funds, Real Estate', icon: 'lucide:landmark' }
    ],
    color: 'amber',
    link: {
      url: '#',
      label: 'Resources'
    }
  },
  {
    id: 'content',
    name: 'Content Creation',
    icon: 'lucide:video',
    description: 'Creating educational content about technology and software development. I enjoy sharing knowledge and building a community around technical topics.',
    stats: [
      { label: 'Medium', value: 'Video & Writing', icon: 'lucide:pen-tool' },
      { label: 'Topics', value: 'Web Dev, AI, Design', icon: 'lucide:layers' }
    ],
    color: 'violet',
    link: {
      url: '#',
      label: 'View Content'
    }
  }
]

// Use provided hobbies or sample data
const displayHobbies = props.hobbies?.length ? props.hobbies : sampleHobbies
</script>

<template>
  <section class="mt-12">
    <h2 class="text-xl font-medium mb-6">Hobbies</h2>
    
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
      :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
      style="transition: opacity 0.6s ease-out"
    >
      <div 
        v-for="(hobby, idx) in displayHobbies" 
        :key="hobby.id"
        class="group relative bg-background/50 backdrop-blur-sm rounded-lg border border-border/40 overflow-hidden transition-all duration-200 hover:shadow-md"
        :class="[
          activeHobby === hobby.id ? 'shadow-md ring-1' : '',
          `hover:ring-1 hover:ring-${hobby.color}-500/20 ring-${hobby.color}-500/20`
        ]"
        :style="{ 
          transition: `all 0.3s ease-out ${idx * 100}ms`,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
          opacity: isVisible ? 1 : 0
        }"
        @click="toggleActive(hobby.id)"
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
          <p class="text-sm text-muted-foreground mb-4">{{ hobby.description }}</p>
          
          <!-- Stats -->
          <div 
            v-if="hobby.stats && hobby.stats.length" 
            class="grid grid-cols-2 gap-3 mb-4"
          >
            <div 
              v-for="stat in hobby.stats" 
              :key="`${hobby.id}-${stat.label}`"
              class="flex items-center"
            >
              <div class="w-6 h-6 flex items-center justify-center mr-2 opacity-70">
                <Icon :icon="stat.icon || 'lucide:activity'" class="w-4 h-4" />
              </div>
              <div>
                <div class="text-xs text-muted-foreground">{{ stat.label }}</div>
                <div class="text-sm font-medium">{{ stat.value }}</div>
              </div>
            </div>
          </div>
          
          <!-- Link -->
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
    </div>
  </section>
</template>