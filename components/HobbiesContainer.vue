<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import HobbyItem from './HobbyItem.vue'
import type {Hobby} from "~/lib/types/hobby";

const props = defineProps<{
  hobbies: Hobby[]
}>()

// For animations
const isVisible = ref(false)
const activeHobby = ref('')

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const handleToggleActive = (id: string) => {
  if (activeHobby.value === id) {
    activeHobby.value = ''
  } else {
    activeHobby.value = id
  }
}

// Use provided hobbies or sample data
// const displayHobbies = props.hobbies?.length ? props.hobbies : []
// Use computed for better reactivity with props
const displayHobbies = computed(() => props.hobbies || [])
</script>

<template>
  <section class="mt-12">
    <h2 
      class="text-xl font-medium mb-6 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
      :class="{ 'opacity-100 translate-y-0 scale-100': isVisible, 'opacity-0 translate-y-[10px] scale-[0.98]': !isVisible }"
    >Hobbies</h2>
    
    <div 
      class="grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100"
      :class="{ 'opacity-100': isVisible, 'opacity-0': !isVisible }"
    >
      <HobbyItem
        v-for="(hobby, idx) in displayHobbies"
        :key="hobby.id"
        :hobby="hobby"
        :is-active="activeHobby === hobby.id"
        :is-visible="isVisible"
        :animation-delay="`${idx * 100}ms`"
        @toggle-active="handleToggleActive"
      />
    </div>
  </section>
</template>