// Follow the Deno deploy pattern for Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// This is a placeholder for a real LaTeX compilation service
// In a production environment, you would integrate with a LaTeX compilation API
// or set up a Docker container with a LaTeX distribution
async function compileLaTeX(latexContent: string): Promise<Uint8Array> {
  try {
    // In a real implementation, you would:
    // 1. Send the LaTeX content to a compilation service
    // 2. Wait for the compiled PDF
    // 3. Return the PDF as a binary buffer
    
    // For this demo, we'll use a placeholder PDF
    // This would be replaced with actual compilation logic
    
    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a placeholder PDF (this is just a minimal valid PDF structure)
    // In production, this would be the actual compiled PDF
    const placeholderPdf = new TextEncoder().encode(
      "%PDF-1.4\n" +
      "1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n" +
      "2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n" +
      "3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\n" +
      "xref\n" +
      "0 4\n" +
      "0000000000 65535 f\n" +
      "0000000009 00000 n\n" +
      "0000000052 00000 n\n" +
      "0000000101 00000 n\n" +
      "trailer<</Size 4/Root 1 0 R>>\n" +
      "startxref\n" +
      "178\n" +
      "%%EOF"
    );
    
    return placeholderPdf;
  } catch (error) {
    console.error("LaTeX compilation error:", error);
    throw new Error(`Failed to compile LaTeX: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
  
  try {
    // Parse request body
    const requestData = await req.json();
    const { latexContent } = requestData;
    
    if (!latexContent) {
      return new Response(JSON.stringify({ error: "LaTeX content is required" }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }
    
    // Compile LaTeX to PDF
    const pdfBuffer = await compileLaTeX(latexContent);
    
    // Return the compiled PDF
    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  }
});