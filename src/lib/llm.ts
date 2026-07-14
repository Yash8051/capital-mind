// ============================================================
// CapitalMind AI — LLM Client (Gemini via LangChain)
// ============================================================
// Initializes a ChatGoogleGenerativeAI instance once and exports
// it for reuse across all agent nodes. Reads the API key from
// the GOOGLE_API_KEY environment variable (set in .env.local).

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

let llmInstance: ChatGoogleGenerativeAI | null = null;

/**
 * Returns (or creates) the singleton Gemini LLM client.
 *
 * Model choice: gemini-2.0-flash — fast inference, low cost, and
 * good enough for structured analysis + JSON output. Swap to
 * "gemini-1.5-pro" if you need higher reasoning quality.
 */
export function getLLM(): ChatGoogleGenerativeAI {
  if (!llmInstance) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GOOGLE_API_KEY is not set. Add it to your .env.local file."
      );
    }

    llmInstance = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey,
      temperature: 0.3, // Low temperature → more deterministic output
      maxOutputTokens: 4096,
    });
  }

  return llmInstance;
}
