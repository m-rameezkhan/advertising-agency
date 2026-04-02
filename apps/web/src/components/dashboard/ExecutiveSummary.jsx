import React from "react";

export function ExecutiveSummary({ selectedRange, connected }) {
  return (
    <div className="rounded-[28px] bg-ink-950 p-6 text-white shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-ink-300">Executive summary</p>
          <h2 className="mt-3 text-3xl font-semibold">Performance stayed efficient across portfolio campaigns.</h2>
          <p className="mt-3 text-sm leading-7 text-ink-300">
            For {selectedRange.toLowerCase()}, conversion volume is trending up while spend remains within target pacing. Use the brief builder
            to draft the next campaign direction directly from the command center.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-3xl bg-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-300">System status</p>
            <p className="mt-2 text-lg font-semibold">{connected ? "Notifications connected" : "Offline mode"}</p>
          </div>
          <div className="rounded-3xl bg-white/10 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-300">Creative ops</p>
            <p className="mt-2 text-lg font-semibold">AI brief pipeline ready</p>
          </div>
        </div>
      </div>
    </div>
  );
}
