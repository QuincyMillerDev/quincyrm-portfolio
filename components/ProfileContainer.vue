<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { Button } from '~/components/ui/button'
import { Card } from '~/components/ui/card'
import { NuxtImg } from '#components'

// Analytics composable for tracking events
const { trackInteraction } = useAnalytics()

// Define props for the component
const props = defineProps<{
  name: string
  desktopPictureUrl: string
  mobilePictureUrl: string
  subtitle: string
  location: string
  descriptionMd: string
  links: Array<{ name: string; url: string; icon: string }>
}>()

// Split markdown text into paragraphs
const paragraphs = computed<string[]>(() =>
  props.descriptionMd
    .trim()
    .split(/\n\s*\n/)
    .filter((p: string) => p.length)
)

// Brand color classes for social icons
const brandColorClasses: Record<string, string> = {
  GitHub: 'hover:text-[#181717]',
  LinkedIn: 'hover:text-[#0077B5]',
  'X.com': 'hover:text-[#1DA1F2]',
  Instagram: 'hover:text-[#E1306C]',
  Email: 'hover:text-green-500'
}

// Animation states
const isVisible = ref(false)
const imageLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 300)
})

const handleImageLoad = () => {
  imageLoaded.value = true
}

// Track social link clicks
const trackSocialClick = (socialName: string, url: string) => {
  trackInteraction('click', 'social-link', {
    social_platform: socialName,
    link_url: url,
    section: 'profile-header'
  })
}
</script>

<template>
  <Card class="bg-background/50 backdrop-blur-sm border border-border/40 overflow-hidden w-full">
    <div 
      class="relative w-full py-2 px-3 md:py-3 md:px-5"
      :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-4': !isVisible }"
      style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
    >
      <!-- Mobile Layout - Horizontal -->
      <div class="md:hidden w-full">
        <div class="flex items-start justify-between gap-3 w-full">
          <!-- Content -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-foreground mb-0">{{ props.name }}</h1>
            <h2 class="text-lg text-muted-foreground mb-0">{{ props.subtitle }}</h2>
            <div class="flex items-center text-sm text-muted-foreground mb-1">
              <Icon icon="lucide:map-pin" class="w-3.5 h-3.5 mr-1" />
              <span>{{ props.location }}</span>
            </div>
          </div>
          
          <!-- Image -->
          <div 
            class="flex-shrink-0"
            :class="{ 'opacity-100 scale-100': imageLoaded, 'opacity-0 scale-95': !imageLoaded }"
            style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
          >
            <NuxtImg
              :src="props.mobilePictureUrl"
              :alt="`${props.name}'s Profile Picture`"
              width="200"
              height="200"
              format="webp"
              quality="90"
              class="rounded-full shadow-md aspect-square object-cover w-24 h-24"
              @load="handleImageLoad"
            />
          </div>
        </div>
        
        <!-- Description -->
        <div 
          class="prose prose-sm max-w-none text-muted-foreground dark:prose-invert w-full mt-1"
          :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-4': !isVisible }"
          style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
        >
          <p
            v-for="(text, idx) in paragraphs"
            :key="idx"
            class="mb-1"
          >
            {{ text }}
          </p>
        </div>

        <!-- Social Links -->
        <div class="flex items-center flex-wrap gap-1 mt-2 mb-1">
          <div class="flex flex-wrap gap-1">
            <Button
              v-for="(link, index) in props.links"
              :key="link.name"
              as-child
              variant="ghost"
              size="icon"
              class="w-7 h-7 rounded-md transition-all duration-300"
              :class="[
                brandColorClasses[link.name] || '',
                { 'opacity-0': !isVisible, [`opacity-100 transition-opacity duration-500 delay-[${300 + index * 100}ms]`]: isVisible }
              ]"
            >
              <a 
                :href="link.url" 
                target="_blank" 
                rel="noopener noreferrer" 
                :aria-label="link.name"
                @click="trackSocialClick(link.name, link.url)"
              >
                <Icon :icon="link.icon" class="w-3.5 h-3.5" />
              </a>
            </Button>
          </div>
          
          <div class="h-3.5 w-px bg-border/40 mx-1.5" />
          
          <NuxtLink 
            to="/links" 
            class="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-0.5"
            @click="trackInteraction('click', 'navigation', { link: 'all-links', section: 'profile-header' })"
          >
            <Icon icon="lucide:link" class="w-3 h-3" />
            <span>All links</span>
          </NuxtLink>
        </div>

      </div>
      
      <!-- Desktop Layout - Horizontal -->
      <div class="hidden md:block">
        <div class="flex items-center gap-8 w-full">
          <!-- Content -->
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-foreground mb-0.5">{{ props.name }}</h1>
            <h2 class="text-xl text-muted-foreground mb-1.5">{{ props.subtitle }}</h2>
            <div class="flex items-center text-sm text-muted-foreground mb-1.5">
              <Icon icon="lucide:map-pin" class="w-4 h-4 mr-1.5" />
              <span>{{ props.location }}</span>
            </div>
            
            <!-- Description -->
            <div 
              class="prose prose-sm md:prose-base max-w-none text-muted-foreground dark:prose-invert"
              :class="{ 'opacity-100 translate-y-0': isVisible, 'opacity-0 translate-y-4': !isVisible }"
              style="transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
            >
              <p
                v-for="(text, idx) in paragraphs"
                :key="idx"
                class="mb-2"
              >
                {{ text }}
              </p>
            </div>

            <!-- Social Links -->
            <div class="flex items-center gap-2 mb-2">
              <div class="flex flex-wrap gap-2">
                <Button
                  v-for="(link, index) in props.links"
                  :key="link.name"
                  as-child
                  variant="ghost"
                  size="icon"
                  class="w-8 h-8 rounded-md transition-all duration-300"
                  :class="[
                    brandColorClasses[link.name] || '',
                    { 'opacity-0': !isVisible, [`opacity-100 transition-opacity duration-500 delay-[${300 + index * 100}ms]`]: isVisible }
                  ]"
                >
                  <a 
                    :href="link.url" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    :aria-label="link.name"
                    @click="trackSocialClick(link.name, link.url)"
                  >
                    <Icon :icon="link.icon" class="w-4 h-4" />
                  </a>
                </Button>
              </div>
              
              <div class="h-4 w-px bg-border/40 mx-1" />
              
              <NuxtLink 
                to="/links" 
                class="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1"
                @click="trackInteraction('click', 'navigation', { link: 'all-links', section: 'profile-header' })"
              >
                <Icon icon="lucide:link" class="w-3.5 h-3.5" />
                <span>All links</span>
              </NuxtLink>
            </div>
            

          </div>
          
          <!-- Image -->
          <div 
            class="flex-shrink-0"
            :class="{ 'opacity-100 scale-100': imageLoaded, 'opacity-0 scale-95': !imageLoaded }"
            style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1)"
          >
            <div class="relative group">
              <div 
                class="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 blur-lg group-hover:opacity-100 opacity-0 transition-opacity duration-700"
              />
              <NuxtImg
                :src="props.desktopPictureUrl"
                :alt="`${props.name}'s Profile Picture`"
                width="220"
                height="220"
                format="webp"
                quality="90"
                class="rounded-xl shadow-md aspect-square object-cover w-[220px] relative z-10"
                @load="handleImageLoad"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>