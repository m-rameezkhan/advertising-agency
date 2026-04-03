import React from "react";

export function SidebarSkeleton() {
  return <div className="dashboard-card hidden h-[720px] xl:block xl:w-72 animate-pulse" />;
}

export function KPIGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="kpi-card animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-12 w-12 rounded-2xl bg-slate-200 dark:bg-white/10" />
            <div className="h-6 w-16 rounded-xl bg-slate-200 dark:bg-white/10" />
          </div>
          <div className="mt-5 h-4 w-24 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-3 h-8 w-28 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-4 h-1.5 w-16 rounded-full bg-slate-200 dark:bg-white/10" />
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="dashboard-card animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-6 w-48 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-3 h-4 w-64 rounded bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="h-10 w-32 rounded-2xl bg-slate-200 dark:bg-white/10" />
      </div>
      <div className="mt-6 h-80 rounded-[24px] bg-slate-200 dark:bg-white/10" />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="dashboard-card animate-pulse">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="h-6 w-40 rounded bg-slate-200 dark:bg-white/10" />
          <div className="mt-3 h-4 w-72 rounded bg-slate-200 dark:bg-white/10" />
        </div>
        <div className="h-10 w-72 rounded-2xl bg-slate-200 dark:bg-white/10" />
      </div>
      <div className="mt-6 space-y-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className="h-10 rounded-2xl bg-slate-200 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}
