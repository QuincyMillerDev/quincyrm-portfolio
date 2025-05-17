<script setup lang="ts">
import ChatbotPanel from '~/components/chat/ChatbotPanel.vue'
import { useBreakpoints } from '@vueuse/core'
import { useChatStore } from '~/stores/chatStore'

// Use Pinia store for chat state
const chatStore = useChatStore()

// Detect mobile breakpoint
const breakpoints = useBreakpoints({
  mobile: 768, // md breakpoint
})
const isMobile = breakpoints.smaller('mobile')
</script>

<template>
  <!-- Root container -->
  <div class="h-screen flex flex-col bg-background text-foreground">
    <!-- Main layout with conditional chat panel -->
    <div class="flex h-full relative">
      <!-- Chat panel - hidden on mobile and when closed -->
      <Transition
        enter-active-class="transition-all duration-150 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 -translate-x-full"
        leave-to-class="opacity-0 -translate-x-full"
      >
        <div 
          v-if="!isMobile && chatStore.isOpen" 
          class="absolute left-0 top-0 z-20 h-full flex-shrink-0 border-r border-border/30 shadow-sm bg-background sm:w-96 md:w-96 lg:w-[401px] xl:w-[451px] 2xl:w-[551px]"
        >
          <ChatbotPanel class="h-full" />
        </div>
      </Transition>
      
      <!-- Main content area with transition -->
      <div 
        class="flex-grow flex flex-col h-full transition-all duration-150 ease-out w-full"
        :class="{
          'pl-0': isMobile || !chatStore.isOpen, 
          'sm:pl-96 md:pl-96 lg:pl-[450px] xl:pl-[500px] 2xl:pl-[550px]': !isMobile && chatStore.isOpen
        }"
      >
        <!-- Scrollable content area -->
        <div class="flex-grow overflow-y-auto custom-scroll-area">
          <MainNavbar />
          <main class="max-w-3xl w-full mx-auto px-4 pb-8 pt-11 transition-all duration-150">
            <slot /> <!-- NuxtPage content renders here -->
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Hide Scrollbar */
.custom-scroll-area::-webkit-scrollbar {
  display: none; /* For WebKit browsers (Chrome, Safari, Edge) */
}

.custom-scroll-area {
  -ms-overflow-style: none;  /* For Internet Explorer and Edge (older versions) */
  scrollbar-width: none;  /* For Firefox */
  overflow-y: auto; /* Ensure scrolling is still possible */
}
</style> 