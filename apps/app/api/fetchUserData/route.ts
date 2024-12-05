import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

const cache = new Map();
const CACHE_DURATION = 15 * 60 * 1000;

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username') || 'Guest'; // Default to "Guest" if no name is provided

    if (!username) {
        return NextResponse.json({ error: 'Username is required' }, { status: 404 });
    }

    const bearerToken = "AAAAAAAAAAAAAAAAAAAAALDYtAEAAAAA7EwsW3KAbXl7hHZPoo4izy2BU%2BE%3DOXEGviURs4Zut4Wfd8o7doyPgRfy9Pdb7q3RuU27erayly7cCY";

    if (!bearerToken) {
        return NextResponse.json({ error: 'Twitter API credentials are not configured' }, { status: 500 });
    }

    const cachedData = cache.get(username);
    if (cachedData && (Date.now() - cachedData.timestamp < CACHE_DURATION)) {
        return NextResponse.json(cachedData.data);
    }

    try {
        const response = await axios.get(
            `https://api.twitter.com/2/users/by/username/${username}`,
            {
                params: {
                    'user.fields': 'description,public_metrics,profile_image_url,created_at,location,verified,url,entities',
                },
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'User-Agent': 'VibeCheckerApp'
                }
            }
        );

        if (response.data.errors) {
            return NextResponse.json({ error: 'User not found or API error' }, { status: 422 });
        }

        const userData = response.data.data;

        const followRatio = userData.public_metrics.followers_count > 0
            ? (userData.public_metrics.following_count / userData.public_metrics.followers_count).toFixed(2)
            : 0;


        const accountAge = Math.floor((Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24));
        const tweetsPerDay = (userData.public_metrics.tweet_count / accountAge).toFixed(2);

        const enrichedUserData = {
            ...userData,
            follow_ratio: followRatio,
            account_age_days: accountAge,
            tweets_per_day: tweetsPerDay,
        };

        cache.set(username, { data: enrichedUserData, timestamp: Date.now() });
        return NextResponse.json(enrichedUserData);

    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Unable to process' }, { status: 500 });
    }
}