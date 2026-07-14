// ============================================================
// CapitalMind AI — Competitor Bar Chart
// ============================================================

"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Competitor } from "@/types";

interface CompetitorBarChartProps {
  competitors: Competitor[];
}

export function CompetitorBarChart({ competitors }: CompetitorBarChartProps) {
  const data = competitors.map((c) => ({
    name: c.ticker || c.name.slice(0, 8),
    revenue: c.revenue / 1e9, // Convert to billions
    growth: c.revenueGrowth,
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v}B`}
          />
          <Tooltip
            contentStyle={{
              background: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "12px",
              backdropFilter: "blur(8px)",
              color: "#fff",
              fontSize: "12px",
            }}
            formatter={(value, name) => [
              name === "revenue" ? `$${Number(value).toFixed(1)}B` : `${Number(value).toFixed(1)}%`,
              name === "revenue" ? "Revenue" : "Growth",
            ]}
          />
          <Bar
            dataKey="revenue"
            fill="url(#barGradient)"
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
