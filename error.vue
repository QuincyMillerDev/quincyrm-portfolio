<script setup lang="ts">
import type { NuxtError } from '#app'
import { Button } from '~/components/ui/button'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error?.statusCode === 404)

const handleClearError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="h-screen flex flex-col items-center justify-center bg-background text-foreground font-sans px-4">
    <div class="max-w-md w-full text-center space-y-5">
      <p class="text-7xl font-bold tracking-tight text-foreground/90">
        {{ error?.statusCode || 500 }}
      </p>

      <template v-if="is404">
        <p class="text-muted-foreground">
          This page does not exist. Like the legacy PHP monolith it may once have
          lived in, it has been replaced by something that works.
        </p>
        <p class="text-sm text-muted-foreground/70">
          If you were sent here by a stale link, the chatbot on the homepage
          probably knows where the content went.
        </p>
      </template>
      <template v-else>
        <p class="text-muted-foreground">
          Something went wrong on this end. It has been noted, loudly, which is
          how failures should happen.
        </p>
      </template>

      <div class="flex items-center justify-center gap-2 pt-2">
        <Button class="gap-1.5" @click="handleClearError">
          <Icon icon="lucide:home" class="w-4 h-4" />
          Back home
        </Button>
      </div>
    </div>
  </div>
</template>
