-- Homepage hero grid destinations (client review).

UPDATE hero_tiles
SET link_url = '/about',
    updated_at = NOW()
WHERE image_url LIKE '%2ca75e38-eb67-43aa-bfc3-4078bd56a17b%';

UPDATE hero_tiles
SET link_url = '/collections/what-remains-of-the-gods',
    sort_order = 2,
    updated_at = NOW()
WHERE image_url LIKE '%5ff24132-fb17-4115-9128-ed93dfa5fabc%';

UPDATE hero_tiles
SET link_url = '/collections/portraits',
    sort_order = 3,
    updated_at = NOW()
WHERE image_url LIKE '%09e4e320-6f3c-41db-92a0-7f16601c58a8%';

UPDATE hero_tiles
SET link_url = '/collections/sold-painted-tshirts',
    sort_order = 4,
    is_active = true,
    updated_at = NOW()
WHERE image_url LIKE '%c5e293c1-cdcd-4ce6-97d1-e34d9340638d%';
