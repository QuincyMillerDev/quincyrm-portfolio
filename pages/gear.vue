<script setup lang="ts">
// Gear page to showcase equipment
</script>

<template>
  <div class="min-h-screen bg-background">
    <MainNavbar />
    <main class="container mx-auto px-4 py-10">
      <h1 class="text-4xl font-bold mb-6">My Gear</h1>
      <p class="text-muted-foreground mb-8">A showcase of the equipment I use for development and content creation</p>
      
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Workstation</h2>
          <ul class="space-y-2 text-muted-foreground">
            <li>• Custom PC Build (Ryzen 9 / RTX 3080)</li>
            <li>• 32" 4K Monitor</li>
            <li>• Standing Desk</li>
            <li>• Ergonomic Chair</li>
          </ul>
        </div>
        
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Development</h2>
          <ul class="space-y-2 text-muted-foreground">
            <li>• VS Code / WebStorm</li>
            <li>• GitHub Copilot</li>
            <li>• Docker for local development</li>
            <li>• Mechanical Keyboard (Cherry MX)</li>
          </ul>
        </div>
        
        <div class="rounded-lg border p-6 shadow-sm">
          <h2 class="text-2xl font-semibold mb-4">Content Creation</h2>
          <ul class="space-y-2 text-muted-foreground">
            <li>• DSLR Camera (Canon)</li>
            <li>• Microphone (Blue Yeti)</li>
            <li>• Adobe Creative Suite</li>
            <li>• Lighting Kit</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template> 