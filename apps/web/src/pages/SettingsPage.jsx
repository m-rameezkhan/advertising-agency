import React, { useState } from "react";

export function SettingsPage({ user, darkMode, onToggleDarkMode }) {
  const [saved, setSaved] = useState(false);
  const [preferences, setPreferences] = useState({
    digestEmails: true,
    aiFallback: true,
    campaignAlerts: true
  });

  const togglePreference = (key) => {
    setSaved(false);
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <section className="dashboard-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Preferences</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Workspace settings</h2>

        <div className="mt-4 space-y-3">
          {[
            ["digestEmails", "Daily digest emails"],
            ["aiFallback", "AI safe fallback mode"],
            ["campaignAlerts", "Real-time campaign alerts"]
          ].map(([key, label]) => (
            <label key={key} className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
              <button
                type="button"
                onClick={() => togglePreference(key)}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${preferences[key] ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300"}`}
              >
                {preferences[key] ? "Enabled" : "Disabled"}
              </button>
            </label>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setSaved(true);
            }}
            className="rounded-2xl bg-ink-950 px-4 py-3 text-sm font-semibold text-white dark:bg-white dark:text-ink-950"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:text-slate-200"
          >
            Switch to {darkMode ? "light" : "dark"} mode
          </button>
        </div>

        {saved && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-300">Preferences saved locally for this workspace.</p>}
      </section>

      <section className="dashboard-card">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-300">Profile</p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Account</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
          <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-white">{user?.name || "Admin"}</p>
            <p className="mt-1">{user?.email || "admin@agency.local"}</p>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-white">API status</p>
            <p className="mt-1">Campaign API, PostgreSQL, and AI fallback mode are ready for deployment.</p>
          </div>
          <div className="rounded-xl border border-slate-200 px-4 py-3 dark:border-white/10">
            <p className="font-semibold text-slate-900 dark:text-white">Security</p>
            <p className="mt-1">JWT-based auth is enabled for the active session.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
