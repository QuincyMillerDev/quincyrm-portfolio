<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="ghost" size="icon" class="h-6 w-6">
        <Icon icon="lucide:message-circle" class="h-[1rem] w-[1rem]" />
        <span class="sr-only">Open Chat</span>
      </Button>
    </SheetTrigger>
    <SheetContent class="p-4 flex flex-col h-full w-[400px] sm:w-[540px]">
      <SheetHeader class="mb-4">
        <SheetTitle>Chat with Me</SheetTitle>
        <SheetDescription>
          Ask me anything about my work, skills, or background.
        </SheetDescription>
      </SheetHeader>

      <div class="flex-1 overflow-y-auto space-y-3 my-4 pr-2">
        <slot name="messages" />
      </div>

      <SheetFooter />
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/components/ui/button'
import { Icon } from '@iconify/vue'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter
} from '@/components/ui/sheet'

const open = ref(false)

</script> 