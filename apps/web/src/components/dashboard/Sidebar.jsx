import React from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Sparkles,
  Users
} from "lucide-react";

const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "campaigns", label: "Campaigns", path: "/campaigns", icon: BriefcaseBusiness },
  { id: "clients", label: "Clients", path: "/clients", icon: Users },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: BarChart3 },
  { id: "brief", label: "AI Briefs", path: "/brief", icon: Sparkles },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings }
];

export function Sidebar({ currentPath, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile, user }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 backdrop-blur-sm transition xl:hidden ${mobileOpen ? "block" : "hidden"}`}
        onClick={onCloseMobile}
      />

      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-slate-200/70 bg-white/94 shadow-[0_18px_48px_rgba(15,23,42,0.10)] backdrop-blur dark:border-white/10 dark:bg-slate-950/92 ${
          collapsed ? "w-[86px]" : "w-[248px]"
        } transform transition-all duration-300 ${mobileOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-4 dark:border-white/10">
          <button type="button" onClick={() => onNavigate("/dashboard")} className="min-w-0 text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500 dark:text-slate-300">Agency</p>
            {!collapsed && (
              <h1 className="mt-1 truncate text-lg font-semibold text-slate-900 dark:text-white">Campaign Suite</h1>
            )}
          </button>

          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 xl:inline-flex dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1.5 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPath === item.path;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.path)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  active
                    ? "bg-slate-200 text-slate-900 dark:bg-white dark:text-slate-950"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
                }`}
              >
                <Icon size={18} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-200/70 px-3 py-4 dark:border-white/10">
          <div className="rounded-2xl bg-slate-100 px-3 py-3 text-slate-700 dark:bg-white/5 dark:text-white">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{collapsed ? "Pro" : "Workspace"}</p>
            {!collapsed && (
              <>
                <p className="mt-2 text-sm font-semibold">{user?.name || "Admin"}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Signed in</p>
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
