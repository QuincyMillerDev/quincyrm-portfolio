import { defineEventHandler, getHeader, setResponseStatus } from 'h3';
import { kv } from '@vercel/kv';
import type { StravaAthleteStats, StravaErrorResponse, StravaTokenResponse } from '../../../lib/types/strava';

// Key for storing token data in KV
const KV_TOKEN_KEY = 'strava:tokenData';
// Key for storing stats data in KV (using ownerId for potential future multi-user scenarios)
const getKvStatsKey = (ownerId: string) => `strava:stats:${ownerId}`;

interface StoredTokenData {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // Expiry timestamp (seconds since epoch)
}




// Type guard to check if an object is a StravaErrorResponse
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isStravaError(response: any): response is StravaErrorResponse {
  return response && typeof response.message === 'string' && Array.isArray(response.errors);
}

export default defineEventHandler(async (event) => { // Use event parameter now
  // --- Cron Secret Check --- 
  const cronSecret = process.env.CRON_SECRET;
  const authorizationHeader = getHeader(event, 'authorization');

  if (!cronSecret) {
    console.error('CRON ERROR: CRON_SECRET environment variable is not set.');
    setResponseStatus(event, 500); // Internal Server Error
    return { status: 'error', message: 'Server configuration error: Cron secret missing.' };
  }

  if (authorizationHeader !== `Bearer ${cronSecret}`) {
    console.warn('CRON WARN: Unauthorized attempt to access update job.');
    setResponseStatus(event, 401); // Unauthorized
    return { status: 'error', message: 'Unauthorized' };
  }
  // --- End Cron Secret Check --- 

  console.log('Starting Strava update cron job (authorized)...');

  const ownerId = process.env.MY_STRAVA_OWNER_ID;
  const clientId = process.env.STRAVA_CLIENT_ID;
  const clientSecret = process.env.STRAVA_CLIENT_SECRET;
  const initialRefreshToken = process.env.STRAVA_REFRESH_TOKEN;

  if (!ownerId || !clientId || !clientSecret || !initialRefreshToken) {
    console.error('CRON ERROR: Missing Strava environment variables (ID, Secret, Refresh Token)');
    // Note: Status code is already set if secret check passed, 
    // but this specific error might warrant a 500 if it occurs after successful auth.
    setResponseStatus(event, 500);
    return { status: 'error', message: 'Missing server configuration for Strava.' };
  }

  let currentToken: StoredTokenData | null = null;
  let refreshed = false;

  try {
    // 1. Load current token state from KV
    currentToken = await kv.get<StoredTokenData>(KV_TOKEN_KEY);

    if (!currentToken) {
      currentToken = {
        accessToken: 'dummy',
        refreshToken: initialRefreshToken,
        expiresAt: 0,
      };
      console.log('No token found in KV, initializing with refresh token from env.');
    }

    const nowInSeconds = Date.now() / 1000;
    const needsRefresh = !currentToken.accessToken || currentToken.expiresAt < (nowInSeconds + 600);

    if (needsRefresh) {
      console.log('Strava token needs refresh...');
      const refreshResponse = await $fetch<StravaTokenResponse | StravaErrorResponse>('https://www.strava.com/oauth/token', {
        method: 'POST',
        body: {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: currentToken.refreshToken,
        },
        ignoreResponseError: true,
      });

      if (isStravaError(refreshResponse)) {
        throw new Error(`Strava refresh error: ${refreshResponse.message} - ${JSON.stringify(refreshResponse.errors)}`);
      }

      // Type assertion after checking for error
      const successfulRefreshResponse = refreshResponse as StravaTokenResponse;

      if (!successfulRefreshResponse.access_token) {
        throw new Error(`Strava refresh error: Invalid response received - ${JSON.stringify(refreshResponse)}`);
      }

      currentToken.accessToken = successfulRefreshResponse.access_token;
      currentToken.expiresAt = successfulRefreshResponse.expires_at;
      currentToken.refreshToken = successfulRefreshResponse.refresh_token;

      await kv.set(KV_TOKEN_KEY, currentToken);
      refreshed = true;
      console.log('Strava token refreshed and saved to KV.');
    } else {
      console.log('Strava token is still valid.');
    }

    const stravaStatsUrl = `https://www.strava.com/api/v3/athletes/${ownerId}/stats`;
    console.log(`Fetching stats from ${stravaStatsUrl}...`);

    const statsResponse = await $fetch<StravaAthleteStats | StravaErrorResponse>(stravaStatsUrl, {
      headers: {
        'Authorization': `Bearer ${currentToken.accessToken}`
      },
      ignoreResponseError: true,
    });

    if (isStravaError(statsResponse)) {
      if (statsResponse.message === 'Authorization Error') {
        console.warn('Strava authorization error fetching stats. Token might be invalid. Clearing stored token for next run.');
        await kv.del(KV_TOKEN_KEY);
        throw new Error(`Strava Stats Fetch Auth Error: ${statsResponse.message}`);
      }
      throw new Error(`Strava stats API error: ${statsResponse.message} - ${JSON.stringify(statsResponse.errors)}`);
    }

    // Type assertion after checking for error
    const statsData = statsResponse as StravaAthleteStats;

    // Add a basic check to ensure the expected data structure is present
    if (!statsData || !statsData.ytd_run_totals || !statsData.recent_run_totals || !statsData.all_run_totals) {
       throw new Error(`Strava stats API error: Invalid or incomplete run stats data received - ${JSON.stringify(statsData)}`);
    }

    const kvStatsKey = getKvStatsKey(ownerId);
    await kv.set(kvStatsKey, statsData);
    console.log(`Strava stats fetched and saved to KV key: ${kvStatsKey}`);

    // Return success
    setResponseStatus(event, 200); // Explicitly set success status
    return {
      status: 'success',
      refreshedToken: refreshed,
      statsFetched: true,
      timestamp: new Date().toISOString()
    };

  } catch (error: unknown) { // Use unknown for better type safety
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('CRON JOB FAILED (after auth): ', errorMessage);
    // Don't override 401 if it was set earlier due to auth failure
    if (event.node.res.statusCode !== 401) {
         setResponseStatus(event, 500); // Set 500 for internal errors after auth
    }
    return { status: 'error', message: errorMessage };
  }
}); 