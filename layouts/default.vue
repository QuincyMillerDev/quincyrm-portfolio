<script setup lang="ts">
// Default layout component that includes MainNavbar and main content area
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground">
    <!-- Header with MainNavbar -->
    <MainNavbar />
    
    <!-- Main content area - centered in a narrower column for vertical-first layout -->
    <main class="flex-grow max-w-3xl w-full mx-auto px-4 py-8 pt-24">
      <slot />
    </main>
  </div>
</template> 