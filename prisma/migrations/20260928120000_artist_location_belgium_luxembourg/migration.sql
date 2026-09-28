-- Update studio location shown on product cards and detail pages
ALTER TABLE "products" ALTER COLUMN "artist_location" SET DEFAULT 'Belgium & Luxembourg';

UPDATE "products"
SET "artist_location" = 'Belgium & Luxembourg'
WHERE "artist_location" = 'United Kingdom';
