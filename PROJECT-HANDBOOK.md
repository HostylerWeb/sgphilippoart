# SG Philippo Art — Project handbook

Quick reference if you forget where things live, how to deploy, or how to get back in.

> **Security:** This file is committed to GitHub. Do **not** paste real passwords here.
> Store secrets in a password manager and in the server `.env` file (never committed).
> If a password was ever shared in chat or email, rotate it.

---

## GitHub

| Item | Value |
|------|--------|
| **Repository** | https://github.com/HostylerWeb/sgphilippoart |
| **Clone (SSH)** | `git@github.com:HostylerWeb/sgphilippoart.git` |
| **Default branch** | `main` |
| **GitHub org** | `HostylerWeb` |

**Push changes from your machine:**

```bash
cd /var/www/html/sgphilippoart   # or your local clone path
git add .
git commit -m "Describe your change"
git push origin main
```

**SSH key for GitHub (this dev machine):** `~/.ssh/id_ed25519_github`

The VPS does **not** have a GitHub deploy key yet — production updates use **rsync** (see below), not `git pull` on the server.

---

## Local development

| Item | Value |
|------|--------|
| **Project folder (this machine)** | `/var/www/html/sgphilippoart` |
| **Stack** | Next.js 16, Prisma, PostgreSQL, pnpm |
| **Dev URL** | http://localhost:3000 |
| **Env file** | `.env` (copy from `.env.example` — not in git) |

**First-time setup:**

```bash
cd /var/www/html/sgphilippoart
cp .env.example .env
docker compose up -d postgres
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

**Common commands:**

```bash
pnpm dev              # local dev server
pnpm build            # production build check
pnpm db:migrate       # new migration (dev)
pnpm db:migrate:deploy  # apply migrations (production)
pnpm db:seed          # seed demo data (dev only)
pnpm lint
```

**Admin (local, after seed):**

- URL: http://localhost:3000/admin
- Email: `admin@sgphilippoart.com`
- Password: value of `ADMIN_SEED_PASSWORD` in your local `.env` (seed default in code: `Demo123!` if unset)

More detail: [`README.md`](README.md), [`deploy/README.md`](deploy/README.md)

---

## VPS (Hostinger) — production / staging

| Item | Value |
|------|--------|
| **Provider** | Hostinger VPS |
| **VPS IP** | `145.223.88.74` |
| **Staging URL** | https://srv1872514.hstgr.cloud |
| **Production domain (planned)** | https://sgphilippoart.com |
| **App on server** | `/var/www/sites/sgphilippoart` |
| **App Unix user** | `hostyler` |
| **App port** | `3001` |
| **Systemd service** | `sgphilippoart.service` |
| **Nginx config** | `/etc/nginx/sites-enabled/sgphilippoart.staging` |
| **Server env file** | `/var/www/sites/sgphilippoart/.env` |

### SSH access

```bash
# Deploy / admin (full access)
ssh root@145.223.88.74

# App user (if needed)
ssh hostyler@145.223.88.74
```

**Where to get / reset the VPS root password:** Hostinger hPanel → VPS → SSH / root access.

Do not store the root password in this repo. Keep it in your password manager.

### Same VPS — Hostyler (do not break)

| Item | Value |
|------|--------|
| **Site** | https://hostyler.com |
| **App path** | `/var/www/sites/hostyler` |
| **Port** | `3000` |
| **Service** | `hostyler.service` |
| **Port registry** | `/var/www/sites/ports.conf` (`sgphilippoart=3001`) |

**Rules:**

- Never use port **3000** for SG Philippo Art.
- Never edit Hostyler’s app, nginx, or systemd without intending to change Hostyler.
- `srv1872514.hstgr.cloud` is routed to **SG Philippo Art**, not Hostyler.

---

## Database (VPS)

| Item | Value |
|------|--------|
| **Engine** | PostgreSQL (Docker container `hostyler-postgres`) |
| **Host** | `127.0.0.1:5432` (on the VPS) |
| **Database name** | `sgphilippoart` |
| **Connection string** | In server `.env` as `DATABASE_URL` |

Credentials live only in `/var/www/sites/sgphilippoart/.env` on the server.

---

## How to update the live website (staging)

From your **local machine**, in the project folder:

```bash
cd /var/www/html/sgphilippoart

# 1. Optional but recommended: commit and push to GitHub first
git push origin main

# 2. Sync files to the VPS (excludes node_modules, .next, .env)
rsync -az --delete \
  --exclude node_modules --exclude .next --exclude .env \
  --exclude public/uploads/products --exclude public/uploads/hero \
  -e ssh \
  ./ root@145.223.88.74:/var/www/sites/sgphilippoart/

