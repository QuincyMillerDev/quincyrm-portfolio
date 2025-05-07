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
  <Card class="group relative overflow-hidden transition-transform hover:translate-y-[-3px] hover:shadow-md border-border/50">
    <!-- Subtle overlay effect -->
    <div class="absolute inset-0 bg-gradient-to-tr from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <CardHeader class="relative z-10 p-5">
      <CardTitle class="text-base font-medium group-hover:text-primary transition-colors">{{ props.project.title }}</CardTitle>
      <CardDescription class="mt-2 text-sm text-muted-foreground">
        {{ props.project.description }}
      </CardDescription>
    </CardHeader>
    <CardFooter class="relative z-10 p-5 pt-0">
      <CardAction as-child>
        <a
          :href="props.project.link"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary hover:text-primary/80 text-sm font-medium transition-colors"
        >
          View Repository
        </a>
      </CardAction>
    </CardFooter>
  </Card>
</template>