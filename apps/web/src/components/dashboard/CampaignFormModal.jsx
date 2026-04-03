import React, { useEffect, useState } from "react";

const defaultFormState = {
  id: null,
  name: "",
  client: "",
  status: "draft",
  budget: "",
  impressions: "",
  clicks: "",
  spend: 0,
  conversions: 0,
  revenue: 0,
  startDate: "",
  endDate: ""
};

function toFormState(campaign) {
  if (!campaign) {
    return defaultFormState;
  }

  return {
    id: campaign.id,
    name: campaign.name || "",
    client: campaign.client || "",
    status: campaign.status || "draft",
    budget: campaign.budget ?? "",
    impressions: campaign.impressions ?? "",
    clicks: campaign.clicks ?? "",
    spend: campaign.spend ?? 0,
    conversions: campaign.conversions ?? 0,
    revenue: campaign.revenue ?? 0,
    startDate: campaign.startDate || "",
    endDate: campaign.endDate || ""
  };
}

export function CampaignFormModal({ open, mode, campaign, onClose, onSubmit, submitting, error }) {
  const [form, setForm] = useState(defaultFormState);

  useEffect(() => {
    if (!open) {
      return;
    }

    setForm(toFormState(campaign));
  }, [campaign, open]);

  if (!open) {
    return null;
  }

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      budget: Number(form.budget),
      impressions: Number(form.impressions),
      clicks: Number(form.clicks),
      spend: Number(form.spend || 0),
      conversions: Number(form.conversions || 0),
      revenue: Number(form.revenue || form.spend || 0)
    });
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/55 px-4 py-4 backdrop-blur-sm sm:py-6">
      <div className="flex min-h-full items-start justify-center sm:items-center">
        <div className="flex w-full max-w-2xl max-h-[calc(100vh-2rem)] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.35)] dark:bg-slate-950 sm:max-h-[calc(100vh-3rem)]">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 dark:border-white/10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-300">
                {mode === "create" ? "Create campaign" : "Edit campaign"}
              </p>
              <h2 className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">
                {mode === "create" ? "Add a new campaign" : "Update campaign details"}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
            >
              Close
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Campaign name</span>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Client</span>
                  <input
                    required
                    value={form.client}
                    onChange={(event) => updateField("client", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Budget</span>
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.budget}
                    onChange={(event) => updateField("budget", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Status</span>
                  <select value={form.status} onChange={(event) => updateField("status", event.target.value)} className="select-field w-full">
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Impressions</span>
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.impressions}
                    onChange={(event) => updateField("impressions", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Clicks</span>
                  <input
                    required
                    min="0"
                    type="number"
                    value={form.clicks}
                    onChange={(event) => updateField("clicks", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Conversions</span>
                  <input
                    min="0"
                    type="number"
                    value={form.conversions}
                    onChange={(event) => updateField("conversions", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Spend</span>
                  <input
                    min="0"
                    type="number"
                    value={form.spend}
                    onChange={(event) => updateField("spend", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Revenue</span>
                  <input
                    min="0"
                    type="number"
                    value={form.revenue}
                    onChange={(event) => updateField("revenue", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Start date</span>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(event) => updateField("startDate", event.target.value)}
                    className="input-field w-full"
                  />
                </label>

                <label className="space-y-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">End date</span>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(event) => updateField("endDate", event.target.value)}
                    className="input-field w-full"
                  />
                </label>
              </div>

              {error && (
                <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-slate-200 px-5 py-4 dark:border-white/10">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:opacity-60 dark:border-white/10 dark:text-slate-200 dark:hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-900 disabled:opacity-60 dark:bg-white dark:text-ink-950"
              >
                {submitting ? "Saving..." : mode === "create" ? "Create campaign" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
