import React, { useMemo, useState } from "react";
import { BarChart3, DollarSign, Eye, MousePointerClick, ShoppingCart, TrendingUp } from "lucide-react";
import { CampaignFormModal } from "../components/dashboard/CampaignFormModal";
import { ExecutiveSummary } from "../components/dashboard/ExecutiveSummary";
import { KpiCard } from "../components/dashboard/KpiCard";
import { TrendChart } from "../components/dashboard/TrendChart";
import { CampaignTable } from "../components/dashboard/CampaignTable";
import { ChartSkeleton, KPIGridSkeleton, TableSkeleton } from "../components/dashboard/Skeletons";
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

export function CampaignDashboardPage({
  campaigns,
  loading,
  error,
  mutationError,
  mutationPending,
  deletePending,
  activeActionId,
  saveCampaign,
  removeCampaign,
  clearMutationError,
  refresh,
  notifications
}) {
  const [selectedRange, setSelectedRange] = useState("30");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const totals = useMemo(() => calculateTotals(campaigns), [campaigns]);
  const statusCounts = useMemo(() => getStatusCounts(campaigns), [campaigns]);
  const topCampaign = useMemo(() => getTopCampaign(campaigns), [campaigns]);
  const trendByRange = useMemo(
    () => ({
      7: buildTrendSeries(campaigns, 7),
      30: buildTrendSeries(campaigns, 30),
      90: buildTrendSeries(campaigns, 90),
      custom: customRange.start && customRange.end ? buildTrendSeries(campaigns, customRange) : []
    }),
    [campaigns, customRange]
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

  const openCreateModal = () => {
    clearMutationError();
    setModalMode("create");
    setSelectedCampaign(null);
    setModalOpen(true);
  };

  const openEditModal = (campaign) => {
    clearMutationError();
    setModalMode("edit");
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (mutationPending) {
      return;
    }

    setModalOpen(false);
    setSelectedCampaign(null);
    clearMutationError();
  };

  const handleSubmitCampaign = async (formValues) => {
    try {
      await saveCampaign(modalMode, formValues);
      setModalOpen(false);
      setSelectedCampaign(null);
    } catch {}
  };

  const handleDeleteCampaign = async (campaign) => {
    const confirmed = window.confirm(`Delete "${campaign.name}" from the dashboard?`);

    if (!confirmed) {
      return;
    }

    try {
      await removeCampaign(campaign.id);
    } catch {}
  };

  return (
    <>
      <div className="space-y-6">
        {error ? (
          <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 text-rose-900 shadow-panel dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]">Dashboard unavailable</p>
            <p className="mt-3 text-sm leading-7">
              The dashboard could not load campaign data from the API. {error}
            </p>
            <button
              type="button"
              onClick={refresh}
              className="mt-4 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500"
            >
              Retry request
            </button>
          </div>
        ) : (
          <>
            <ExecutiveSummary selectedRange={getRangeLabel(selectedRange)} connected={notifications.connected} summary={summary} />

            {mutationError && !modalOpen && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
                {mutationError}
              </div>
            )}

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

                <TrendChart
                  trendByRange={trendByRange}
                  selectedRange={selectedRange}
                  onRangeChange={setSelectedRange}
                  customRange={customRange}
                  onCustomRangeChange={setCustomRange}
                />

                <CampaignTable
                  campaigns={campaigns.map(normalizeCampaign)}
                  onCreate={openCreateModal}
                  onEdit={openEditModal}
                  onDelete={handleDeleteCampaign}
                  activeActionId={activeActionId}
                  deletePending={deletePending}
                />
              </>
            )}
          </>
        )}
      </div>

      <CampaignFormModal
        open={modalOpen}
        mode={modalMode}
        campaign={selectedCampaign}
        onClose={closeModal}
        onSubmit={handleSubmitCampaign}
        submitting={mutationPending}
        error={mutationError}
      />
    </>
  );
}
