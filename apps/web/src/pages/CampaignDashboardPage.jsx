import React, { useEffect, useMemo, useState } from "react";
import { BarChart3, DollarSign, Eye, MousePointerClick, ShoppingCart, TrendingUp } from "lucide-react";
import { Sidebar } from "../components/dashboard/Sidebar";
import { ExecutiveSummary } from "../components/dashboard/ExecutiveSummary";
import { KpiCard } from "../components/dashboard/KpiCard";
import { TrendChart } from "../components/dashboard/TrendChart";
import { CampaignTable } from "../components/dashboard/CampaignTable";
import { NotificationCenter } from "../components/dashboard/NotificationCenter";
import { ChartSkeleton, KPIGridSkeleton, SidebarSkeleton, TableSkeleton } from "../components/dashboard/Skeletons";
import { fetchCampaigns } from "../lib/api";
import {
  buildTrendSeries,
  calculateChange,
  calculateRatioChange,
  calculateTotals,
  getRangeLabel,
  getStatusCounts,
  getTopCampaign,
  normalizeCampaign
} from "../lib/dashboard";
import { currency, number, percentage } from "../lib/formatters";

export function CampaignDashboardPage({ darkMode, onToggleDarkMode, notifications }) {
  const [selectedRange, setSelectedRange] = useState("30");
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    async function loadCampaigns() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchCampaigns();

        if (!active) {
          return;
        }

        setCampaigns(response.map(normalizeCampaign));
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Unable to load campaigns.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCampaigns();

    return () => {
      active = false;
    };
  }, [reloadToken]);

  const totals = useMemo(() => calculateTotals(campaigns), [campaigns]);
  const statusCounts = useMemo(() => getStatusCounts(campaigns), [campaigns]);
  const topCampaign = useMemo(() => getTopCampaign(campaigns), [campaigns]);
  const trendByRange = useMemo(
    () => ({
      7: buildTrendSeries(campaigns, 7),
      30: buildTrendSeries(campaigns, 30)
    }),
    [campaigns]
  );

  const kpis = useMemo(() => {
    const trend30 = trendByRange[30];

    return [
      {
        title: "Impressions",
        value: number(totals.totalImpressions),
        trendValue: calculateChange(trend30, "impressions").value,
        trend: calculateChange(trend30, "impressions").trend,
        icon: <Eye size={22} />
      },
      {
        title: "Clicks",
        value: number(totals.totalClicks),
        trendValue: calculateChange(trend30, "clicks").value,
        trend: calculateChange(trend30, "clicks").trend,
        icon: <MousePointerClick size={22} />
      },
      {
        title: "CTR",
        value: percentage(totals.ctr),
        trendValue: calculateRatioChange(trend30, "clicks", "impressions").value,
        trend: calculateRatioChange(trend30, "clicks", "impressions").trend,
        icon: <BarChart3 size={22} />
      },
      {
        title: "Conversions",
        value: number(totals.totalConversions),
        trendValue: calculateChange(trend30, "conversions").value,
        trend: calculateChange(trend30, "conversions").trend,
        icon: <ShoppingCart size={22} />
      },
      {
        title: "Spend",
        value: currency(totals.totalSpend),
        trendValue: calculateChange(trend30, "spend").value,
        trend: calculateChange(trend30, "spend").trend,
        icon: <DollarSign size={22} />
      },
      {
        title: "ROAS",
        value: `${totals.roas.toFixed(2)}x`,
        trendValue: calculateRatioChange(trend30, "revenue", "spend").value,
        trend: calculateRatioChange(trend30, "revenue", "spend").trend,
        icon: <TrendingUp size={22} />
      }
    ];
  }, [totals, trendByRange]);

  const summary = useMemo(
    () => ({
      activeCampaigns: statusCounts.active || 0,
      clientCount: new Set(campaigns.map((campaign) => campaign.client)).size,
      topCampaign,
      totalSpend: totals.totalSpend,
      pacing: totals.pacing
    }),
    [campaigns, statusCounts.active, topCampaign, totals.pacing, totals.totalSpend]
  );

  return (
    <div className="mx-auto grid max-w-[1600px] gap-6 px-4 py-6 xl:grid-cols-[288px_minmax(0,1fr)]">
      {loading ? <SidebarSkeleton /> : <Sidebar campaigns={campaigns} totals={totals} />}

      <main className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-ink-500 dark:text-ink-300">Live dashboard</p>
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

        {error ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 text-rose-900 shadow-panel dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">Dashboard unavailable</p>
            <p className="mt-3 text-sm leading-7">
              The dashboard could not load campaign data from the API. {error}
            </p>
            <button
              type="button"
              onClick={() => setReloadToken((current) => current + 1)}
              className="mt-4 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              Retry request
            </button>
          </div>
        ) : (
          <>
            <ExecutiveSummary selectedRange={getRangeLabel(selectedRange)} connected={notifications.connected} summary={summary} />

            {loading ? (
              <>
                <KPIGridSkeleton />
                <ChartSkeleton />
                <TableSkeleton />
              </>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
                  {kpis.map((kpi) => (
                    <KpiCard key={kpi.title} {...kpi} />
                  ))}
                </div>

                <TrendChart trendByRange={trendByRange} selectedRange={selectedRange} onRangeChange={setSelectedRange} />

                <CampaignTable campaigns={campaigns} />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}
