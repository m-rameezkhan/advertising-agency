import { getSessionToken } from "./session";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = getSessionToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers,
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const details = Array.isArray(payload?.error?.details) && payload.error.details.length > 0 ? ` ${payload.error.details.join(" ")}` : "";
    throw new Error(`${payload?.error?.message || `Request failed with status ${response.status}`}${details}`);
  }

  return payload;
}

export async function fetchCampaigns(limit = 100) {
  const params = new URLSearchParams({ limit: String(limit) });
  const payload = await request(`/campaigns?${params.toString()}`);
  return Array.isArray(payload?.data) ? payload.data : [];
}

export async function createCampaign(payload) {
  const response = await request("/campaigns", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response?.data;
}

export async function updateCampaign(id, payload) {
  const response = await request(`/campaigns/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });

  return response?.data;
}

export async function deleteCampaign(id) {
  return request(`/campaigns/${id}`, {
    method: "DELETE"
  });
}

export async function login(payload) {
  const response = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response;
}

export async function signup(payload) {
  const response = await request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload)
  });

  return response;
}
