<script setup lang="ts">
import { NuxtImg } from '#components'
import type { ImageItem as ImageItemType } from "~/lib/types/image";
import { useChatSuggestions } from '~/composables/useChatSuggestions';

interface ExtendedImageItem extends ImageItemType {
  idx: number;
  chatSuggestion?: string;
}

const props = defineProps<{
  image: ExtendedImageItem
  isActive: boolean
  isVisible: boolean
  animationDelay: string
}>()

const emit = defineEmits<{
  (e: 'toggle-active', idx: number): void
}>()

const { handleChatSuggestion } = useChatSuggestions();

const handleClick = () => {
  emit('toggle-active', props.image.idx)
  if (props.image.chatSuggestion) {
    handleChatSuggestion(props.image.chatSuggestion);
  }
}
</script>

<template>
  <div
    class="group image-item relative aspect-square rounded-lg overflow-hidden shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-default"
    :class="{
      'is-active': isActive,
      'opacity-100 translate-y-0 scale-100': isVisible, 
      'opacity-0 translate-y-[10px] scale-[0.98]': !isVisible
    }"
    :style="{ transitionDelay: animationDelay }"
    @click="handleClick"
  >
    <!-- Hover effect elements -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 dark:from-primary/5 dark:to-primary/5 z-0 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-opacity duration-200 ease-out" />
    
    <!-- Image -->
    <NuxtImg
      :src="image.src"
      :alt="image.alt"
      width="300"
      height="300"
      format="webp"
      class="w-full h-full object-cover transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100" 
      :class="isVisible ? 'scale-100 blur-0' : 'scale-100 blur-sm'"
    />
    
    <!-- Description overlay -->
    <div class="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-all duration-200 ease-out bg-gradient-to-t from-black/70 to-transparent translate-y-2 group-hover:translate-y-0 is-active:translate-y-0">
      <div class="text-white text-xs sm:text-sm font-medium">
        <p>{{ image.shortDescription }}</p>
        <p v-if="image.location || image.date" class="text-xs opacity-80 mt-0.5">
          <span v-if="image.location">{{ image.location }}</span>
          <span v-if="image.location && image.date"> &middot; </span>
          <span v-if="image.date">{{ image.date }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Hover effects */
.image-item:hover, .image-item.is-active {
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  transition-property: box-shadow;
  transition-duration: 0.2s; 
  transition-timing-function: ease-out; 
}

@media (min-width: 768px) {
  .image-item:hover, .image-item.is-active { 
    z-index: 50; 
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
  
  .image-item:hover img { 
    filter: saturate(1.1);
  }
}

/* Active state for mobile tap */
.is-active\:opacity-100:where(.is-active) {
  opacity: 1;
}

.is-active\:translate-y-0:where(.is-active) {
  transform: translateY(0);
}

/* Image filter effects */
.image-item img {
  filter: saturate(0.9);
}
</style> 