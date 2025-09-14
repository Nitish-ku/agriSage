import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { crop, temperature, humidity, pH, season, location, language } = await req.json();

    const systemPrompt = `You are an expert agricultural risk analyst for Kerala farming. Analyze the provided crop and environmental conditions to predict farming risks and provide recommendations.

Parameters:
- Crop: ${crop}
- Temperature: ${temperature}°C
- Humidity: ${humidity}%
- pH Level: ${pH}
- Season: ${season}
- Location: ${location}

Language: ${language === 'ml' ? 'Malayalam' : language === 'hi' ? 'Hindi' : 'English'}
Context: Kerala climate, monsoon patterns, local pests and diseases

Provide risk assessment for:
1. Overall risk level (low/medium/high)
2. Weather-related risks
3. Disease susceptibility 
4. Soil condition risks
5. Specific actionable recommendations

Format as JSON with keys: overallRisk, weatherRisk, diseaseRisk, soilRisk, recommendations (array), confidence`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze risk factors for ${crop} cultivation with the given environmental conditions.` }
        ],
        max_completion_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let riskResult;

    try {
      // Try to parse JSON response
      riskResult = JSON.parse(data.choices[0].message.content);
    } catch {
      // Fallback if not JSON format
      const content = data.choices[0].message.content;
      riskResult = {
        overallRisk: "medium",
        weatherRisk: "medium", 
        diseaseRisk: "medium",
        soilRisk: "medium",
        recommendations: [content.substring(0, 100) + "..."],
        confidence: 75
      };
    }

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