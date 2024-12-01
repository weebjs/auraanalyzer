import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { error } from 'console';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    // Fetch user's Twitter page
    const response = await fetch(`https://twstalker.com/${username}`);
    const html = await response.text();
    
    // Parse HTML with Cheerio
    const $ = cheerio.load(html);
    
    // Extract tweets
    const tweets: string[] = [];
    $('.tweet-text').each((_, element) => {
      tweets.push($(element).text().trim());
    });

    // If no tweets found, return error
    if (tweets.length === 0) {
      return Response.json({ error:  }, { status: 404 });
    }

    // Generate advice using Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Based on these recent tweets from a Twitter user, please provide helpful life advice in a friendly tone. Here are their tweets: ${tweets.join('\n')}`;
    
    const result = await model.generateContent(prompt);
    const advice = result.response.text();

    return Response.json({ advice, tweets });
    
  } catch (error) {
    console.error('Error:', error);
    return Response.json({ error: 'Failed to generate advice' }, { status: 500 });
  }
}

