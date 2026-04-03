const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.error?.message || `Request failed with status ${response.status}`);
  }

  return payload;
}

export async function fetchCampaigns(limit = 100) {
  const params = new URLSearchParams({ limit: String(limit) });
  const payload = await request(`/campaigns?${params.toString()}`);
  return Array.isArray(payload?.data) ? payload.data : [];
}
