// ============================================================
// CapitalMind AI — Navbar
// ============================================================

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, BarChart3, ExternalLink } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25 transition-transform group-hover:scale-105">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
              CapitalMind
            </span>
            <span className="text-[10px] font-medium uppercase tracking-widest text-indigo-500">
              AI Research
            </span>
          </div>
        </Link>

        {/* Nav Links */}
        <div className="hidden items-center gap-1 sm:flex">
          <Link
            href="/"
            className={cn(
              "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              pathname === "/dashboard"
                ? "text-indigo-600 dark:text-indigo-400"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            )}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <ThemeToggle />
          <Link
            href="/dashboard"
            className="hidden rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:brightness-110 sm:block"
          >
            Launch App
          </Link>
        </div>
      </div>
    </nav>
  );
}
