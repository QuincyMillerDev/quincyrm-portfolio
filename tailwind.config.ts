import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    fontFamily: {
      sans: ['"Red Hat Text"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      // Other extends can go here
    },
  },
  plugins: [
    typography
  ],
} satisfies Config 