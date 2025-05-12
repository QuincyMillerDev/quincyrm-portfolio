import { defineStore } from 'pinia';
import type { HobbyStats } from '~/types/hobby';

// Define the structure matching the /athletes/{id}/stats endpoint response
// This is the data that will be stored in KV and fetched by this store
interface StravaAthleteStats {
  ytd_ride_totals: StravaTotals;
  ytd_run_totals: StravaTotals;
  // Add other fields like all_ride_totals, recent_run_totals if needed
}

interface StravaTotals {
  count: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
}

// Updated state interface
interface StravaActivityState {
  athleteStats: StravaAthleteStats | null; 
  isLoading: boolean;
  error: string | null;
}

// Helper type predicate remains the same
function isFetchError(error: unknown): error is { response?: { status: number; data?: { error?: string } }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
}

// Helper function to format time from seconds to H:MM
function formatSecondsToHoursMinutes(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}:${minutes.toString().padStart(2, '0')}`;
}

export const useStravaActivityStore = defineStore('stravaActivity', {
  state: (): StravaActivityState => ({
    athleteStats: null, 
    isLoading: false,
    error: null,
  }),
  getters: {
    fitnessStats(state): HobbyStats[] {
      if (state.isLoading) {
        return [{ label: 'YTD Stats', value: 'Loading...', icon: 'lucide:loader-2' }];
      }
      if (state.error) {
        return [{ label: 'YTD Stats', value: 'Error loading data', icon: 'lucide:alert-triangle' }];
      }
      if (state.athleteStats) {
        const stats = state.athleteStats;
        const statsArray: HobbyStats[] = [];

        if (stats.ytd_run_totals && stats.ytd_run_totals.count > 0) {
          const distanceKm = (stats.ytd_run_totals.distance / 1000).toFixed(1);
          const timeFormatted = formatSecondsToHoursMinutes(stats.ytd_run_totals.moving_time);
          statsArray.push({
            label: 'YTD Run',
            value: `${distanceKm}km / ${timeFormatted} / ${stats.ytd_run_totals.count} runs`,
            icon: 'lucide:trending-up',
          });
        } else {
           statsArray.push({ label: 'YTD Run', value: 'No runs yet', icon: 'lucide:calendar-off' });
        }

        if (stats.ytd_ride_totals && stats.ytd_ride_totals.count > 0) {
          const distanceKm = (stats.ytd_ride_totals.distance / 1000).toFixed(1);
          const timeFormatted = formatSecondsToHoursMinutes(stats.ytd_ride_totals.moving_time);
          statsArray.push({
            label: 'YTD Ride',
            value: `${distanceKm}km / ${timeFormatted} / ${stats.ytd_ride_totals.count} rides`,
            icon: 'lucide:bike',
          });
        } else {
          statsArray.push({ label: 'YTD Ride', value: 'No rides yet', icon: 'lucide:calendar-off' });
        }
        return statsArray;
      }
      return [{ label: 'YTD Stats', value: 'No data available', icon: 'lucide:alert-circle' }];
    },
  },
  actions: {
    async fetchAthleteStats() { // Name can remain the same, functionality changes
      if (this.isLoading) return;
      this.isLoading = true;
      this.error = null;
      try {
        // Fetch from the new cached-stats endpoint
        const response = await $fetch<StravaAthleteStats | { error: string; data: null }>('/api/strava/cached-stats');
        
        // Check if the response indicates an error (e.g., from KV not finding data)
        if ('error' in response && response.error) {
            if (response.error === 'No cached Strava stats found.') {
                console.warn('No cached Strava stats found in KV, will display default.');
                this.error = 'No recent activity data available.'; // User-friendly message
                this.athleteStats = null;
            } else {
                throw new Error(response.error); // Other server-side errors
            }
        } else {
            this.athleteStats = response as StravaAthleteStats; // Cast if no error property
        }

      } catch (err) {
        console.error('Failed to fetch cached athlete stats:', err);
        if (isFetchError(err)) {
            this.error = err.response?.data?.error || err.message || 'Failed to load stats.';
        } else {
          this.error = 'An unknown error occurred while fetching cached stats.';
        }
        this.athleteStats = null; // Clear stats on error
      } finally {
        this.isLoading = false;
      }
    },
  },
}); 