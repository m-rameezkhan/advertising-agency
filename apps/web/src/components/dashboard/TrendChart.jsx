import React, { useMemo, useState } from "react";
import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { currency, number } from "../../lib/formatters";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function TrendChart({ trendByRange, selectedRange, onRangeChange, customRange, onCustomRangeChange }) {
  const [chartType, setChartType] = useState("area");
  const trend = trendByRange[selectedRange] || [];

  const data = useMemo(
    () => ({
      labels: trend.map((item) => item.day),
      datasets: [
        {
          label: "Spend",
          data: trend.map((item) => item.spend),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.18)",
          fill: chartType === "area",
          tension: 0.35,
          pointRadius: chartType === "line" ? 3 : 0
        },
        {
          label: "Conversions",
          data: trend.map((item) => item.conversions),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.16)",
          fill: chartType === "area",
          tension: 0.35,
          pointRadius: chartType === "line" ? 3 : 0
        }
      ]
    }),
    [chartType, trend]
  );

  const footerStats = useMemo(() => {
    if (!trend.length) {
      return {
        avgSpend: currency(0),
        peakConversions: number(0),
        totalClicks: number(0)
      };
    }

    const totalSpend = trend.reduce((sum, item) => sum + item.spend, 0);
    const peakConversions = trend.reduce((max, item) => Math.max(max, item.conversions), 0);
    const totalClicks = trend.reduce((sum, item) => sum + item.clicks, 0);

    return {
      avgSpend: currency(totalSpend / trend.length),
      peakConversions: number(peakConversions),
      totalClicks: number(totalClicks)
    };
  }, [trend]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true,
            color: "#64748b"
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: "#94a3b8"
          }
        },
        y: {
          ticks: {
            color: "#94a3b8"
          },
          grid: {
            color: "rgba(148, 163, 184, 0.12)"
          }
        }
      }
    }),
    []
  );

  return (
    <section className="dashboard-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Performance</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">Spend and conversions by selected range.</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-white/5">
            {["area", "line"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChartType(type)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  chartType === type ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-950" : "text-slate-500 dark:text-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select value={selectedRange} onChange={(event) => onRangeChange(event.target.value)} className="select-field">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="custom">Custom</option>
          </select>

          {selectedRange === "custom" && (
            <>
              <input
                type="date"
                value={customRange.start}
                onChange={(event) => onCustomRangeChange((current) => ({ ...current, start: event.target.value }))}
                className="input-field"
              />
              <input
                type="date"
                value={customRange.end}
                onChange={(event) => onCustomRangeChange((current) => ({ ...current, end: event.target.value }))}
                className="input-field"
              />
            </>
          )}
        </div>
      </div>

      <div className="mt-5 h-80 rounded-[18px] bg-slate-50 p-4 dark:bg-slate-900/50">
        {trend.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-300">No trend data available.</div>
        )}
      </div>

      <div className="mt-5 grid gap-4 border-t border-slate-200/80 pt-4 sm:grid-cols-3 dark:border-white/10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Avg spend</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{footerStats.avgSpend}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Peak conversions</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{footerStats.peakConversions}</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">Clicks</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{footerStats.totalClicks}</p>
        </div>
      </div>
    </section>
  );
}
