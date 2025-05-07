<script setup lang="ts">
// Direct font loading as fallback - REMOVING THIS as @nuxtjs/google-fonts handles it
// useHead({
//   link: [
//     { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
//     { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
//     { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Red+Hat+Text:wght@400;500;700&display=swap' }
//   ]
// })
</script>

<template>
  <div class="font-sans min-h-screen">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

