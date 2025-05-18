export interface StravaRunTotals {
  count: number;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  elevation_gain: number; // meters
  achievement_count?: number; // Optional, as not present in all_run_totals or ytd_run_totals
}

export interface StravaAthleteStats {
  recent_run_totals: StravaRunTotals;
  all_run_totals: StravaRunTotals;
  ytd_run_totals: StravaRunTotals;
  // We are omitting ride and swim totals as per the request
}

// Interface for a potential error response from Strava OAuth/API
// This can be kept here or moved if used by other non-Strava stat related API calls
export interface StravaErrorResponse {
  message: string;
  errors: Array<{ resource: string; field: string; code: string }>;
}

// Interface for a successful token refresh response
// This is specific to token refresh, so might be better co-located if not broadly used
export interface StravaTokenResponse {
  access_token: string;
  expires_at: number;
  refresh_token: string;
}
