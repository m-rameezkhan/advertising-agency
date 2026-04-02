import React from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { currency, number, percentage } from "../../lib/formatters";

const badgeMap = {
  active: "bg-mint/20 text-ink-950 dark:text-mint",
  paused: "bg-sun/25 text-ink-950 dark:text-sun",
  draft: "bg-sky/20 text-ink-950 dark:text-sky",
  archived: "bg-white/10 text-ink-800 dark:text-ink-200"
};

export function CampaignTable({ campaigns, sortConfig, onSort, filter, onFilter }) {
  const SortIcon = sortConfig.direction === "asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow;

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/70 p-6 shadow-panel backdrop-blur dark:bg-ink-900/80">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-ink-500 dark:text-ink-300">Campaign table</p>
          <h2 className="mt-2 text-xl font-semibold text-ink-950 dark:text-white">Sortable client performance</h2>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={filter}
            onChange={(event) => onFilter(event.target.value)}
            placeholder="Filter by client or campaign"
            className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-ink-400 dark:border-white/10 dark:bg-ink-950 dark:text-white"
          />
          <button
            type="button"
            onClick={() => onSort(sortConfig.key === "spend" ? "ctr" : "spend")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-ink-950"
          >
            <SortIcon size={16} />
            Sort by {sortConfig.key === "spend" ? "CTR" : "Spend"}
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-ink-500 dark:text-ink-300">
            <tr>
              <th className="pb-4">Campaign</th>
              <th className="pb-4">Client</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Budget</th>
              <th className="pb-4">Spend</th>
              <th className="pb-4">Impressions</th>
              <th className="pb-4">CTR</th>
              <th className="pb-4">Conversions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 dark:divide-white/10">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="text-ink-900 dark:text-white">
                <td className="py-4 font-semibold">{campaign.name}</td>
                <td className="py-4">{campaign.client}</td>
                <td className="py-4">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${badgeMap[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="py-4">{currency(campaign.budget)}</td>
                <td className="py-4">{currency(campaign.spend)}</td>
                <td className="py-4">{number(campaign.impressions)}</td>
                <td className="py-4">{percentage(campaign.ctr)}</td>
                <td className="py-4">{number(campaign.conversions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
