-- French CMS copy for hero tiles, trust strip, testimonials, and product translations.

UPDATE hero_tiles
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"eyebrow": "Nouvelle série", "title": "Femmes guerrières", "link_text": "Voir la collection", "image_alt": "Femme guerrière avec casque, bouclier et lance"}'::jsonb,
  true
)
WHERE title = 'Warrior Women';

UPDATE hero_tiles
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"eyebrow": "Sur mesure", "title": "Commander un portrait", "link_text": "Commencer une commande", "image_alt": "Artiste peignant sur un chevalet dans l''atelier"}'::jsonb,
  true
)
WHERE title = 'Commission a Portrait';

UPDATE trust_items
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"title": "Certificat d''authenticité", "body": "Signé et numéroté pour chaque original."}'::jsonb,
  true
)
WHERE title = 'Certificate of authenticity';

UPDATE testimonials
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"title": "Encore plus beau en vrai", "body": "La peinture est encore plus belle qu''en photo. L''emballage était excellent et la livraison rapide."}'::jsonb,
  true
)
WHERE title = 'Stunning in person';

UPDATE testimonials
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"title": "Conforme à la description", "body": "La communication avec l''atelier a été excellente. Les couleurs sont plus riches en vrai qu''en ligne."}'::jsonb,
  true
)
WHERE title = 'Exactly as described';

UPDATE testimonials
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"title": "Ma deuxième œuvre", "body": "C''est ma deuxième peinture de cette collection et je l''aime autant que la première. Commande simple et rapide."}'::jsonb,
  true
)
WHERE title = 'Second piece I''ve bought';

UPDATE testimonials
SET translations = jsonb_set(
  COALESCE(translations, '{}'::jsonb),
  '{fr}',
  '{"title": "Belle et pleine de sens", "body": "J''ai acheté « Sophia » en cadeau — la qualité d''impression est excellente et la livraison est arrivée dans les délais annoncés."}'::jsonb,
  true
)
WHERE title = 'Beautiful and meaningful';

UPDATE products
SET translations = '{"fr": {"title": "Le Voile rouge", "medium": "Estampe giclée", "description": "Une étude de portrait saisissante en cramoisi et en ombre. Estampe giclée en édition limitée sur papier de qualité musée.", "meta_title": "« Le Voile rouge » — Estampe giclée", "meta_description": "Estampe de portrait en édition limitée par SG Philippo Art."}}'::jsonb
WHERE slug = 'the-red-veil'
  AND (translations IS NULL OR translations::text = 'null');

UPDATE site_settings
SET value = E'Œuvres originales peintes à la main · \r\nDécouvrez la nouvelle série Femmes guerrières'
WHERE key = 'announcement_text_fr';

UPDATE site_settings
SET value = 'Nouvelle série · « Femmes guerrières »'
WHERE key = 'announcement_highlight_fr';
