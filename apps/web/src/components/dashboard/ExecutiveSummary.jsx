import React from "react";
import { currency } from "../../lib/formatters";

export function ExecutiveSummary({ selectedRange, connected, summary }) {
  return (
    <div className="dashboard-card bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Overview</p>
          <h2 className="mt-2 text-xl font-semibold">Portfolio snapshot</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {selectedRange} spend is {currency(summary.totalSpend)} across {summary.activeCampaigns} active campaigns and {summary.clientCount} clients.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-white/5 dark:shadow-none">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Alerts</p>
            <p className="mt-1 text-sm font-semibold">{connected ? "Connected" : "Offline"}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm dark:bg-white/5 dark:shadow-none">
            <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Pacing</p>
            <p className="mt-1 text-sm font-semibold">{summary.pacing.toFixed(0)}% used</p>
          </div>
        </div>
      </div>
    </div>
  );
}
