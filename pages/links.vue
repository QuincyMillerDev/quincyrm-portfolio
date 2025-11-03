<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { NuxtImg } from '#components'
import LinkCard from '~/components/LinkCard.vue'
import { Button } from '~/components/ui/button'

const name = "Quincy Miller"
const profilePicture = '/images/portrait_small.jpg'

const links = ref([
  {
    title: 'AltIndex',
    description: 'Turn alternative data into alpha.',
    url: 'https://app.altindex.com/',
    image: '/images/altindex-logo-square-transparent.png'
  },
  {
    title: 'Stocks & Income',
    description: 'Beat the market before your morning coffee. Daily investor newsletter.',
    url: 'https://stocks-income.beehiiv.com/',
    image: '/images/stocksandincomeimg.avif',
    imageBg: 'bg-black'
  },
  {
    title: 'Instagram',
    description: 'Semi-daily videos on my projects, tech, investing, and more.',
    url: 'https://www.instagram.com/quincyrm_/',
    image: '/images/Instagram-icon-Logo-2016-present-193859535.png'
  },
  {
    title: 'TikTok',
    description: 'Also more content.',
    url: 'https://www.tiktok.com/@quincyrm_?is_from_webapp=1&sender_device=pc',
    image: '/images/Tiktok-Logo-2016-410079205.png'
  },
  {
    title: 'X (Twitter)',
    description: 'Unfiltered thoughts and quick updates.',
    url: 'https://x.com/_quincyrm',
    image: '/images/x_twitter_logov2.jpg'
  }
])

const isVisible = ref(false)
const imageLoaded = ref(false)
const showInAppBrowserBanner = ref(false)
const browserName = ref('')
const bannerDismissed = ref(false)

// Detect if user is in TikTok's in-app browser
const detectInAppBrowser = () => {
  if (process.client) {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera || ''
    
    // Log for debugging
    console.log('User Agent:', ua)
    
    // TikTok detection - check for multiple variations
    if (ua.includes('TikTok') || 
        ua.includes('musical_ly') || 
        ua.includes('Bytedance') ||
        ua.match(/\bTrill\b/i)) {
      browserName.value = 'TikTok'
      console.log('✓ TikTok detected!')
      return true
    }
    
    // Not in TikTok
    console.log('Not in TikTok browser')
  }
  return false
}

const dismissBanner = () => {
  bannerDismissed.value = true
}

const instructionText = 'Tap the three dots (•••) at the top right and select "Open in browser"'

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
  
  // Check for in-app browser
  showInAppBrowserBanner.value = detectInAppBrowser()
})

const handleImageLoad = () => {
  imageLoaded.value = true
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center py-8 px-4">
    <div class="w-full max-w-md space-y-6">
      
      <!-- In-App Browser Warning Banner -->
      <div 
        v-if="showInAppBrowserBanner && !bannerDismissed"
        class="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-400 dark:border-amber-600 rounded-lg p-4 shadow-lg"
        :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 -translate-y-4': !isVisible }"
        style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
      >
        <div class="flex items-start gap-3">
          <Icon 
            icon="lucide:alert-triangle" 
            class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
          />
          <div class="flex-1 space-y-2">
            <p class="text-sm font-semibold text-amber-900 dark:text-amber-100">
              You're viewing this in TikTok
            </p>
            <p class="text-xs text-amber-800 dark:text-amber-200">
              For the best experience and to open links properly:
            </p>
            <p class="text-xs font-medium text-amber-900 dark:text-amber-100 bg-amber-100 dark:bg-amber-900/40 p-2 rounded border border-amber-300 dark:border-amber-600">
              {{ instructionText }}
            </p>
          </div>
          <button 
            @click="dismissBanner"
            class="text-amber-600 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-200 transition-colors flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <Icon icon="lucide:x" class="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        class="flex flex-col items-center text-center space-y-4"
        :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-4': !isVisible }"
        style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
      >
        <div 
          :class="{ 'opacity-100 scale-100': imageLoaded, 'opacity-0 scale-95': !imageLoaded }"
          style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
        >
          <NuxtImg
            :src="profilePicture"
            :alt="`${name}'s Profile Picture`"
            width="120"
            height="120"
            format="webp"
            quality="90"
            class="rounded-full shadow-lg aspect-square object-cover w-28 h-28"
            @load="handleImageLoad"
          />
        </div>
        
        <div>
          <h1 class="text-2xl font-bold text-foreground">{{ name }}</h1>
          <p class="text-muted-foreground text-sm">Head of Product @ Invested Inc.</p>
          <p class="text-muted-foreground mt-2">See all of it here 👇</p>
        </div>
      </div>

      <div 
        class="space-y-3"
        :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
        style="transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
      >
        <LinkCard
          v-for="link in links"
          :key="link.title"
          :title="link.title"
          :description="link.description"
          :url="link.url"
          :image="link.image"
          :image-bg="link.imageBg"
          
        />
      </div>

      <div 
        class="pt-8 flex justify-center"
        :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
        style="transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s"
      >
        <NuxtLink to="/">
          <Button variant="ghost" class="group">
            <Icon icon="lucide:arrow-left" class="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to homepage
          </Button>
        </NuxtLink>
      </div>
      
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-slide-up {
  animation: fade-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>