/**
 * Creates the Brand model and adds a Brand reference field to Product.
 * Run: node scripts/add-brand-model.mjs
 */
import { Client } from '@hygraph/management-sdk';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const auth = {
  authToken: process.env.HYGRAPH_MUTATION_TOKEN,
  endpoint:  process.env.HYGRAPH_MANAGEMENT_ENDPOINT,
};

const wait = (ms) => new Promise(r => setTimeout(r, ms));

// ── Step 1: Create Brand model + fields ────────────────────────────────────
console.log('Step 1: Creating Brand model...');
{
  const c = new Client(auth);
  c.createModel({ apiId: 'Brand', apiIdPlural: 'Brands', displayName: 'Brand', description: 'Available product brands' });
  c.createSimpleField({ parentApiId: 'Brand', apiId: 'name', displayName: 'Name', type: 'STRING', isRequired: true, isTitle: true });
  c.createSimpleField({ parentApiId: 'Brand', apiId: 'slug', displayName: 'Slug', type: 'STRING', isRequired: true, isUnique: true });
  try {
    const r = await c.run(false);
    if (r?.errors?.length) { console.warn('⚠️ Step 1 warning:', r.errors.map(e => e.message).join('\n')); }
    else { console.log('  ✓ Brand model created'); }
  } catch (err) {
    console.log('  (Step 1 failed, likely because model already exists, continuing...)');
  }
}

console.log('  Waiting for migration...');
await wait(8000);

// ── Step 2: Add Brand reference to Product ─────────────────────────────────────
console.log('Step 2: Adding Brand relation to Product...');
{
  const c = new Client(auth);
  c.createRelationalField({
    parentApiId: 'Product',
    apiId: 'brand',
    displayName: 'Brand',
    type: 'RELATION',
    reverseField: {
      modelApiId: 'Brand',
      apiId: 'products',
      displayName: 'Products',
      isList: true,
      isUnidirectional: true,
    }
  });
  const r = await c.run(false);
  if (r?.errors?.length) { console.error('❌', r.errors.map(e => e.message).join('\n')); process.exit(1); }
  console.log('  ✓ Brand relation added to Product');
}

console.log(`
✅  Brand schema ready!

⚠️  IMPORTANT — Hygraph Console permissions:
   Settings → API Access → Permanent Auth Tokens → your token → Content Permissions
   Add:
     Brand  →  Create, Read, Update, Delete (as needed)
     Product →  (already set — no change needed)
`);
