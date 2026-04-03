import React, { useMemo } from "react";
import { currency, number } from "../lib/formatters";

export function ClientsPage({ campaigns }) {
  const clients = useMemo(() => {
    const byClient = new Map();

    campaigns.forEach((campaign) => {
      const current = byClient.get(campaign.client) || { name: campaign.client, campaigns: 0, spend: 0, conversions: 0, impressions: 0 };
      current.campaigns += 1;
      current.spend += campaign.spend;
      current.conversions += campaign.conversions;
      current.impressions += campaign.impressions;
      byClient.set(campaign.client, current);
    });

    return [...byClient.values()].sort((left, right) => right.spend - left.spend);
  }, [campaigns]);

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {clients.map((client) => (
        <div key={client.name} className="dashboard-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-300">Client</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{client.name}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600 dark:bg-white/5 dark:text-slate-300">{client.campaigns} campaigns</span>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Spend</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{currency(client.spend)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Conversions</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{number(client.conversions)}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Impressions</p>
              <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{number(client.impressions)}</p>
            </div>
          </div>
        </div>
      ))}

      {clients.length === 0 && <div className="dashboard-card text-sm text-slate-500 dark:text-slate-300">No client records available yet.</div>}
    </div>
  );
}
