/**
 * Adds ProductCategory enum + category field to the Product model in Hygraph.
 * Values: SkinCare, Fragrance, Hair, Makeup
 * Run: node scripts/add-category-field.mjs
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

console.log('Adding ProductCategory enum to Hygraph...');

{
  const c = new Client(auth);
  c.createEnumeration({
    apiId:       'ProductCategory',
    displayName: 'Product Category',
    values: [
      { apiId: 'SkinCare',   displayName: 'Skin Care'  },
      { apiId: 'Fragrance',  displayName: 'Fragrance'  },
      { apiId: 'Hair',       displayName: 'Hair'        },
      { apiId: 'Makeup',     displayName: 'Makeup'      },
    ],
  });
  const r = await c.run(false);
  if (r?.errors?.length) {
    console.error('❌ Enum error:', r.errors.map(e => e.message).join('\n'));
    process.exit(1);
  }
  console.log('  ✓ ProductCategory enum created');
}

console.log('Adding category field to Product model...');

{
  const c = new Client(auth);
  c.createEnumerableField({
    parentApiId:      'Product',
    apiId:            'category',
    displayName:      'Category',
    enumerationApiId: 'ProductCategory',
  });
  const r = await c.run(false);
  if (r?.errors?.length) {
    console.error('❌ Field error:', r.errors.map(e => e.message).join('\n'));
    process.exit(1);
  }
  console.log('  ✓ category field added to Product');
}

console.log('\n✅ Done! Products in Hygraph now have a "Category" dropdown.');
console.log('   Values: Skin Care | Fragrance | Hair | Makeup');
