// ============================================================
// CapitalMind AI — Dashboard Search Bar
// ============================================================

"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
  onSearch: (company: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

export function SearchBar({ onSearch, isLoading, initialValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="group relative flex items-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900">
        <Search className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company name or ticker (e.g., Apple, TSLA, NVIDIA)..."
          className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white sm:text-base"
          disabled={isLoading}
          id="dashboard-search"
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="mr-2 flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>
      </div>
    </form>
  );
}
