<script setup lang="ts">
defineOptions({ name: 'AboutTimeline' })

interface TimelineItem {
  year: string
  title: string
  description: string
}
const props = defineProps<{ items: TimelineItem[] }>()
</script>

<template>
  <section class="mt-16">
    <h2 class="text-3xl font-bold mb-6">Timeline</h2>
    <div class="relative">
      <div class="border-l-2 border-gray-200 dark:border-gray-700 absolute h-full left-4 top-0" />
      <ul class="space-y-12 pl-8">
        <li
          v-for="(item, idx) in props.items"
          :key="idx"
          class="relative"
        >
          <div class="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600 dark:bg-blue-400" />
          <time class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ item.year }}</time>
          <div
            class="mt-1 p-4 bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow"
          >
            <h3 class="text-lg font-semibold">{{ item.title }}</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-400">{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template> 