import { inject } from '@vercel/analytics'

export default defineNuxtPlugin(() => {
  // Only inject analytics in production and on the client side
  if (process.env.NODE_ENV === 'production') {
    inject()
  }
}) 