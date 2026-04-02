CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  client TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'draft', 'archived')),
  budget NUMERIC(12,2) NOT NULL,
  spend NUMERIC(12,2) NOT NULL DEFAULT 0,
  revenue NUMERIC(12,2) NOT NULL DEFAULT 0,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  conversions INTEGER NOT NULL DEFAULT 0,
  start_date DATE,
  end_date DATE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  ctr_threshold NUMERIC(5,2) NOT NULL DEFAULT 1.00,
  budget_threshold NUMERIC(5,2) NOT NULL DEFAULT 90.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO campaigns (name, client, status, budget, spend, revenue, impressions, clicks, conversions, start_date, end_date)
VALUES
  ('Lumiere Summer Launch', 'Lumiere Skincare', 'active', 50000, 32450, 155760, 2400000, 48000, 1200, '2026-03-01', '2026-04-15'),
  ('Urban Brew Retargeting', 'Urban Brew', 'paused', 22000, 17500, 68250, 980000, 14300, 410, '2026-02-10', '2026-05-10'),
  ('Atlas Fitness Trial Push', 'Atlas Fitness', 'active', 68000, 61200, 324360, 3250000, 51200, 1905, '2026-01-25', '2026-04-30');

INSERT INTO alert_rules (campaign_id, ctr_threshold, budget_threshold)
SELECT id, 1.00, 90.00
FROM campaigns
WHERE NOT EXISTS (
  SELECT 1
  FROM alert_rules
  WHERE alert_rules.campaign_id = campaigns.id
);
