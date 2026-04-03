import React, { useMemo, useState } from "react";
import { ArrowDownWideNarrow, ArrowUpNarrowWide } from "lucide-react";
import { currency, number, percentage } from "../../lib/formatters";

const badgeMap = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200",
  paused: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-200",
  draft: "bg-sky/10 text-sky dark:bg-sky/20 dark:text-sky",
  archived: "bg-slate-200 text-slate-700 dark:bg-slate-500/15 dark:text-slate-200"
};

const sortableColumns = ["name", "client", "status", "spend", "budget", "ctr", "conversions"];

export function CampaignTable({ campaigns }) {
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "spend", direction: "desc" });

  const filteredCampaigns = useMemo(() => {
    const normalizedFilter = filter.trim().toLowerCase();

    return campaigns.filter((campaign) => {
      const matchesSearch =
        !normalizedFilter ||
        [campaign.name, campaign.client, campaign.status].some((field) => String(field).toLowerCase().includes(normalizedFilter));
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [campaigns, filter, statusFilter]);

  const displayedCampaigns = useMemo(() => {
    const sorted = [...filteredCampaigns];
    const { key, direction } = sortConfig;

    sorted.sort((left, right) => {
      const leftValue = left[key];
      const rightValue = right[key];

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return direction === "asc" ? leftValue - rightValue : rightValue - leftValue;
      }

      const comparison = String(leftValue).localeCompare(String(rightValue), undefined, { sensitivity: "base" });
      return direction === "asc" ? comparison : comparison * -1;
    });

    return sorted;
  }, [filteredCampaigns, sortConfig]);

  const handleSort = (column) => {
    if (!sortableColumns.includes(column)) {
      return;
    }

    setSortConfig((current) => ({
      key: column,
      direction: current.key === column && current.direction === "asc" ? "desc" : "asc"
    }));
  };

  const SortIcon = sortConfig.direction === "asc" ? ArrowUpNarrowWide : ArrowDownWideNarrow;

  return (
    <section className="dashboard-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            Active Campaigns
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Search, sort, and review live campaign performance from the API.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <input
            type="text"
            placeholder="Search campaigns"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="input-field sm:col-span-2"
          />
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="select-field">
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="table-header">
              {[
                ["name", "Campaign"],
                ["client", "Client"],
                ["status", "Status"],
                ["budget", "Budget"],
                ["spend", "Spend"],
                ["ctr", "CTR"],
                ["conversions", "Conversions"]
              ].map(([column, label]) => (
                <th key={column} className="table-cell">
                  <button
                    type="button"
                    onClick={() => handleSort(column)}
                    className="inline-flex items-center gap-2 font-semibold text-slate-700 transition hover:text-sky dark:text-slate-200 dark:hover:text-sky"
                  >
                    {label}
                    {sortConfig.key === column && <SortIcon size={14} />}
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {displayedCampaigns.length > 0 ? (
              displayedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="table-row">
                  <td className="table-cell">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{campaign.name}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{campaign.startDate || "No start date"}</p>
                    </div>
                  </td>
                  <td className="table-cell text-slate-600 dark:text-slate-300">{campaign.client}</td>
                  <td className="table-cell">
                    <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-semibold capitalize ${badgeMap[campaign.status]}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="table-cell font-medium text-slate-700 dark:text-slate-200">{currency(campaign.budget)}</td>
                  <td className="table-cell font-bold text-slate-900 dark:text-white">{currency(campaign.spend)}</td>
                  <td className="table-cell text-slate-600 dark:text-slate-300">{percentage(campaign.ctr)}</td>
                  <td className="table-cell text-slate-600 dark:text-slate-300">{number(campaign.conversions)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="table-cell py-10 text-center text-slate-500 dark:text-slate-300">
                  No campaigns matched the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-5 border-t border-slate-200/80 pt-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-300">
        Showing {displayedCampaigns.length} of {campaigns.length} campaigns
      </div>
    </section>
  );
}
