import { Router } from "express";
import { env } from "../config/env.js";
import { generateStructuredJson, streamStructuredJson } from "../services/openaiService.js";

export function generationRoutes() {
  const router = Router();

  router.post("/copy", async (req, res, next) => {
    try {
      const { product, tone, platform, word_limit: wordLimit = 60, stream } = req.body || {};
      const prompt = `
        Return JSON with keys headline, body, cta.
        Product: ${product}
        Tone: ${tone}
        Platform: ${platform}
        Word limit: ${wordLimit}
      `;
      const fallback = {
        headline: `Launch ${product || "your offer"} with confidence`,
        body: `Introduce ${product || "your product"} on ${platform || "your next campaign"} with a ${tone || "clear"} message, one audience pain point, and one measurable benefit.`,
        cta: "Book a strategy call"
      };

      if (stream) {
        await streamStructuredJson(prompt, res, fallback);
        return;
      }

      res.json(await generateStructuredJson(prompt, fallback));
    } catch (error) {
      next(error);
    }
  });

  router.post("/social", async (req, res, next) => {
    try {
      const { platform, campaign_goal: campaignGoal, brand_voice: brandVoice } = req.body || {};
      res.json(
        await generateStructuredJson(`
          Return JSON with key captions as an array of exactly 5 strings.
          Platform: ${platform}
          Campaign goal: ${campaignGoal}
          Brand voice: ${brandVoice}
        `, {
          captions: [
            `${platform || "Social"} campaign built to drive ${campaignGoal || "results"} with a ${brandVoice || "confident"} tone.`,
            `Turn attention into action with a simple promise, strong visual, and direct CTA.`,
            `Highlight one product win, one audience problem, and one reason to trust the brand.`,
            `Keep the message short, benefit-led, and tailored for scroll-stopping creative.`,
            `Close with a next step that feels easy to act on today.`
          ]
        })
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/hashtags", async (req, res, next) => {
    try {
      const { content, industry } = req.body || {};
      res.json(
        await generateStructuredJson(`
          Return JSON with key hashtags as an array of exactly 10 hashtag strings.
          Content: ${content}
          Industry: ${industry}
        `, {
          hashtags: [
            "#AdvertisingStrategy",
            "#DigitalCampaigns",
            "#BrandGrowth",
            "#PerformanceMarketing",
            "#CreativeStrategy",
            "#AudienceFirst",
            "#CampaignLaunch",
            "#MarketingOps",
            `#${String(industry || "Marketing").replace(/\s+/g, "")}`,
            "#AgencyWorkflow"
          ]
        })
      );
    } catch (error) {
      next(error);
    }
  });

  router.post("/brief", async (req, res, next) => {
    try {
      res.json(
        await generateStructuredJson(`
          Return JSON with keys:
          campaignTitle (string),
          headlines (array of exactly 3 strings),
          toneGuide (string),
          channels (array of objects with name and allocation numeric percent),
          heroVisual (string).

          Client name: ${req.body.clientName}
          Industry: ${req.body.industry}
          Website: ${req.body.website}
          Competitors: ${req.body.competitors}
          Objective: ${req.body.objective}
          Target audience: ${req.body.targetAudience}
          Budget: ${req.body.budget}
          Tone: ${req.body.tone}
          Imagery style: ${req.body.imageryStyle}
          Color direction: ${req.body.colorDirection}
          Do and don't: ${req.body.dosDonts}
        `, {
          campaignTitle: `${req.body.clientName || "Client"} ${req.body.objective || "Growth"} Campaign`,
          headlines: [
            `Make ${req.body.clientName || "your brand"} the first choice for ${req.body.targetAudience || "your audience"}.`,
            `A clearer message for ${req.body.industry || "your category"} buyers ready to act.`,
            `Creative built to turn attention into measurable campaign momentum.`
          ],
          toneGuide: `Use a ${req.body.tone || "clear and confident"} tone with concise benefit-led copy, practical proof points, and direct calls to action.`,
          channels: [
            { name: "Paid Social", allocation: 40 },
            { name: "Search", allocation: 35 },
            { name: "Display Retargeting", allocation: 25 }
          ],
          heroVisual: `Develop a ${req.body.imageryStyle || "clean"} hero visual with ${req.body.colorDirection || "brand-led"} color direction that highlights the audience problem and product payoff in one frame.`
        })
      );
    } catch (error) {
      next(error);
    }
  });

  router.get("/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "ai-content-generation",
      model: env.model,
      mode: env.apiKey && !env.apiKey.startsWith("replace-with-") ? "live" : "fallback"
    });
  });

  return router;
}
