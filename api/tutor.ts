/**
 * Vercel Serverless Function — AI Tutor powered by Google Gemini.
 *
 * POST /api/tutor
 * Body: { code: string, step: object, question: string }
 * Returns: { response: string }
 *
 * The GEMINI_API_KEY env var must be set in Vercel project settings.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `You are CodePulse AI Tutor, an expert computer science educator specializing in Data Structures and Algorithms (DSA).

Your role:
- Explain code execution steps clearly and concisely
- Use analogies and real-world examples
- Guide students toward understanding, don't just give answers
- When explaining complexity, show WHY not just WHAT
- Use simple language appropriate for CS students
- Format responses with markdown: use **bold** for key terms, \`code\` for variables
- Keep responses under 200 words unless the student asks for a deep dive
- Be encouraging and supportive

You will receive the student's code, the current execution state, and their question.`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key not configured. Set GEMINI_API_KEY in Vercel environment variables.' });
  }

  const { code, step, question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question is required.' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const userMessage = `
## Student's Code
\`\`\`javascript
${code || 'No code provided'}
\`\`\`

## Current Execution Step
${step ? JSON.stringify(step, null, 2) : 'No step data available'}

## Student's Question
${question}
`;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: 'You are an AI DSA tutor. Follow these instructions: ' + SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood! I\'m CodePulse AI Tutor, ready to help you understand Data Structures and Algorithms step by step. What would you like to learn?' }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return res.status(200).json({ response });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to get response from AI tutor.',
    });
  }
}
