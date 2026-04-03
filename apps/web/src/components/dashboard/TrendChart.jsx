import React, { useMemo, useState } from "react";
import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Tooltip } from "chart.js";
import { Line } from "react-chartjs-2";
import { currency, number } from "../../lib/formatters";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

export function TrendChart({ trendByRange, selectedRange, onRangeChange }) {
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
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent dark:from-white dark:to-slate-300">
            Performance Analytics
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
            Daily performance derived from live campaign totals across the selected window.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="inline-flex rounded-2xl bg-slate-100 p-1 dark:bg-white/5">
            {["area", "line"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setChartType(type)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold capitalize transition ${
                  chartType === type ? "bg-sky text-white shadow-sm" : "text-slate-500 dark:text-slate-300"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <select value={selectedRange} onChange={(event) => onRangeChange(event.target.value)} className="select-field">
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
          </select>
        </div>
      </div>

      <div className="mt-6 h-80 rounded-[24px] bg-gradient-to-br from-sky/10 via-white to-cyan-50 p-4 dark:from-sky/10 dark:via-slate-950 dark:to-cyan-500/10">
        {trend.length > 0 ? (
          <Line data={data} options={options} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-300">No trend data available.</div>
        )}
      </div>

      <div className="mt-6 grid gap-4 border-t border-slate-200/80 pt-5 sm:grid-cols-3 dark:border-white/10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Avg daily spend</p>
          <p className="mt-2 text-2xl font-bold text-sky dark:text-sky">{footerStats.avgSpend}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Peak conversions</p>
          <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-300">{footerStats.peakConversions}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Attributed clicks</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{footerStats.totalClicks}</p>
        </div>
      </div>
    </section>
  );
}
