/**
 * Glowish Cosmetics — Hygraph Schema Setup
 * =========================================
 * Uses @hygraph/management-sdk to create all models and fields.
 *
 * Models created:
 *   1. Product        — name, code, description, tags, price, featured, image
 *   2. Order          — customerName, phone, address, notes, orderedProducts → Product
 *   3. WebsiteSetting — title, aboutContent, contactEmail, contactPhone, contactAddress, headerImage
 *
 * Run:
 *   npm install @hygraph/management-sdk dotenv
 *   node scripts/create-schema.mjs
 *
 * Requires in .env.local:
 *   HYGRAPH_MANAGEMENT_TOKEN  — Personal Access Token (https://app.hygraph.com/account/tokens)
 *   HYGRAPH_MANAGEMENT_ENDPOINT — Content API endpoint (NOT the CDN one), e.g.
 *                                 https://api-ap-south-1.hygraph.com/v2/PROJECT_ID/master
 *                                 (The SDK derives the management URL internally from this)
 */

import { Client } from '@hygraph/management-sdk';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../.env.local') });

if (!process.env.HYGRAPH_MANAGEMENT_TOKEN || !process.env.HYGRAPH_MANAGEMENT_ENDPOINT) {
    console.error(`
❌  Missing env vars. Add to .env.local:
    HYGRAPH_MANAGEMENT_TOKEN=pat_...
    HYGRAPH_MANAGEMENT_ENDPOINT=https://management-ap-south-1.hygraph.com/graphql
`);
    process.exit(1);
}

const client = new Client({
    authToken: process.env.HYGRAPH_MANAGEMENT_TOKEN,
    endpoint:  process.env.HYGRAPH_MANAGEMENT_ENDPOINT,
});

