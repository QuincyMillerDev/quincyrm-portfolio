<script setup lang="ts">
// About page
</script>

<template>
  <div class="min-h-screen bg-background">
    <MainNavbar />
    <main class="container mx-auto px-4 py-10">
      <h1 class="text-4xl font-bold mb-6">About Me</h1>
      <div class="grid gap-8 md:grid-cols-2">
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">My Background</h2>
          <p class="mb-4 text-muted-foreground">
            I'm a passionate developer with a background in web technologies and design.
            My journey in tech began several years ago, and I've been building digital
            experiences ever since.
          </p>
          <p class="mb-4 text-muted-foreground">
            I specialize in frontend development with a focus on creating accessible,
            performant, and visually appealing interfaces.
          </p>
        </div>
        
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Skills</h2>
          <ul class="space-y-2 text-muted-foreground">
            <li>• Vue.js / Nuxt.js</li>
            <li>• TypeScript / JavaScript</li>
            <li>• HTML / CSS / Tailwind</li>
            <li>• UI/UX Design</li>
            <li>• Responsive Web Development</li>
            <li>• Performance Optimization</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template> 