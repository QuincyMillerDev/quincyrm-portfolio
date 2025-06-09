import { track } from '@vercel/analytics'

type EventProperties = Record<string, string | number | boolean | null>

/**
 * Composable for tracking custom events with Vercel Analytics
 * Only tracks events in production environment
 */
export const useAnalytics = () => {
  /**
   * Track a custom event
   * @param name - The name of the event
   * @param properties - Optional properties to include with the event
   */
  const trackEvent = (name: string, properties?: EventProperties) => {
    if (process.env.NODE_ENV === 'production') {
      track(name, properties)
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: trackEvent', name, properties)
    }
  }

  /**
   * Track a page view (usually handled automatically by the plugin)
   * @param page - The page path
   * @param properties - Optional properties to include
   */
  const trackPageView = (page: string, properties?: EventProperties) => {
    if (process.env.NODE_ENV === 'production') {
      track('pageview', { page, ...properties })
    }
  }

  /**
   * Track user interactions
   * @param action - The action performed
   * @param element - The element that was interacted with
   * @param properties - Additional properties
   */
  const trackInteraction = (action: string, element: string, properties?: EventProperties) => {
    if (process.env.NODE_ENV === 'production') {
      track('interaction', { action, element, ...properties })
    } else if (process.env.NODE_ENV === 'development') {
      console.log('Analytics: trackInteraction', 'interaction', { action, element, ...properties })
    }
  }

  return {
    trackEvent,
    trackPageView,
    trackInteraction
  }
} 