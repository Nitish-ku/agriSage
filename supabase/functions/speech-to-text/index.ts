import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioDataUrl } = await req.json();
    if (!audioDataUrl) throw new Error("audioDataUrl is required.");
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not set.");

    const match = audioDataUrl.match(/^data:(audio\/.+);base64,(.+)$/);
    if (!match) {
      throw new Error("Invalid audio data URL format.");
    }
    const mimeType = match[1];
    const base64Data = match[2];

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const audioPart = {
      inlineData: {
        data: base64Data,
        mimeType,
      },
    };

    const prompt = "Transcribe the following audio recording accurately.";

    const result = await model.generateContent([prompt, audioPart]);
    const response = await result.response;
    const transcript = response.text();

    return new Response(JSON.stringify({ transcript }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in speech-to-text function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
