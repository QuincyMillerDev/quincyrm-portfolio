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
        <div
          v-for="(image, idx) in props.images"
          :key="`grid-${idx}`"
          class="group image-item relative aspect-square rounded-lg overflow-hidden shadow-sm transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          :class="{
            'is-active': activeIndex === idx,
            'opacity-100 translate-y-0 scale-100': loaded, 
            'opacity-0 translate-y-[10px] scale-[0.98]': !loaded
          }"
          :style="{ transitionDelay: loaded ? '0ms' : '0ms' }"
          @click="toggleActive(idx)"
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
            :class="loaded ? 'scale-100 blur-0' : 'scale-100 blur-sm'"
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