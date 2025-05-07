<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
} from '@/components/ui/sheet'
import ChatInterface from '@/components/chat/ChatInterface.vue'

const open = ref(false)
</script>

<template>
    <Sheet v-model:open="open">
      <SheetTrigger as-child>
        <Button variant="ghost" size="icon" class="h-6 w-6">
          <Icon icon="lucide:message-circle" class="h-[1rem] w-[1rem]" />
          <span class="sr-only">Open Chat</span>
        </Button>
      </SheetTrigger>
      <SheetContent class="p-0 flex flex-col h-full w-[400px] sm:w-[450px] border-l border-border/50 bg-background/95 backdrop-blur-sm">
  
        <div class="flex-1 overflow-hidden">
          <ChatInterface />
        </div>
      </SheetContent>
    </Sheet>
  </template>