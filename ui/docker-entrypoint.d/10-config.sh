#!/bin/sh
set -e

API_BASE_URL_VALUE=${API_BASE_URL:-}

cat <<EOF > /usr/share/nginx/html/config.js
window.__API_BASE_URL = "${API_BASE_URL_VALUE}";
EOF
