/**
 * Hygraph Schema Setup Script
 *
 * Creates the three content models:
 *   1. Product
 *   2. Order
 *   3. WebsiteSetting
 *
 * Run:  node scripts/setup-hygraph.mjs
 *
 * Prerequisites:
 *   - HYGRAPH_MANAGEMENT_TOKEN in .env.local (a Permanent Auth Token with Admin role)
 *   - NEXT_PUBLIC_HYGRAPH_ENDPOINT in .env.local
 *
 * The Hygraph Management SDK is used to create the schema programmatically.
 * Install it first:  npm install @hygraph/management-sdk
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env.local from the project root (one level up from /scripts)
config({ path: resolve(__dirname, "../.env.local") });

const ENDPOINT = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT;
const TOKEN    = process.env.HYGRAPH_MANAGEMENT_TOKEN;

if (!ENDPOINT || !TOKEN) {
  console.error("❌  Missing NEXT_PUBLIC_HYGRAPH_ENDPOINT or HYGRAPH_MANAGEMENT_TOKEN in .env.local");
  process.exit(1);
}

// ── Derive the Management API URL from the content endpoint ──────────────────
// Content  endpoint: https://<region>.cdn.hygraph.com/content/<projectId>/master
// Management endpoint: https://management.hygraph.com/graphql
const MANAGEMENT_URL = "https://management.hygraph.com/graphql";

// ── Extract projectId from endpoint ─────────────────────────────────────────
const projectIdMatch = ENDPOINT.match(/content\/([a-z0-9]+)\//i);
if (!projectIdMatch) {
  console.error("❌  Could not parse projectId from NEXT_PUBLIC_HYGRAPH_ENDPOINT.");
  process.exit(1);
}
const PROJECT_ID = projectIdMatch[1];
console.log(`📦  Project ID: ${PROJECT_ID}`);

// ── GraphQL helper ───────────────────────────────────────────────────────────
async function mgmt(query, variables = {}) {
  const res = await fetch(MANAGEMENT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:  `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
    throw new Error(json.errors[0]?.message ?? "Management API error");
  }
  return json.data;
}

// ── Mutations ────────────────────────────────────────────────────────────────
const CREATE_MODEL = `
  mutation CreateModel($projectId: ID!, $input: CreateModelInput!) {
    createModel(projectId: $projectId, input: $input) { id apiId }
  }`;

const CREATE_SIMPLE_FIELD = `
  mutation CreateSimpleField($projectId: ID!, $modelId: ID!, $input: CreateSimpleFieldInput!) {
    createSimpleField(projectId: $projectId, modelId: $modelId, input: $input) { id apiId }
  }`;

const CREATE_RELATION_FIELD = `
  mutation CreateRelationalField($projectId: ID!, $modelId: ID!, $input: CreateRelationalFieldInput!) {
    createRelationalField(projectId: $projectId, modelId: $modelId, input: $input) { id apiId }
  }`;

const CREATE_ASSET_FIELD = `
  mutation CreateAssetField($projectId: ID!, $modelId: ID!, $input: CreateAssetFieldInput!) {
    createAssetField(projectId: $projectId, modelId: $modelId, input: $input) { id apiId }
  }`;

// ── Helpers ──────────────────────────────────────────────────────────────────
async function createModel(apiId, displayName) {
  console.log(`\n🔧  Creating model: ${displayName} (${apiId})`);
  try {
    const data = await mgmt(CREATE_MODEL, {
      projectId: PROJECT_ID,
      input: { apiId, apiIdPlural: apiId + "s", displayName },
    });
    console.log(`   ✅  ${displayName} → id: ${data.createModel.id}`);
    return data.createModel.id;
  } catch (e) {
    console.warn(`   ⚠️   ${displayName} may already exist: ${e.message}`);
    return null;
  }
}

async function addSimpleField(modelId, apiId, displayName, type, opts = {}) {
  try {
    await mgmt(CREATE_SIMPLE_FIELD, {
      projectId: PROJECT_ID,
      modelId,
      input: { apiId, displayName, type, ...opts },
    });
    console.log(`   + ${displayName} (${type})`);
  } catch (e) {
    console.warn(`   ⚠️  Field ${apiId} may already exist: ${e.message}`);
  }
}

async function addAssetField(modelId, apiId, displayName) {
  try {
    await mgmt(CREATE_ASSET_FIELD, {
      projectId: PROJECT_ID,
      modelId,
      input: { apiId, displayName, isRequired: false },
    });
    console.log(`   + ${displayName} (Asset)`);
  } catch (e) {
    console.warn(`   ⚠️  Asset field ${apiId} may already exist: ${e.message}`);
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🌸  Glowish Cosmetics – Hygraph Schema Setup\n");

  // ── 1. Product ──────────────────────────────────────────────────────────────
  const productId = await createModel("Product", "Product");
  if (productId) {
    await addSimpleField(productId, "name",     "Name",        "String",  { isRequired: true });
    await addSimpleField(productId, "code",     "Code",        "String",  { isRequired: true });
    await addSimpleField(productId, "description", "Description", "RichText");
    await addSimpleField(productId, "tags",     "Tags",        "String",  { isList: true });
    await addSimpleField(productId, "price",    "Price",       "Float");
    await addSimpleField(productId, "featured", "Featured",    "Boolean", { initialValue: false });
    await addAssetField(productId,  "image",    "Image");
  }

  // ── 2. Order ────────────────────────────────────────────────────────────────
  const orderId = await createModel("Order", "Order");
  if (orderId) {
    await addSimpleField(orderId, "customerName", "Customer Name", "String", { isRequired: true });
    await addSimpleField(orderId, "phone",        "Phone",         "String", { isRequired: true });
    await addSimpleField(orderId, "address",      "Address",       "String", { isRequired: true });
    await addSimpleField(orderId, "notes",        "Notes",         "String");
    // orderedProducts relation is created after both models exist
  }

  // ── 3. WebsiteSetting ───────────────────────────────────────────────────────
  const settingId = await createModel("WebsiteSetting", "Website Setting");
  if (settingId) {
    await addSimpleField(settingId, "title",          "Title",           "String");
    await addSimpleField(settingId, "aboutContent",   "About Content",   "RichText");
    await addSimpleField(settingId, "contactEmail",   "Contact Email",   "String");
    await addSimpleField(settingId, "contactPhone",   "Contact Phone",   "String");
    await addSimpleField(settingId, "contactAddress", "Contact Address", "String");
    await addAssetField(settingId,  "headerImage",    "Header Image");
  }

  console.log(`
✅  Schema setup complete!

Next steps:
  1. Open Hygraph → Schema → Product and verify all fields
  2. Set up a permanent auth token with Editor role in Hygraph → Settings → API Access
  3. Create an Order relation field: Order → orderedProducts → Product (many-to-many)
     (Relation fields require both models to exist — do this manually in Hygraph UI)
  4. Add your endpoint and tokens to .env.local
  5. Publish your API for public read access (Hygraph → Settings → API Access → Public)
`);
}

main().catch((e) => { console.error(e); process.exit(1); });
