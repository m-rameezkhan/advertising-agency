import React from "react";

const presets = ["Last 7d", "Last 30d", "Last 90d", "Custom"];

export function DateRangePicker({ selected, onSelect, customRange, onCustomRangeChange }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/70 p-5 shadow-panel backdrop-blur dark:bg-ink-900/80">
      <p className="text-sm text-ink-500 dark:text-ink-300">Date range</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onSelect(preset)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              selected === preset
                ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950"
                : "bg-ink-100 text-ink-700 dark:bg-white/10 dark:text-ink-200"
            }`}
          >
            {preset}
          </button>
        ))}
      </div>

      {selected === "Custom" && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            type="date"
            value={customRange.start}
            onChange={(event) => onCustomRangeChange({ ...customRange, start: event.target.value })}
            className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none dark:border-white/10 dark:bg-ink-950 dark:text-white"
          />
          <input
            type="date"
            value={customRange.end}
            onChange={(event) => onCustomRangeChange({ ...customRange, end: event.target.value })}
            className="rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none dark:border-white/10 dark:bg-ink-950 dark:text-white"
          />
        </div>
      )}
    </div>
  );
}