async function main() {
    console.log('🌸  Glowish Cosmetics — Hygraph Schema Setup');
    console.log('─'.repeat(55));

    // ─────────────────────────────────────────────────────────────
    // 1. PRODUCT MODEL
    // ─────────────────────────────────────────────────────────────
    console.log('\n[1/3] Creating Product model...');

    client.createModel({
        apiId:        'Product',
        apiIdPlural:  'Products',
        displayName:  'Product',
        description:  'A cosmetics product sold on the website',
    });

    // name — required
    client.createSimpleField({
        parentApiId:  'Product',
        apiId:        'name',
        displayName:  'Name',
        type:         'STRING',
        isRequired:   true,
        isTitle:      true,
    });

    // code — product SKU
    client.createSimpleField({
        parentApiId:  'Product',
        apiId:        'code',
        displayName:  'Product Code',
        type:         'STRING',
        isRequired:   true,
        isUnique:     true,
    });

    // description — rich text
    client.createSimpleField({
        parentApiId:  'Product',
        apiId:        'description',
        displayName:  'Description',
        type:         'RICHTEXT',
    });

    // tags — multiple values (e.g. skincare, makeup)
    client.createSimpleField({
        parentApiId:  'Product',
        apiId:        'tags',
        displayName:  'Tags',
        type:         'STRING',
        isList:       true,
    });

    // price — optional float
    client.createSimpleField({
        parentApiId:  'Product',
        apiId:        'price',
        displayName:  'Price',
        type:         'FLOAT',
    });

    // featured — boolean flag for homepage
    client.createSimpleField({
        parentApiId:   'Product',
        apiId:         'featured',
        displayName:   'Featured',
        type:          'BOOLEAN',
        initialValue:  'false',
    });

    // image — asset field
    client.createRelationalField({
        parentApiId:  'Product',
        apiId:        'image',
        displayName:  'Product Image',
        type:         'ASSET',
        reverseField: {
            modelApiId:       'Asset',
            apiId:            'productImageRef',
            displayName:      'Product Image Ref',
            isUnidirectional: true,
        },
    });

    // ─────────────────────────────────────────────────────────────
    // 2. ORDER MODEL
    // ─────────────────────────────────────────────────────────────
    console.log('[2/3] Creating Order model...');

    client.createModel({
        apiId:        'Order',
        apiIdPlural:  'Orders',
        displayName:  'Order',
        description:  'A customer order placed through the website',
    });

    // customerName
    client.createSimpleField({
        parentApiId:  'Order',
        apiId:        'customerName',
        displayName:  'Customer Name',
        type:         'STRING',
        isRequired:   true,
        isTitle:      true,
    });

    // phone
    client.createSimpleField({
        parentApiId:  'Order',
        apiId:        'phone',
        displayName:  'Phone Number',
        type:         'STRING',
        isRequired:   true,
    });

    // address
    client.createSimpleField({
        parentApiId:  'Order',
        apiId:        'address',
        displayName:  'Delivery Address',
        type:         'STRING',
        isRequired:   true,
    });

    // notes — optional
    client.createSimpleField({
        parentApiId:  'Order',
        apiId:        'notes',
        displayName:  'Order Notes',
        type:         'STRING',
    });

    // orderedProducts — relation to Product (many-to-many, list)
    client.createRelationalField({
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

    // ─────────────────────────────────────────────────────────────
    // 3. WEBSITE SETTING MODEL
    // ─────────────────────────────────────────────────────────────
    console.log('[3/3] Creating WebsiteSetting model...');

    client.createModel({
        apiId:        'WebsiteSetting',
        apiIdPlural:  'WebsiteSettings',
        displayName:  'Website Setting',
        description:  'Global website content: header, about, contact details',
    });

    // title
    client.createSimpleField({
        parentApiId:  'WebsiteSetting',
        apiId:        'title',
        displayName:  'Site Title',
        type:         'STRING',
        isTitle:      true,
    });

    // aboutContent — rich text
    client.createSimpleField({
        parentApiId:  'WebsiteSetting',
        apiId:        'aboutContent',
        displayName:  'About Content',
        type:         'RICHTEXT',
    });

    // contactEmail
    client.createSimpleField({
        parentApiId:  'WebsiteSetting',
        apiId:        'contactEmail',
        displayName:  'Contact Email',
        type:         'STRING',
    });

    // contactPhone
    client.createSimpleField({
        parentApiId:  'WebsiteSetting',
        apiId:        'contactPhone',
        displayName:  'Contact Phone',
        type:         'STRING',
    });

    // contactAddress
    client.createSimpleField({
        parentApiId:  'WebsiteSetting',
        apiId:        'contactAddress',
        displayName:  'Contact Address',
        type:         'STRING',
    });

    // headerImage — asset
    client.createRelationalField({
        parentApiId:  'WebsiteSetting',
        apiId:        'headerImage',
        displayName:  'Header Image',
        type:         'ASSET',
        reverseField: {
            modelApiId:       'Asset',
            apiId:            'websiteSettingHeaderRef',
            displayName:      'Header Image Ref',
            isUnidirectional: true,
        },
    });

    // ─────────────────────────────────────────────────────────────
    // Execute all queued operations
    // ─────────────────────────────────────────────────────────────
    console.log('\n⏳  Running all schema mutations...\n');

    try {
        // dryRun: true  → preview only, no changes
        // dryRun: false → apply changes to Hygraph
        const result = await client.run(false);
        console.log('✅  Schema created successfully!\n');

        if (result?.errors?.length) {
            console.warn('⚠️  Some fields may have had warnings:');
            result.errors.forEach((e) => console.warn('  -', e.message ?? e));
        }

        console.log(`
─────────────────────────────────────────────────────────
✅  All done! Models in Hygraph:
    • Product        (name, code, description, tags, price, featured, image)
    • Order          (customerName, phone, address, notes, orderedProducts)
    • WebsiteSetting (title, aboutContent, contact details, headerImage)

Next steps:
  1. Hygraph → Settings → API Access → Public Content API
     Enable READ permission for: Product, WebsiteSetting

  2. Seed sample products:
     node scripts/seed-content.mjs

  3. Start the website:
     npm run dev
─────────────────────────────────────────────────────────
`);
    } catch (err) {
        console.error('❌  Schema creation failed:\n', err.message ?? err);

        if (err.message?.includes('token') || err.message?.includes('Unauthorized') || err.message?.includes('verification')) {
            console.error(`
──────────────────────────────────────────────────────────
TOKEN ERROR — How to fix:

  The Management SDK needs a PERSONAL ACCESS TOKEN (PAT),
  not a project Permanent Auth Token.

  1. Go to → https://app.hygraph.com/account/tokens
  2. Click "Add Token" → name it anything → Create
  3. Copy it and update .env.local:
       HYGRAPH_MANAGEMENT_TOKEN=pat_xxxxxxxxxxxxx
  4. Re-run: node scripts/create-schema.mjs
──────────────────────────────────────────────────────────
`);
        }
        process.exit(1);
    }
}

main();
