-- Backfill newsletter unsubscribe columns for databases created before they existed.
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "unsubscribe_token" TEXT;
ALTER TABLE "newsletter_subscribers" ADD COLUMN IF NOT EXISTS "unsubscribed_at" TIMESTAMP(3);

UPDATE "newsletter_subscribers"
SET "unsubscribe_token" = gen_random_uuid()::text
WHERE "unsubscribe_token" IS NULL;

ALTER TABLE "newsletter_subscribers" ALTER COLUMN "unsubscribe_token" SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "newsletter_subscribers_unsubscribe_token_key"
ON "newsletter_subscribers"("unsubscribe_token");
