<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type {ImageItem} from "~/lib/types/image";
import ImageItemComponent from './ImageItem.vue'

const props = defineProps<{ 
  images: ImageItem[],
  title?: string 
}>()

const loaded = ref(false)
const activeIndex = ref(-1)

const toggleActive = (idx: number) => {
  if (activeIndex.value === idx) {
    activeIndex.value = -1
  } else {
    activeIndex.value = idx
  }
}

onMounted(() => {
  setTimeout(() => {
    loaded.value = true
  }, 100)
})
</script>

<template>
  <section class="relative mb-8">
    <h2 
      v-if="title" 
      class="text-xl font-medium mb-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100"
      :class="{ 'opacity-100 translate-y-0 scale-100': loaded, 'opacity-0 translate-y-[10px] scale-[0.98]': !loaded }"
    >{{ title }}</h2>
    
    <div :class="{ 'images-loaded': loaded }">
      <!-- Responsive Grid Layout for all screens -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <ImageItemComponent
          v-for="(image, idx) in props.images"
          :key="`grid-${idx}`"
          :image="{ ...image, idx }"
          :is-active="activeIndex === idx"
          :is-visible="loaded"
          :animation-delay="`${idx * 100}ms`"
          @toggle-active="toggleActive"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>

/* Hover effects - these are fine and separate from entry animation */
.image-item:hover, .image-item.is-active {
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  transition-property: box-shadow; /* Only box-shadow for hover, entry is on 'all' */
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

/* Active state for mobile tap - these are fine */
.is-active\:opacity-100:where(.is-active) {
  opacity: 1;
}

.is-active\:translate-y-0:where(.is-active) {
  transform: translateY(0);
}

/* Image filter effects - these are fine */
.image-item img {
  filter: saturate(0.9); /* Base saturation for images */
}
</style>