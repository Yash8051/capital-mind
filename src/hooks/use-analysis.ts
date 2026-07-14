// ============================================================
// CapitalMind AI — Analysis SSE Streaming Hook
// ============================================================

"use client";

import { useState, useCallback, useRef } from "react";
import type { AnalysisState, AgentProgress, AgentName } from "@/types";

const INITIAL_STATE: AnalysisState = {
  companyName: "",
  ticker: "",
  status: "idle",
  progress: [],
  companyResearch: null,
  financialAnalysis: null,
  newsSentiment: null,
  competitorAnalysis: null,
  riskAssessment: null,
  investmentDecision: null,
  error: null,
  rawQuote: null,
};

export function useAnalysis() {
  const [state, setState] = useState<AnalysisState>(INITIAL_STATE);
  const abortRef = useRef<AbortController | null>(null);

  const analyze = useCallback(async (companyName: string) => {
    // Abort any existing analysis
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const abortController = new AbortController();
    abortRef.current = abortController;

    // Reset state
    setState({
      ...INITIAL_STATE,
      companyName,
      status: "analyzing",
    });

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Process complete SSE messages
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || ""; // Keep incomplete message in buffer

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          try {
            const event = JSON.parse(line.slice(6));

            switch (event.type) {
              case "agent_start":
                setState((prev) => ({
                  ...prev,
                  progress: [
                    ...prev.progress,
                    {
                      agent: event.data.agent as AgentName,
                      status: "running",
                      message: event.data.message,
                      timestamp: event.timestamp,
                    } as AgentProgress,
                  ],
                }));
                break;

              case "agent_complete":
                setState((prev) => ({
                  ...prev,
                  progress: prev.progress.map((p) =>
                    p.agent === event.data.agent
                      ? { ...p, status: "complete" as const, message: event.data.message }
                      : p
                  ),
                }));
                break;

              case "agent_error":
                setState((prev) => ({
                  ...prev,
                  progress: prev.progress.map((p) =>
                    p.agent === event.data.agent
                      ? { ...p, status: "error" as const, message: event.data.message }
                      : p
                  ),
                }));
                break;

              case "progress":
                setState((prev) => ({
                  ...prev,
                  progress: [
                    ...prev.progress.filter(
                      (p) =>
                        !(
                          p.agent === event.data.agent &&
                          p.status === "running"
                        )
                    ),
                    event.data as AgentProgress,
                  ],
                }));
                break;

              case "partial_result":
                setState((prev) => ({
                  ...prev,
                  [event.data.type]: event.data.data,
                }));
                break;

              case "final_result":
                setState((prev) => ({
                  ...prev,
                  ...event.data,
                  status: "complete",
                }));
                break;

              case "error":
                setState((prev) => ({
                  ...prev,
                  status: "error",
                  error: event.data.message,
                }));
                break;
            }
          } catch {
            // Skip malformed events
          }
        }
      }
    } catch (error) {
      if ((error as Error).name === "AbortError") return;

      setState((prev) => ({
        ...prev,
        status: "error",
        error: error instanceof Error ? error.message : "Analysis failed",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setState(INITIAL_STATE);
  }, []);

  return { state, analyze, reset };
}
