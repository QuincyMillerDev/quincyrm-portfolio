<script setup lang="ts">
// About page
import { ref } from 'vue'
import ImageContainer from '~/components/ImageContainer.vue'
import Timeline from '~/components/Timeline.vue'
import HobbiesContainer from '~/components/HobbiesContainer.vue'

interface ImageItem {
  src: string
  alt: string
  description: string
}
const images: ImageItem[] = [
  { src: '/images/IMG_1625_VSCO.JPG', alt: 'Backcountry Skiing', description: 'Backcountry skiing near Alta, Utah.' },
  { src: '/images/IMG_7864.JPG', alt: 'Japan', description: 'Visted Japan in 2024.' },
  { src: '/images/IMG_3697.JPG', alt: 'Head of the Charles', description: 'Meet Scout! We rowed in the Head of the Charles regatta together.' },
  { src: '/images/IMG_2402.JPG', alt: 'Hiking in the Adirondacks', description: 'Hiking in the Adirondacks.' },
  // Add more memories here
]

const timelineItems = ref([
  // The Timeline component will use mock data if this is empty
])

const hobbies = ref([
  // The Hobbies component will use sample data if this is empty
])

const activeSection = ref<string | null>(null)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}
</script>

<template>
  <div class="space-y-12">
    <div>
      <h1 class="text-2xl font-medium">About Me</h1>
    </div>
    
    <div
      class="transition-all duration-200 ease-out relative"
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
      class="transition-all duration-200 ease-out relative"
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
      class="transition-all duration-200 ease-out relative"
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