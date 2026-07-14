// ============================================================
// CapitalMind AI — Gemini 2.5 Pro Client
// ============================================================

import { ChatGoogle } from "@langchain/google";

let geminiInstance: ChatGoogle | null = null;

/**
 * Get or create the Gemini 2.5 Pro client singleton
 */
export function getGeminiClient(): ChatGoogle {
  if (!geminiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY is not set. Please add it to your .env.local file."
      );
    }

    geminiInstance = new ChatGoogle({
      model: "gemini-2.5-pro",
      apiKey,
      temperature: 0.3, // Lower temperature for more consistent analysis
      maxOutputTokens: 8192,
    });
  }

  return geminiInstance;
}

/**
 * Invoke Gemini with a system prompt and user message, expecting JSON output
 */
export async function invokeGeminiJSON<T>(
  systemPrompt: string,
  userMessage: string
): Promise<T> {
  const llm = getGeminiClient();

  const response = await llm.invoke([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `${userMessage}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no code fences, no explanations. Just the raw JSON object.`,
    },
  ]);

  const text =
    typeof response.content === "string"
      ? response.content
      : Array.isArray(response.content)
        ? response.content
            .filter((c) => typeof c === "object" && "text" in c)
            .map((c) => (c as { text: string }).text)
            .join("")
        : String(response.content);

  // Strip potential markdown code fences
  const cleaned = text
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    console.error("Failed to parse Gemini response as JSON:", cleaned.slice(0, 500));
    throw new Error("Gemini returned invalid JSON. Please try again.");
  }
}
