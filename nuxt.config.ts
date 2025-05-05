import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  modules: [
    '@nuxt/eslint',
    '@nuxtjs/google-fonts',
    '@nuxt/icon',
    '@nuxt/image',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  googleFonts: {
    families: {
      'Red Hat Text': [400, 500, 700]
    },
    display: 'swap',
    preload: true,
    prefetch: true,
    preconnect: true,
    useStylesheet: true,
    subsets: ['latin']
  },

  alias: {
    '@sheet': fileURLToPath(new URL('./components/ui/sheet', import.meta.url)),
  },
})