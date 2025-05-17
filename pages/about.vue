<script setup lang="ts">
// About page
import { ref, onMounted, computed } from 'vue'
import ImageContainer from '~/components/ImageContainer.vue'
import Timeline from '~/components/Timeline.vue'
import HobbiesContainer from '~/components/HobbiesContainer.vue'
import type {TimelineItemData} from "~/types/timeline";
import type {ImageItem} from "~/types/image";
import type {Hobby} from "~/types/hobby"
import { useStravaActivityStore } from '~/stores/stravaActivity';

// Initialize the store
const stravaStore = useStravaActivityStore();

const images: ImageItem[] = [
  { src: '/images/IMG_1625_VSCO.JPG', alt: 'Backcountry Skiing', shortDescription: 'I need to go backcountry skiing again.', location: 'Alta, UT', date: 'Jan 2025' },
  { src: '/images/IMG_1385.JPG', alt: 'Senior Design', shortDescription: 'Won 3rd place in Capstone Competition.', location: 'Storrs, CT', date: 'Apr 2024' },
  { src: '/images/IMG_7864.JPG', alt: 'Japan', shortDescription: 'Exploring Japan.', location: 'Tokyo, Japan', date: 'Aug 2024' },
  { src: '/images/IMG_3697.JPG', alt: 'Head of the Charles', shortDescription: 'Scout and I rowed in the HoTC.', location: 'Boston, MA', date: 'Oct 2024' },
]

const timelineItems = ref<TimelineItemData[]>([
{
    year: '2024 - Now',
    title: 'Full-Stack Software Engineer',
    company: 'Hubbell Inc.',
    location: 'Avon, CT',
    description: 'Working on enterprise products in Hubbell\'s high risk, high reward division.',
    skills: ['Python', 'TypeScript', 'Azure', 'Angular', 'C#', 'Databricks', 'PostgreSQL', 'Terraform', 'CI/CD'],
    type: 'work'
  },
  {
    year: '2022 - 2024',
    title: 'Associate Software Engineer',
    company: 'UConn Digital Experience Group',
    location: 'Storrs, CT',
    description: 'Lead the development of diverse full-stack applications. Turned client ideas into functional, responsive applications.',
    skills: ['Vue.js', 'TypeScript', 'React', 'Node.js', 'Docker', 'NGINX', 'MySQL'],
    type: 'work'
  },
  {
    year: '2020 - 2024',
    title: 'B.S.E in Computer Science & Engineering',
    company: 'University of Connecticut',
    location: 'Storrs, CT',
    description: 'Made my parents proud. Concentrated in software design and development.',
    type: 'education'
  },
  {
    year: '2022-2023',
    title: 'Software Engineering Intern',
    company: 'Hubbell Inc.',
    location: 'Avon, CT',
    description: 'Worked in an agile environment over two consecutive summer internships.',
    skills: ['C#', '.NET', 'Java', 'Spring Boot', 'MySQL'],
    type: 'work'
  }
])

// Initial hobbies data (without fitness stats)
const baseHobbies = ref<Hobby[]>([
  {
    id: 'fitness',
    name: 'Fitness & Nutrition',
    icon: 'lucide:dumbbell',
    description: 'I track everything.',
    stats: [], // Stats will come from Pinia store via computed property
    colorHue: 150,
    accentColorHex: '#4CAF50'
  },
  {
    id: 'skiing',
    name: 'Skiing',
    icon: 'lucide:mountain-snow',
    description: 'I actually do touch grass/snow. ',
    stats: [
      { label: 'Seasons', value: '12+', icon: 'lucide:calendar' },
      { label: 'Favorite Mountain', value: 'Snowbird, UT', icon: 'lucide:mountain' }
    ],
    colorHue: 200,
    accentColorHex: '#00BCD4'
  },
  {
    id: 'finance',
    name: 'Personal Finance',
    icon: 'lucide:bar-chart-2',
    description: 'Like I said, I track <em>everything</em>.',
    stats: [
      { label: 'Investment Style', value: 'Long-term', icon: 'lucide:trending-up' },
      { label: 'Focus Areas', value: 'Index Funds, Stocks, Real Estate?', icon: 'lucide:landmark' }
    ],
    colorHue: 40,
    accentColorHex: '#FFC107'
  },
  {
    id: 'content',
    name: 'Content Creation',
    icon: 'lucide:video',
    description: 'Built a community on Twitch during the pandemic.',
    stats: [
      { label: 'Medium', value: 'Twitch & TikTok', icon: 'lucide:pen-tool' },
      { label: 'Topics', value: 'Gaming, Tech, Life', icon: 'lucide:layers' }
    ],
    colorHue: 270,
    accentColorHex: '#9C27B0'
  }
])

// Computed property to merge base hobbies with dynamic fitness stats from Pinia
const hobbies = computed(() => {
  return baseHobbies.value.map(hobby => {
    if (hobby.id === 'fitness') {
      // Replace the stats for the fitness hobby with the ones from the store
      return { ...hobby, stats: stravaStore.fitnessStats };
    }
    return hobby;
  });
});

const activeSection = ref<string | null>(null)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}

// Fetch latest activity data via Pinia store action when the component mounts
onMounted(() => {
  stravaStore.fetchAthleteStats();
  // Optional: Set up polling or refetch on window focus for more frequent updates
  // Consider if polling is necessary or if webhook updates + initial fetch are sufficient
  // Example: Poll every 5 minutes
  // setInterval(() => stravaStore.fetchAthleteStats(), 5 * 60 * 1000);
});
</script>

<template>
  <div class="space-y-12">
    
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'images',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'images'
      }"
      @mouseenter="setHoveredSection('images')"
      @mouseleave="setHoveredSection(null)"
    >
      <ImageContainer :images="images" />
    </div>
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'timeline',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'timeline'
      }"
      @mouseenter="setHoveredSection('timeline')"
      @mouseleave="setHoveredSection(null)"
    >
      <Timeline :items="timelineItems" />
    </div>
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'scale-101 z-10': activeSection === 'hobbies',
        'opacity-85 brightness-98 scale-99': activeSection !== null && activeSection !== 'hobbies'
      }"
      @mouseenter="setHoveredSection('hobbies')"
      @mouseleave="setHoveredSection(null)"
    >
      <HobbiesContainer :hobbies="hobbies" />
    </div>
  </div>
</template>

<style scoped>
/* No custom styles needed anymore for blur */

@keyframes fade-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-slide-up {
  animation: fade-slide-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>