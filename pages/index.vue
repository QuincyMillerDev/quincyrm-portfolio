<script setup lang="ts">
import { ref, onMounted } from 'vue'
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
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/qrm111/', icon: 'lucide:linkedin' },
  { name: 'X.com', url: 'https://x.com/_quincyrm/', icon: 'lucide:x' },
  { name: 'Instagram', url: 'https://www.instagram.com/quincy._miller/', icon: 'lucide:instagram' },
  { name: 'Twitch', url: 'https://www.twitch.tv/cooliobeans', icon: 'lucide:twitch' },
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
const projectsContainerVisible = ref(false)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}

onMounted(() => {
  setTimeout(() => {
    projectsContainerVisible.value = true;
  }, 300); // Delay before animation starts
});
</script>

<template>
  <div class="space-y-12">
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
    
    <!-- Wrapper for entry animation -->
    <div
      :class="[
        'relative',
        projectsContainerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      ]"
      style="transition-property: opacity, transform; transition-duration: 0.6s; transition-timing-function: ease-out;"
    >
      <!-- Original wrapper for hover effects -->
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
  </div>
</template>