import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { image, cropType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert agricultural AI assistant specialized in crop disease detection. 
Analyze the provided crop image and return a JSON response with the following structure:
{
  "diseaseName": "Name of the disease or 'Healthy' if no disease detected",
  "confidence": 85,
  "severity": "low" | "medium" | "high" | "critical",
  "description": "Brief description of the disease",
  "symptoms": ["symptom1", "symptom2"],
  "treatment": ["treatment step 1", "treatment step 2"],
  "preventiveMeasures": ["prevention tip 1", "prevention tip 2"],
  "recommendedProducts": [
    {"name": "Product name", "type": "fertilizer" | "pesticide" | "fungicide", "dosage": "dosage info"}
  ]
}

The crop type is: ${cropType}. Provide realistic agricultural advice based on common diseases for this crop.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: `Analyze this ${cropType} crop image for diseases and provide treatment recommendations.` },
              { type: "image_url", image_url: { url: image } }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse the JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysisResult = JSON.parse(jsonMatch[0]);
      return new Response(JSON.stringify(analysisResult), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("Failed to parse AI response");
  } catch (error) {
    console.error("Analysis error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Analysis failed" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
