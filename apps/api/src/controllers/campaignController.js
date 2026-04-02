import { createCampaign, getCampaignById, listCampaigns, softDeleteCampaign, updateCampaign } from "../services/campaignService.js";
import { evaluateCampaignAlerts } from "../services/alertService.js";

export function createCampaignController(io) {
  return {
    list: async (req, res, next) => {
      try {
        const campaigns = await listCampaigns(req.query);
        res.json({ data: campaigns });
      } catch (error) {
        next(error);
      }
    },
    getOne: async (req, res, next) => {
      try {
        const campaign = await getCampaignById(req.params.id);
        res.json({ data: campaign });
      } catch (error) {
        next(error);
      }
    },
    create: async (req, res, next) => {
      try {
        const campaign = await createCampaign(req.body);
        await evaluateCampaignAlerts(campaign, io);
        res.status(201).json({ data: campaign });
      } catch (error) {
        next(error);
      }
    },
    update: async (req, res, next) => {
      try {
        const campaign = await updateCampaign(req.params.id, req.body);
        await evaluateCampaignAlerts(campaign, io);
        res.json({ data: campaign });
      } catch (error) {
        next(error);
      }
    },
    remove: async (req, res, next) => {
      try {
        const result = await softDeleteCampaign(req.params.id);
        res.json({ data: result });
      } catch (error) {
        next(error);
      }
    }
  };
}
