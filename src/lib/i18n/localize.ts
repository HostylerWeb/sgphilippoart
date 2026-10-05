import type { Locale } from "@/i18n/config";
import { getLocalizedField } from "@/lib/i18n/content";

const PRODUCT_FIELDS = ["title", "description", "meta_title", "meta_description", "medium"] as const;
const CATEGORY_FIELDS = ["name", "description"] as const;
const HERO_FIELDS = ["eyebrow", "title", "link_text", "image_alt"] as const;
const TESTIMONIAL_FIELDS = ["title", "body"] as const;
const TRUST_FIELDS = ["title", "body"] as const;

export const TRANSLATION_FIELD_SETS = {
  product: PRODUCT_FIELDS,
  category: CATEGORY_FIELDS,
  hero: HERO_FIELDS,
  testimonial: TESTIMONIAL_FIELDS,
  trust: TRUST_FIELDS,
} as const;

type ProductLike = {
  title: string;
  description?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  medium?: string | null;
  translations?: unknown;
};

export function localizeProduct<T extends ProductLike>(product: T, locale: Locale): T {
  return {
    ...product,
    title: getLocalizedField(product, "title", locale, product.title),
    description: product.description
      ? getLocalizedField(product, "description", locale, product.description)
      : product.description,
    meta_title: product.meta_title
      ? getLocalizedField(product, "meta_title", locale, product.meta_title)
      : product.meta_title,
    meta_description: product.meta_description
      ? getLocalizedField(product, "meta_description", locale, product.meta_description)
      : product.meta_description,
    medium: product.medium
      ? getLocalizedField(product, "medium", locale, product.medium)
      : product.medium,
  };
}

type CategoryLike = {
  slug?: string;
  name: string;
  description?: string | null;
  translations?: unknown;
};

export function localizeCategoryEntity<T extends CategoryLike>(category: T, locale: Locale): T {
  const scope = category.slug ? `category:${category.slug}` : undefined;
  return {
    ...category,
    name: getLocalizedField(category, "name", locale, category.name, scope),
    description: category.description
      ? getLocalizedField(category, "description", locale, category.description, scope)
      : category.description,
  };
}

type HeroLike = {
  id?: string;
  eyebrow: string;
  title: string;
  link_text: string;
  image_alt?: string | null;
  translations?: unknown;
};

export function localizeHeroTile<T extends HeroLike>(tile: T, locale: Locale): T {
  const scope = tile.id ? `hero:${tile.id}` : undefined;
  return {
    ...tile,
    eyebrow: getLocalizedField(tile, "eyebrow", locale, tile.eyebrow, scope),
    title: getLocalizedField(tile, "title", locale, tile.title, scope),
    link_text: getLocalizedField(tile, "link_text", locale, tile.link_text, scope),
    image_alt: tile.image_alt
      ? getLocalizedField(tile, "image_alt", locale, tile.image_alt, scope)
      : tile.image_alt,
  };
}

type TestimonialLike = {
  id?: string;
  title: string;
  body: string;
  translations?: unknown;
};

export function localizeTestimonial<T extends TestimonialLike>(
  testimonial: T,
  locale: Locale,
): T {
  const scope = testimonial.id ? `testimonial:${testimonial.id}` : undefined;
  return {
    ...testimonial,
    title: getLocalizedField(testimonial, "title", locale, testimonial.title, scope),
    body: getLocalizedField(testimonial, "body", locale, testimonial.body, scope),
  };
}

type TrustLike = {
  icon?: string;
  title: string;
  body: string;
  translations?: unknown;
};

export function localizeTrustItem<T extends TrustLike>(item: T, locale: Locale): T {
  const scope = item.icon ? `trust:${item.icon}` : undefined;
  return {
    ...item,
    title: getLocalizedField(item, "title", locale, item.title, scope),
    body: getLocalizedField(item, "body", locale, item.body, scope),
  };
}
