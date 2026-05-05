const resolveApiBaseUrl = () => {
  if (typeof window !== "undefined" && window.__API_BASE_URL) {
    return window.__API_BASE_URL;
  }

  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  if (typeof window !== "undefined") {
    return `http://${window.location.hostname}:3031`;
  }

  return "http://localhost:3031";
};

const API_BASE_URL = resolveApiBaseUrl();

const fetchJson = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with ${response.status}`);
  }
  return response.json();
};

export const fetchApiInfo = async () => fetchJson(`${API_BASE_URL}/`);

export const fetchCities = async (limit = 1000) =>
  fetchJson(`${API_BASE_URL}/cities?num=${limit}`);

export const createCity = async (name) =>
  fetchJson(`${API_BASE_URL}/cities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
