<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileContainer from '~/components/ProfileContainer.vue'
import ProjectsContainer from '~/components/ProjectsContainer.vue'
import type { Project } from '~/lib/types/projects'
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


const projects: Project[] = [
  {
    title: 'Personal Portfolio Website',
    description: 'This dynamic portfolio showcases software engineering skills with a Nuxt.js frontend, RAG AI chatbot, and Strava API integration, deployed on Vercel.',
    link: 'https://github.com/QuincyMillerDev/quincyrm-portfolio',
    chatSuggestion: 'Tell me more about this portfolio website.'
  },
  {
    title: 'Multimodal Care Coordinator (Senior Design)',
    description: 'Developed a multi-modal patient onboarding chatbot and a RAG system for medical professionals for Bastion Health, winning 3rd place in UConn\'s Senior Design Competition.',
    link: 'https://github.com/QuincyMillerDev/Multimodal-Care-Coordinator',
    chatSuggestion: 'What was the purpose of the Multimodal Care Coordinator project?'
  },
  {
    title: 'ProteomeX Data Analysis',
    description: 'Modernized a legacy application of proteomics data analysis with a Laravel backend, React UI, and Dockerized C algorithm.',
    link: 'https://www.proteome-x.com/',
    chatSuggestion: 'Tell me about ProteomeX.'
  },
  {
    title: 'Grant Trails (UConn DXG)',
    description: 'A web application designed to visualize the economic impact of research grants awarded to UConn faculty, featuring an interactive map of spending within Connecticut.',
    link: 'https://granttrails.core.uconn.edu/',
    chatSuggestion: 'Tell me about the Grant Trails project.'
  },
  {
    title: 'Sourcery',
    description: 'A web platform to streamline researcher access to primary source documents from archives, libraries, and special collections.',
    link: 'https://sourceryapp.org/',
    chatSuggestion: 'Tell me about Sourcery.'
  },
  {
    title: 'Kinetic Sand Topography Visualizer (UConn DXG)',
    description: 'An MVP to transform 3D LiDAR scans of kinetic sand landscapes into 2D topographic heatmaps for landscape architecture students.',
    link: 'https://github.com/uconndxlab/landscape-AR',
    chatSuggestion: 'Tell me about the Kinetic Sand Topography Visualizer.'
  },
  {
    title: 'Hiring Maps (UConn DXG)',
    description: 'An interactive web application visualizing Connecticut\'s job market trends and industry data, co-developed at UConn DXG.',
    link: 'https://github.com/uconndxlab/hiring-maps',
    chatSuggestion: 'Tell me about the Hiring Maps project.'
  }
]

const activeSection = ref<string | null>(null)
const projectsContainerVisible = ref(false)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}

onMounted(() => {
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