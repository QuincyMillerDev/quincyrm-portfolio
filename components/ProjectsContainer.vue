<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectCard from '~/components/ProjectCard.vue'

interface Project {
  title: string
  description: string
  link: string
}

const props = defineProps<{
  projects: Project[]
}>()

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 200)
})
</script>

<template>
  <section 
    class="mt-12 transition-all duration-500"
    :class="[isVisible ? 'opacity-100' : 'opacity-0']"
  >
    <h2 
      class="text-xl font-medium mb-4 animate-timeline-header"
      :class="{ 'opacity-100 translate-y-0 scale-100': isVisible, 'opacity-0 translate-y-5 scale-95': !isVisible }"
    >Projects</h2>
    
    <!-- Standard grid layout -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <ProjectCard
        v-for="(project, index) in props.projects"
        :key="project.title"
        :project="project"
        :index="index"
        :is-visible="isVisible"
        :animation-delay="`${index * 100}ms`"
        class="h-80"
      />
    </div>
  </section>
</template>