// ============================================================
// InvestIQ Sidebar
// ============================================================
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LineChart,
  Star,
  Search,
  PieChart,
  Filter,
  Bell,
  Newspaper,
  Settings,
  Moon,
  Sun,
  Activity
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/dashboard", icon: LineChart },
  { name: "Watchlist", href: "/watchlist", icon: Star },
  { name: "Research", href: "/research", icon: Search },
  { name: "Portfolio", href: "/portfolio", icon: PieChart },
  { name: "Screener", href: "/screener", icon: Filter },
  { name: "Alerts", href: "/alerts", icon: Bell },
  { name: "News", href: "/news", icon: Newspaper },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-[#1e293b] bg-[#0f172a] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-500" />
          <span className="text-xl font-bold tracking-tight">InvestIQ</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (pathname === "/dashboard" && item.name === "Dashboard");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3 border border-slate-700/50">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">User</span>
            <span className="text-xs text-yellow-500 flex items-center gap-1">
              Premium Plan <span>👑</span>
            </span>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2">
          <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
            <Moon className="h-4 w-4" /> Dark Mode
          </span>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
              theme === "dark" ? "bg-blue-500" : "bg-slate-600"
            )}
          >
            <span
              className={cn(
                "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                theme === "dark" ? "translate-x-4" : "translate-x-0"
              )}
            />
          </button>
        </div>
      </div>
    </aside>
  );
}
