/**
 * Glowish Cosmetics — Content Seeder
 * ====================================
 * Seeds sample products + website settings into Hygraph.
 * Uses HYGRAPH_MUTATION_TOKEN (Permanent Auth Token with Editor role).
 *
 * ⚠️  Run AFTER your schema models exist (via create-schema.mjs or Hygraph UI).
 *
 * Run:
 *   node scripts/seed-content.mjs
 *
 * What it creates:
 *   • 9 cosmetics products (skincare, makeup, fragrance, haircare)
 *   • 1 WebsiteSetting (header, about, contact info)
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const TOKEN   = process.env.HYGRAPH_MUTATION_TOKEN;
const CDN_URL = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;

if (!TOKEN || !CDN_URL) {
  console.error("❌  Missing HYGRAPH_MUTATION_TOKEN or NEXT_PUBLIC_HYGRAPH_ENDPOINT");
  process.exit(1);
}

// ── Derive writable API endpoint from CDN endpoint ──────────────────────────
// CDN:    https://ap-south-1.cdn.hygraph.com/content/PROJECT_ID/master  (read-only)
// API:    https://api-ap-south-1.hygraph.com/v2/PROJECT_ID/master       (read + write)
const match = CDN_URL.match(/https:\/\/([\w-]+)\.cdn\.hygraph\.com\/content\/([^/]+)\/master/);
if (!match) { console.error("❌  Could not parse CDN endpoint"); process.exit(1); }
const [, REGION, PROJECT_ID] = match;
const API_URL = `https://api-${REGION}.hygraph.com/v2/${PROJECT_ID}/master`;

console.log(`📦  Project : ${PROJECT_ID}`);
console.log(`🌏  Region  : ${REGION}`);
console.log(`🔗  API URL : ${API_URL}\n`);

// ── GraphQL helper ──────────────────────────────────────────────────────────
async function gql(query, variables = {}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(json.errors.map((e) => e.message).join(" | "));
  return json.data;
}

// ── Mutations ────────────────────────────────────────────────────────────────
const CREATE_PRODUCT = `
  mutation CreateProduct($data: ProductCreateInput!) {
    createProduct(data: $data) { id name }
  }`;

const PUBLISH_PRODUCT = `
  mutation PublishProduct($id: ID!) {
    publishProduct(where: { id: $id }, to: PUBLISHED) { id }
  }`;

const CREATE_SETTING = `
  mutation CreateWebsiteSetting($data: WebsiteSettingCreateInput!) {
    createWebsiteSetting(data: $data) { id }
  }`;

const PUBLISH_SETTING = `
  mutation PublishWebsiteSetting($id: ID!) {
    publishWebsiteSetting(where: { id: $id }, to: PUBLISHED) { id }
  }`;

// ── RichText helper — Hygraph accepts { markdown: "..." } for RichText fields ─
const md = (text) => ({ markdown: text });

// ── Sample Products ──────────────────────────────────────────────────────────
const PRODUCTS = [
  // ── Skincare ────────────────────────────────────────────────────────────────
  {
    name: "Glow Boost Vitamin C Serum",
    code: "SKN-001",
    tags: ["skincare", "serum", "brightening"],
    price: 34.99,
    featured: true,
    description: md("Our bestselling Vitamin C Serum brightens dull skin, fades dark spots, and boosts collagen production. Formulated with 15% stabilised Vitamin C, hyaluronic acid, and niacinamide for visible results in 2 weeks."),
  },
  {
    name: "Rose Petal Hydrating Toner",
    code: "SKN-002",
    tags: ["skincare", "toner", "hydrating"],
    price: 18.99,
    featured: true,
    description: md("Alcohol-free rose water toner that preps skin, minimises pores, and locks in hydration. Infused with real Bulgarian rose extract and allantoin for a calming, dewy finish."),
  },
  {
    name: "Petal Soft Moisturising Cream",
    code: "SKN-003",
    tags: ["skincare", "moisturiser", "dry skin"],
    price: 27.50,
    featured: false,
    description: md("Rich, non-greasy moisturiser with shea butter, ceramides, and rose hip oil. Replenishes the skin barrier and keeps skin soft for 24 hours."),
  },
  {
    name: "Clear Skin Niacinamide Serum",
    code: "SKN-004",
    tags: ["skincare", "serum", "acne"],
    price: 29.99,
    featured: false,
    description: md("10% Niacinamide + 1% Zinc formula that visibly reduces pores, controls excess sebum, and fades blemish marks. Suitable for oily and combination skin."),
  },

  // ── Makeup ───────────────────────────────────────────────────────────────────
  {
    name: "Velvet Kiss Lip Color — Berry Blush",
    code: "MKP-001",
    tags: ["makeup", "lips", "long lasting"],
    price: 15.99,
    featured: true,
    description: md("Highly pigmented liquid lipstick in a rich berry-blush shade. Creamy matte finish that stays on for up to 12 hours without drying out your lips."),
  },
  {
    name: "Dewdrop Cushion Foundation",
    code: "MKP-002",
    tags: ["makeup", "foundation", "dewy"],
    price: 32.00,
    featured: false,
    description: md("Cushion foundation with SPF 30 that delivers medium buildable coverage with a natural dewy finish. Available in 12 shades. Infused with hyaluronic acid to keep skin plump throughout the day."),
  },
  {
    name: "Shimmer Eye Palette — Rose Gold",
    code: "MKP-003",
    tags: ["makeup", "eyeshadow", "shimmer"],
    price: 24.99,
    featured: true,
    description: md("9-shade rose gold eyeshadow palette with a mix of mattes, shimmers, and glitters. Highly blendable, long-wearing, and suitable for both day and night looks."),
  },

  // ── Fragrance ────────────────────────────────────────────────────────────────
  {
    name: "Bloom & Dew Perfume Mist",
    code: "FRG-001",
    tags: ["fragrance", "perfume", "floral"],
    price: 22.00,
    featured: false,
    description: md("A light, feminine body mist with top notes of peony and lychee, a heart of Bulgarian rose, and a warm base of sandalwood. Perfect for everyday wear."),
  },

  // ── Hair Care ────────────────────────────────────────────────────────────────
  {
    name: "Argan & Rose Hair Oil",
    code: "HRC-001",
    tags: ["haircare", "hair oil", "frizz control"],
    price: 19.99,
    featured: false,
    description: md("Lightweight hair oil with Moroccan argan oil and rose hip extract. Tames frizz, adds shine, and nourishes dry ends without leaving a greasy residue."),
  },
];

// ── Website Settings ─────────────────────────────────────────────────────────
const WEBSITE_SETTING = {
  title: "Glowish Cosmetics",
  contactEmail: "hello@glowishcosmetics.com",
  contactPhone: "+1 (555) 123-4567",
  contactAddress: "123 Beauty Lane, Bloom City, BC 12345",
  aboutContent: md(
    "Glowish Cosmetics was founded with a simple mission: to make premium beauty accessible to everyone. " +
    "We believe great skincare and makeup should not cost a fortune, nor should it compromise on quality.\n\n" +
    "Each of our products is carefully formulated with skin-loving ingredients — free from harmful chemicals " +
    "and tested by real people with real skin types. From hydrating serums to long-lasting lip colors, " +
    "every item in our collection is designed to make you feel confident, beautiful, and uniquely you."
  ),
};

// ── Runner ───────────────────────────────────────────────────────────────────
async function createAndPublish(label, createMutation, publishMutation, data, dataKey, idKey) {
  process.stdout.write(`  ➕  ${label}... `);
  try {
    const created = await gql(createMutation, { data });
    const id = created[dataKey][idKey ?? "id"];
    await gql(publishMutation, { id });
    console.log(`✅  published (id: ${id})`);
    return id;
  } catch (e) {
    console.log(`❌  ${e.message}`);
    return null;
  }
}

async function main() {
  console.log("🌸  Glowish Cosmetics — Content Seeder\n");
  console.log("─".repeat(55));

  // ── Products ─────────────────────────────────────────────────────────────────
  console.log(`\n📦  Seeding ${PRODUCTS.length} Products:\n`);
  let ok = 0;
  for (const p of PRODUCTS) {
    const id = await createAndPublish(
      `${p.name} (${p.code})`,
      CREATE_PRODUCT,
      PUBLISH_PRODUCT,
      p,
      "createProduct"
    );
    if (id) ok++;
    // Small delay to avoid rate limiting
    await new Promise((r) => setTimeout(r, 300));
  }

  // ── Website Settings ──────────────────────────────────────────────────────────
  console.log(`\n⚙️   Seeding Website Settings:\n`);
  await createAndPublish(
    "Glowish Cosmetics — Settings",
    CREATE_SETTING,
    PUBLISH_SETTING,
    WEBSITE_SETTING,
    "createWebsiteSetting"
  );

  console.log(`
─────────────────────────────────────────────────────────
✅  Seeding complete!  ${ok}/${PRODUCTS.length} products published.

Your Hygraph CMS now has:
  • ${ok} products (skincare, makeup, fragrance, haircare)
  • Website settings (contact info + about content)

Start the website:
  npm run dev  →  http://localhost:3000
─────────────────────────────────────────────────────────
`);
}

main().catch((e) => {
  console.error("\n❌  Fatal error:", e.message);

  if (e.message.includes("Field") && e.message.includes("not found")) {
    console.error(`
The schema models don't exist yet in Hygraph.
Run the schema creator first:
  node scripts/create-schema.mjs

Or create them manually in Hygraph UI → Schema tab.
`);
  }

  if (e.message.includes("token") || e.message.includes("Unauthorized") || e.message.includes("401")) {
    console.error(`
Auth error — check your HYGRAPH_MUTATION_TOKEN in .env.local.
It must be a Permanent Auth Token with Editor role.
Generate one at: Hygraph → Settings → API Access → Permanent Auth Tokens
`);
  }

  process.exit(1);
});
