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
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set.");
    }

    const { crop, temperature, humidity, pH, season, location, language } = await req.json();

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const langMap = {
      ml: 'Malayalam',
      hi: 'Hindi',
      en: 'English'
    };

    const prompt = `
      You are an expert agricultural risk analyst specializing in farming in Kerala, India.
      Analyze the provided crop and environmental conditions to predict farming risks and provide actionable recommendations.

      **Input Parameters:**
      - Crop: ${crop}
      - Location: ${location}, Kerala
      - Season: ${season}
      - Temperature: ${temperature}°C
      - Humidity: ${humidity}%
      - Soil pH Level: ${pH}

      **Analysis Language:** ${langMap[language] || 'English'}

      **Task:**
      Based on the input parameters and the specific context of Kerala's climate, common pests, and soil types, provide a detailed risk analysis.

      **Output Format:**
      Your response MUST be a single, valid JSON object. Do not include any text or markdown formatting (like \
```json\
) before or after the JSON object.
      The JSON object must have the following structure:
      {
        "overallRisk": "<low|medium|high>",
        "weatherRisk": "<low|medium|high>",
        "diseaseRisk": "<low|medium|high>",
        "soilRisk": "<low|medium|high>",
        "recommendations": [
          "<string>",
          "<string>",
          "..."
        ],
        "confidence": <number between 0 and 100>
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // More robustly find and parse the JSON from the model's response
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      throw new Error("AI response did not contain valid JSON. Response: " + text);
    }
    const jsonString = match[0];
    const riskResult = JSON.parse(jsonString);

    console.log('Crop risk prediction completed');

    return new Response(JSON.stringify(riskResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in predict-crop-risk function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});