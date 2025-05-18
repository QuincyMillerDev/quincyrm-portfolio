<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ProjectCard from '~/components/ProjectCard.vue'
import type { Project } from '~/lib/types/projects'

const props = defineProps<{
  projects: Project[]
}>()

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section 
    class="mt-12"
  >
    <h2 
      class="text-xl font-medium mb-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="{ 'opacity-100 translate-y-0 scale-100': isVisible, 'opacity-0 translate-y-[10px] scale-[0.98]': !isVisible }"
    >Projects</h2>
    
    <!-- Standard grid layout -->
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100" 
      :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
    >
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