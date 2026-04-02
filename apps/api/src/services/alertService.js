import { pool } from "../db/pool.js";

export async function getAlertHistory(limit = 20) {
  const { rows } = await pool.query(
    `
      SELECT id, campaign_id, title, message, severity, created_at
      FROM alert_history
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  );

  return rows.map((row) => ({ ...row, read: false }));
}

export async function evaluateCampaignAlerts(campaign, io) {
  const ctr = campaign.impressions ? (campaign.clicks / campaign.impressions) * 100 : 0;
  const spendRatio = campaign.budget ? campaign.spend / campaign.budget : 0;
  const findings = [];

  if (ctr < 1) {
    findings.push({
      title: `CTR alert for ${campaign.name}`,
      message: `CTR dropped to ${ctr.toFixed(2)}%, which is below the 1.00% threshold.`,
      severity: "high"
    });
  }

  if (spendRatio >= 0.9) {
    findings.push({
      title: `Budget pacing alert for ${campaign.name}`,
      message: `Campaign has spent ${(spendRatio * 100).toFixed(0)}% of its budget.`,
      severity: "medium"
    });
  }

  for (const finding of findings) {
    const { rows } = await pool.query(
      `
        INSERT INTO alert_history (campaign_id, title, message, severity)
        VALUES ($1, $2, $3, $4)
        RETURNING id, campaign_id, title, message, severity, created_at
      `,
      [campaign.id, finding.title, finding.message, finding.severity]
    );

    io.emit("alerts:new", { ...rows[0], read: false });
  }
}
