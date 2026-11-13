# Hou Express --- Product Catalog Seed Data

This file documents the sample data used to test the product catalog
module with MySQL, Prisma 7, and DBeaver.

> **Important:** This is a one-time seed for a clean test database. The
> fixed UUIDs and unique slugs/SKUs mean the inserts will fail if the
> same records already exist. Do not run it again against a database
> that already contains this sample data.

## What this seed creates

- One category: **Phone**
- One product: **iPhone 17**
- Two variants:
  - iPhone 17, 128GB, White --- SKU `IP17-128-WHT`, price `799.00`
  - iPhone 17, 256GB, Black --- SKU `IP17-256-BLK`, price `899.00`
- Three images:
  - One general product image
  - One image for the white variant
  - One image for the black variant

## SQL seed

Run the statements in order. In DBeaver, you can execute each statement
individually, or use the script-execution command for the whole file.

```sql
-- 1. Create a category
INSERT INTO category (
    id,
    name,
    slug,
    parentId,
    createdAt,
    updatedAt
)
VALUES (
    '11111111-1111-4111-8111-111111111111',
    'Phone',
    'phone',
    NULL,
    NOW(),
    NOW()
);

-- 2. Create a product
INSERT INTO product (
    id,
    categoryId,
    title,
    slug,
    description,
    status,
    createdAt,
    updatedAt
)
VALUES (
    '22222222-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    'iPhone 17',
    'iphone-17',
    'Apple iPhone 17',
    'ACTIVE',
    NOW(),
    NOW()
);

-- 3. Create the product variants
INSERT INTO productvariant (
    id,
    productId,
    sku,
    description,
    price,
    salePrice,
    status,
    createdAt,
    updatedAt
)
VALUES
(
    '33333333-3333-4333-8333-333333333333',
    '22222222-2222-4222-8222-222222222222',
    'IP17-128-WHT',
    '128GB, White',
    799.00,
    NULL,
    'ACTIVE',
    NOW(),
    NOW()
),
(
    '44444444-4444-4444-8444-444444444444',
    '22222222-2222-4222-8222-222222222222',
    'IP17-256-BLK',
    '256GB, Black',
    899.00,
    NULL,
    'ACTIVE',
    NOW(),
    NOW()
);

-- 4. Add product and variant images
-- variantId = NULL means this is a general product image.
-- A non-NULL variantId means the image belongs to that specific variant.
INSERT INTO productimage (
    id,
    productId,
    variantId,
    imagePath,
    altText,
    isPrimary,
    sortOrder,
    createdAt,
    updatedAt
)
VALUES
(
    UUID(),
    '22222222-2222-4222-8222-222222222222',
    NULL,
    'products/iphone-17/main.jpg',
    'iPhone 17 product image',
    TRUE,
    1,
    NOW(),
    NOW()
),
(
    UUID(),
    '22222222-2222-4222-8222-222222222222',
    '33333333-3333-4333-8333-333333333333',
    'products/iphone-17/white.jpg',
    'iPhone 17 128GB White',
    TRUE,
    1,
    NOW(),
    NOW()
),
(
    UUID(),
    '22222222-2222-4222-8222-222222222222',
    '44444444-4444-4444-8444-444444444444',
    'products/iphone-17/black.jpg',
    'iPhone 17 256GB Black',
    TRUE,
    1,
    NOW(),
    NOW()
);
```

## Verify the inserted data

Run these queries after the inserts:

```sql
-- Check the category
SELECT *
FROM category
WHERE id = '11111111-1111-4111-8111-111111111111';

-- Check the product
SELECT *
FROM product
WHERE id = '22222222-2222-4222-8222-222222222222';

-- Check its variants
SELECT *
FROM productvariant
WHERE productId = '22222222-2222-4222-8222-222222222222';

-- Check its images
SELECT *
FROM productimage
WHERE productId = '22222222-2222-4222-8222-222222222222'
ORDER BY variantId, sortOrder;
```

## Notes

- The table names above match the current Prisma-generated MySQL table
  names: `category`, `product`, `productvariant`, and `productimage`.
- Column names use the current camelCase database names, such as
  `productId`, `variantId`, `createdAt`, and `updatedAt`.
- `updatedAt` is included in every insert because the database column
  is non-null.
- The image paths are placeholders. Replace them with paths or URLs
  that your application can actually serve.
- The product's general image has `variantId = NULL`. Variant images
  reference the corresponding `ProductVariant`.
- `isPrimary = TRUE` marks the primary image within that image
  gallery. The general product gallery and each variant gallery can
  each have their own primary image.
- This sample does not create attribute definitions or variant
  attribute-value links. The variant descriptions identify the sample
  configurations for now.
