import React, { useState } from "react";
import { useDarkMode } from "./hooks/useDarkMode";
import { useNotifications } from "./hooks/useNotifications";
import { CampaignDashboardPage } from "./pages/CampaignDashboardPage";
import { CreativeBriefPage } from "./pages/CreativeBriefPage";

export default function App() {
  const { darkMode, setDarkMode } = useDarkMode();
  const notifications = useNotifications();
  const [page, setPage] = useState("dashboard");

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 pt-4">
        <div className="inline-flex rounded-full border border-white/10 bg-white/70 p-1 shadow-panel backdrop-blur dark:bg-ink-900/80">
          {[
            ["dashboard", "1.1 Dashboard"],
            ["brief", "1.2 Brief Builder"]
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setPage(value)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                page === value ? "bg-ink-950 text-white dark:bg-white dark:text-ink-950" : "text-ink-700 dark:text-ink-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {page === "dashboard" ? (
        <CampaignDashboardPage
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode((current) => !current)}
          notifications={notifications}
        />
      ) : (
        <CreativeBriefPage />
      )}
    </div>
  );
}
