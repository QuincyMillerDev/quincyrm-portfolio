import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  
  // Add app-wide head configuration for iOS theming
  app: {
    head: {
      meta: [
        // iOS status bar configuration
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        // Add theme-color meta for browser UI elements
        { name: 'theme-color', content: '#ffffff', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#020817', media: '(prefers-color-scheme: dark)' }
      ],
      link: [
        // Add a manifest file for PWA support
        { rel: 'manifest', href: '/site.webmanifest' }
      ]
    }
  },
  
  vite: {
    plugins: [
      tailwindcss(),
    ],
    server: {
      hmr: {
        protocol: 'ws',
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