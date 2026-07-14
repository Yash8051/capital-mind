// ============================================================
// CapitalMind AI — News Feed + Sentiment
// ============================================================

"use client";

import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import { formatDate, getSentimentColor } from "@/lib/utils";
import { SentimentPieChart } from "@/components/charts/sentiment-pie";
import type { NewsSentimentResult } from "@/types";

interface NewsFeedProps {
  data: NewsSentimentResult;
}

export function NewsFeed({ data }: NewsFeedProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          News Sentiment
        </h3>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${getSentimentColor(data.overallSentiment)} ${
            data.overallSentiment === "positive"
              ? "bg-emerald-100 dark:bg-emerald-900/30"
              : data.overallSentiment === "negative"
                ? "bg-rose-100 dark:bg-rose-900/30"
                : "bg-slate-100 dark:bg-slate-800"
          }`}
        >
          {data.overallSentiment}
        </span>
      </div>

      {/* Chart + Major Impacts */}
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="flex items-center justify-center">
          <SentimentPieChart distribution={data.sentimentDistribution} />
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
            Major Impacts
          </p>
          <ul className="space-y-2">
            {data.majorImpacts.slice(0, 4).map((impact, i) => (
              <li
                key={i}
                className="text-sm leading-relaxed text-slate-600 dark:text-slate-400"
              >
                • {impact}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Article List */}
      <div className="mt-6 space-y-3">
        <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
          Recent Articles
        </p>
        {data.articles.slice(0, 6).map((article, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-1">
                {article.title}
              </p>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span>{article.source}</span>
                <span>·</span>
                <span>{formatDate(article.publishedAt)}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize ${getSentimentColor(article.sentiment)} ${
                    article.sentiment === "positive"
                      ? "bg-emerald-100 dark:bg-emerald-900/30"
                      : article.sentiment === "negative"
                        ? "bg-rose-100 dark:bg-rose-900/30"
                        : "bg-slate-200 dark:bg-slate-700"
                  }`}
                >
                  {article.sentiment}
                </span>
              </div>
            </div>
            {article.url && (
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-slate-400 hover:text-indigo-500"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
