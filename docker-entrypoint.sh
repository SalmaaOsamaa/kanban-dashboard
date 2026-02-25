#!/bin/sh
# Seed db.json from the default copy on first run (volume will be empty)
if [ ! -f /app/data/db.json ]; then
  mkdir -p /app/data
  cp /app/db.json.default /app/data/db.json
fi

cd /app/data
exec "$@"
