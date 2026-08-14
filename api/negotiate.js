export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  // If API key is missing on Vercel, return a safe simulated response
  if (!apiKey) {
    return res.status(200).json({ 
      text: "[SentinelAI Agent]: System incident response active. File execution halted based on entropy analysis." 
    });
  }

  const { fileName, entropy, threshold, history } = req.body || {};

  if (!fileName || typeof entropy !== "number") {
    return res.status(400).json({ error: "fileName and entropy are required" });
  }

  const systemPrompt = `You are an AI incident-response negotiation assistant embedded in a security dashboard demo (SentinelAI-X). A file named "${fileName}" was flagged with Shannon entropy ${entropy} bits/byte (threshold: ${threshold}). Roleplay as the defensive AI agent responding to a simulated ransomware negotiation scenario. Stay in character as a calm, strategic incident-response negotiator. Keep responses to 2-4 sentences. This is a fictional training/demo scenario, not a real incident.`;

  const messages = (history || [])
    .filter((h) => h.sender === "Attacker Note" || h.sender === "Llama 3 AI" || h.sender === "You")
    .map((h) => ({
      role: h.sender === "Llama 3 AI" ? "assistant" : "user",
      content: h.text
    }));

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307", // Correct model ID with lower token usage
        max_tokens: 300,
        system: systemPrompt,
        messages: messages.length ? messages : [{ role: "user", content: "Begin the negotiation response." }]
      })
    });

    if (!response.ok) {
      // Handles low credit or API errors gracefully with a fallback negotiation response
      return res.status(200).json({
        text: `[SentinelAI Agent]: Threat payload detected for ${fileName} (Entropy: ${entropy}). Automated countermeasures enabled and perimeter secured.`
      });
    }

    const data = await response.json();
    const text = data.content?.map((c) => c.text || "").join("\n") || "(no response)";
    return res.status(200).json({ text });
  } catch (err) {
    // Return fallback on network/server errors
    return res.status(200).json({
      text: `[SentinelAI Agent]: Connection disrupted. Enforcing local quarantine policy on target process.`
    });
  }
}