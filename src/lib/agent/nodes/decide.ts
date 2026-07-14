// ============================================================
// CapitalMind AI — decide Node
// ============================================================
// Third and final node in the graph. Takes the analysis text
// produced by the analyze node, sends it to Gemini with a prompt
// requesting a JSON verdict, and parses the structured output
// into the state fields: decision, confidence, reasoning,
// keyRisks, and keyStrengths.

import type { ResearchStateType } from "../state";
import { getLLM } from "@/lib/llm";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/** System prompt requesting a strict JSON verdict. */
const SYSTEM_PROMPT = `You are a senior investment committee member making a final recommendation.

Given an analysis of a company, output your verdict as a **single JSON object** with exactly these fields:

{
  "decision": "Invest" | "Pass" | "Watch",
  "confidence": "High" | "Medium" | "Low",
  "reasoning": "<1-2 paragraph explanation of your decision>",
  "keyRisks": ["<risk 1>", "<risk 2>", ...],
  "keyStrengths": ["<strength 1>", "<strength 2>", ...]
}

Rules:
- "Invest" = The company is a strong buy opportunity.
- "Pass" = Too many red flags; avoid for now.
- "Watch" = Interesting but wait for a better entry point or more data.
- Provide 3-5 items in keyRisks and keyStrengths each.
- Respond ONLY with the JSON object. No markdown fences, no explanation outside the JSON.`;

/**
 * decide node — produces the final investment verdict as structured JSON.
 */
export async function decide(
  state: ResearchStateType
): Promise<Partial<ResearchStateType>> {
  const llm = getLLM();

  const userPrompt = `Here is the full investment analysis for **${state.companyName}**:

${state.analysis}

Based on this analysis, provide your investment verdict as JSON.`;

  console.log(`[decide] Requesting verdict from Gemini...`);

  const response = await llm.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(userPrompt),
  ]);

  // Extract raw text
  const raw =
    typeof response.content === "string"
      ? response.content
      : String(response.content);

  // Strip markdown code fences if Gemini wraps the JSON
  const cleaned = raw
    .replace(/^```(?:json)?\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();

  // Parse the JSON verdict
  let verdict: {
    decision: string;
    confidence: string;
    reasoning: string;
    keyRisks: string[];
    keyStrengths: string[];
  };

  try {
    verdict = JSON.parse(cleaned);
  } catch {
    console.error("[decide] Failed to parse JSON:", cleaned.slice(0, 300));
    // Fallback: return a safe default so the graph doesn't crash
    verdict = {
      decision: "Watch",
      confidence: "Low",
      reasoning:
        "The model returned an unparseable response. Please try again.",
      keyRisks: ["Unable to parse model output"],
      keyStrengths: ["Analysis was generated but verdict parsing failed"],
    };
  }

  console.log(`[decide] Verdict: ${verdict.decision} (${verdict.confidence})`);

  return {
    decision: verdict.decision,
    confidence: verdict.confidence,
    reasoning: verdict.reasoning,
    keyRisks: verdict.keyRisks,
    keyStrengths: verdict.keyStrengths,
  };
}
