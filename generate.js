// ============================================================
//  api/generate.js — Vercel Serverless Function
//
//  PURPOSE:
//    Acts as a secure proxy between the React frontend and
//    the Anthropic API. The API key lives here (server-side)
//    in an environment variable — it is NEVER sent to the browser.
//
//  HOW IT WORKS:
//    1. Frontend calls POST /api/generate with { prompt }
//    2. This function reads ANTHROPIC_API_KEY from env vars
//    3. Forwards the request to Anthropic's /v1/messages
//    4. Returns the response JSON to the frontend
//
//  SECURITY:
//    - API key only exists in Vercel environment variables
//    - CORS is handled by Vercel automatically for same-origin
//    - Only POST requests are accepted
// ============================================================

export default async function handler(req, res) {

  // ── Only allow POST requests ────────────────────────────────
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  // ── Extract prompt from request body ───────────────────────
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid prompt in request body." });
  }

  // ── Read API key from environment variable ──────────────────
  // Set this in Vercel Dashboard → Project → Settings → Environment Variables
  // Variable name: ANTHROPIC_API_KEY
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY environment variable is not set.");
    return res.status(500).json({ error: "Server configuration error: API key missing." });
  }

  // ── Call Anthropic Claude API ───────────────────────────────
  try {
    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,                // 🔐 injected from env var
        "anthropic-version": "2023-06-01",          // required by Anthropic API
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",     // use latest Sonnet model
        max_tokens: 1500,                           // enough for a full policy doc
        messages: [
          { role: "user", content: prompt }
        ],
      }),
    });

    // ── Handle Anthropic API errors ─────────────────────────
    if (!anthropicResponse.ok) {
      const errBody = await anthropicResponse.text();
      console.error("Anthropic API error:", anthropicResponse.status, errBody);
      return res.status(anthropicResponse.status).json({
        error: `Anthropic API error: ${anthropicResponse.status}`,
      });
    }

    // ── Return the response to the frontend ─────────────────
    const data = await anthropicResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    // Network or parsing error
    console.error("Proxy error:", error);
    return res.status(500).json({ error: "Internal server error. Please try again." });
  }
}
