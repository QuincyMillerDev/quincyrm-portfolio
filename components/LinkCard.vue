<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { NuxtImg } from '#components'
import { useAnalytics } from '~/composables/useAnalytics'

const props = defineProps<{
  title: string
  description: string
  url: string
  image?: string
  icon?: string
  imageBg?: string
}>()

const { trackInteraction } = useAnalytics()

const handleClick = () => {
  trackInteraction('click', 'link-tree', {
    link_title: props.title,
    link_url: props.url,
    section: 'links-page'
  })
}
</script>

<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    class="group block w-full"
    @click="handleClick"
  >
    <div class="flex items-center gap-4 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/40 transition-all duration-300 hover:scale-[1.02] hover:bg-background/70 hover:border-border/60 hover:shadow-lg">
      <div class="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden" :class="props.imageBg">
        <template v-if="image">
          <NuxtImg
            :src="image"
            :alt="title"
            width="48"
            height="48"
            format="webp"
            quality="90"
            class="w-full h-full object-cover"
          />
        </template>
        <template v-else>
          <div class="w-full h-full flex items-center justify-center bg-muted">
            <Icon :icon="props.icon || 'lucide:link-2'" class="w-6 h-6 text-muted-foreground" />
          </div>
        </template>
      </div>
      
      <div class="flex-1 text-left">
        <h3 class="font-semibold text-foreground mb-0.5">{{ title }}</h3>
        <p class="text-sm text-muted-foreground">{{ description }}</p>
      </div>
      
      <Icon icon="lucide:arrow-right" class="w-5 h-5 text-muted-foreground/50 group-hover:text-muted-foreground group-hover:translate-x-1 transition-all duration-300" />
    </div>
  </a>
</template>