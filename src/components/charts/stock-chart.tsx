// ============================================================
// CapitalMind AI — Stock Price Chart
// ============================================================

"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { HistoricalDataPoint } from "@/types";

interface StockChartProps {
  data: HistoricalDataPoint[];
}

export function StockChart({ data }: StockChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Stock Price History
      </h4>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.1)" />
            <XAxis
              dataKey="date"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${v}`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "rgba(15, 23, 42, 0.9)",
                border: "1px solid rgba(16, 185, 129, 0.2)",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "12px",
              }}
              formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#stockGrad)"
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
