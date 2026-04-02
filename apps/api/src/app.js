import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { env } from "./config/env.js";
import { requestId } from "./middleware/requestId.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { campaignRoutes } from "./routes/campaignRoutes.js";
import { getAlertHistory } from "./services/alertService.js";

export function createApp(io) {
  const app = express();

  app.use(cors({ origin: env.clientOrigin }));
  app.use(express.json());
  app.use(requestId);
  app.use(morgan(":method :url :status :response-time ms req=:req[x-request-id]"));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      limit: 100,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "campaign-api" });
  });

  app.get("/api/alerts", async (_req, res, next) => {
    try {
      const alerts = await getAlertHistory();
      res.json({ data: alerts });
    } catch (error) {
      next(error);
    }
  });

  app.use("/api/auth", authRoutes());
  app.use("/api/campaigns", campaignRoutes(io));
  app.use(errorHandler);

  return app;
}
