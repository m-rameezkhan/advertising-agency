import React from "react";

export function KpiCard({ title, value, icon, trend, trendValue }) {
  const trendClasses =
    trend === "down"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200";

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 dark:bg-white/5 dark:text-slate-200">
          {icon}
        </div>
        <span className={`inline-flex rounded-lg px-2 py-1 text-[11px] font-semibold ${trendClasses}`}>{trendValue}</span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">{title}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
