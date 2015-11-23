#!/usr/bin/env bash

# Generate session token
export ETHERPAD_SESSION=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)

# Generate configuration
envsubst < settings-template.json > settings.json

# Export PM2 env
export PM2_HOME=.
# Avoid Keymetrics banner
echo 1 > "touch"

# Start Etherpad
/usr/bin/pm2 start node_modules/ep_etherpad-lite/node/server.js || exit 1

# Stream logs
/usr/bin/pm2 logs
