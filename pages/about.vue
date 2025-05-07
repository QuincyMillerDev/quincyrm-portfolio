<script setup lang="ts">
// About page
import ImageContainer from '~/components/ImageContainer.vue'
import Timeline from '~/components/Timeline.vue'

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

</script>

<template>
  <div class="container mx-auto py-16 space-y-12">
    <h1 class="text-2xl font-bold">About Me</h1>
    <ImageContainer :images="images" />
    <Timeline :items="timelineItems" />
  </div>
</template> 