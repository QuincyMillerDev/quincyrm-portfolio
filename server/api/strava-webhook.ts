// server/api/strava-webhook.ts
import { defineEventHandler, getQuery, type H3Event } from "h3";

// TODO: Learn more about how this works, create the token
const STRAVA_VERIFY_TOKEN = process.env.STRAVA_VERIFY_TOKEN;

interface StravaWebhookEventPayload {
    object_type: 'activity' | 'athlete',
    aspect_type: 'create' | 'update' | 'delete';
    object_id: number,
    updates: {
        title?: string,
        type?: string,
        private?: 'true' | 'false', // Note: Strava doc says "true" or "false" as strings
        authorized?: 'false'; // For app deauthorization
    },
    owner_id: number,
    subscription_id: number,
    event_time: number,
}

async function processStravaEvent(eventData: StravaWebhookEventPayload) {
    console.log('Processing Strava webhook event', eventData);

    const { object_type, aspect_type, object_id, owner_id, updates } = eventData;

    if (object_type === 'activity') {
        if (aspect_type === 'create') {
            console.log('New activity created, ID:', object_id);
            // TODO:
            // 1. Retrieve the athlete's Strava access_token (you should have stored this
            //    during the OAuth flow when they authorized your app). Use owner_id to find it.
            // 2. With the access_token, make an API call to Strava to fetch the full details
            //    of this new activity: GET https://www.strava.com/api/v3/activities/${object_id}
            // 3. Store these activity details in your application's database, linked to the owner_id.
            // 4. Optionally, notify your frontend or trigger other application logic.
            // Example:
            // const accessToken = await getAccessTokenForOwner(owner_id);
            // if (accessToken) {
            //   const activityDetails = await fetchStravaActivityDetails(object_id, accessToken);
            //   await saveActivityToDatabase(owner_id, activityDetails);
            // }
        } else if (aspect_type === 'update') {
            console.log(`Activity updated. Activity ID: ${object_id}, Owner ID: ${owner_id}, Updates:`, updates);
            // TODO:
            // 1. Retrieve athlete's access_token.
            // 2. Depending on the 'updates' field, you might need to fetch the full activity
            //    or parts of it if the webhook doesn't provide all necessary info.
            //    For 'title' or 'type' updates, the webhook gives you the new value.
            //    For 'private' updates, you might want to re-fetch to confirm current visibility.
            // 3. Update the activity in your database.
        } else {
            console.log(`Activity deleted. Activity ID: ${object_id}, Owner ID: ${owner_id}`);
            // TODO: figure out what do here
        }

    }
}

export default defineEventHandler(async (event: H3Event) => {
    const httpMethod = event.node.req.method;

    if (httpMethod == 'GET') {
        console.log('Received GET request for Strava webhook');
        const query = getQuery(event);
        const hubMode = query['hub.mode'];
        const hubChallenge = query['hub.challenge'] as string;
        const hubVerifyToken = query['hub.verify_token'];

        if (hubMode === 'subscribe' && hubVerifyToken == STRAVA_VERIFY_TOKEN) {
            console.log('[WEBHOOK] strava webhook challenge validated');
            event.node.res.statusCode = 200;
            event.node.res.setHeader('Content-Type', 'application/json');
            return { 'hub.challenge': hubChallenge };
        } else {
            console.error('[WEBHOOK] strava webhook challenge failed');
            console.log('[WEBHOOK] hub.mode:', hubMode);
            event.node.res.statusCode = 403;
            return { error: 'Invalid hub.mode or hub.verify_token' };
        }
    } else if (httpMethod === 'POST') {
        console.log('[WEBHOOK] strava webhook received');
        try {
            const payload = await readBody<StravaWebhookEventPayload>(event);
            console.log('[WEBHOOK] strava webhook payload:', payload);
            event.node.res.statusCode = 200;
            event.node.res.setHeader('Content-Type', 'application/json');
            setImmediate(() => processStravaEvent(payload).catch(error => {
                console.error('[WEBHOOK] strava webhook error:', error);
            }));

            return { message: '[WEBHOOK] strava webhook received event, started processing' };
        } catch (error) {
            console.error('[WEBHOOK] strava webhook error:', error);
            event.node.res.statusCode = 300;
            return { error: 'Error processing strava webhook' };
        }
    } else {
        console.error('[WEBHOOK] strava webhook received invalid HTTP method:', httpMethod);
        event.node.res.statusCode = 405;
        return { error: 'Invalid HTTP method' };
    }
})