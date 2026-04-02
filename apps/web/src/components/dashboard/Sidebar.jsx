import React from "react";
import { BriefcaseBusiness, Building2, Settings, Sparkles } from "lucide-react";

const navItems = [
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "campaigns", label: "Campaigns", icon: BriefcaseBusiness },
  { id: "creative", label: "Creative Briefs", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings }
];

export function Sidebar({ campaigns }) {
  const clients = [...new Set(campaigns.map((campaign) => campaign.client))];

  return (
    <aside className="rounded-[28px] border border-white/10 bg-white/70 p-6 shadow-panel backdrop-blur dark:bg-ink-900/80">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.32em] text-ink-500 dark:text-ink-300">Agency OS</p>
        <h1 className="mt-3 text-2xl font-semibold text-ink-900 dark:text-white">Campaign Command</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-ink-700 transition hover:bg-ink-100 dark:text-ink-100 dark:hover:bg-white/10"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-8 rounded-3xl bg-ink-950 px-4 py-5 text-white">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-300">Clients</p>
        <div className="mt-4 space-y-3">
          {clients.map((client) => (
            <div key={client} className="rounded-2xl bg-white/10 px-3 py-3 text-sm">
              {client}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
