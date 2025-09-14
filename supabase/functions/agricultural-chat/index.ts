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
    const { query, language } = await req.json();

    const systemPrompt = `You are an expert agricultural assistant specialized in Kerala farming practices. Provide practical, actionable advice for farmers about crops, pests, diseases, fertilizers, and farming techniques. Keep responses concise and helpful.

Language: ${language === 'ml' ? 'Malayalam' : language === 'hi' ? 'Hindi' : 'English'}
Context: Kerala agricultural practices, tropical climate, monsoon seasons
Focus: Practical solutions, specific recommendations, local context

Always include:
- Specific treatment recommendations with dosages
- Best timing for application
- Preventive measures
- Local availability considerations`;

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
          { role: 'user', content: query }
        ],
        max_completion_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Agricultural chat response generated successfully');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      confidence: Math.random() * 0.3 + 0.7 // Mock confidence between 0.7-1.0
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in agricultural-chat function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});