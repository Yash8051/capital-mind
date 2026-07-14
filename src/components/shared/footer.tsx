// ============================================================
// CapitalMind AI — Footer
// ============================================================

import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              CapitalMind AI
            </span>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            AI-powered investment research. Not financial advice. For educational purposes only.
          </p>

          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <span>© {new Date().getFullYear()} CapitalMind AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
