import React from "react";
import { currency } from "../../lib/formatters";

export function ExecutiveSummary({ selectedRange, connected, summary }) {
  return (
    <div className="rounded-[28px] bg-ink-950 p-6 text-white shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-300">Executive summary</p>
          <h2 className="mt-3 text-3xl font-semibold">Performance stayed efficient across portfolio campaigns.</h2>
          <p className="mt-3 text-sm leading-7 text-ink-300">
            For {selectedRange.toLowerCase()}, {summary.activeCampaigns} active campaigns generated {currency(summary.totalSpend)} in tracked spend
            across {summary.clientCount} clients. {summary.topCampaign ? `${summary.topCampaign.name} is currently the highest-spend account.` : "No campaign pacing insights are available yet."}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-300">System status</p>
            <p className="mt-2 text-lg font-semibold">{connected ? "Notifications connected" : "Offline mode"}</p>
          </div>
          <div className="rounded-3xl bg-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-300">Budget pacing</p>
            <p className="mt-2 text-lg font-semibold">{summary.pacing.toFixed(0)}% of planned budget used</p>
          </div>
        </div>
      </div>
    </div>
  );
}
