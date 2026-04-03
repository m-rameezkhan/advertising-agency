import React, { useMemo, useState } from "react";
import { Activity, Eye, MousePointerClick, TrendingUp } from "lucide-react";
import { KpiCard } from "../components/dashboard/KpiCard";
import { TrendChart } from "../components/dashboard/TrendChart";
import { buildTrendSeries, calculateTotals } from "../lib/dashboard";
import { currency, number, percentage } from "../lib/formatters";

export function AnalyticsPage({ campaigns }) {
  const [selectedRange, setSelectedRange] = useState("30");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const totals = useMemo(() => calculateTotals(campaigns), [campaigns]);
  const trendByRange = useMemo(
    () => ({
      7: buildTrendSeries(campaigns, 7),
      30: buildTrendSeries(campaigns, 30),
      90: buildTrendSeries(campaigns, 90),
      custom: customRange.start && customRange.end ? buildTrendSeries(campaigns, customRange) : []
    }),
    [campaigns, customRange]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Spend" value={currency(totals.totalSpend)} trend="up" trendValue="Live" icon={<TrendingUp size={22} />} />
        <KpiCard title="Impressions" value={number(totals.totalImpressions)} trend="up" trendValue="Live" icon={<Eye size={22} />} />
        <KpiCard title="Clicks" value={number(totals.totalClicks)} trend="up" trendValue="Live" icon={<MousePointerClick size={22} />} />
        <KpiCard title="CTR" value={percentage(totals.ctr)} trend="up" trendValue="Derived" icon={<Activity size={22} />} />
      </div>

      <TrendChart
        trendByRange={trendByRange}
        selectedRange={selectedRange}
        onRangeChange={setSelectedRange}
        customRange={customRange}
        onCustomRangeChange={setCustomRange}
      />
    </div>
  );
}
