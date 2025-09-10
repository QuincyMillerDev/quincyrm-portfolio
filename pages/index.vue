<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProfileContainer from '~/components/ProfileContainer.vue'
import ProjectsContainer from '~/components/ProjectsContainer.vue'
import type { Project } from '~/lib/types/projects'
// Keep the data definition
const name = "Hi, I'm Quincy"
const desktopPictureUrl = '/images/portrait.jpg'
const mobilePictureUrl = '/images/portrait_small.jpg'
const subtitle = "Building Internet Businesses"
const descriptionMd = `
Computer Science @ UConn Alumni
`
// Social links and icons
const links = [
  { name: 'GitHub', url: 'https://github.com/quincymillerdev', icon: 'lucide:github' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/qrm111/', icon: 'lucide:linkedin' },
  { name: 'X.com', url: 'https://x.com/_quincyrm/', icon: 'lucide:twitter' },
  { name: 'Instagram', url: 'https://www.instagram.com/quincyrm_/', icon: 'lucide:instagram' },
  { name: 'Email', url: 'mailto:quincymiller6589@gmail.com', icon: 'lucide:mail' }
]


const projects: Project[] = [
  {
    title: 'ATS Resume Optimizer',
    description: 'B2C SaaS product that optimizes resumes for ethically passing ATS systems.',
    link: 'https://atsresumeoptimizer.com',
    chatSuggestion: 'What was the purpose of the ATS Resume Optimizer project?'
  },
  {
    title: 'Ilograph MCP Server',
    description: 'An intelligent server enabling AI agents to automate architectural diagramming and real-time validation with Ilograph.',
    link: 'https://github.com/QuincyMillerDev/ilograph-mcp-server',
    chatSuggestion: 'Tell me about the Ilograph MCP Server and its technical architecture.'
  },
  {
    title: 'Personal Portfolio Website',
    description: 'This dynamic Nuxt.js portfolio, featuring a RAG AI chatbot and automated Strava integration, is the very site you\'re on.',
    link: 'https://github.com/QuincyMillerDev/quincyrm-portfolio',
    chatSuggestion: 'Tell me more about this portfolio website.'
  },
  {
    title: 'Multimodal Care Coordinator',
    description: 'An award-winning AI system for Bastion Health that streamlines patient onboarding and empowers medical professionals.',
    link: 'https://github.com/QuincyMillerDev/Multimodal-Care-Coordinator',
    chatSuggestion: 'What was the purpose of the Multimodal Care Coordinator project?'
  },
  {
    title: 'Domain-Specific Named Entity Recognition',
    description: 'Achieved a 94.47% F1 score by fine-tuning a BERT model for highly accurate movie-domain named entity recognition.',
    link: 'https://github.com/QuincyMillerDev/BERT-NLP',
    chatSuggestion: 'Explain the high-level approach of the fine-tuning of the BERT model in Quincy\'s project.'
  },
  {
    title: 'ProteomeX Data Analysis',
    description: 'Revitalized a legacy proteomics data analysis application with a modern stack including Laravel, React, and Docker.',
    link: 'https://www.proteome-x.com/',
    chatSuggestion: 'Tell me about ProteomeX.'
  },
  {
    title: 'Grant Trails',
    description: 'An interactive web app visualizing the economic impact of UConn research grants across Connecticut.',
    link: 'https://granttrails.core.uconn.edu/',
    chatSuggestion: 'Tell me about the Grant Trails project.'
  },
  {
    title: 'Sourcery',
    description: 'A web platform, co-developed at UConn I3, that streamlines how researchers access primary source documents from archives and special collections.',
    link: 'https://sourceryapp.org/',
    chatSuggestion: 'Tell me about Sourcery.'
  },
  {
    title: 'Kinetic Sand Topography Visualizer',
    description: 'An MVP that transforms 3D LiDAR scans of kinetic sand into 2D topographic heatmaps for landscape architecture students.',
    link: 'https://github.com/uconndxlab/landscape-AR',
    chatSuggestion: 'Tell me about the Kinetic Sand Topography Visualizer.'
  },
  {
    title: 'Hiring Maps',
    description: 'An interactive web app that visualizes Connecticut\'s job market trends and industry data.',
    link: 'https://github.com/uconndxlab/hiring-maps',
    chatSuggestion: 'Tell me about the Hiring Maps project.'
  },
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