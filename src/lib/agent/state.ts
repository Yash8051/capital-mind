// ============================================================
// CapitalMind AI — LangGraph State Schema
// ============================================================
// Defines the shared state that flows through every node in the
// graph. Each field uses a last-write-wins reducer so that
// downstream nodes simply overwrite the value set by upstream ones.

import { Annotation } from "@langchain/langgraph";

/**
 * A single search result returned by Tavily.
 */
export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
}

/**
 * The shared state object passed between all three graph nodes:
 *   gatherData → analyze → decide
 */
export const ResearchState = Annotation.Root({
  // ── Input (set once at invocation) ─────────────────────────
  companyName: Annotation<string>({
    reducer: (_prev, next) => next,
  }),

  // ── gatherData output ─────────────────────────────────────
  searchResults: Annotation<SearchResult[]>({
    reducer: (_prev, next) => next,
  }),

  // ── analyze output ────────────────────────────────────────
  analysis: Annotation<string>({
    reducer: (_prev, next) => next,
  }),

  // ── decide outputs ────────────────────────────────────────
  decision: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  confidence: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  reasoning: Annotation<string>({
    reducer: (_prev, next) => next,
  }),
  keyRisks: Annotation<string[]>({
    reducer: (_prev, next) => next,
  }),
  keyStrengths: Annotation<string[]>({
    reducer: (_prev, next) => next,
  }),
});

/** TypeScript type for the state object. */
export type ResearchStateType = typeof ResearchState.State;
