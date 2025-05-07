<script setup lang="ts">
import { ref } from 'vue'
import ProfileContainer from '~/components/ProfileContainer.vue'
import ProjectsContainer from '~/components/ProjectsContainer.vue'
// Keep the data definition
const name = "Quincy Miller"
const desktopPictureUrl = '/images/portrait.jpg'
const mobilePictureUrl = '/images/portrait_small.jpg'
const subtitle = "Full-Stack Software Engineer"
const descriptionMd = `
Passionate about building modern web applications and exploring the potential of AI. 
Currently focused on Nuxt.js, TypeScript, and integrating intelligent features.
`
// Social links and icons
const links = [
  { name: 'GitHub', url: 'https://github.com/quincymillerdev', icon: 'lucide:github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'lucide:linkedin' },
  { name: 'X.com', url: 'https://x.com/your-handle', icon: 'lucide:x' },
  { name: 'Instagram', url: 'https://instagram.com/your-handle', icon: 'lucide:instagram' },
  { name: 'Twitch', url: 'https://twitch.tv/your-handle', icon: 'lucide:twitch' },
  { name: 'Email', url: 'mailto:quincymiller6589@gmail.com', icon: 'lucide:mail' }
]

// Projects data
interface Project {
  title: string
  description: string
  link: string
}
const projects: Project[] = [
  { title: 'Project One', description: 'Description for project one.', link: 'https://github.com/username/project-one' },
  { title: 'Project Two', description: 'Description for project two.', link: 'https://github.com/username/project-two' },
  // Add more projects here
]

const activeSection = ref<string | null>(null)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}
</script>

<template>
  <div class="container mx-auto px-4 py-12 space-y-12">
    <TypewriterHeader 
      :text="`Hello, I'm Quincy Miller.`" 
      class="text-xl md:text-2xl font-bold" 
    />
    
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'profile',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'profile'
      }"
      @mouseenter="setHoveredSection('profile')"
      @mouseleave="setHoveredSection(null)"
    >
      <ProfileContainer 
        :name="name" 
        :desktop-picture-url="desktopPictureUrl" 
        :mobile-picture-url="mobilePictureUrl"
        :subtitle="subtitle"
        :description-md="descriptionMd"
        :links="links"
        location="Coventry, CT"
      />
    </div>
    
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'projects',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'projects'
      }"
      @mouseenter="setHoveredSection('projects')"
      @mouseleave="setHoveredSection(null)"
    >
      <ProjectsContainer :projects="projects" />
    </div>
  </div>
</template>