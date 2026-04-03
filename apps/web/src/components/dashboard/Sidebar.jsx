import React from "react";
import { BarChart3, BriefcaseBusiness, Building2, Settings, Sparkles } from "lucide-react";
import { currency } from "../../lib/formatters";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, active: true },
  { id: "campaigns", label: "Campaigns", icon: BriefcaseBusiness },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "creative", label: "Creative Briefs", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings }
];

export function Sidebar({ campaigns, totals }) {
  const clients = [...new Set(campaigns.map((campaign) => campaign.client))].slice(0, 5);

  return (
    <aside className="dashboard-card hidden xl:flex xl:w-72 xl:flex-col xl:self-start">
      <div className="border-b border-slate-200/70 px-6 py-6 dark:border-white/10">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-300">Agency</p>
        <h1 className="mt-3 text-3xl font-bold bg-gradient-to-r from-slate-900 via-sky to-cyan-500 bg-clip-text text-transparent dark:from-white dark:via-sky dark:to-cyan-300">
          Command
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Live portfolio view powered by the campaign API.</p>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-5">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                item.active
                  ? "bg-gradient-to-r from-sky to-cyan-500 text-white shadow-[0_18px_40px_rgba(14,165,233,0.35)]"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="space-y-4 border-t border-slate-200/70 px-4 py-5 dark:border-white/10">
        <div className="rounded-3xl bg-slate-950 px-4 py-5 text-white">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Portfolio spend</p>
          <p className="mt-3 text-2xl font-bold">{currency(totals.totalSpend)}</p>
          <p className="mt-2 text-sm text-slate-300">{campaigns.length} live campaigns tracked</p>
        </div>

        <div>
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-300">Top clients</p>
          <div className="mt-3 space-y-2">
            {clients.map((client) => (
              <div
                key={client}
                className="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm font-medium text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
              >
                {client}
              </div>
            ))}
            {clients.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
                No clients available yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
