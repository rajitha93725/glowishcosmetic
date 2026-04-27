/**
 * Fix orderedProducts relation on Order model.
 * 1. Deletes the broken field (if it exists in any state)
 * 2. Recreates it as isList: true (many products per order)
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

// ── Step 1: delete broken fields ─────────────────────────────────────────────
console.log('Step 1: Deleting broken relation fields...');
{
  const c = new Client(auth);
  c.deleteField({ parentApiId: 'Order',   apiId: 'orderedProducts' });
  c.deleteField({ parentApiId: 'Product', apiId: 'orders' });
  try {
    const r = await c.run(false);
    if (r?.errors?.length) console.warn('  warnings:', r.errors.map(e => e.message).join(', '));
    else console.log('  ✓ deleted');
  } catch (e) {
    console.log('  (delete step had errors — continuing):', e.message?.slice(0, 120));
  }
}

// ── Step 2: recreate as many-to-many list relation ───────────────────────────
console.log('Step 2: Creating fresh orderedProducts relation (isList: true)...');
{
  const c = new Client(auth);
  c.createRelationalField({
    parentApiId:  'Order',
    apiId:        'orderedProducts',
    displayName:  'Ordered Products',
    type:         'RELATION',
    isList:       true,
    reverseField: {
      modelApiId:  'Product',
      apiId:       'orders',
      displayName: 'Orders',
      isList:      true,
    },
  });
  const r = await c.run(false);
  if (r?.errors?.length) {
    console.error('❌  Error recreating field:', r.errors.map(e => e.message).join('\n'));
    process.exit(1);
  }
  console.log('  ✓ orderedProducts recreated as list relation');
}

console.log('\n✅  Done! Order.orderedProducts is now a proper has-many relation.');
console.log('    Restart your Next.js dev server and try placing an order.');
