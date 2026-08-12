/**
 * Client-side service for calling the AI Tutor API.
 */

import type { ExecutionStep } from '@/types/execution';

export interface TutorRequest {
  code: string;
  step: ExecutionStep | null;
  question: string;
}

export interface TutorResponse {
  response: string;
}

/**
 * Call the AI Tutor serverless function.
 *
 * In development (no /api route available), we use the Gemini API directly
 * from the client with a user-provided API key stored in localStorage.
 * In production (Vercel), we call /api/tutor which securely proxies the request.
 */
export async function askTutor(request: TutorRequest): Promise<string> {
  // Try the serverless function first (production on Vercel)
  try {
    const res = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });

    if (res.ok) {
      const data: TutorResponse = await res.json();
      return data.response;
    }

    // If the serverless function isn't available (e.g. local dev), fall back
    const errorData = await res.json().catch(() => null);
    if (res.status === 404) {
      // Serverless function not deployed — try client-side Gemini
      return await askTutorClientSide(request);
    }

    throw new Error(errorData?.error || `API error: ${res.status}`);
  } catch (err: any) {
    // Network error or serverless not available — try client-side
    if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
      return await askTutorClientSide(request);
    }
    throw err;
  }
}

/**
 * Fallback: Call Gemini API directly from the browser.
 * Requires the user to set their API key in localStorage.
 */
async function askTutorClientSide(request: TutorRequest): Promise<string> {
  const apiKey = localStorage.getItem('codepulse-gemini-key');

  if (!apiKey) {
    throw new Error(
      'NO_API_KEY: To use the AI Tutor in development mode, please enter your free Gemini API key. Get one at https://ai.google.dev'
    );
  }

  const { GoogleGenerativeAI } = await import('@google/generative-ai');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const prompt = `You are CodePulse AI Tutor, an expert DSA educator. Be concise (under 200 words), use markdown, and be encouraging.

## Code
\`\`\`javascript
${request.code || 'No code'}
\`\`\`

## Current Step
${request.step ? JSON.stringify(request.step, null, 2) : 'No step data'}

## Question
${request.question}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
