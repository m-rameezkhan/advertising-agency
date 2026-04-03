import React from "react";
import { ShieldCheck, UserCircle2, Menu } from "lucide-react";
import { NotificationCenter } from "../dashboard/NotificationCenter";

const routeLabels = {
  "/dashboard": { title: "Dashboard", subtitle: "Live performance" },
  "/campaigns": { title: "Campaigns", subtitle: "Campaign management" },
  "/clients": { title: "Clients", subtitle: "Client portfolio" },
  "/analytics": { title: "Analytics", subtitle: "Performance trends" },
  "/brief": { title: "AI Briefs", subtitle: "Creative workflow" },
  "/settings": { title: "Settings", subtitle: "Workspace controls" }
};

export function PremiumHeader({ currentPath, darkMode, onToggleDarkMode, onOpenSidebar, notifications, user, onLogout }) {
  const content = routeLabels[currentPath] || routeLabels["/dashboard"];

  return (
    <header className="dashboard-card relative z-20 flex flex-col gap-3 px-4 py-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex rounded-xl border border-slate-200 p-2.5 text-slate-600 xl:hidden dark:border-white/10 dark:text-slate-200"
          >
            <Menu size={16} />
          </button>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">{content.subtitle}</p>
            <h1 className="mt-1 text-xl font-semibold text-slate-900 dark:text-white">{content.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:hover:bg-white/5"
          >
            {darkMode ? "Light mode" : "Dark mode"}
          </button>
          <NotificationCenter items={notifications.items} unread={notifications.unread} onMarkAllRead={notifications.markAllRead} />
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl bg-ink-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-ink-900 dark:bg-white dark:text-ink-950"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
          <ShieldCheck size={14} />
          Secure session
        </div>

        <div className="ml-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 dark:border-white/10 dark:bg-slate-950">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-200">
            <UserCircle2 size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user?.name || "Admin"}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-300">{user?.email || "admin@agency.local"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
