<script setup lang="ts">
// Main navbar component for portfolio
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'
import { useRoute } from 'vue-router'

const isDark = useDark()
const toggleDark = useToggle(isDark)
const route = useRoute()
</script>

<template>
  <header class="border-b bg-background">
    <div class="container mx-auto flex h-16 items-center justify-center px-4">
      <div class="flex items-center space-x-8">
        <NuxtLink to="/" class="flex items-center">
          <span class="text-xl font-bold">Portfolio</span>
        </NuxtLink>
        
        <nav class="flex items-center space-x-6">
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
        
        <Button variant="outline" size="icon" @click="toggleDark()">
          <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  </header>
</template> 