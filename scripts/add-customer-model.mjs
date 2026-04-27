/**
 * Creates the Customer model and adds customerEmail + discountApplied to Order.
 * Run: node scripts/add-customer-model.mjs
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

// ── Step 1: Create Customer model + fields ────────────────────────────────────
console.log('Step 1: Creating Customer model...');
{
  const c = new Client(auth);
  c.createModel({ apiId: 'Customer', apiIdPlural: 'Customers', displayName: 'Customer', description: 'Registered website customer' });
  c.createSimpleField({ parentApiId: 'Customer', apiId: 'name',         displayName: 'Full Name',      type: 'STRING',  isRequired: true, isTitle: true });
  c.createSimpleField({ parentApiId: 'Customer', apiId: 'email',        displayName: 'Email',          type: 'STRING',  isRequired: true, isUnique: true });
  c.createSimpleField({ parentApiId: 'Customer', apiId: 'mobile',       displayName: 'Mobile',         type: 'STRING',  isRequired: true });
  c.createSimpleField({ parentApiId: 'Customer', apiId: 'passwordHash', displayName: 'Password Hash',  type: 'STRING',  isRequired: true });
  const r = await c.run(false);
  if (r?.errors?.length) { console.error('❌', r.errors.map(e => e.message).join('\n')); process.exit(1); }
  console.log('  ✓ Customer model created');
}

console.log('  Waiting for migration...');
await wait(8000);

// ── Step 2: Add tracking fields to Order ─────────────────────────────────────
console.log('Step 2: Adding customerEmail + discountApplied to Order...');
{
  const c = new Client(auth);
  c.createSimpleField({ parentApiId: 'Order', apiId: 'customerEmail',    displayName: 'Customer Email',    type: 'STRING' });
  c.createSimpleField({ parentApiId: 'Order', apiId: 'discountApplied',  displayName: 'Discount Applied %', type: 'FLOAT'  });
  const r = await c.run(false);
  if (r?.errors?.length) { console.error('❌', r.errors.map(e => e.message).join('\n')); process.exit(1); }
  console.log('  ✓ customerEmail + discountApplied added to Order');
}

console.log(`
✅  Customer schema ready!

⚠️  IMPORTANT — Hygraph Console permissions:
   Settings → API Access → Permanent Auth Tokens → your token → Content Permissions
   Add:
     Customer  →  Create, Read
     Order     →  (already set — no change needed)
`);
