<script setup lang="ts">
// Main navbar component for portfolio
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router'
import ChatSheet from '@/components/ChatSheet.vue'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()
</script>

<template>
  <div class="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
    <div 
      class="rounded-xl bg-background/90 backdrop-blur-lg px-3 py-1 flex items-center border border-border/50 shadow-lg"
      :class="[
        'before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-r before:from-primary/5 before:to-background/5 before:opacity-60 before:-z-10',
        'after:absolute after:inset-0 after:rounded-xl after:bg-[url(\'/noise.png\')] after:opacity-5 after:bg-repeat after:bg-[length:150px_150px] after:-z-10',
        'hover:shadow-md hover:shadow-primary/5 transition-all duration-300'
      ]"
    >
      <nav class="flex items-center space-x-3 mr-2 relative z-10">
        <NuxtLink 
          to="/" 
          class="text-sm font-medium transition-colors hover:text-primary"
          :class="route.path === '/' ? 'text-primary' : 'text-muted-foreground'"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="text-sm font-medium transition-colors hover:text-primary"
          :class="route.path === '/about' ? 'text-primary' : 'text-muted-foreground'"
        >
          About
        </NuxtLink>
        <NuxtLink 
          to="/gear" 
          class="text-sm font-medium transition-colors hover:text-primary"
          :class="route.path === '/gear' ? 'text-primary' : 'text-muted-foreground'"
        >
          Gear
        </NuxtLink>
      </nav>

      <ChatSheet class="ml-1 relative z-10" />

            <Button variant="ghost" size="icon" class="h-6 w-6 ml-1 relative z-10" @click="toggleDark()">
        <Icon icon="radix-icons:moon" class="h-[0.9rem] w-[0.9rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon icon="radix-icons:sun" class="absolute h-[0.9rem] w-[0.9rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">Toggle theme</span>
      </Button>
    </div>
  </div>
</template> 