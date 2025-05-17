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
(Open to relocation) \n
SWE @ Hubbell, CS Alumni @ UConn
`
// Social links and icons
const links = [
  { name: 'GitHub', url: 'https://github.com/quincymillerdev', icon: 'lucide:github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/qrm111/', icon: 'lucide:linkedin' },
  { name: 'X.com', url: 'https://x.com/_quincyrm/', icon: 'lucide:twitter' },
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
  // ProfileContainer starts its own animation at 100ms (internal)
  // Start ProjectsContainer animation slightly after ProfileContainer has started animating
  setTimeout(() => {
    projectsContainerVisible.value = true;
  }, 150); // Delay for ProjectsContainer wrapper
});
</script>

<template>
  <div class="space-y-12">
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'z-10': activeSection === 'profile',
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
      class="relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="[
        projectsContainerVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-[10px] scale-[0.98]'
      ]"
    >
      <div
        class="transition-all duration-300 ease-out relative"
        :class="{
          'z-10': activeSection === 'projects',
        }"
        @mouseenter="setHoveredSection('projects')"
        @mouseleave="setHoveredSection(null)"
      >
        <ProjectsContainer :projects="projects" />
      </div>
    </div>
  </div>
</template>