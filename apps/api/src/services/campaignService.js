import { pool } from "../db/pool.js";
import { httpError } from "../utils/httpError.js";

function mapCampaign(row) {
  return {
    ...row,
    ctr: row.impressions ? Number(((row.clicks / row.impressions) * 100).toFixed(2)) : 0,
    roas: row.spend ? Number((row.revenue / row.spend).toFixed(2)) : 0
  };
}

export async function listCampaigns({ page = 1, limit = 10, status, sort = "created_at", direction = "desc", search = "" }) {
  const safeSort = ["created_at", "spend", "budget", "impressions", "clicks", "conversions", "name"].includes(sort)
    ? sort
    : "created_at";
  const safeDirection = direction.toLowerCase() === "asc" ? "ASC" : "DESC";
  const offset = (Number(page) - 1) * Number(limit);
  const values = [];
  const where = ["deleted_at IS NULL"];

  if (status) {
    values.push(status);
    where.push(`status = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    where.push(`(name ILIKE $${values.length} OR client ILIKE $${values.length})`);
  }

  values.push(limit);
  values.push(offset);

  const { rows } = await pool.query(
    `
      SELECT *
      FROM campaigns
      WHERE ${where.join(" AND ")}
      ORDER BY ${safeSort} ${safeDirection}
      LIMIT $${values.length - 1}
      OFFSET $${values.length}
    `,
    values
  );

  return rows.map(mapCampaign);
}

export async function getCampaignById(id) {
  const { rows } = await pool.query("SELECT * FROM campaigns WHERE id = $1 AND deleted_at IS NULL", [id]);
  if (!rows[0]) {
    throw httpError(404, "Campaign not found");
  }
  return mapCampaign(rows[0]);
}

export async function createCampaign(payload) {
  const { rows } = await pool.query(
    `
      INSERT INTO campaigns (name, client, status, budget, spend, revenue, impressions, clicks, conversions, start_date, end_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `,
    [
      payload.name,
      payload.client,
      payload.status,
      payload.budget,
      payload.spend,
      payload.revenue || payload.budget,
      payload.impressions,
      payload.clicks,
      payload.conversions,
      payload.startDate || null,
      payload.endDate || null
    ]
  );

  return mapCampaign(rows[0]);
}

export async function updateCampaign(id, payload) {
  const { rows } = await pool.query(
    `
      UPDATE campaigns
      SET name = $2,
          client = $3,
          status = $4,
          budget = $5,
          spend = $6,
          revenue = $7,
          impressions = $8,
          clicks = $9,
          conversions = $10,
          start_date = $11,
          end_date = $12,
          updated_at = NOW()
      WHERE id = $1 AND deleted_at IS NULL
      RETURNING *
    `,
    [
      id,
      payload.name,
      payload.client,
      payload.status,
      payload.budget,
      payload.spend,
      payload.revenue || payload.budget,
      payload.impressions,
      payload.clicks,
      payload.conversions,
      payload.startDate || null,
      payload.endDate || null
    ]
  );

  if (!rows[0]) {
    throw httpError(404, "Campaign not found");
  }
  return mapCampaign(rows[0]);
}

export async function softDeleteCampaign(id) {
  const { rowCount } = await pool.query(
    "UPDATE campaigns SET deleted_at = NOW(), updated_at = NOW() WHERE id = $1 AND deleted_at IS NULL",
    [id]
  );

  if (!rowCount) {
    throw httpError(404, "Campaign not found");
  }

  return { success: true };
}
