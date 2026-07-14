// ============================================================
// CapitalMind AI — Company Header
// ============================================================

"use client";

import { motion } from "motion/react";
import { Building2, MapPin, Globe, Users } from "lucide-react";
import { formatLargeNumber } from "@/lib/utils";
import type { CompanyResearchResult } from "@/types";

interface CompanyHeaderProps {
  data: CompanyResearchResult;
}

export function CompanyHeader({ data }: CompanyHeaderProps) {
  const { overview } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
        {/* Logo */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900">
          {overview.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={overview.logoUrl}
              alt={overview.name}
              className="h-10 w-10 rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
                (e.target as HTMLImageElement).parentElement!.innerHTML =
                  '<div class="flex h-10 w-10 items-center justify-center"><svg class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>';
              }}
            />
          ) : (
            <Building2 className="h-8 w-8 text-slate-400" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {overview.name}
            </h2>
            <span className="rounded-lg bg-indigo-100 px-2.5 py-0.5 text-sm font-semibold text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
              {overview.ticker}
            </span>
            <span className="text-sm text-slate-500">{overview.exchange}</span>
          </div>

          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            {overview.description}
          </p>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {overview.sector} · {overview.industry}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {overview.headquarters}
            </span>
            {overview.employees > 0 && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {overview.employees.toLocaleString()} employees
              </span>
            )}
            {overview.website && (
              <a
                href={overview.website.startsWith("http") ? overview.website : `https://${overview.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-indigo-500 hover:underline"
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
          </div>
        </div>

        {/* Market Cap */}
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Market Cap
          </p>
          <p className="mt-1 text-xl font-bold text-slate-900 dark:text-white">
            {overview.marketCapFormatted || formatLargeNumber(overview.marketCap)}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
