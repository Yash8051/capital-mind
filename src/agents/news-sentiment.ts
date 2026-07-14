// ============================================================
// CapitalMind AI — News Sentiment Agent
// ============================================================

import type { CapitalMindStateType } from "./state";
import { invokeGeminiJSON } from "@/services/gemini";
import { NEWS_SENTIMENT_PROMPT } from "@/lib/prompts";
import type { NewsSentimentResult } from "@/types";

/**
 * News Sentiment Agent
 *
 * Analyzes recent news articles for sentiment, classifies them,
 * and determines overall market sentiment for the company.
 */
export async function newsSentimentAgent(
  state: CapitalMindStateType
): Promise<Partial<CapitalMindStateType>> {
  const progress = [
    {
      agent: "news-sentiment" as const,
      status: "running" as const,
      message: `Analyzing news sentiment for ${state.companyName}...`,
      timestamp: Date.now(),
    },
  ];

  try {
    const userMessage = `
Analyze news sentiment for:
Company: ${state.companyName}
Ticker: ${state.ticker}

Recent news articles:
${state.newsDataContext || "No recent news articles available from the API. Use your knowledge of recent major news about this company (from the last 3-6 months). Create realistic news entries based on known events."}

Analyze the sentiment of each article and provide an overall sentiment assessment.
If no real articles are provided, generate 6-8 realistic recent news items based on known events about this company.
`;

    const result = await invokeGeminiJSON<NewsSentimentResult>(
      NEWS_SENTIMENT_PROMPT,
      userMessage
    );

    return {
      newsSentiment: result,
      agentProgress: [
        ...progress,
        {
          agent: "news-sentiment" as const,
          status: "complete" as const,
          message: `Sentiment analysis complete. Overall: ${result.overallSentiment} (${result.sentimentScore}/100)`,
          timestamp: Date.now(),
        },
      ],
      errors: [],
    };
  } catch (error) {
    return {
      agentProgress: [
        ...progress,
        {
          agent: "news-sentiment" as const,
          status: "error" as const,
          message: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
          timestamp: Date.now(),
        },
      ],
      errors: [`News Sentiment: ${error instanceof Error ? error.message : "Unknown"}`],
    };
  }
}
