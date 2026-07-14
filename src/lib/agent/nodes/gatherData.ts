// ============================================================
// CapitalMind AI — gatherData Node
// ============================================================
// First node in the graph. Calls the Tavily search API with a
// query built from the company name, then stores the top search
// results in the shared state for the analyze node to consume.

import type { ResearchStateType } from "../state";
import { tavilySearch } from "../tools/tavilySearch";

/**
 * gatherData node — searches the web for company intel.
 *
 * Query template:
 *   "{companyName} financials news risks competitors 2026"
 *
 * This cast a wide net to surface financial data, recent headlines,
 * competitive landscape, and forward-looking risks in a single query.
 */
export async function gatherData(
  state: ResearchStateType
): Promise<Partial<ResearchStateType>> {
  const query = `${state.companyName} financials news risks competitors 2026`;

  console.log(`[gatherData] Searching: "${query}"`);

  const searchResults = await tavilySearch(query, 7);

  console.log(`[gatherData] Found ${searchResults.length} results`);

  return { searchResults };
}
