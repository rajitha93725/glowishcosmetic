/**
 * Adds the 'gallery' Asset List field to the Product model using the SDK.
 * Run: node scripts/add-gallery-field.mjs
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

async function main() {
  console.log('Step 1: Adding "gallery" field to Product model...');
  const c = new Client(auth);
  
  c.createRelationalField({
    parentApiId: 'Product',
    apiId: 'gallery',
    displayName: 'Gallery Images',
    type: 'ASSET',
    isList: true,
    reverseField: {
      modelApiId: 'Asset',
      apiId: 'productGallery',
      displayName: 'Product Gallery',
      isUnidirectional: true,
    }
  });

  try {
    const res = await c.run(false);
    if (res?.errors?.length) {
      console.warn('⚠️ Warning:', res.errors.map(e => e.message).join('\n'));
    } else {
      console.log(`✅  "gallery" field successfully added to Product model.`);
    }
  } catch (err) {
    console.log('❌ Failed to add field:', err.message);
  }
}

main().catch(console.error);
