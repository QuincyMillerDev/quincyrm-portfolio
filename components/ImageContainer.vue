<script setup lang="ts">
import { NuxtImg } from '#components'
import { onMounted, ref } from 'vue'

interface ImageItem {
  src: string
  alt: string
  description: string
}

const props = defineProps<{ images: ImageItem[] }>()
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
  <section class="relative my-12 overflow-visible">
    <!-- Switch between grid (mobile) and horizontal (desktop) layouts -->
    <div 
      :class="{ 'images-loaded': loaded }"
    >
      <!-- Mobile: Grid Layout -->
      <div class="grid grid-cols-2 gap-3 sm:hidden">
        <div
          v-for="(image, idx) in props.images"
          :key="`grid-${idx}`"
          class="group image-item relative aspect-square rounded-lg overflow-hidden shadow-md"
          :class="{'is-active': activeIndex === idx}"
          :style="{ '--delay': `${idx * 100}ms` }"
          @click="toggleActive(idx)"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 z-0 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-opacity duration-500" />
          
          <NuxtImg
            :src="image.src"
            :alt="image.alt"
            width="240"
            height="240"
            format="webp"
            class="w-full h-full object-cover transition-all duration-300 ease-out-expo"
            :class="loaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'"
          />
          
          <div class="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 is-active:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0 is-active:translate-y-0">
            <p class="text-white text-xs font-medium">{{ image.description }}</p>
          </div>
        </div>
      </div>
      
      <!-- Desktop: Horizontal Layout with center-focus hover -->
      <!-- Use position relative overflow-visible to allow content to extend beyond container -->
      <div 
        class="hidden sm:block relative w-full overflow-visible"
      >
        <!-- Centered container that's wider than the parent -->
        <div class="relative w-[150%] left-1/2 -translate-x-1/2 py-8">
          <div class="flex justify-center items-center">
            <div
              v-for="(image, idx) in props.images"
              :key="`horiz-${idx}`"
              class="group image-item-horiz w-36 h-36 sm:w-40 sm:h-40 md:w-52 md:h-52 lg:w-56 lg:h-56 flex-shrink-0 rounded-lg overflow-hidden shadow-md transform-gpu mx-1"
              :class="[
                idx === 0 ? '-rotate-3 z-10' : '',
                idx === 1 ? 'rotate-2 z-20' : '',
                idx === 2 ? '-rotate-3 z-30' : '',
                idx === 3 ? 'rotate-3 z-40' : '',
              ]"
              :style="{ 
                '--delay': `${idx * 150}ms`,
                '--x-offset': `${(idx - 1.5) * 40}px`
              }"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-500/5 dark:to-purple-500/5 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <NuxtImg
                :src="image.src"
                :alt="image.alt"
                width="300" 
                height="300"
                format="webp"
                class="w-full h-full object-cover transition-all duration-300 ease-out-expo"
                :class="loaded ? 'scale-100 blur-0' : 'scale-105 blur-sm'"
              />
              
              <div class="absolute inset-0 flex items-end justify-center p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/80 to-transparent translate-y-2 group-hover:translate-y-0">
                <p class="text-white text-xs sm:text-sm font-medium text-center max-w-[90%]">{{ image.description }}</p>
              </div>
              
              <div class="absolute inset-0 border border-white/10 group-hover:border-white/20 rounded-lg pointer-events-none transition-all duration-500" />
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
  transform: translateY(30px) scale(0.92);
  opacity: 0;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  transition-delay: var(--delay, 0ms);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  will-change: transform, opacity;
}

.images-loaded .image-item, .images-loaded .image-item-horiz {
  transform: translateY(0) scale(1);
  opacity: 1;
}

/* Mobile grid hover effects */
.image-item:hover, .image-item.is-active {
  transform: translateY(-5px) scale(1.03);
  z-index: 10;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Desktop horizontal hover effects - centered positioning */
.image-item-horiz {
  transition: all 0.5s cubic-bezier(0.33, 1, 0.68, 1);
}

.image-item-horiz:hover {
  transform: translateX(calc(-1 * var(--x-offset))) translateY(-10px) rotate(0deg) !important;
  z-index: 50 !important;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
}

/* Custom ease-out-expo transition */
.ease-out-expo {
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hover focus effect - subtle highlight */
.image-item-horiz::after, .image-item::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.image-item-horiz:hover::after, .image-item:hover::after, .image-item.is-active::after {
  opacity: 1;
}

/* Active state for mobile tap */
.is-active\:opacity-100:where(.is-active) {
  opacity: 1;
}

.is-active\:translate-y-0:where(.is-active) {
  transform: translateY(0);
}
</style> 