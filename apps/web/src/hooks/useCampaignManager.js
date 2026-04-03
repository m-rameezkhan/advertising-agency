import { useCallback, useEffect, useState } from "react";
import { createCampaign, deleteCampaign, fetchCampaigns, updateCampaign } from "../lib/api";
import { normalizeCampaign } from "../lib/dashboard";

export function useCampaignManager(enabled = true) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mutationError, setMutationError] = useState("");
  const [mutationPending, setMutationPending] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [activeActionId, setActiveActionId] = useState("");
  const [reloadToken, setReloadToken] = useState(0);

  const refresh = useCallback(() => {
    setReloadToken((current) => current + 1);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setCampaigns([]);
      setLoading(false);
      setError("");
      return undefined;
    }

    let active = true;

    async function loadCampaigns() {
      setLoading(true);
      setError("");

      try {
        const response = await fetchCampaigns(100);

        if (!active) {
          return;
        }

        setCampaigns(response.map(normalizeCampaign));
      } catch (loadError) {
        if (!active) {
          return;
        }

        setError(loadError.message || "Unable to load campaigns.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCampaigns();

    return () => {
      active = false;
    };
  }, [enabled, reloadToken]);

  const saveCampaign = useCallback(async (mode, values) => {
    setMutationPending(true);
    setMutationError("");

    try {
      if (mode === "create") {
        const createdCampaign = normalizeCampaign(await createCampaign(values));
        setCampaigns((current) => [createdCampaign, ...current]);
        return createdCampaign;
      }

      const updatedCampaign = normalizeCampaign(await updateCampaign(values.id, values));
      setCampaigns((current) => current.map((campaign) => (campaign.id === updatedCampaign.id ? updatedCampaign : campaign)));
      return updatedCampaign;
    } catch (submitError) {
      const message = submitError.message || "Unable to save campaign.";
      setMutationError(message);
      throw new Error(message);
    } finally {
      setMutationPending(false);
    }
  }, []);

  const removeCampaign = useCallback(async (campaignId) => {
    setDeletePending(true);
    setActiveActionId(campaignId);
    setMutationError("");

    try {
      await deleteCampaign(campaignId);
      setCampaigns((current) => current.filter((campaign) => campaign.id !== campaignId));
    } catch (deleteError) {
      const message = deleteError.message || "Unable to delete campaign.";
      setMutationError(message);
      throw new Error(message);
    } finally {
      setDeletePending(false);
      setActiveActionId("");
    }
  }, []);

  return {
    campaigns,
    loading,
    error,
    mutationError,
    mutationPending,
    deletePending,
    activeActionId,
    setMutationError,
    refresh,
    saveCampaign,
    removeCampaign
  };
}
