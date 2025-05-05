<script setup lang="ts">
import ProjectCard from '~/components/ProjectCard.vue'

interface Project {
  title: string
  description: string
  link: string
}

const props = defineProps<{
  projects: Project[]
}>()
</script>

<template>
  <section class="mt-16">
    <h2 class="text-3xl font-bold mb-6">Projects</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ProjectCard
        v-for="project in props.projects"
        :key="project.title"
        :project="project"
      />
    </div>
  </section>
</template> 