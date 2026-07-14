// ============================================================
// CapitalMind AI — analyze Node
// ============================================================
// Second node in the graph. Takes the raw search results gathered
// by gatherData, sends them to Gemini with a structured prompt,
// and produces a comprehensive text analysis covering five areas:
//   1. Business model
//   2. Financial health
//   3. Market position & competition
//   4. Key risks
//   5. Recent news sentiment

import type { ResearchStateType } from "../state";
import { getLLM } from "@/lib/llm";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

/** System prompt that instructs Gemini to act as a senior analyst. */
const SYSTEM_PROMPT = `You are a senior investment research analyst. Given a set of web search results about a company, produce a structured analysis covering exactly these five sections:

1. **Business Model** — What the company does, how it makes money, key revenue streams.
2. **Financial Health** — Revenue trends, profitability, debt levels, cash flow signals from the data.
3. **Market Position & Competition** — Where it stands vs. competitors, market share, competitive moats or vulnerabilities.
4. **Key Risks** — Regulatory, market, financial, operational, and competitive risks.
5. **Recent News Sentiment** — Overall tone of recent news, notable headlines, and their potential impact on the stock.

Write clearly and concisely. Use the evidence from the search results. If data is thin for a section, say so rather than speculating. Do NOT output JSON — output plain text with the five numbered section headers.`;

/**
 * analyze node — synthesizes search results into a structured analysis.
 */
export async function analyze(
  state: ResearchStateType
): Promise<Partial<ResearchStateType>> {
  const llm = getLLM();

  // Format search results into a readable context block
  const context = state.searchResults
    .map(
      (r, i) =>
        `[${i + 1}] ${r.title}\n    ${r.snippet}\n    Source: ${r.url}`
    )
    .join("\n\n");

  const userPrompt = `Analyze the following company: **${state.companyName}**

Here are the web search results to base your analysis on:

${context}

Produce your five-section analysis now.`;

  console.log(`[analyze] Sending ${state.searchResults.length} results to Gemini...`);

  const response = await llm.invoke([
    new SystemMessage(SYSTEM_PROMPT),
    new HumanMessage(userPrompt),
  ]);

  // Extract text content from the response
  const analysis =
    typeof response.content === "string"
      ? response.content
      : String(response.content);

  console.log(`[analyze] Analysis complete (${analysis.length} chars)`);

  return { analysis };
}
