/**
 * Recreate Order.orderedProducts as a UNIDIRECTIONAL list relation.
 * This means Order → Products works, but Product.orders field is hidden.
 * Effect: connecting products to an order no longer requires "update Product" permission.
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

// Step 1: delete both sides of the current bidirectional relation
console.log('Step 1: Deleting existing relation fields...');
{
  const c = new Client(auth);
  c.deleteField({ parentApiId: 'Order',   apiId: 'orderedProducts' });
  c.deleteField({ parentApiId: 'Product', apiId: 'orders' });
  try {
    await c.run(false);
    console.log('  ✓ deleted');
  } catch (e) {
    console.log('  (may have partially failed, continuing):', e.message?.slice(0, 100));
  }
}

// Step 2: recreate as unidirectional (isUnidirectional hides the reverse side from the API)
console.log('Step 2: Recreating as unidirectional list relation...');
{
  const c = new Client(auth);
  c.createRelationalField({
    parentApiId:  'Order',
    apiId:        'orderedProducts',
    displayName:  'Ordered Products',
    type:         'RELATION',
    isList:       true,
    reverseField: {
      modelApiId:       'Product',
      apiId:            'orders',
      displayName:      'Orders',
      isUnidirectional: true,
    },
  });
  const r = await c.run(false);
  if (r?.errors?.length) {
    console.error('❌  Error:', r.errors.map(e => e.message).join('\n'));
    process.exit(1);
  }
  console.log('  ✓ orderedProducts is now a unidirectional list relation');
  console.log('\n  Only "create Order" permission is now needed in Hygraph console.');
}
