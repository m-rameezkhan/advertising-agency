import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validateCampaign } from "../middleware/validateCampaign.js";
import { createCampaignController } from "../controllers/campaignController.js";

export function campaignRoutes(io) {
  const router = Router();
  const controller = createCampaignController(io);

  router.get("/", controller.list);
  router.get("/:id", controller.getOne);
  router.use(authenticate);
  router.post("/", validateCampaign, controller.create);
  router.put("/:id", validateCampaign, controller.update);
  router.delete("/:id", controller.remove);

  return router;
}
