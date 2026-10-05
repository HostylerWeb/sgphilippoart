-- Remove mistaken "the-artist" shop category (artist story is on /about).
UPDATE hero_tiles
SET link_url = '/about'
WHERE lower(trim(link_url)) IN (
  '/collections/the-artist',
  'https://sgphilippoart.com/collections/the-artist'
)
   OR lower(link_url) LIKE '%/collections/the-artist%';

DELETE FROM categories
WHERE slug = 'the-artist'
  AND NOT EXISTS (
    SELECT 1 FROM products p WHERE p.category_id = categories.id
  );
