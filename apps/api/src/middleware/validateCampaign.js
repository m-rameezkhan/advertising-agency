import { httpError } from "../utils/httpError.js";

const validStatuses = ["active", "paused", "draft", "archived"];

export function validateCampaign(req, _res, next) {
  const payload = req.body || {};
  const errors = [];

  ["name", "client", "status", "budget", "spend", "impressions", "clicks", "conversions"].forEach((field) => {
    if (payload[field] === undefined || payload[field] === null || payload[field] === "") {
      errors.push(`${field} is required`);
    }
  });

  if (payload.status && !validStatuses.includes(payload.status)) {
    errors.push(`status must be one of: ${validStatuses.join(", ")}`);
  }

  ["budget", "spend", "impressions", "clicks", "conversions"].forEach((field) => {
    if (payload[field] !== undefined && Number(payload[field]) < 0) {
      errors.push(`${field} must be a non-negative number`);
    }
  });

  if (errors.length > 0) {
    return next(httpError(400, "Campaign validation failed", errors));
  }

  return next();
}