# 3. Install, migrate, build, restart on the server
ssh root@145.223.88.74 '
  chown -R hostyler:hostyler /var/www/sites/sgphilippoart
  cd /var/www/sites/sgphilippoart
  sudo -u hostyler pnpm install --frozen-lockfile
  sudo -u hostyler pnpm db:migrate:deploy
  sudo -u hostyler NODE_ENV=production pnpm build
  systemctl restart sgphilippoart
'
```

**Important:** `NEXT_PUBLIC_*` and `AUTH_URL` are baked in at **build** time. If you change them in `.env`, you must run `pnpm build` again on the server.

**Current staging env (on server):**

- `NEXT_PUBLIC_SITE_URL` / `AUTH_URL` → `https://srv1872514.hstgr.cloud`
- `PORT=3001`

Full staging notes: [`deploy/VPS-STAGING.md`](deploy/VPS-STAGING.md)

---

## Logs & health checks (VPS)

```bash
ssh root@145.223.88.74

# Service status
systemctl status sgphilippoart

# Live logs
journalctl -u sgphilippoart -f

# App responding locally
curl -I http://127.0.0.1:3001/

# Nginx reload after config change
nginx -t && systemctl reload nginx
```

---

## Admin panel (storefront)

| Item | Value |
|------|--------|
| **Staging admin URL** | https://srv1872514.hstgr.cloud/admin |
| **Email** | `admin@sgphilippoart.com` |
| **Password** | Set on first deploy via `ADMIN_SEED_PASSWORD` in **server** `.env`; change after first login |

If locked out: reset password in the database or re-run seed on a fresh DB (see `deploy/README.md`).

---

## Email (SMTP)

Configured in `.env` on the server:

- `STUDIO_EMAIL` — sender and studio inbox for notifications
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM_NAME`

On staging, SMTP may be empty (emails log to console / journal). Check server `.env` for current values.

Test locally: `pnpm smtp:test` / `pnpm email:test`

---

## Credentials checklist (store in password manager)

Fill these in your password manager — **not** in this file:

| What | Where to find / set |
|------|---------------------|
| VPS root password | Hostinger hPanel |
| VPS `hostyler` user password (if used) | Hostinger / server setup |
| GitHub SSH key passphrase | Your machine (`~/.ssh/id_ed25519_github`) |
| Server `.env` (`DATABASE_URL`, `AUTH_SECRET`, SMTP, etc.) | `/var/www/sites/sgphilippoart/.env` |
| Admin login password | Server `.env` `ADMIN_SEED_PASSWORD` or changed in app |
| Hostinger / domain DNS | Hostinger domain panel |
| Google OAuth (optional) | Google Cloud Console → `.env` |

---

## Cutover to sgphilippoart.com (when DNS is ready)

1. Point DNS A records for `sgphilippoart.com` and `www` to `145.223.88.74`.
2. Add `server_name sgphilippoart.com www.sgphilippoart.com` in Nginx (or new vhost).
3. Update server `.env`: `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` → `https://sgphilippoart.com`
4. Rebuild on server: `sudo -u hostyler NODE_ENV=production pnpm build`
5. SSL: `certbot --nginx -d sgphilippoart.com -d www.sgphilippoart.com`
6. `systemctl restart sgphilippoart`

Details: [`deploy/VPS-STAGING.md`](deploy/VPS-STAGING.md) § Cutover

---

## Related files in this repo

| File | Purpose |
|------|---------|
| [`README.md`](README.md) | Local dev & general overview |
| [`deploy/VPS-STAGING.md`](deploy/VPS-STAGING.md) | Staging deploy & Hostyler coexistence |
| [`deploy/README.md`](deploy/README.md) | Production Docker deploy checklist |
| [`deploy/vps-systemd.sgphilippoart.service`](deploy/vps-systemd.sgphilippoart.service) | Systemd unit template |
| [`deploy/vps-nginx.staging.conf`](deploy/vps-nginx.staging.conf) | Nginx staging vhost template |
| [`.env.example`](.env.example) | Env variable reference |

---

## Quick troubleshooting

| Problem | What to check |
|---------|----------------|
| Site down | `systemctl status sgphilippoart`, `journalctl -u sgphilippoart -n 50` |
| 502 from Nginx | Is app on port 3001? `curl http://127.0.0.1:3001/` |
| DB errors | `DATABASE_URL` in server `.env`, Postgres container running |
| Auth redirect loops | `AUTH_URL` matches public URL; rebuild after change |
| Emails not sending | SMTP vars in server `.env`, `pnpm smtp:test` locally |
| Hostyler broken | Confirm Hostyler still on port 3000 and untouched |

---

*Last updated: March 2026 — keep this file in sync when infrastructure changes.*
