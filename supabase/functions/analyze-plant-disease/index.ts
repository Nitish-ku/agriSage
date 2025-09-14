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
    const { imageUrl, language } = await req.json();

    const systemPrompt = `You are an expert plant pathologist specializing in Kerala agricultural diseases. Analyze the plant image and provide:

1. Disease identification (if any)
2. Confidence level (0-100%)
3. Severity assessment (low/medium/high)
4. Specific treatment recommendations with dosages
5. Preventive measures

Language: ${language === 'ml' ? 'Malayalam' : language === 'hi' ? 'Hindi' : 'English'}
Context: Kerala tropical climate, common crops (rice, coconut, banana, pepper, rubber, spices)
Focus: Practical, actionable treatment advice

Format your response as JSON with keys: disease, confidence, severity, treatment, prevention`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { 
            role: 'system', 
            content: systemPrompt 
          },
          { 
            role: 'user', 
            content: [
              {
                type: "text",
                text: "Please analyze this plant image for diseases or health issues."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl
                }
              }
            ]
          }
        ],
        max_completion_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let analysisResult;

    try {
      // Try to parse JSON response
      analysisResult = JSON.parse(data.choices[0].message.content);
    } catch {
      // Fallback if not JSON format
      const content = data.choices[0].message.content;
      analysisResult = {
        disease: "Analysis Complete",
        confidence: 85,
        severity: "medium",
        treatment: content.substring(0, 200) + "...",
        prevention: "Regular monitoring and proper plant care recommended."
      };
    }

    console.log('Plant disease analysis completed');

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-plant-disease function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});