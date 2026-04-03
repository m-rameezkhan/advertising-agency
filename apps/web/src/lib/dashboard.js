const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate()));
  }

  const [year, month, day] = String(value).split("T")[0].split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date, amount) {
  return new Date(date.getTime() + amount * DAY_MS);
}

function diffDays(start, end) {
  return Math.floor((end.getTime() - start.getTime()) / DAY_MS);
}

function sumValues(items, selector) {
  return items.reduce((total, item) => total + selector(item), 0);
}

export function normalizeCampaign(campaign) {
  const impressions = Number(campaign.impressions || 0);
  const clicks = Number(campaign.clicks || 0);
  const spend = Number(campaign.spend || 0);
  const revenue = Number(campaign.revenue || 0);

  return {
    ...campaign,
    budget: Number(campaign.budget || 0),
    spend,
    revenue,
    impressions,
    clicks,
    conversions: Number(campaign.conversions || 0),
    ctr: Number(campaign.ctr ?? (impressions ? (clicks / impressions) * 100 : 0)),
    roas: Number(campaign.roas ?? (spend ? revenue / spend : 0)),
    status: campaign.status || "draft",
    startDate: campaign.startDate || campaign.start_date || null,
    endDate: campaign.endDate || campaign.end_date || null,
    createdAt: campaign.createdAt || campaign.created_at || null
  };
}

export function calculateTotals(campaigns) {
  const totalImpressions = sumValues(campaigns, (campaign) => campaign.impressions);
  const totalClicks = sumValues(campaigns, (campaign) => campaign.clicks);
  const totalConversions = sumValues(campaigns, (campaign) => campaign.conversions);
  const totalSpend = sumValues(campaigns, (campaign) => campaign.spend);
  const totalRevenue = sumValues(campaigns, (campaign) => campaign.revenue);
  const totalBudget = sumValues(campaigns, (campaign) => campaign.budget);

  return {
    totalImpressions,
    totalClicks,
    totalConversions,
    totalSpend,
    totalRevenue,
    totalBudget,
    ctr: totalImpressions ? (totalClicks / totalImpressions) * 100 : 0,
    roas: totalSpend ? totalRevenue / totalSpend : 0,
    pacing: totalBudget ? (totalSpend / totalBudget) * 100 : 0
  };
}

export function getStatusCounts(campaigns) {
  return campaigns.reduce(
    (counts, campaign) => ({
      ...counts,
      [campaign.status]: (counts[campaign.status] || 0) + 1
    }),
    { active: 0, paused: 0, draft: 0, archived: 0 }
  );
}

function resolveRange(range) {
  const today = toUtcDate(new Date());

  if (typeof range === "number") {
    return {
      start: addDays(today, -(range - 1)),
      end: today
    };
  }

  const start = toUtcDate(range?.start);
  const end = toUtcDate(range?.end);

  if (!start || !end) {
    return {
      start: addDays(today, -29),
      end: today
    };
  }

  return {
    start,
    end
  };
}

export function buildTrendSeries(campaigns, range) {
  const { start, end } = resolveRange(range);
  const rangeInDays = Math.max(diffDays(start, end) + 1, 1);
  const points = Array.from({ length: rangeInDays }, (_, index) => {
    const date = addDays(start, index);

    return {
      date,
      day: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC"
      }),
      spend: 0,
      conversions: 0,
      clicks: 0,
      impressions: 0,
      revenue: 0
    };
  });

  campaigns.forEach((campaign) => {
    const campaignStart = toUtcDate(campaign.startDate || campaign.createdAt) || start;
    const campaignEnd = toUtcDate(campaign.endDate) || end;
    const activeDays = Math.max(diffDays(campaignStart, campaignEnd) + 1, 1);

    if (campaignEnd < start || campaignStart > end) {
      return;
    }

    const dailyMetrics = {
      spend: campaign.spend / activeDays,
      conversions: campaign.conversions / activeDays,
      clicks: campaign.clicks / activeDays,
      impressions: campaign.impressions / activeDays,
      revenue: campaign.revenue / activeDays
    };

    points.forEach((point) => {
      if (point.date < campaignStart || point.date > campaignEnd) {
        return;
      }

      point.spend += dailyMetrics.spend;
      point.conversions += dailyMetrics.conversions;
      point.clicks += dailyMetrics.clicks;
      point.impressions += dailyMetrics.impressions;
      point.revenue += dailyMetrics.revenue;
    });
  });

  return points.map((point) => ({
    day: point.day,
    spend: Number(point.spend.toFixed(2)),
    conversions: Number(point.conversions.toFixed(2)),
    clicks: Number(point.clicks.toFixed(2)),
    impressions: Number(point.impressions.toFixed(2)),
    revenue: Number(point.revenue.toFixed(2))
  }));
}

export function calculateChange(series, key) {
  if (!series.length) {
    return { trend: "up", value: "0.0%" };
  }

  const midpoint = Math.ceil(series.length / 2);
  const previous = sumValues(series.slice(0, midpoint), (point) => point[key] || 0);
  const current = sumValues(series.slice(midpoint), (point) => point[key] || 0);

  if (!previous && !current) {
    return { trend: "up", value: "0.0%" };
  }

  if (!previous) {
    return { trend: "up", value: "+100.0%" };
  }

  const delta = ((current - previous) / previous) * 100;

  return {
    trend: delta >= 0 ? "up" : "down",
    value: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`
  };
}

export function calculateRatioChange(series, numeratorKey, denominatorKey) {
  if (!series.length) {
    return { trend: "up", value: "0.0%" };
  }

  const midpoint = Math.ceil(series.length / 2);
  const previousNumerator = sumValues(series.slice(0, midpoint), (point) => point[numeratorKey] || 0);
  const previousDenominator = sumValues(series.slice(0, midpoint), (point) => point[denominatorKey] || 0);
  const currentNumerator = sumValues(series.slice(midpoint), (point) => point[numeratorKey] || 0);
  const currentDenominator = sumValues(series.slice(midpoint), (point) => point[denominatorKey] || 0);
  const previousRatio = previousDenominator ? previousNumerator / previousDenominator : 0;
  const currentRatio = currentDenominator ? currentNumerator / currentDenominator : 0;

  if (!previousRatio && !currentRatio) {
    return { trend: "up", value: "0.0%" };
  }

  if (!previousRatio) {
    return { trend: "up", value: "+100.0%" };
  }

  const delta = ((currentRatio - previousRatio) / previousRatio) * 100;

  return {
    trend: delta >= 0 ? "up" : "down",
    value: `${delta >= 0 ? "+" : ""}${delta.toFixed(1)}%`
  };
}

export function getTopCampaign(campaigns) {
  return [...campaigns].sort((left, right) => right.spend - left.spend)[0] || null;
}

export function getRangeLabel(rangeInDays) {
  if (rangeInDays === "7") {
    return "Last 7 days";
  }

  if (rangeInDays === "30") {
    return "Last 30 days";
  }

  if (rangeInDays === "90") {
    return "Last 90 days";
  }

  return "Custom range";
}
