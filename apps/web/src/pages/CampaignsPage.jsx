import React, { useMemo, useState } from "react";
import { CampaignFormModal } from "../components/dashboard/CampaignFormModal";
import { CampaignTable } from "../components/dashboard/CampaignTable";
import { TableSkeleton } from "../components/dashboard/Skeletons";
import { currency, number } from "../lib/formatters";

export function CampaignsPage({
  campaigns,
  loading,
  error,
  mutationError,
  mutationPending,
  deletePending,
  activeActionId,
  saveCampaign,
  removeCampaign,
  clearMutationError,
  refresh
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const totals = useMemo(
    () => ({
      live: campaigns.filter((campaign) => campaign.status === "active").length,
      spend: campaigns.reduce((sum, campaign) => sum + campaign.spend, 0),
      conversions: campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0)
    }),
    [campaigns]
  );

  const openCreate = () => {
    clearMutationError();
    setModalMode("create");
    setSelectedCampaign(null);
    setModalOpen(true);
  };

  const openEdit = (campaign) => {
    clearMutationError();
    setModalMode("edit");
    setSelectedCampaign(campaign);
    setModalOpen(true);
  };

  const handleSave = async (values) => {
    try {
      await saveCampaign(modalMode, values);
      setModalOpen(false);
      setSelectedCampaign(null);
    } catch {}
  };

  const handleDelete = async (campaign) => {
    if (!window.confirm(`Delete "${campaign.name}" from the campaign registry?`)) {
      return;
    }

    try {
      await removeCampaign(campaign.id);
    } catch {}
  };

  if (error) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50/90 p-6 text-rose-900 shadow-panel dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
        <p className="text-sm font-semibold uppercase tracking-[0.24em]">Campaign data unavailable</p>
        <p className="mt-3 text-sm leading-7">{error}</p>
        <button type="button" onClick={refresh} className="mt-4 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white">
          Retry request
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        {[
          ["Active campaigns", number(totals.live)],
          ["Managed spend", currency(totals.spend)],
          ["Total conversions", number(totals.conversions)]
        ].map(([label, value]) => (
          <div key={label} className="dashboard-card">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-300">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          </div>
        ))}
      </div>

      {mutationError && !modalOpen && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100">
          {mutationError}
        </div>
      )}

      {loading ? (
        <TableSkeleton />
      ) : (
        <CampaignTable
          campaigns={campaigns}
          onCreate={openCreate}
          onEdit={openEdit}
          onDelete={handleDelete}
          activeActionId={activeActionId}
          deletePending={deletePending}
        />
      )}

      <CampaignFormModal
        open={modalOpen}
        mode={modalMode}
        campaign={selectedCampaign}
        onClose={() => {
          if (!mutationPending) {
            setModalOpen(false);
            setSelectedCampaign(null);
            clearMutationError();
          }
        }}
        onSubmit={handleSave}
        submitting={mutationPending}
        error={mutationError}
      />
    </>
  );
}
