import React, { useMemo, useState } from "react";
import campaignData from "../data/campaigns.json";
import { Sidebar } from "../components/dashboard/Sidebar";
import { ExecutiveSummary } from "../components/dashboard/ExecutiveSummary";
import { KpiCard } from "../components/dashboard/KpiCard";
import { DateRangePicker } from "../components/dashboard/DateRangePicker";
import { TrendChart } from "../components/dashboard/TrendChart";
import { CampaignTable } from "../components/dashboard/CampaignTable";
import { NotificationCenter } from "../components/dashboard/NotificationCenter";
import { currency, number, percentage } from "../lib/formatters";

export function CampaignDashboardPage({ darkMode, onToggleDarkMode, notifications }) {
  const [selectedRange, setSelectedRange] = useState("Last 30d");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [filter, setFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "spend", direction: "desc" });

  const campaigns = campaignData.campaigns;

  const filteredCampaigns = useMemo(() => {
    const normalizedFilter = filter.toLowerCase();
    return [...campaigns]
      .filter((campaign) =>
        [campaign.name, campaign.client, campaign.status].some((field) => field.toLowerCase().includes(normalizedFilter))
      )
      .sort((a, b) => {
        const modifier = sortConfig.direction === "asc" ? 1 : -1;
        return (a[sortConfig.key] - b[sortConfig.key]) * modifier;
      });
  }, [campaigns, filter, sortConfig]);

  const totals = useMemo(() => {
    const totalImpressions = campaigns.reduce((sum, item) => sum + item.impressions, 0);
    const totalClicks = campaigns.reduce((sum, item) => sum + item.clicks, 0);
    const totalConversions = campaigns.reduce((sum, item) => sum + item.conversions, 0);
    const totalSpend = campaigns.reduce((sum, item) => sum + item.spend, 0);
    const totalBudget = campaigns.reduce((sum, item) => sum + item.budget, 0);
    const ctr = totalImpressions ? (totalClicks / totalImpressions) * 100 : 0;
    const roas = totalSpend ? (totalBudget / totalSpend).toFixed(1) : "0.0";

    return {
      totalImpressions,
      totalClicks,
      ctr,
      totalConversions,
      totalSpend,
      roas
    };
  }, [campaigns]);

  const kpis = [
    { title: "Impressions", value: number(totals.totalImpressions), change: "+12.4%", accent: "#56a7ff33" },
    { title: "Clicks", value: number(totals.totalClicks), change: "+8.1%", accent: "#55d6be40" },
    { title: "CTR", value: percentage(totals.ctr), change: "+0.3 pts", accent: "#f5c45155" },
    { title: "Conversions", value: number(totals.totalConversions), change: "+15.2%", accent: "#56a7ff33" },
    { title: "Spend", value: currency(totals.totalSpend), change: "92% pacing", accent: "#ff6b5744" },
    { title: "ROAS", value: `${totals.roas}x`, change: "+0.8x", accent: "#55d6be40" }
  ];

  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc"
    }));
  };

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 xl:grid-cols-[280px_1fr]">
      <Sidebar campaigns={campaigns} />

      <main className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">Task 1.1</p>
            <h1 className="mt-2 text-3xl font-semibold text-ink-950 dark:text-white">Campaign Performance Dashboard</h1>
          </div>

          <div className="flex items-center gap-3 self-start xl:self-auto">
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="rounded-2xl border border-white/10 bg-white/70 px-4 py-3 text-sm font-semibold text-ink-900 shadow-panel backdrop-blur dark:bg-ink-900/80 dark:text-white"
            >
              {darkMode ? "Light mode" : "Dark mode"}
            </button>
            <NotificationCenter
              items={notifications.items}
              unread={notifications.unread}
              onMarkAllRead={notifications.markAllRead}
            />
          </div>
        </div>

        <ExecutiveSummary selectedRange={selectedRange} connected={notifications.connected} />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.title} {...kpi} />
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <DateRangePicker
            selected={selectedRange}
            onSelect={setSelectedRange}
            customRange={customRange}
            onCustomRangeChange={setCustomRange}
          />
          <TrendChart trend={campaignData.trend} />
        </div>

        <CampaignTable
          campaigns={filteredCampaigns}
          sortConfig={sortConfig}
          onSort={handleSort}
          filter={filter}
          onFilter={setFilter}
        />
      </main>
    </div>
  );
}
