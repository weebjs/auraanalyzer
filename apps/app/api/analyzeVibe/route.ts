import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  const { userData } = await request.json();

  if (!userData) {
    return NextResponse.json({ error: 'User data is required' }, { status: 400 });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const followRatio = userData.public_metrics.followers_count > 0
      ? (userData.public_metrics.following_count / userData.public_metrics.followers_count).toFixed(2)
      : 'N/A';

    const prompt = `hey take a look at this profile from x.com:
- **username:** ${userData.username}
- **description:** ${userData.description || 'no description provided'}
- **followers:** ${userData.public_metrics.followers_count}
- **following:** ${userData.public_metrics.following_count}
- **tweet count:** ${userData.public_metrics.tweet_count}
- **follow ratio:** ${followRatio}
- **account age (days):** ${userData.account_age_days}
- **tweets per day:** ${userData.tweets_per_day}

Now, talk about how big of the user's aura is (whatever that means). Keep it casual, friendly, funny, short, relatable and no need to think too much about the stats, or numbers. just make sure it fun! do NOT assume anything about the user, make sure it's related to their activites and maybe roast them a bit, keep it short! respond in lower case. Also no need to mention the account stats! Make sure it's clear how much aura the user has (show the percentage)... if there aura is low, then say its low! Keep it short but not too short. Instead of "they" respond with "you" also do it based on there posts
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing vibe:', error);
    return NextResponse.json({ error: 'Error analyzing vibe' }, { status: 500 });
  }
}