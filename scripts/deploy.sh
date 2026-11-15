#!/usr/bin/env bash
# build and upload the site to the VPS.
#   DEPLOY_HOST=user@server-ip bun run deploy
set -euo pipefail
: "${DEPLOY_HOST:?set DEPLOY_HOST, e.g. DEPLOY_HOST=munene@1.2.3.4}"
DEST=/var/www/munene/current

vite build
node scripts/github.js HassanMunene build/github.json || echo "github.json not refreshed (keeping the server's copy)"
# --exclude keeps the server's daily-refreshed github.json if the fetch above failed
rsync -az --delete --exclude 'github.json' build/ "$DEPLOY_HOST:$DEST/"
[ -f build/github.json ] && rsync -az build/github.json "$DEPLOY_HOST:$DEST/github.json"
echo "deployed to $DEPLOY_HOST"
