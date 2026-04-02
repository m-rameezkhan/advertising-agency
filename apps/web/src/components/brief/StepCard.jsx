import React from "react";

export function StepCard({ title, description, children }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/70 p-6 shadow-panel backdrop-blur dark:bg-ink-900/80">
      <p className="text-sm text-ink-500 dark:text-ink-300">{description}</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink-950 dark:text-white">{title}</h2>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}
