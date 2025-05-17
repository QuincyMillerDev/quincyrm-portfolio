<script setup lang="ts">
import { NuxtImg } from '#components'
import { onMounted, ref } from 'vue'
import type {ImageItem} from "~/types/image";

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
  }, 300)
})
</script>

<template>
  <section class="relative mb-8">
    <h2 v-if="title" class="text-xl font-medium mb-4">{{ title }}</h2>
    
    <div :class="{ 'images-loaded': loaded }">
      <!-- Responsive Grid Layout for all screens -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="(image, idx) in props.images"
          :key="`grid-${idx}`"
          class="group image-item relative aspect-square rounded-lg overflow-hidden shadow-sm"
          :class="{'is-active': activeIndex === idx}"
          :style="{ '--delay': `${idx * 100}ms` }"
          @click="toggleActive(idx)"
        >
          <!-- Hover effect elements -->
          <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/5 dark:from-primary/5 dark:to-primary/5 z-0 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-opacity duration-500" />
          
          <!-- Image -->
          <NuxtImg
            :src="image.src"
            :alt="image.alt"
            width="300"
            height="300"
            format="webp"
            class="w-full h-full object-cover transition-all duration-300 ease-out-expo"
            :class="loaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'"
          />
          
          <!-- Description overlay -->
          <div class="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/70 to-transparent translate-y-2 group-hover:translate-y-0 is-active:translate-y-0">
            <div class="text-white text-xs sm:text-sm font-medium">
              <p>{{ image.shortDescription }}</p>
              <p v-if="image.location || image.date" class="text-xs opacity-80 mt-0.5">
                <span v-if="image.location">{{ image.location }}</span>
                <span v-if="image.location && image.date"> &middot; </span>
                <span v-if="image.date">{{ image.date }}</span>
              </p>
            </div>
          </div>
          
          <!-- Decorative corner accent (desktop only) -->
          <div class="hidden md:block absolute top-0 right-0 w-12 h-12 -translate-x-full translate-y-full rotate-45 bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-expo" style="transition-delay: 50ms;" />
          
          <!-- Subtle border effect -->
          <div class="absolute inset-0 border border-white/5 group-hover:border-white/20 rounded-lg pointer-events-none transition-all duration-500" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Shared styles for all image items */
.image-item {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  will-change: transform, opacity;
}

.images-loaded .image-item {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Hover effects */
.image-item:hover, .image-item.is-active {
  transform: translateY(-3px);
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition-duration: 0.3s;
}

/* Medium and larger screens get enhanced hover */
@media (min-width: 768px) {
  .image-item:hover {
    transform: translateY(-6px);
    z-index: 50;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }
  
  .image-item:hover img {
    filter: saturate(1.1);
    /* transform: scale(1.05); */ /* Removed scaling */
  }
}

/* Custom ease-out-expo transition */
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
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