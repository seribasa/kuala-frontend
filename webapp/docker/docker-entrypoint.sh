#!/usr/bin/env sh
set -e

# Generate runtime env.js from template
if [ -f /usr/share/nginx/html/env.template.js ]; then
  # Only substitute the variables we care about for safety
  : "${API_BASE_URL:=https://kuala-api-staging.seribasa.digital}"
  envsubst '${API_BASE_URL}' < /usr/share/nginx/html/env.template.js > /usr/share/nginx/html/env.js
fi

# Start nginx in foreground
exec nginx -g 'daemon off;'
