import { defineEventHandler } from 'h3';
import { kv } from '@vercel/kv';
import type { StravaAthleteStats } from '~/types/strava';

// Key for storing stats data in KV
const getKvStatsKey = (ownerId: string) => `strava:stats:${ownerId}`;

export default defineEventHandler(async (event) => {
  const ownerId = process.env.MY_STRAVA_OWNER_ID;

  if (!ownerId) {
    console.error('ERROR fetching cached stats: Missing MY_STRAVA_OWNER_ID env var.');
    event.node.res.statusCode = 500;
    return { error: 'Server configuration error.' };
  }

  const kvStatsKey = getKvStatsKey(ownerId);

  try {
    const statsData = await kv.get<StravaAthleteStats>(kvStatsKey);

    if (!statsData) {
      console.warn(`No cached Strava stats found in KV for key: ${kvStatsKey}`);
      event.node.res.statusCode = 404;
      // Return a specific structure for the frontend to handle gracefully
      return { error: 'No cached Strava stats found.', data: null }; 
    }

    // Successfully retrieved data from KV
    return statsData; // Return the cached object directly

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown KV error';
    console.error(`Error fetching cached Strava stats from KV for key ${kvStatsKey}:`, errorMessage);
    event.node.res.statusCode = 500;
    return { error: 'Failed to retrieve cached stats due to a server error.' };
  }
}); 