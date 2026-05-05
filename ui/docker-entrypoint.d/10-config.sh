#!/bin/sh
set -e

API_BASE_URL_VALUE=${API_BASE_URL:-}
UI_CONTAINER_ID_VALUE=$(hostname)

cat <<EOF > /usr/share/nginx/html/config.js
window.__API_BASE_URL = "${API_BASE_URL_VALUE}";
window.__UI_CONTAINER_ID = "${UI_CONTAINER_ID_VALUE}";
EOF
