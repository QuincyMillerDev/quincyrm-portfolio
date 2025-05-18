<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '~/components/ui/sheet'
import ChatInterface from '~/components/chat/ChatInterface.vue'
import { useChatStore } from '~~/stores/chatStore'

// Use Pinia store for mobile sheet
const chatStore = useChatStore()
</script>

<template>
  <Sheet v-model:open="chatStore.isMobileSheetOpen">
    <ClientOnly>
      <SheetTrigger>
        <Button variant="ghost" size="icon" class="h-6 w-6 mx-1 flex items-center justify-center">
          <Icon icon="lucide:message-square" class="h-[1rem] w-[1rem]" />
          <span class="sr-only">Open Chat</span>
        </Button>
      </SheetTrigger>
    </ClientOnly>
    <SheetContent 
      class="p-0 flex flex-col h-full border-l border-border/50 bg-background/95 backdrop-blur-sm"
      :class="[
        'w-[85vw] max-w-[350px]', // For extra small screens
        'sm:w-[400px]', // For small screens (sm)
        'md:w-[500px]', // For medium screens (md)
      ]"
    >
      <div class="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </SheetContent>
  </Sheet>
</template>