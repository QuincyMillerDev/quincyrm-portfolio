<script setup lang="ts">
// Main navbar component for portfolio
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useDark, useToggle, useBreakpoints } from '@vueuse/core'
import { useRoute } from 'vue-router'
import ChatSheet from '@/components/chat/ChatSheet.vue'
import { useChatStore } from '~/stores/chatStore'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()

// Use chat store instead of inject
const chatStore = useChatStore()

// Detect mobile breakpoint
const breakpoints = useBreakpoints({
  mobile: 768, // md breakpoint
})
const isMobile = breakpoints.smaller('mobile')
</script>

<template>
  <div class="sticky top-0 w-full flex justify-center items-center py-2 z-50 pointer-events-none">
    <div 
      class="rounded-sm bg-background/80 backdrop-blur-sm px-3 py-1 flex items-center border border-border/40 shadow-sm pointer-events-auto"
      :class="[
        'hover:bg-background/90 transition-all duration-300'
      ]"
    >
      <nav class="flex items-center space-x-3 mr-2 relative z-10">
        <NuxtLink 
          to="/" 
          class="text-sm font-medium transition-colors hover:text-primary"
          :class="route.path === '/' ? 'text-foreground' : 'text-muted-foreground'"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="text-sm font-medium transition-colors hover:text-primary"
          :class="route.path === '/about' ? 'text-foreground' : 'text-muted-foreground'"
        >
          About
        </NuxtLink>
      </nav>

      <div class="flex items-center">
        <!-- Use ChatSheet on mobile, toggle chat panel on desktop -->
        <ClientOnly>
          <template v-if="isMobile">
            <div class="flex items-center">
              <ChatSheet />
            </div>
          </template>
          <template v-else>
            <div class="flex items-center">
              <Button variant="ghost" size="icon" class="h-6 w-6 mx-1 flex items-center justify-center" @click="chatStore.toggleChat">
                <Icon icon="lucide:message-square" class="h-[1rem] w-[1rem]" />
                <span class="sr-only">Toggle chat</span>
              </Button>
            </div>
          </template>
        </ClientOnly>

        <ClientOnly>
          <div class="flex items-center">
            <Button variant="ghost" size="icon" class="h-6 w-6 mx-1 flex items-center justify-center" @click="toggleDark()">
              <Icon icon="lucide:moon" class="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Icon icon="lucide:sun" class="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </div>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>