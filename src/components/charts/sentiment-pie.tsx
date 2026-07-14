// ============================================================
// CapitalMind AI — Sentiment Pie Chart
// ============================================================

"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { SentimentDistribution } from "@/types";

const COLORS = {
  positive: "#10b981",
  neutral: "#94a3b8",
  negative: "#f43f5e",
};

interface SentimentPieChartProps {
  distribution: SentimentDistribution;
}

export function SentimentPieChart({ distribution }: SentimentPieChartProps) {
  const data = [
    { name: "Positive", value: distribution.positive },
    { name: "Neutral", value: distribution.neutral },
    { name: "Negative", value: distribution.negative },
  ];

  return (
    <div className="h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
            animationBegin={0}
            animationDuration={1000}
          >
            {data.map((entry) => (
              <Cell
                key={entry.name}
                fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                stroke="transparent"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "12px",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value) => [`${value}%`, ""]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
