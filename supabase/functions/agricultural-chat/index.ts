import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

// Get the API key from environment variables
const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language } = await req.json();

    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables.");
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an expert agricultural assistant specialized in Kerala farming practices. Provide practical, actionable advice for farmers about crops, pests, diseases, fertilizers, and farming techniques. Keep responses concise and helpful.

Language: ${language === 'ml' ? 'Malayalam' : language === 'hi' ? 'Hindi' : 'English'}
Context: Kerala agricultural practices, tropical climate, monsoon seasons
Focus: Practical solutions, specific recommendations, local context

Always include:
- Specific treatment recommendations with dosages
- Best timing for application
- Preventive measures
- Local availability considerations`;

    const prompt = `${systemPrompt}\n\nUser query: ${query}`;

    const result = await model.generateContentStream(prompt);

    // Create a ReadableStream to send the response
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Error in agricultural-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
