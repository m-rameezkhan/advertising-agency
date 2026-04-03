import React from "react";

export function KpiCard({ title, value, icon, trend, trendValue }) {
  const trendClasses =
    trend === "down"
      ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200"
      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200";

  return (
    <div className="kpi-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky/10 text-sky dark:bg-sky/20 dark:text-sky">
          {icon}
        </div>
        <span className={`inline-flex rounded-xl px-2.5 py-1 text-xs font-semibold ${trendClasses}`}>{trendValue}</span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-300">{title}</p>
      <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
      <div className="mt-4 h-1.5 w-16 rounded-full bg-gradient-to-r from-sky via-cyan-400 to-transparent shadow-[0_10px_24px_rgba(14,165,233,0.35)]" />
    </div>
  );
}
