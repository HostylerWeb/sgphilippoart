# SG Philippo Art — Next.js Storefront

Art gallery e-commerce site. **Design reference:** [`../index.html`](../index.html) at the repo root.

## Quick start (local development)

**Requirements:** Node.js 20+, pnpm, Docker (for PostgreSQL)

```bash
cd sgphilippoart

# 1. Environment
cp .env.example .env
# Edit .env if needed (defaults work with Docker Postgres below)

# 2. Start PostgreSQL
docker compose up -d postgres

# 3. Install dependencies
pnpm install

# 4. Database schema + seed data
pnpm db:push
pnpm db:seed

# 5. Run dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### View on your phone (same Wi‑Fi)

```bash
pnpm dev:mobile
```

Then on your phone open **`http://10.107.145.3:3000`** (use your LAN IP from `hostname -I`).

`next.config.ts` includes `allowedDevOrigins` for `10.107.145.3` so client JavaScript loads on mobile. If your IP changes, add it to `allowedDevOrigins` or set `ALLOWED_DEV_ORIGINS` in `.env`.

**Restart the dev server** after changing `next.config.ts`.

### View on your phone (any network — tunnel)

```bash
pnpm dev:mobile
pnpm tunnel
```

Add the tunnel hostname to `.env`:

```env
ALLOWED_DEV_ORIGINS="your-subdomain.loca.lt"
```

Restart `pnpm dev:mobile`, then open the tunnel URL on your phone.

**Admin:** `/admin` — `admin@sgphilippoart.com` / `Demo123!` (from seed)

---

## VPS production deployment

Full step-by-step for a fresh Ubuntu/Debian VPS (e.g. DigitalOcean, Hetzner, OVH).

### 1. Server prep

```bash
# SSH into the VPS as root or sudo user
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in so docker group applies
```

### 2. Clone and configure

```bash
cd /var/www
sudo git clone git@github.com:HostylerWeb/sgphilippoart.git html
cd html/sgphilippoart
cp .env.example .env
```

Edit `.env` for production:

```env
DATABASE_URL="postgresql://sgphilippoart:CHANGE_ME@postgres:5432/sgphilippoart?schema=public"
NEXT_PUBLIC_SITE_URL="https://sgphilippoart.com"
NEXT_PUBLIC_SITE_NAME="SG Philippo Art"
AUTH_SECRET="<run: openssl rand -base64 32>"
AUTH_URL="https://sgphilippoart.com"
STUDIO_EMAIL="contact@sgphilippoart.com"
SMTP_HOST="mail.your-provider.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="contact@sgphilippoart.com"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM_NAME="SG Philippo Art"
ADMIN_SEED_PASSWORD="Choose-a-strong-password"
```

Set a strong Postgres password in `docker-compose.yml` under `postgres.environment.POSTGRES_PASSWORD` and match it in `DATABASE_URL` for the app service.

### 3. Build and launch with Docker

```bash
docker compose up -d --build
```

This starts:
- **postgres** — PostgreSQL 16 (port 5432, persisted volume)
- **app** — Next.js on port 3000 (uploads volume at `uploads_data`)

Initialize the database (first deploy only):

```bash
docker compose exec app npx prisma db push
docker compose exec app npx tsx prisma/seed.ts
```

### 4. Nginx + SSL

```bash
sudo cp deploy/nginx.conf.example /etc/nginx/sites-available/sgphilippoart.com
sudo ln -s /etc/nginx/sites-available/sgphilippoart.com /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d sgphilippoart.com -d www.sgphilippoart.com
```

Point DNS **A records** for `sgphilippoart.com` and `www` to the VPS IP before running certbot.

### 5. Updates (redeploy)

```bash
cd /var/www/html/sgphilippoart
git pull
docker compose up -d --build
docker compose exec app npx prisma db push   # if schema changed
```

### 6. Backups

```bash
# Daily Postgres dump (add to crontab)
docker compose exec -T postgres pg_dump -U sgphilippoart sgphilippoart > backup-$(date +%F).sql
```

Back up the Docker volume for uploads (`uploads_data`) or bind-mount `public/uploads` to the host.

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Run production build locally |
| `pnpm db:push` | Sync Prisma schema to database |
| `pnpm db:seed` | Seed homepage content + admin user |
| `pnpm db:studio` | Prisma Studio GUI |

## Internationalization (EN / FR)

- **UI labels** — static strings in `src/i18n/dictionaries/` (EN + FR).
- **Dynamic content** — managed in admin with a **French (FR) translation** section on each form:
  - **Products** — title, description, medium, meta fields
  - **Collections** — name, description
  - **Hero tiles** — eyebrow, title, link text, image alt
  - **Reviews** — title, body
  - **Site settings** — announcement, footer, concierge, shipping/tax labels (French translations section)

English fields are the default/fallback. French visitors (cookie `spa_locale=fr`, default locale is FR) see admin translations when provided.

Language toggle: header (EN / FR). URL `?lang=en` or `?lang=fr` sets the cookie.

## Environment variables

See `.env.example`. Key values:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection |
| `AUTH_SECRET` | Auth.js session signing |
| `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `STUDIO_EMAIL` | Sender + admin notification inbox |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (587 STARTTLS, 465 SSL) |
| `SMTP_USER` / `SMTP_PASSWORD` | SMTP authentication |

Full build plan: [`../plan.md`](../plan.md)
