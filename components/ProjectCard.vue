<script setup lang="ts">
import Card from '~/components/ui/card/Card.vue'
import CardHeader from '~/components/ui/card/CardHeader.vue'
import CardTitle from '~/components/ui/card/CardTitle.vue'
import CardDescription from '~/components/ui/card/CardDescription.vue'
import CardFooter from '~/components/ui/card/CardFooter.vue'
import CardAction from '~/components/ui/card/CardAction.vue'

interface Project {
  title: string
  description: string
  link: string
}
const props = defineProps<{ project: Project }>()
</script>

<template>
  <Card class="group relative overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl">
    <!-- Overlay effect -->
    <div class="absolute inset-0 bg-gradient-to-tr from-transparent to-blue-200 opacity-0 group-hover:opacity-20 transition-opacity" />
    <CardHeader class="relative z-10 p-6">
      <CardTitle class="text-lg font-semibold group-hover:text-blue-600">{{ props.project.title }}</CardTitle>
      <CardDescription class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        {{ props.project.description }}
      </CardDescription>
    </CardHeader>
    <CardFooter class="relative z-10 p-6 bg-gradient-to-t from-white to-transparent dark:from-gray-800">
      <CardAction as-child>
        <a
          :href="props.project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Repository
        </a>
      </CardAction>
    </CardFooter>
  </Card>
</template> 