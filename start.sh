#!/bin/sh
# THIS IS A START SCRIPT FOR NGINX, WHICH WILL BE USED TO START THE NGINX SERVER
# DO NOT MODIFY THIS FILE

# Check if BACKEND_API_URL environment variable exists
if [ -n "$BACKEND_API_URL" ]; then
  # Update backend.json with BACKEND_API_URL
  echo "{\"BACKEND_API_URL\": \"$BACKEND_API_URL\"}" > /usr/share/nginx/html/backend.json
fi

# Start nginx
nginx -g 'daemon off;'