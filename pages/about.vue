<script setup lang="ts">
// About page
import { ref } from 'vue'
import ImageContainer from '~/components/ImageContainer.vue'
import Timeline from '~/components/Timeline.vue'
import HobbiesContainer from '~/components/HobbiesContainer.vue'

interface TimelineItemData {
  year: string
  title: string
  company?: string
  location?: string
  description: string
  skills?: string[]
  type: 'work' | 'project' | 'education' | 'achievement'
}

interface ImageItem {
  src: string
  alt: string
  shortDescription: string
  location?: string
  date?: string
}
const images: ImageItem[] = [
  { src: '/images/IMG_1625_VSCO.JPG', alt: 'Backcountry Skiing', shortDescription: 'I need to go backcountry skiing again.', location: 'Alta, UT', date: 'Jan 2025' },
  { src: '/images/IMG_1385.JPG', alt: 'Senior Design', shortDescription: 'UConn Computer Science Capstone, 3rd place!', location: 'Storrs, CT', date: 'April 2024' },
  { src: '/images/IMG_7864.JPG', alt: 'Japan', shortDescription: 'Exploring Japan.', location: 'Tokyo, Japan', date: 'August 2024' },
  { src: '/images/IMG_3697.JPG', alt: 'Head of the Charles', shortDescription: 'Scout and I rowed in the PR3 doubles race at the Head of the Charles.', location: 'Boston, MA', date: 'Oct 2024' },
]

const timelineItems = ref<TimelineItemData[]>([
{
    year: '2024 - Now',
    title: 'Software Engineer',
    company: 'Hubbell Inc.',
    location: 'Avon, CT',
    description: 'Working on enterprise products in Hubbell\'s high risk, high reward division.',
    skills: ['Python', 'TypeScript', 'Azure', 'Angular', 'C#', 'Databricks', 'PostgreSQL', 'CI/CD'],
    type: 'work'
  },
  {
    year: '2022 - 2024',
    title: 'Associate Software Engineer',
    company: 'UConn Digital Experience Group',
    location: 'Storrs, CT',
    description: 'Lead the development of diverse full-stack applications. Turned client ideas into functional, responsive web applications.',
    skills: ['Vue.js', 'TypeScript', 'Nuxt', 'Node.js', 'Docker', 'NGINX', 'MySQL'],
    type: 'work'
  },
  {
    year: '2020 - 2024',
    title: 'B.S.E in Computer Science & Engineering',
    company: 'University of Connecticut',
    location: 'Storrs, CT',
    description: 'Made my parents proud. Concentrated in software design and development.',
    type: 'education'
  },
  {
    year: '2022-2023',
    title: 'Software Engineering Intern',
    company: 'Hubbell Inc.',
    location: 'Avon, CT',
    description: 'Worked in an agile environment over consecutive summer internships to deliver a product to the market.',
    type: 'work'
  }
])

const hobbies = ref([
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
])

const activeSection = ref<string | null>(null)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1 class="text-xl md:text-2xl font-bold">About Me</h1>
    </div>
    
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'images',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'images'
      }"
      @mouseenter="setHoveredSection('images')"
      @mouseleave="setHoveredSection(null)"
    >
      <ImageContainer :images="images" />
    </div>
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'timeline',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'timeline'
      }"
      @mouseenter="setHoveredSection('timeline')"
      @mouseleave="setHoveredSection(null)"
    >
      <Timeline :items="timelineItems" />
    </div>
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'hobbies',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'hobbies'
      }"
      @mouseenter="setHoveredSection('hobbies')"
      @mouseleave="setHoveredSection(null)"
    >
      <HobbiesContainer :hobbies="hobbies" />
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed anymore for blur */
</style>