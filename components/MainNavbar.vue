<script setup lang="ts">
// Main navbar component for portfolio
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <header class="border-b bg-background">
    <div class="container mx-auto flex h-16 items-center px-4">
      <div class="mr-4 flex">
        <NuxtLink to="/" class="flex items-center">
          <span class="text-xl font-bold">Portfolio</span>
        </NuxtLink>
      </div>
      <nav class="flex items-center space-x-4 lg:space-x-6">
        <NuxtLink 
          to="/" 
          class="text-sm font-medium transition-colors hover:text-primary"
        >
          Home
        </NuxtLink>
        <NuxtLink 
          to="/projects" 
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Projects
        </NuxtLink>
        <NuxtLink 
          to="/about" 
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          About
        </NuxtLink>
        <NuxtLink 
          to="/contact" 
          class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          Contact
        </NuxtLink>
      </nav>
      <div class="ml-auto flex items-center space-x-2">
        <Button variant="outline" size="icon" @click="toggleDark()">
          <Icon icon="radix-icons:moon" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Icon icon="radix-icons:sun" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle theme</span>
        </Button>
        <Button variant="outline" size="sm">
          Login
        </Button>
        <Button size="sm">
          Sign Up
        </Button>
      </div>
    </div>
  </header>
</template> 