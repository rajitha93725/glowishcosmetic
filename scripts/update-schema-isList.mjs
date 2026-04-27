/**
 * One-shot script: update orderedProducts on Order to isList: true.
 * Run: node scripts/update-schema-isList.mjs
 */
import { Client } from '@hygraph/management-sdk';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const client = new Client({
  authToken: process.env.HYGRAPH_MUTATION_TOKEN,
  endpoint:  process.env.HYGRAPH_MANAGEMENT_ENDPOINT,
});

client.updateRelationalField({
  parentApiId: 'Order',
  apiId:       'orderedProducts',
  isList:      true,
});

console.log('⏳  Applying isList: true to Order.orderedProducts ...');
const result = await client.run(false);

if (result?.errors?.length) {
  console.error('❌  Errors:', result.errors);
  process.exit(1);
}

console.log('✅  Done! orderedProducts is now a list relation.');
