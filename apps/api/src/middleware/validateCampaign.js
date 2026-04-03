import { httpError } from "../utils/httpError.js";

const validStatuses = ["active", "paused", "draft", "archived"];
const numericFields = ["budget", "spend", "revenue", "impressions", "clicks", "conversions"];

function normalizeNumber(value, fallback = 0) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return Number(value);
}

export function validateCampaign(req, _res, next) {
  const payload = req.body || {};
  const errors = [];
  const normalizedPayload = {
    name: String(payload.name || "").trim(),
    client: String(payload.client || "").trim(),
    status: payload.status,
    budget: normalizeNumber(payload.budget),
    spend: normalizeNumber(payload.spend),
    revenue: normalizeNumber(payload.revenue, undefined),
    impressions: normalizeNumber(payload.impressions),
    clicks: normalizeNumber(payload.clicks),
    conversions: normalizeNumber(payload.conversions),
    startDate: payload.startDate || null,
    endDate: payload.endDate || null
  };

  ["name", "client", "status", "budget", "impressions", "clicks"].forEach((field) => {
    if (normalizedPayload[field] === undefined || normalizedPayload[field] === null || normalizedPayload[field] === "") {
      errors.push(`${field} is required`);
    }
  });

  if (normalizedPayload.status && !validStatuses.includes(normalizedPayload.status)) {
    errors.push(`status must be one of: ${validStatuses.join(", ")}`);
  }

  numericFields.forEach((field) => {
    if (normalizedPayload[field] !== undefined && (!Number.isFinite(normalizedPayload[field]) || normalizedPayload[field] < 0)) {
      errors.push(`${field} must be a non-negative number`);
    }
  });

  if (normalizedPayload.clicks > normalizedPayload.impressions) {
    errors.push("clicks cannot exceed impressions");
  }

  if (normalizedPayload.conversions > normalizedPayload.clicks) {
    errors.push("conversions cannot exceed clicks");
  }

  if (normalizedPayload.startDate && normalizedPayload.endDate && normalizedPayload.startDate > normalizedPayload.endDate) {
    errors.push("startDate must be before endDate");
  }

  if (errors.length > 0) {
    return next(httpError(400, "Campaign validation failed", errors));
  }

  req.body = {
    ...normalizedPayload,
    revenue: normalizedPayload.revenue ?? normalizedPayload.spend
  };

  return next();
}
