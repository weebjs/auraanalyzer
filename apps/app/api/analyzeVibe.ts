import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  const { userData } = req.body;

  if (!userData) {
    return res.status(400).json({ error: 'User data is required' });
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

based on this user, give them life or self advice about this user.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ analysis: text });
  } catch (error) {
    console.error('Error analyzing vibe:', error);
    res.status(500).json({ error: 'Error analyzing vibe' });
  }
}
