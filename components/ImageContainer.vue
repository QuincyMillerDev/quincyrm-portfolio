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
  <section class="relative my-8">
    <h2 v-if="title" class="text-xl font-medium mb-4">{{ title }}</h2>
    
    <div :class="{ 'images-loaded': loaded }">
      <!-- Mobile: Grid Layout -->
      <div class="grid grid-cols-2 gap-3 sm:hidden">
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
            width="240"
            height="240"
            format="webp"
            class="w-full h-full object-cover transition-all duration-300 ease-out-expo"
            :class="loaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'"
          />
          
          <!-- Description overlay -->
          <div class="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/70 to-transparent translate-y-2 group-hover:translate-y-0 is-active:translate-y-0">
            <div class="text-white text-xs font-medium">
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
      
      <!-- Desktop: Horizontal Layout with enhanced hover effects -->
      <div class="hidden sm:block relative">
        <!-- Overflow container with horizontal scroll feel -->
        <div class="relative w-[120%] left-1/2 -translate-x-1/2 py-6">
          <div class="flex justify-center items-center">
            <div
              v-for="(image, idx) in props.images"
              :key="`horiz-${idx}`"
              class="group image-item-horiz w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-52 lg:h-52 flex-shrink-0 rounded-lg overflow-hidden shadow-sm transform-gpu mx-1.5"
              :class="[
                idx === 0 ? '-rotate-2 z-10' : '',
                idx === 1 ? 'rotate-1 z-20' : '',
                idx === 2 ? '-rotate-2 z-30' : '',
                idx === 3 ? 'rotate-2 z-40' : '',
              ]"
              :style="{ 
                '--delay': `${idx * 150}ms`,
                '--x-offset': `${(idx - 1.5) * 30}px`,
                '--rotation': `${idx % 2 === 0 ? '-2deg' : '2deg'}`
              }"
            >
              <!-- Enhanced hover effect elements -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
              
              <!-- Decorative corner accent -->
              <div class="absolute top-0 right-0 w-12 h-12 -translate-x-full translate-y-full rotate-45 bg-primary/10 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out-expo" style="transition-delay: 50ms;" />
              
              <!-- Image -->
              <NuxtImg
                :src="image.src"
                :alt="image.alt"
                width="300" 
                height="300"
                format="webp"
                class="w-full h-full object-cover transition-all duration-500 ease-out-expo"
                :class="loaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'"
              />
              
              <!-- Description overlay with enhanced animation -->
              <div class="absolute inset-0 flex items-end justify-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/80 via-black/40 to-transparent translate-y-2 group-hover:translate-y-0">
                <div class="text-white text-xs sm:text-sm font-medium text-center max-w-[90%] relative">
                  <p class="relative z-10">{{ image.shortDescription }}</p>
                  <p v-if="image.location || image.date" class="text-xs opacity-80 mt-0.5 relative z-10">
                    <span v-if="image.location">{{ image.location }}</span>
                    <span v-if="image.location && image.date"> &middot; </span>
                    <span v-if="image.date">{{ image.date }}</span>
                  </p>
                </div>
              </div>
              
              <!-- Subtle border effect -->
              <div class="absolute inset-0 border border-white/5 group-hover:border-white/20 rounded-lg pointer-events-none transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Shared styles for all image items */
.image-item, .image-item-horiz {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  will-change: transform, opacity;
}

.images-loaded .image-item, .images-loaded .image-item-horiz {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Mobile grid hover effects */
.image-item:hover, .image-item.is-active {
  transform: translateY(-3px) scale(1.02);
  z-index: 10;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* Desktop horizontal hover effects - enhanced with unique animations */
.image-item-horiz {
  transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);
  transform-origin: center;
}

.image-item-horiz:hover {
  transform: translateX(calc(-1 * var(--x-offset))) translateY(-8px) rotate(0deg) !important;
  z-index: 50 !important;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
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

/* Unique hover effect - image slight zoom and focus */
.image-item-horiz img {
  filter: saturate(0.9);
}

.image-item-horiz:hover img {
  filter: saturate(1.1);
  transform: scale(1.05);
}

/* Unique hover effect - perspective tilt */
.image-item-horiz::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%);
  opacity: 0;
  transition: opacity 0.5s ease;
  z-index: 5;
}

.image-item-horiz:hover::before {
  opacity: 1;
}
</style>