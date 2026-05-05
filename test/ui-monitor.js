const UI_URL = process.env.UI_URL ?? "http://localhost:3032";
const INTERVAL_MS = Number.parseInt(process.env.INTERVAL_MS ?? "1000", 10);

const fetchText = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }
  return response.text();
};

const extractAssetUrl = (html, pattern) => {
  const match = html.match(pattern);
  if (!match) {
    return null;
  }
  const [, assetPath] = match;
  return new URL(assetPath, UI_URL).toString();
};

const extractBackgroundColor = (cssText) => {
  const match = cssText.match(/background-color:\s*([^;]+);/i);
  if (!match) {
    return "unknown";
  }

  const rawValue = match[1].trim();
  return rawValue.split("}")[0].trim();
};

const extractUiVersion = (jsText) => {
  const match = jsText.match(/__UI_VERSION\s*=\s*["']([^"']+)["']/);
  return match ? match[1] : "unknown";
};

const readUiInfo = async () => {
  const html = await fetchText(`${UI_URL}/`);
  const cssUrl = extractAssetUrl(html, /href="(\/assets\/[^"]+\.css)"/i);
  const jsUrl = extractAssetUrl(html, /src="(\/assets\/[^"]+\.js)"/i);

  const [cssText, jsText] = await Promise.all([
    cssUrl ? fetchText(cssUrl) : "",
    jsUrl ? fetchText(jsUrl) : "",
  ]);

  const backgroundColor = cssText ? extractBackgroundColor(cssText) : "unknown";
  const uiVersion = jsText ? extractUiVersion(jsText) : "unknown";

  console.log(
    `ui ${new Date().toISOString()} ui_version=${uiVersion} background=${backgroundColor}`
  );
};

if (typeof fetch !== "function") {
  console.error("This script requires Node.js 18+ for fetch support.");
  process.exit(1);
}

setInterval(() => {
  readUiInfo().catch((error) => {
    console.error(`${new Date().toISOString()} ui_error=${error.message}`);
  });
}, Number.isFinite(INTERVAL_MS) ? INTERVAL_MS : 1000);
