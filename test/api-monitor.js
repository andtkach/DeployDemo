const API_URL = process.env.API_URL ?? "http://localhost:3031";
const INTERVAL_MS = Number.parseInt(process.env.INTERVAL_MS ?? "1000", 10);

const fetchJson = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.json();
};

const readApiInfo = async () => {
  const info = await fetchJson(`${API_URL}/`);
  console.log(
    `api ${new Date().toISOString()} server=${info.servername} version=${info.version}`
  );
};

if (typeof fetch !== "function") {
  console.error("This script requires Node.js 18+ for fetch support.");
  process.exit(1);
}

setInterval(() => {
  readApiInfo().catch((error) => {
    console.error(`${new Date().toISOString()} api_error=${error.message}`);
  });
}, Number.isFinite(INTERVAL_MS) ? INTERVAL_MS : 1000);
