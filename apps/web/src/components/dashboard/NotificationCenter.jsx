import React, { useState } from "react";
import { Bell, CheckCheck } from "lucide-react";

export function NotificationCenter({ items, unread, onMarkAllRead }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/70 shadow-panel backdrop-blur dark:bg-ink-900/80"
      >
        <Bell size={18} className="text-ink-900 dark:text-white" />
        {unread > 0 && (
          <span className="absolute right-2 top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-3 w-[340px] rounded-[28px] border border-white/10 bg-white/95 p-5 shadow-panel backdrop-blur dark:bg-ink-900/95">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-white">Alerts</p>
              <p className="text-xs text-ink-500 dark:text-ink-300">Threshold-based campaign monitoring</p>
            </div>
            <button
              type="button"
              onClick={onMarkAllRead}
              className="inline-flex items-center gap-1 text-xs font-semibold text-ink-600 dark:text-ink-200"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {items.length === 0 && (
              <div className="rounded-2xl bg-ink-50 px-4 py-3 text-sm text-ink-500 dark:bg-white/5 dark:text-ink-300">
                No alerts yet. The API will push them here when thresholds are crossed.
              </div>
            )}

            {items.map((item) => (
              <div
                key={item.id}
                className={`rounded-2xl border px-4 py-3 ${
                  item.read ? "border-ink-100 bg-ink-50 dark:border-white/10 dark:bg-white/5" : "border-coral/40 bg-coral/10"
                }`}
              >
                <p className="text-sm font-semibold text-ink-900 dark:text-white">{item.title}</p>
                <p className="mt-1 text-xs leading-6 text-ink-600 dark:text-ink-300">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
