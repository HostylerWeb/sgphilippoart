import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const db = new PrismaClient({ adapter });

async function main() {
  await db.wishlists.deleteMany();
  await db.commission_inquiries.deleteMany();
  await db.contact_messages.deleteMany();
  await db.newsletter_subscribers.deleteMany();
  await db.verification_tokens.deleteMany();
  await db.sessions.deleteMany();
  await db.accounts.deleteMany();
  await db.users.deleteMany();
  await db.order_items.deleteMany();
  await db.orders.deleteMany();
  await db.cart_items.deleteMany();
  await db.product_images.deleteMany();
  await db.products.deleteMany();
  await db.categories.deleteMany();
  await db.hero_tiles.deleteMany();
  await db.testimonials.deleteMany();
  await db.trust_items.deleteMany();
  await db.site_settings.deleteMany();

  const categories = await Promise.all([
    db.categories.create({
      data: {
        name: "New Arrivals",
        slug: "new-arrivals",
        description: "The latest works from the studio.",
        sort_order: 1,
        show_on_homepage: true,
        show_in_nav: true,
      },
    }),
    db.categories.create({
      data: {
        name: "Paintings",
        slug: "paintings",
        description: "Original oil paintings on canvas and linen.",
        sort_order: 2,
        show_on_homepage: true,
        show_in_nav: true,
      },
    }),
    db.categories.create({
      data: {
        name: "Portraits",
        slug: "portraits",
        description: "Intimate portraits and character studies.",
        sort_order: 3,
        show_on_homepage: true,
        show_in_nav: true,
      },
    }),
    db.categories.create({
      data: {
        name: "Warrior Women",
        slug: "warrior-women",
        description: "A series celebrating strength and myth.",
        sort_order: 4,
        show_on_homepage: true,
        show_in_nav: true,
      },
    }),
    db.categories.create({
      data: {
        name: "Mythology",
        slug: "mythology",
        description: "Classical and mythological subjects reimagined.",
        sort_order: 5,
        show_on_homepage: true,
        show_in_nav: true,
      },
    }),
    db.categories.create({
      data: {
        name: "Prints",
        slug: "prints",
        description: "Limited edition giclée fine art prints.",
        sort_order: 6,
        show_on_homepage: true,
        show_in_nav: true,
      },
    }),
    db.categories.create({
      data: {
        name: "Commissions",
        slug: "commissions",
        description: "Custom paintings made to order.",
        sort_order: 7,
        show_on_homepage: false,
        show_in_nav: false,
      },
    }),
    db.categories.create({
      data: {
        name: "The Artist",
        slug: "the-artist",
        description: "About the studio and creative process.",
        sort_order: 8,
        show_on_homepage: false,
        show_in_nav: false,
      },
    }),
  ]);

  const categoryBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  await db.hero_tiles.createMany({
    data: [
      {
        eyebrow: "New Series",
        title: "Warrior Women",
        link_text: "Shop the collection",
        link_url: "/collections/warrior-women",
        image_url:
          "https://images.unsplash.com/photo-1718140526486-de25c4ba6c7d?w=800&h=1000&fit=crop&q=80",
        image_alt: "Warrior woman with helmet, shield, and spear",
        sort_order: 1,
      },
      {
        eyebrow: "Curated Edit",
        title: "Portraits Under $500",
        link_text: "Shop affordable finds",
        link_url: "/collections/portraits",
        image_url:
          "https://images.unsplash.com/photo-1692891353728-f81dbd5c928e?w=800&h=1000&fit=crop&q=80",
        image_alt: "Oil portrait of a woman in a black dress",
        sort_order: 2,
      },
      {
        eyebrow: "Exhibition",
        title: "The Oracle Series",
        link_text: "Discover the show",
        link_url: "/collections/mythology",
        image_url:
          "https://images.unsplash.com/photo-1688194152718-1167f025b420?w=800&h=1000&fit=crop&q=80",
        image_alt: "Classical Greek statue of Athena",
        sort_order: 3,
      },
      {
        eyebrow: "Made to Order",
        title: "Commission a Portrait",
        link_text: "Start a commission",
        link_url: "/commissions",
        image_url:
          "https://images.unsplash.com/photo-1758522275336-ebec0374b903?w=800&h=1000&fit=crop&q=80",
        image_alt: "Artist painting on an easel in a studio",
        sort_order: 4,
      },
    ],
  });

  const products = [
    {
      title: "The Oracle at Dusk",
      slug: "the-oracle-at-dusk",
      category_slug: "mythology",
      price: 1450,
      product_type: "original" as const,
      medium: "Oil on Canvas",
      dimensions: "50 x 60 cm",
      description:
        "A mythological scene bathed in twilight gold — figures emerge from shadow as celestial light breaks through storm clouds. Painted in layered oils with rich impasto highlights.",
      meta_title: '"The Oracle at Dusk" — Original Oil Painting',
      meta_description:
        "Original oil painting by SG Philippo Art. Mythological figures in dramatic celestial light. Oil on canvas, 50 x 60 cm.",
      image_url:
        "https://images.unsplash.com/photo-1718140245034-9b68a05d112f?w=800&h=1000&fit=crop&q=80",
      image_alt: "Mythological figures in a dramatic celestial scene",
    },
    {
      title: "Valkyrie",
      slug: "valkyrie",
      category_slug: "warrior-women",
      price: 1950,
      product_type: "original" as const,
      medium: "Oil on Linen",
      dimensions: "60 x 80 cm",
      description:
        "A powerful portrait of a warrior woman inspired by Norse mythology. Bold brushwork and a restrained palette evoke strength, resolve, and quiet defiance.",
      meta_title: '"Valkyrie" — Original Oil Painting',
      meta_description:
        "Original oil on linen painting of a warrior woman. 60 x 80 cm. By SG Philippo Art.",
      image_url:
        "https://images.unsplash.com/photo-1624351660016-f15a8eeb8b65?w=800&h=1000&fit=crop&q=80",
      image_alt: "Warrior woman portrait",
    },
    {
      title: "Sophia",
      slug: "sophia",
      category_slug: "portraits",
      price: 260,
      product_type: "print" as const,
      medium: "Giclée Print",
      dimensions: "30 x 40 cm",
      edition_size: 25,
      stock_quantity: 25,
      description:
        "A luminous portrait rendered in warm ochres and deep crimson. Museum-quality giclée print on archival paper, numbered and signed.",
      meta_title: '"Sophia" — Limited Edition Giclée Print',
      meta_description:
        "Limited edition giclée print, edition of 25. 30 x 40 cm. By SG Philippo Art.",
      image_url:
        "https://images.unsplash.com/photo-1693166740241-f03b4d199a3c?w=800&h=1000&fit=crop&q=80",
      image_alt: "Oil portrait of a woman with red hair",
    },
    {
      title: "Kore, Unbound",
      slug: "kore-unbound",
      category_slug: "paintings",
      price: 2800,
      product_type: "original" as const,
      medium: "Oil on Linen",
      dimensions: "70 x 90 cm",
      description:
        "An expansive original exploring themes of liberation and renewal. Classical references meet contemporary gesture in sweeping layers of oil on linen.",
      meta_title: '"Kore, Unbound" — Original Oil Painting',
      meta_description:
        "Large-scale original oil on linen, 70 x 90 cm. By SG Philippo Art.",
      image_url:
        "https://images.unsplash.com/photo-1728245779513-4d7bc606cc1e?w=800&h=1000&fit=crop&q=80",
      image_alt: "Ancient Greek vase depicting a mythological scene",
    },
    {
      title: "Athena Rising",
      slug: "athena-rising",
      category_slug: "warrior-women",
      price: 2200,
      product_type: "original" as const,
      medium: "Oil on Canvas",
      dimensions: "65 x 85 cm",
      description:
        "A commanding figure emerges from marble and shadow — a meditation on wisdom, war, and the feminine divine.",
      meta_title: '"Athena Rising" — Original Oil Painting',
      meta_description: "Original oil painting from the Warrior Women series.",
      image_url:
        "https://images.unsplash.com/photo-1688194152718-1167f025b420?w=800&h=1000&fit=crop&q=80",
      image_alt: "Classical statue of Athena",
    },
    {
      title: "The Red Veil",
      slug: "the-red-veil",
      category_slug: "portraits",
      price: 380,
      product_type: "print" as const,
      medium: "Giclée Print",
      dimensions: "40 x 50 cm",
      edition_size: 50,
      stock_quantity: 50,
      description:
        "A striking portrait study in crimson and shadow. Limited edition giclée on museum-grade paper.",
      meta_title: '"The Red Veil" — Giclée Print',
      meta_description: "Limited edition portrait print by SG Philippo Art.",
      image_url:
        "https://images.unsplash.com/photo-1692891353728-f81dbd5c928e?w=800&h=1000&fit=crop&q=80",
      image_alt: "Oil portrait of a woman in a black dress",
    },
    {
      title: "Persephone's Garden",
      slug: "persephones-garden",
      category_slug: "mythology",
      price: 1650,
      product_type: "original" as const,
      medium: "Oil on Canvas",
      dimensions: "55 x 70 cm",
      description:
        "Lush florals and mythic undertones intertwine in this richly layered canvas exploring cycles of loss and return.",
      meta_title: '"Persephone\'s Garden" — Original Oil Painting',
      meta_description: "Mythological original oil painting by SG Philippo Art.",
      image_url:
        "https://images.unsplash.com/photo-1718140526486-de25c4ba6c7d?w=800&h=1000&fit=crop&q=80",
      image_alt: "Floral mythological painting",
    },
    {
      title: "Study in Ochre",
      slug: "study-in-ochre",
      category_slug: "prints",
      price: 195,
      product_type: "print" as const,
      medium: "Giclée Print",
      dimensions: "25 x 35 cm",
      edition_size: 100,
      stock_quantity: 100,
      description:
        "An intimate study in warm earth tones — perfect for smaller spaces. Archival giclée print.",
      meta_title: '"Study in Ochre" — Giclée Print',
      meta_description: "Affordable fine art print by SG Philippo Art.",
      image_url:
        "https://images.unsplash.com/photo-1758522275336-ebec0374b903?w=800&h=1000&fit=crop&q=80",
      image_alt: "Warm-toned art study",
    },
  ];

  for (const [index, product] of products.entries()) {
    await db.products.create({
      data: {
        title: product.title,
        slug: product.slug,
        price: product.price,
        description: product.description,
        meta_title: product.meta_title,
        meta_description: product.meta_description,
        product_type: product.product_type,
        status: "published",
        medium: product.medium,
        dimensions: product.dimensions,
        edition_size: product.edition_size,
        stock_quantity: product.stock_quantity,
        is_featured: true,
        sort_order: index + 1,
        category_id: categoryBySlug[product.category_slug].id,
        images: {
          create: {
            url: product.image_url,
            alt_text: product.image_alt,
            is_primary: true,
            sort_order: 0,
          },
        },
      },
    });
  }

  await db.trust_items.createMany({
    data: [
      {
        title: "Hand-painted originals",
        body: "Every piece painted in oil by the studio, no reproductions.",
        icon: "shield",
        sort_order: 1,
      },
      {
        title: "Free worldwide shipping",
        body: "Insured, tracked delivery on every order.",
        icon: "truck",
        sort_order: 2,
      },
      {
        title: "14-day free returns",
        body: "Buy with confidence, no questions asked.",
        icon: "return",
        sort_order: 3,
      },
      {
        title: "Certificate of authenticity",
        body: "Signed and numbered with every original.",
        icon: "star",
        sort_order: 4,
      },
    ],
  });

  await db.testimonials.createMany({
    data: [
      {
        title: "Stunning in person",
        body: "The painting arrived even more beautiful than the photos. Packaging was excellent and it shipped fast.",
        author_name: "Karen N.",
        author_image_url:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=80",
        sort_order: 1,
      },
      {
        title: "Exactly as described",
        body: "Communication with the studio was wonderful throughout. The colors are richer in person than online.",
        author_name: "Terry F.",
        author_image_url:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80",
        sort_order: 2,
      },
      {
        title: "Second piece I've bought",
        body: "This is my second painting from this collection and I love it just as much as the first. Fast, easy checkout.",
        author_name: "Carolyn",
        author_image_url:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=80",
        sort_order: 3,
      },
      {
        title: "Beautiful and meaningful",
        body: 'Bought "Sophia" as a gift — the print quality is excellent and it arrived well within the estimated window.',
        author_name: "Ellen V.",
        author_image_url:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80",
        sort_order: 4,
      },
    ],
  });

  await db.site_settings.createMany({
    data: [
      { key: "site_name", value: "SG Philippo Art" },
      { key: "currency_code", value: "EUR" },
      { key: "currency_locale", value: "fr-BE" },
      { key: "locale_display", value: "Belgique · Luxembourg · France / EUR / cm" },
      { key: "tax_enabled", value: "false" },
      { key: "tax_rate", value: "0" },
      { key: "tax_label", value: "Tax" },
      { key: "tax_inclusive", value: "false" },
      { key: "shipping_mode", value: "free_worldwide" },
      { key: "shipping_flat_rate", value: "0" },
      { key: "shipping_label", value: "Free worldwide shipping" },
      { key: "free_shipping_threshold", value: "0" },
      { key: "handling_fee", value: "0" },
      { key: "handling_fee_label", value: "Handling" },
      { key: "min_order_amount", value: "0" },
      { key: "returns_days", value: "14" },
      { key: "returns_policy_summary", value: "14-day free returns on eligible prints" },
      { key: "payment_mode", value: "inquiry" },
      { key: "contact_email", value: "contact@sgphilippoart.com" },
      { key: "commission_enabled", value: "true" },
      { key: "announcement_text", value: "Livraison mondiale gratuite sur les peintures originales · Nouveau : la série Warrior Women" },
      { key: "announcement_highlight", value: "Nouveau : la série Warrior Women" },
      { key: "concierge_eyebrow", value: "Personal Guidance" },
      { key: "concierge_title", value: "Not sure which piece is right for your space?" },
      {
        key: "concierge_body",
        value:
          "Get complimentary one-on-one advice on choosing a piece that fits your taste, room, and budget — no pressure, just guidance.",
      },
      { key: "concierge_cta", value: "Connect with the studio" },
      {
        key: "footer_description",
        value:
          "Original oil paintings exploring beauty, myth, and the strength of women across history. Hand-painted, shipped worldwide.",
      },
      { key: "social_instagram", value: "" },
      { key: "social_pinterest", value: "" },
      { key: "social_tiktok", value: "" },
      { key: "social_facebook", value: "" },
      { key: "social_youtube", value: "" },
      { key: "social_x", value: "" },
      { key: "social_linkedin", value: "" },
      { key: "social_etsy", value: "" },
    ],
  });

  const adminPassword = process.env.ADMIN_SEED_PASSWORD ?? "Demo123!";
  await db.users.create({
    data: {
      name: "Studio Admin",
      email: "admin@sgphilippoart.com",
      password_hash: await bcrypt.hash(adminPassword, 12),
      role: "admin",
      email_verified: new Date(),
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);
    await db.$disconnect();
    await pool.end();
    process.exit(1);
  });
