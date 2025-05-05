<script setup lang="ts">
import { computed } from 'vue'
import { NuxtImg } from '#components' // Use auto-import
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'

// Define props for the component
const props = defineProps<{
  name: string
  pictureUrl: string
  subtitle: string
  descriptionMd: string
  links: Array<{ name: string; url: string; icon: string }>
}>()

// Split markdown text into paragraphs
const paragraphs = computed(() =>
  props.descriptionMd
    .trim()
    .split(/\n\s*\n/)
    .filter((p) => p.length)
)

// Brand color classes for social icons
const brandColorClasses: Record<string, string> = {
  GitHub: 'hover:text-[#181717]',
  LinkedIn: 'hover:text-[#0077B5]',
  'X.com': 'hover:text-black',
  Instagram: 'hover:text-[#E1306C]',
  Twitch: 'hover:text-[#9146FF]',
}
</script>

<template>
  <section class="flex flex-col items-center text-center md:flex-row md:items-start md:text-left gap-8 md:gap-16">
    <!-- Image Column -->
    <div class="w-48 md:w-72 flex-shrink-0 mb-6 md:mb-0">
      <NuxtImg
        :src="props.pictureUrl"
        :alt="`${props.name}'s Profile Picture`"
        width="288"
        height="288"
        format="webp"
        quality="80"
        class="aspect-square rounded-full shadow-lg object-cover"
      />
    </div>
    <!-- Text Column -->
    <div class="flex-1">
      <!-- Name -->
      <h1 class="text-5xl font-bold mb-2">{{ props.name }}</h1>
      <!-- Subtitle -->
      <h2 class="text-lg sm:text-xl text-muted-foreground mb-6">{{ props.subtitle }}</h2>
      <!-- Description -->
      <div class="prose max-w-none text-muted-foreground dark:prose-invert mb-6">
        <p
          v-for="(text, idx) in paragraphs"
          :key="idx"
        >
          {{ text }}
        </p>
      </div>
      <!-- Social Icons as Buttons -->
      <div class="flex flex-wrap gap-2 justify-center md:justify-start">
        <Button
          v-for="link in props.links"
          :key="link.name"
          as-child
          variant="ghost"
          size="icon"
          class="transition-colors duration-200 text-muted-foreground"
          :class="brandColorClasses[link.name] || ''"
        >
          <a :href="link.url" target="_blank" rel="noopener noreferrer">
            <Icon :icon="link.icon" class="w-4 h-4" />
          </a>
        </Button>
      </div>
    </div>
  </section>
</template> 