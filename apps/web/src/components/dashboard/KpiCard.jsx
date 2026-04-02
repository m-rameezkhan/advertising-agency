import React from "react";

export function KpiCard({ title, value, change, accent }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/70 p-5 shadow-panel backdrop-blur dark:bg-ink-900/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-ink-500 dark:text-ink-300">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-ink-950 dark:text-white">{value}</p>
        </div>
        <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold text-ink-950" style={{ backgroundColor: accent }}>
          {change}
        </span>
      </div>
    </div>
  );
}
