<script setup lang="ts">
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
  { name: 'GitHub', url: 'https://github.com/quincymillerdev', icon: 'simple-icons:github' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/your-profile', icon: 'simple-icons:linkedin' },
  { name: 'X.com', url: 'https://x.com/your-handle', icon: 'simple-icons:x' },
  { name: 'Instagram', url: 'https://instagram.com/your-handle', icon: 'simple-icons:instagram' },
  { name: 'Twitch', url: 'https://twitch.tv/your-handle', icon: 'simple-icons:twitch' },
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
</script>

<template>
  <div class="container mx-auto px-4 py-12 space-y-12">
    <TypewriterHeader 
      :text="`Hello, I'm Quincy Miller.`" 
      class="text-xl md:text-2xl font-bold" 
    />
    
    <ProfileContainer 
      :name="name" 
      :desktop-picture-url="desktopPictureUrl" 
      :mobile-picture-url="mobilePictureUrl"
      :subtitle="subtitle"
      :description-md="descriptionMd"
      :links="links"
      location="Coventry, CT"
    />
    
    <div>
      <ProjectsContainer :projects="projects" />
    </div>
  </div>
</template>