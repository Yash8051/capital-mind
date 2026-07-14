// ============================================================
// CapitalMind AI — Tavily Search Tool
// ============================================================
// Wraps the Tavily REST API to perform web searches. Returns a
// simplified array of { title, snippet, url } objects that the
// gatherData node feeds into the shared state.

import type { SearchResult } from "../state";

/** Raw shape of each result from the Tavily API response. */
interface TavilyResult {
  title: string;
  content: string; // Tavily calls the snippet "content"
  url: string;
}

/**
 * Search the web via Tavily and return the top results.
 *
 * @param query - The search query string.
 * @param maxResults - Maximum number of results to return (default 5).
 * @returns An array of SearchResult objects.
 */
export async function tavilySearch(
  query: string,
  maxResults = 5
): Promise<SearchResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TAVILY_API_KEY is not set. Add it to your .env.local file."
    );
  }

  // Tavily REST endpoint
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: maxResults,
      include_answer: false,
      search_depth: "basic",
    }),
    // Abort if the request takes longer than 15 seconds
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "unknown error");
    throw new Error(`Tavily API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();

  // Map Tavily's response shape to our SearchResult interface
  const results: SearchResult[] = (data.results || [])
    .slice(0, maxResults)
    .map((r: TavilyResult) => ({
      title: r.title,
      snippet: r.content,
      url: r.url,
    }));

  return results;
}
