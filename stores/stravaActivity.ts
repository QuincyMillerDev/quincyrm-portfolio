import { defineStore } from 'pinia';
import type { HobbyStats } from '~/lib/types/hobby';
import type { StravaAthleteStats } from '~/lib/types/strava';

interface StravaActivityState {
  athleteStats: StravaAthleteStats | null; 
  isLoading: boolean;
  error: string | null;
}

// Helper type predicate remains the same
function isFetchError(error: unknown): error is { response?: { status: number; data?: { error?: string } }; message: string } {
  return typeof error === 'object' && error !== null && 'message' in error;
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

        // Conversion factor from meters to miles
        const metersToMiles = 0.000621371;

        // YTD Run Totals
        if (stats.ytd_run_totals && stats.ytd_run_totals.count > 0) {
          const distanceMiles = (stats.ytd_run_totals.distance * metersToMiles).toFixed(1);
          statsArray.push({
            label: 'YTD Runs',
            value: `${distanceMiles}mi / ${stats.ytd_run_totals.count} runs`,
            icon: 'material-symbols:directions-run-rounded', // Updated Icon
          });
        } else {
           statsArray.push({ label: 'YTD Run', value: 'No runs yet', icon: 'lucide:calendar-off' });
        }

        // All Time Run Totals
        if (stats.all_run_totals && stats.all_run_totals.count > 0) {
          const distanceMiles = (stats.all_run_totals.distance * metersToMiles).toFixed(1);
          statsArray.push({
            label: 'All Time Runs',
            value: `${distanceMiles}mi / ${stats.all_run_totals.count} runs`,
            icon: 'material-symbols:history-rounded', // Example icon
          });
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