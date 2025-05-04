<script setup lang="ts">
// Home page for the portfolio
</script>

<template>
  <div class="min-h-screen bg-background">
    <MainNavbar />
    <main class="container mx-auto px-4 py-10">
      <h1 class="text-4xl font-bold mb-6">Welcome to my Portfolio</h1>
      <p class="text-muted-foreground mb-8">A showcase of Shadcn Vue components</p>
      
      <div class="grid gap-8 md:grid-cols-2">
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Button Examples</h2>
          <div class="flex flex-wrap gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
        </div>
        
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">More Components</h2>
          <p class="mb-4">This page demonstrates that Shadcn Vue components are working correctly.</p>
          <Button variant="outline" size="lg">
            Explore Components
          </Button>
        </div>
      </div>
    </main>
  </div>
</template> 