import { GraphQLClient } from 'graphql-request';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

const endpoint = process.env.HYGRAPH_MANAGEMENT_ENDPOINT;
const token    = process.env.HYGRAPH_MUTATION_TOKEN;

const client = new GraphQLClient(endpoint, {
  headers: { Authorization: `Bearer ${token}` },
});

const query = `{
  orderCreate: __type(name: "OrderCreateInput") {
    inputFields { name type { name kind ofType { name kind ofType { name kind } } } }
  }
  orderUpdate: __type(name: "OrderUpdateInput") {
    inputFields { name type { name kind ofType { name kind ofType { name kind } } } }
  }
}`;

const data = await client.request(query);

console.log('\n=== OrderCreateInput fields ===');
for (const f of data.orderCreate?.inputFields ?? []) {
  const t = f.type;
  const typeName = t.name ?? t.ofType?.name ?? t.ofType?.ofType?.name ?? '?';
  console.log(`  ${f.name}: ${t.kind}(${typeName})`);
}

console.log('\n=== OrderUpdateInput fields ===');
for (const f of data.orderUpdate?.inputFields ?? []) {
  const t = f.type;
  const typeName = t.name ?? t.ofType?.name ?? t.ofType?.ofType?.name ?? '?';
  console.log(`  ${f.name}: ${t.kind}(${typeName})`);
}
