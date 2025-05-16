<script setup lang="ts">
// Main navbar component for portfolio
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import ChatSheet from '@/components/chat/ChatSheet.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()
</script>

<template>
  <div class="fixed top-4 left-0 w-screen z-50 flex justify-center items-start pointer-events-none">
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

      <ChatSheet class="ml-1 relative z-10" />

      <Button variant="ghost" size="icon" class="h-6 w-6 ml-1 relative z-10" @click="toggleDark()">
        <Icon icon="lucide:moon" class="h-[0.9rem] w-[0.9rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon icon="lucide:sun" class="absolute h-[0.9rem] w-[0.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </div>
</template>