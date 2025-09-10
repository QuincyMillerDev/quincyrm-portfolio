<script setup lang="ts">
// About page
import { ref, onMounted, computed } from 'vue'
import ImageContainer from '~/components/ImageContainer.vue'
import Timeline from '~/components/Timeline.vue'
import HobbiesContainer from '~/components/HobbiesContainer.vue'
import type {TimelineItemData} from "~/lib/types/timeline";
import type {ImageItem} from "~/lib/types/image";
import type {Hobby} from "~/lib/types/hobby" 
import { useStravaActivityStore } from '~/stores/stravaActivity';

// Initialize the store
const stravaStore = useStravaActivityStore();

const images: ImageItem[] = [
  { src: '/images/IMG_1625_VSCO.JPG', alt: 'Backcountry Skiing', shortDescription: 'I need to go backcountry skiing again.', location: 'Alta, UT', date: 'Jan 2025', chatSuggestion: 'Tell me about Quincy\'s backcountry skiing experience.' },
  { src: '/images/IMG_1385.JPG', alt: 'Senior Design', shortDescription: 'Won 3rd place in Capstone Competition.', location: 'Storrs, CT', date: 'Apr 2024', chatSuggestion: 'Tell me about Quincy\'s senior design accomplishments.' },
  { src: '/images/IMG_7864.JPG', alt: 'Japan', shortDescription: 'Exploring Japan.', location: 'Tokyo, Japan', date: 'Aug 2024', chatSuggestion: 'Tell me about Quincy\'s Japan trip.' },
  { src: '/images/IMG_3697.JPG', alt: 'Head of the Charles', shortDescription: 'Scout and I rowed in the HoTC.', location: 'Boston, MA', date: 'Oct 2024', chatSuggestion: 'Tell me about Quincy\'s Head of the Charles experience.' },
]

const timelineItems = ref<TimelineItemData[]>([
  {
    year: '2025 - Now',
    title: 'Head of Product & Engineering',
    company: 'Invested Inc.',
    location: 'Remote',
    description: 'Helping a generation of investors make more confident decisions.',
    skills: ['TypeScript', 'Python', 'Node.js', 'AWS', 'PostgreSQL', 'AI', 'LLMs', 'Product Strategy', 'Growth', 'Creator Marketing', 'Entrepreneurship'],
    type: 'work',
  },
  {
    year: '2024 - 2025',
    title: 'Software Development Engineer',
    company: 'Hubbell Inc.',
    location: 'Avon, CT',
    description: 'Working on enterprise products in Hubbell\'s high risk, high reward division.',
    skills: ['Python', 'TypeScript', 'Azure', 'Angular', 'C#', 'Databricks', 'PostgreSQL', 'Terraform', 'CI/CD'],
    type: 'work',
    chatSuggestion: 'What were Quincy\'s achievements and responsibilities as a software development engineer at Hubbell Inc?'
  },
  {
    year: '2022 - 2024',
    title: 'Associate Software Engineer',
    company: 'UConn Internal Insights & Innovation',
    location: 'Storrs, CT',
    description: 'Lead the development of diverse full-stack applications. Turned client ideas into functional, responsive applications.',
    skills: ['Vue.js', 'TypeScript', 'React', 'Node.js', 'Docker', 'NGINX', 'MySQL'],
    type: 'work',
    chatSuggestion: 'What was Quincy\'s role at UConn Internal Insights & Innovation?'
  },
  {
    year: '2022-2023',
    title: 'Software Engineering Intern',
    company: 'Hubbell Inc.',
    location: 'Avon, CT',
    description: 'Worked in an agile environment over two consecutive summer internships.',
    skills: ['C#', '.NET', 'Java', 'Spring Boot', 'MySQL'],
    type: 'work',
    chatSuggestion: 'What was Quincy\'s role at Hubbell Inc. as a software engineering intern?'
  },
  {
    year: '2022-2023',
    title: 'Husky Developers Club',
    description: 'Member and outreach chair. Lead events and workshops to promote software development skills among fellow students.',
    type: 'project',
    chatSuggestion: 'Tell me about Quincy\'s involvement in the Husky Developers Club.'
  },
  {
    year: '2020 - 2024',
    title: 'B.S.E in Computer Science & Engineering',
    company: 'University of Connecticut',
    location: 'Storrs, CT',
    description: 'Made my parents proud. Concentrated in software design and development.',
    type: 'education',
    chatSuggestion: 'Tell me about Quincy\'s academic experience at UConn.'
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
    accentColorHex: '#4CAF50',
    chatSuggestion: 'How does this Strava integration work?'
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
    accentColorHex: '#00BCD4',
    chatSuggestion: 'Tell me more about Quincy\'s passion for skiing.'
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
    accentColorHex: '#FFC107',
    chatSuggestion: 'What is Quincy\'s investment style?'
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
    accentColorHex: '#9C27B0',
    chatSuggestion: 'Tell me more about Quincy\'s content creation.'
  }
])

// Computed property to merge base hobbies with dynamic fitness stats from Pinia
const hobbies = computed<Hobby[]>(() => {
  return baseHobbies.value.map((hobby: Hobby) => {
    if (hobby.id === 'fitness') {
      return { ...hobby, stats: stravaStore.fitnessStats };
    }
    return hobby;
  });
});

const activeSection = ref<string | null>(null)

const setHoveredSection = (section: string | null) => {
  activeSection.value = section
}

onMounted(() => {
  stravaStore.fetchAthleteStats();
});
</script>

<template>
  <div class="space-y-12">
    
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'z-10': activeSection === 'images'
      }"
      @mouseenter="setHoveredSection('images')"
      @mouseleave="setHoveredSection(null)"
    >
      <ImageContainer :images="images" />
    </div>
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'z-10': activeSection === 'timeline'
      }"
      @mouseenter="setHoveredSection('timeline')"
      @mouseleave="setHoveredSection(null)"
    >
      <Timeline :items="timelineItems" />
    </div>
    <div
      class="transition-all duration-300 ease-out relative"
      :class="{
        'z-10': activeSection === 'hobbies'
      }"
      @mouseenter="setHoveredSection('hobbies')"
      @mouseleave="setHoveredSection(null)"
    >
      <HobbiesContainer :hobbies="hobbies" />
    </div>
  </div>
</template>

<style scoped>

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