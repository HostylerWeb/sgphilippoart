# Production deployment

## 1. Environment

Copy `.env.example` to `.env` on the server and set:

- `POSTGRES_PASSWORD` — strong database password
- `DATABASE_URL` — PostgreSQL connection string (set automatically in Docker Compose)
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_URL` / `NEXT_PUBLIC_SITE_URL` — `https://sgphilippoart.com`
- `STUDIO_EMAIL` + SMTP settings (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`) for transactional email

**Never run `pnpm db:seed` on production.** Create the admin user manually or run seed once on a fresh database before launch, then change the password immediately.

## 2. Docker Compose

```bash
docker compose up -d --build
```

Migrations run automatically on container start via `scripts/docker-entrypoint.sh`.

**Existing database created with `db:push`?** Baseline once before deploy:

```bash
npx prisma migrate resolve --applied 20260728120000_init
```

Then future deploys use `migrate deploy` normally.

To create the first admin on a fresh database (one time only):

```bash
docker compose run --rm -e ADMIN_SEED_PASSWORD='your-strong-password' app npx tsx prisma/seed.ts
```

## 3. Nginx + SSL

- Use `deploy/nginx.conf.example` as a starting point
- `certbot --nginx -d sgphilippoart.com -d www.sgphilippoart.com`
- Uploads persist in the Docker volume `uploads_data`

## 4. Post-deploy checklist

- [ ] Change admin password after first login
- [ ] Upload real product images via `/admin`
- [ ] Fill social links in `/admin/settings`
- [ ] Test contact, commission, newsletter, and order inquiry emails
- [ ] Submit `https://sgphilippoart.com/sitemap.xml` in Google Search Console
- [ ] Verify cookie banner and `/cookies` policy page
- [ ] Test order tracking at `/track-order`

## 5. Local development

```bash
docker compose up -d postgres
pnpm db:migrate && pnpm db:seed && pnpm dev
```

## 6. Backups

Schedule regular backups of:

- PostgreSQL (`pg_dump`)
- Docker volume `uploads_data` (product and hero images)
