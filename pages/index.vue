<script setup lang="ts">
import HeroInfo from '~/components/HeroInfo.vue'

// Keep the data definition
const name = "Quincy Miller"
const pictureUrl = '/images/portrait.jpg'
const subtitle = "Full-Stack Developer & AI Enthusiast"
const descriptionMd = `
Passionate about building modern web applications and exploring the potential of AI. 
Currently focused on Nuxt.js, TypeScript, and integrating intelligent features.
`
// Social links and icons
const links = [
  { name: 'GitHub', url: 'https://github.com/quincymillerdev', icon: 'simple-icons:github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'simple-icons:linkedin' },
  { name: 'X.com', url: 'https://x.com/your-handle', icon: 'simple-icons:x' },
  { name: 'Instagram', url: 'https://instagram.com/your-handle', icon: 'simple-icons:instagram' },
  { name: 'Twitch', url: 'https://twitch.tv/your-handle', icon: 'simple-icons:twitch' },
]

</script>

<template>
  <div class="container mx-auto pt-24 sm:pt-32 pb-16">
    <HeroInfo 
      :name="name" 
      :picture-url="pictureUrl" 
      :subtitle="subtitle"
      :description-md="descriptionMd"
      :links="links"
    />
  </div>
</template> 