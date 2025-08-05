/*
import { GoogleGenAI } from '@google/genai';

export async function POST(req) {
  try {
    const { jobPosition, jobDescription, yearsOfExperience } = await req.json();

    const genAI = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-pro',
      generationConfig: { responseMimeType: 'text/plain' },
    });

    const prompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${yearsOfExperience}, Give me 5 interview questions with answers in JSON format with keys "question" and "answer".`;

    const result = await model.generateContentStream([prompt]);

    let fullText = '';
    for await (const chunk of result.stream) {
      if (chunk.text()) fullText += chunk.text();
    }

    // Optional: remove ```json or ``` if wrapped
    fullText = fullText.trim().replace(/^```json|```$/g, '');

    // Try parsing
    const parsed = JSON.parse(fullText);
    return Response.json(parsed);
  } catch (err) {
    console.error('Gemini API Error:', err);
    return new Response(JSON.stringify({ error: 'Failed to generate questions' }), {
      status: 500,
    });
  }
}
*/