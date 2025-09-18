import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";
import { Buffer } from "https://deno.land/std@0.168.0/io/buffer.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to fetch image and convert to base64
async function urlToGenerativePart(url: string, mimeType: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const buffer = await response.arrayBuffer();
  const base64 = new Buffer(buffer).toString("base64");
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) throw new Error("imageUrl is required.");
    if (!geminiApiKey) throw new Error("GEMINI_API_KEY is not set.");

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart = await urlToGenerativePart(imageUrl, "image/jpeg"); // Assuming jpeg, adjust if needed

    const prompt = `You are an expert plant pathologist specializing in Kerala agricultural diseases. Analyze the provided plant image in detail and provide a comprehensive report.

1.  **Identification:** Identify the plant and any visible diseases, pests, or nutrient deficiencies.
2.  **Confidence Level:** State your confidence in this diagnosis (e.g., High, Medium, Low).
3.  **Severity Assessment:** Assess the severity of the issue (e.g., Low, Medium, High, Critical).
4.  **Detailed Treatment Plan:** Provide specific, actionable treatment recommendations with dosages (e.g., Neem oil 5ml/liter water). Mention both organic and chemical options if applicable. Include brand names if common in Kerala.
5.  **Preventive Measures:** List steps the farmer can take to prevent this issue in the future.

Focus on practical, locally relevant advice for a farmer in Kerala, India.`;

    const result = await model.generateContentStream([prompt, imagePart]);

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
    console.error('Error in analyze-plant-disease function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
