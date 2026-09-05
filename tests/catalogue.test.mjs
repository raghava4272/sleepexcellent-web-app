import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const source = await read("lib/catalogue/data.ts");
const databaseEntrySource = await read("db/index.ts");
const databaseConnectionSource = await read("db/connection.ts");
const migrationSource = await read("db/schema.ts");
const migrationSql = await read("drizzle/0000_past_grim_reaper.sql");
const seedScript = await read("scripts/seed-catalogue.ts");
const cataloguePage = await read("components/catalogue-page.tsx");

test("the F002 authoritative seed declares exactly the approved 44 records", () => {
  const directCount = (source.match(/direct\("/g) ?? []).length;
  const ceilingCount = (source.match(/ceiling\("/g) ?? []).length;
  assert.equal(directCount, 36);
  assert.equal(ceilingCount, 8);
  assert.equal((source.match(/direct\([^\n]+"SOFA"/g) ?? []).length, 16);
  assert.equal((source.match(/direct\([^\n]+"BED"/g) ?? []).length, 10);
  assert.equal((source.match(/direct\([^\n]+"MATTRESS"/g) ?? []).length, 10);
  assert.match(source, /direct\("u-shape-sofa", "SOFA", "U-Shape Sofa", 12590000, "9-seater"\)/);
  assert.match(source, /direct\("shim-mattress", "MATTRESS", "Shim Mattress", 211900, null, "72 × 75 × 1 in"\)/);
  assert.match(source, /ceiling\("glass-ceiling", "Glass Ceiling"[\s\S]*30000, 70000, true\)/);
});

test("the catalogue seed contains no unapproved availability or product media mappings", () => {
  assert.match(source, /availability: null/);
  assert.doesNotMatch(source, /image:|video:|mediaPath:|stock:/i);
});

test("the F002 schema preserves category-specific pricing and supports unmapped media", () => {
  assert.match(databaseEntrySource, /import "server-only"/);
  assert.match(databaseEntrySource, /export \{ getDb \} from "\.\/connection"/);
  assert.doesNotMatch(databaseConnectionSource, /^import "server-only";/m);
  assert.match(seedScript, /from "\.\.\/db\/connection"/);
  assert.match(migrationSource, /productCategoryEnum/);
  assert.match(migrationSource, /products_direct_purchase_shape/);
  assert.match(migrationSource, /productMedia/);
  assert.match(migrationSource, /availability: availabilityStateEnum\("availability"\)/);
  assert.match(migrationSource, /isPrimary/);
  assert.match(migrationSql, /ENABLE ROW LEVEL SECURITY/);
  assert.match(migrationSql, /public_can_read_published_products/);
  assert.match(seedScript, /onConflictDoUpdate/);
});

test("catalogue UI includes search, approved sorting, filters, empty, and media-pending states", () => {
  assert.match(cataloguePage, /Search by product or model name/);
  assert.match(cataloguePage, /Price: low to high/);
  assert.match(cataloguePage, /Price: high to low/);
  assert.match(cataloguePage, /Name: A to Z/);
  assert.match(cataloguePage, /No matching models found/);
  assert.match(cataloguePage, /Media pending/);
  assert.doesNotMatch(cataloguePage, /Add to Cart|Buy Now|In Stock|Out of Stock/);
});
