# Deploying to the VPS

One-time server setup (Ubuntu, as a sudo user):

```sh
sudo apt update && sudo apt install -y caddy rsync nodejs
sudo mkdir -p /var/www/munene/current && sudo chown -R $USER /var/www/munene
sudo cp Caddyfile /etc/caddy/Caddyfile && sudo systemctl reload caddy
# daily refresh of the github graph at 09:00
(crontab -l 2>/dev/null; echo '0 9 * * * cd /var/www/munene && node github.mjs HassanMunene current/github.json') | crontab -
```

Copy `scripts/github.js` to `/var/www/munene/github.mjs` once (the `.mjs` name is needed on the server).

DNS (Hostinger → DNS zone): an `A` record for `@` and for `www` pointing to the VPS IP.

Each deploy from your laptop: `DEPLOY_HOST=user@server-ip bun run deploy`

## Deploy on every push (GitHub Actions)

`.github/workflows/deploy.yml` builds the site and uploads it whenever you push to `main`.

1. On your laptop make a key only for deploys: `ssh-keygen -t ed25519 -f ~/.ssh/munene_deploy -N ""`
2. Put the public half on the VPS: `ssh-copy-id -i ~/.ssh/munene_deploy.pub user@server-ip`
3. On GitHub: repo > Settings > Secrets and variables > Actions, add `DEPLOY_HOST`, `DEPLOY_USER`, and `DEPLOY_SSH_KEY` (the contents of `~/.ssh/munene_deploy`, the private file).
4. Push to `main`. Watch it run in the repo's Actions tab.

Keep the private key out of the repo. If the laptop is lost, delete the key from the VPS's `~/.ssh/authorized_keys` and make a new one.
