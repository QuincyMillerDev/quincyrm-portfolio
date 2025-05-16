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
    server: {
      hmr: {
        protocol: 'wss',
        host: 'localhost',
      },
      allowedHosts: [
        '4d73-32-216-125-127.ngrok-free.app'
      ],
    },
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/fonts',
    'shadcn-nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt'
  ],
  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  fonts: {
    families: [
      {
        name: 'Ubuntu',
        provider: 'google',
        weights: [400, 700],
        styles: ['normal', 'italic']
      },
      {
        name: 'Red Hat Display',
        provider: 'google',
        weights: [400, 700],
        styles: ['normal', 'italic']
      },
      {
        name: 'Noto Sans Display',
        provider: 'google',
        weights: [400, 700],
        styles: ['normal', 'italic']
      },
      {
        name: 'JetBrains Mono',
        provider: 'google',
        weights: [400, 700],
        styles: ['normal', 'italic']
      }
    ],
  },

  alias: {
    '@sheet': fileURLToPath(new URL('./components/ui/sheet', import.meta.url)),
  },
})