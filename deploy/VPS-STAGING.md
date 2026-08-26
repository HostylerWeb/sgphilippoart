# VPS staging deployment (multi-site with Hostyler)

SG Philippo Art runs as **site #2** on the same Hostinger VPS as Hostyler.

| Item | Value |
|------|--------|
| **Staging URL** | https://srv1872514.hstgr.cloud |
| **App path** | `/var/www/sites/sgphilippoart` |
| **Port** | `3001` (Hostyler keeps `3000`) |
| **Systemd** | `sgphilippoart.service` |
| **Nginx** | `/etc/nginx/sites-enabled/sgphilippoart.staging` |
| **Database** | PostgreSQL DB `sgphilippoart` on existing `hostyler-postgres` (`127.0.0.1:5432`) |
| **Unix user** | `hostyler` |

## Do not break Hostyler

- Never use port **3000** for this app.
- Never edit `/var/www/sites/hostyler` or `hostyler.service`.
- `hostyler.com` / `www.hostyler.com` must keep pointing to port 3000.
- The VPS hostname `srv1872514.hstgr.cloud` was **removed** from Hostyler’s Nginx `server_name` and assigned to SG Philippo Art.

## Deploy updates

1. **Commit and push** from your dev machine:

```bash
git push origin main
```

2. **Pull and rebuild on the VPS** (app lives at `/var/www/sites/sgphilippoart`, owned by `hostyler`):

```bash
ssh root@145.223.88.74 '
  cd /var/www/sites/sgphilippoart
  sudo -u hostyler git fetch origin
  sudo -u hostyler git reset --hard origin/main
  sudo -u hostyler git clean -fd -e public/uploads -e .env
  sudo -u hostyler pnpm install --no-frozen-lockfile
  sudo -u hostyler pnpm db:migrate:deploy
  rm -rf .next
  sudo -u hostyler NODE_ENV=production pnpm build
  systemctl restart sgphilippoart
'
```

The server clones from `https://github.com/HostylerWeb/sgphilippoart.git` (public read). For a private repo later, add a read-only deploy key for the `hostyler` user.

**Important:** `git clean` keeps `public/uploads/` and `.env` so deploys do not delete uploaded images or server secrets.

## Broken product images after deploy?

If `/_next/image?url=/uploads/products/...` shows "The requested resource isn't a valid image", the file is missing on disk (usually wiped by an older rsync `--delete` without upload excludes). Re-upload the image in `/admin` after deploying with the excludes above.

## Cutover to sgphilippoart.com

1. Point DNS A records for `sgphilippoart.com` and `www` to the VPS IP.
2. Add `server_name sgphilippoart.com www.sgphilippoart.com` to the Nginx site (or a new vhost).
3. Update `.env`: `NEXT_PUBLIC_SITE_URL`, `AUTH_URL` → `https://sgphilippoart.com`
4. Rebuild (`NEXT_PUBLIC_*` is baked in at build time).
5. `certbot --nginx -d sgphilippoart.com -d www.sgphilippoart.com`
6. `systemctl restart sgphilippoart`

## Logs

```bash
journalctl -u sgphilippoart -f
systemctl status sgphilippoart
curl -I http://127.0.0.1:3001/
```

## Seed admin (first deploy only)

Default seed user: `admin@sgphilippoart.com` — password is `ADMIN_SEED_PASSWORD` in `.env` on the server. Change it after first login.
