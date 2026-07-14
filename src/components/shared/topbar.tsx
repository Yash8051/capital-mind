// ============================================================
// InvestIQ Topbar
// ============================================================
"use client";

import { Search, Bell } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("company") || "");

  // Update query when URL params change
  useEffect(() => {
    setQuery(searchParams.get("company") || "");
  }, [searchParams]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/dashboard?company=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="flex h-20 items-center justify-between px-8 bg-[#0b1120] border-b border-[#1e293b]">
      <div className="flex flex-1 items-center gap-6">
        <form onSubmit={handleSubmit} className="w-full max-w-xl">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for companies, stocks, or keywords..."
              className="h-12 w-full rounded-xl border border-slate-700 bg-slate-800/50 pl-11 pr-14 text-sm text-white placeholder:text-slate-400 focus:border-blue-500 focus:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none flex h-6 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-400 opacity-100">
              <span className="text-xs">⌘</span>K
            </div>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-800" />
        </button>
        <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
          U
        </button>
      </div>
    </header>
  );
}
